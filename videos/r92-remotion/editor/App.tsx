import { Player, type PlayerRef } from "@remotion/player";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { R92Ad } from "../src/R92Ad";
import { adSchema, defaultProps, type AdProps, type Crop, type VideoSlot } from "../src/schema";
import { FPS, HEIGHT, WIDTH } from "../src/theme";

type SlotKey = "before" | "after" | "gummies";
const VARIANT = new URLSearchParams(location.search).get("variant") === "1an" ? "1an" : "3mois";
const Q = `variant=${VARIANT}`;
const DIR = VARIANT === "1an" ? "public/videos/1an/" : "public/videos/";
const SLOT_INFO: Record<SlotKey, { title: string; file: string }> = {
  before: { title: "Vidéo 1 — Avant la cure (haut gauche)", file: DIR + "avant.mp4" },
  after: { title: "Vidéo 2 — Après (haut droite)", file: DIR + (VARIANT === "1an" ? "apres.mp4" : "apres-6-mois.mp4") },
  gummies: { title: "Vidéo 3 — Prise des gummies (bas)", file: DIR + "gummies.mp4" },
};
type RenderState = { status: string; progress: number; file?: string; error?: string };

/** Durée réelle d'une vidéo, lue par le navigateur (sert aux boucles dans l'aperçu). */
const probeDuration = (url: string) =>
  new Promise<number | undefined>((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.onloadedmetadata = () => resolve(Number.isFinite(v.duration) ? v.duration : undefined);
    v.onerror = () => resolve(undefined);
    v.src = url;
  });

const stripVersion = (p: AdProps): AdProps => {
  const clean = (s: VideoSlot): VideoSlot => {
    const { sourceDuration: _d, ...rest } = s;
    return { ...rest, src: s.src.split("?")[0] };
  };
  return { ...p, before: clean(p.before), after: clean(p.after), gummies: clean(p.gummies) };
};

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }> = ({
  label, value, min, max, step, unit = "", onChange,
}) => (
  <label className="row">
    <span>{label}</span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    <output>{value}{unit}</output>
  </label>
);

export const App: React.FC = () => {
  const [props, setProps] = useState<AdProps>(defaultProps);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState<SlotKey | null>(null);
  const [render, setRender] = useState<RenderState>({ status: "idle", progress: 0 });
  const [error, setError] = useState<string | null>(null);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const playerRef = useRef<PlayerRef>(null);

  // Charge les réglages enregistrés (ad-props.json)
  useEffect(() => {
    fetch(`/api/props?${Q}`).then((r) => r.json()).then((p) => {
      setProps({ ...defaultProps, ...p });
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  // Enregistre automatiquement (débounce)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      fetch(`/api/props?${Q}`, { method: "POST", body: JSON.stringify(stripVersion(props)) });
    }, 600);
    return () => clearTimeout(t);
  }, [props, loaded]);

  // Lit la durée de chaque source quand elle change
  const srcKey = `${props.before.src}|${props.after.src}|${props.gummies.src}`;
  useEffect(() => {
    (["before", "after", "gummies"] as SlotKey[]).forEach(async (k) => {
      const d = await probeDuration("/" + props[k].src);
      setProps((p) => ({ ...p, [k]: { ...p[k], sourceDuration: d } }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey]);

  // Suivi de l'export
  useEffect(() => {
    if (render.status !== "bundling" && render.status !== "rendering") return;
    const t = setInterval(async () => setRender(await (await fetch("/api/render")).json()), 700);
    return () => clearInterval(t);
  }, [render.status]);

  const setSlot = useCallback((k: SlotKey, patch: Partial<VideoSlot>) => {
    setProps((p) => ({ ...p, [k]: { ...p[k], ...patch } }));
  }, []);
  const setCrop = useCallback((k: SlotKey, patch: Partial<Crop>) => {
    setProps((p) => ({ ...p, [k]: { ...p[k], crop: { ...p[k].crop, ...patch } } }));
  }, []);

  const upload = async (k: SlotKey, file: File) => {
    setError(null);
    setUploading(k);
    try {
      const r = await fetch(`/api/upload?${Q}&slot=${k}&name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setSlot(k, { src: `${j.src}?v=${j.version}`, sourceDuration: undefined });
      playerRef.current?.seekTo(0);
    } catch (e) {
      setError(`Import impossible : ${(e as Error).message}`);
    } finally {
      setUploading(null);
    }
  };

  const exportMp4 = async () => {
    setError(null);
    const r = await fetch(`/api/render?${Q}`, { method: "POST", body: JSON.stringify(stripVersion(props)) });
    if (!r.ok) return setError((await r.json()).error);
    setRender({ status: "bundling", progress: 0 });
  };

  const validation = useMemo(() => adSchema.safeParse(props), [props]);
  const durationInFrames = Math.round(props.durationInSeconds * FPS);
  const busy = render.status === "bundling" || render.status === "rendering";

  return (
    <div className="app">
      <aside className="panel">
        <h1>Pub R92 — 3 vidéos simultanées</h1>
        <nav className="variants">
          <a href="?variant=3mois" className={VARIANT === "3mois" ? "on" : ""}>Cure 3 mois</a>
          <a href="?variant=1an" className={VARIANT === "1an" ? "on" : ""}>Cure 1 an</a>
        </nav>

        <section>
          <h2>Titres</h2>
          <label className="field"><span>Titre principal</span>
            <input value={props.titleText} onChange={(e) => setProps({ ...props, titleText: e.target.value })} /></label>
          <label className="field"><span>Encadré marque</span>
            <input value={props.titleBrand} onChange={(e) => setProps({ ...props, titleBrand: e.target.value })} /></label>
          <label className="field"><span>Message ligne 1</span>
            <input value={props.messageLine1} onChange={(e) => setProps({ ...props, messageLine1: e.target.value })} /></label>
          <label className="field"><span>Message ligne 2</span>
            <input value={props.messageLine2} onChange={(e) => setProps({ ...props, messageLine2: e.target.value })} /></label>
          <label className="field"><span>Mention bas de page</span>
            <textarea rows={2} value={props.disclaimer} onChange={(e) => setProps({ ...props, disclaimer: e.target.value })} /></label>
        </section>

        <section>
          <h2>Instagram</h2>
          <label className="check">
            <input type="checkbox" checked={showSafeZone} onChange={(e) => setShowSafeZone(e.target.checked)} />
            <span>Afficher les zones masquées par Instagram (en rouge, jamais exportées)</span>
          </label>
        </section>

        <section>
          <h2>Disposition</h2>
          <label className="row"><span>Mise en page</span>
            <select value={props.layout ?? "classique"} onChange={(e) => setProps({ ...props, layout: e.target.value as AdProps["layout"] })}>
              <option value="classique">Classique (gummies 888×400)</option>
              <option value="vedette">Avant/après en vedette (gummies 888×280)</option>
            </select></label>
        </section>

        <section>
          <h2>Durée</h2>
          <Slider label="Durée totale" value={props.durationInSeconds} min={20} max={30} step={0.5} unit=" s"
            onChange={(v) => setProps({ ...props, durationInSeconds: v })} />
        </section>

        {(Object.keys(SLOT_INFO) as SlotKey[]).map((k) => {
          const s = props[k];
          return (
            <section key={k}>
              <h2>{SLOT_INFO[k].title}</h2>
              <label className="upload">
                <input type="file" accept="video/*" disabled={uploading !== null}
                  onChange={(e) => e.target.files?.[0] && upload(k, e.target.files[0])} />
                <span>{uploading === k ? "Import et conversion…" : "Importer une vidéo"}</span>
              </label>
              <p className="hint">
                Fichier : <code>{SLOT_INFO[k].file}</code>
                {s.sourceDuration ? ` — ${s.sourceDuration.toFixed(1)} s${s.sourceDuration < props.durationInSeconds ? " (lue en boucle)" : ""}` : " — introuvable"}
              </p>
              {k !== "gummies" ? (
                <label className="field"><span>Titre du cadre</span>
                  <input value={s.label} onChange={(e) => setSlot(k, { label: e.target.value })} /></label>
              ) : (
                <label className="field"><span>Badge sur la vidéo (vide = aucun)</span>
                  <input value={s.label} onChange={(e) => setSlot(k, { label: e.target.value })} /></label>
              )}
              <label className="row"><span>Cadrage</span>
                <select value={s.crop.fit} onChange={(e) => setCrop(k, { fit: e.target.value as Crop["fit"] })}>
                  <option value="cover">Remplir le cadre</option>
                  <option value="contain">Image entière (sans coupe)</option>
                </select></label>
              <Slider label="Zoom" value={s.crop.zoom} min={1} max={2.5} step={0.01} unit="×" onChange={(v) => setCrop(k, { zoom: v })} />
              <Slider label="Horizontal" value={s.crop.x} min={0} max={100} step={1} unit=" %" onChange={(v) => setCrop(k, { x: v })} />
              <Slider label="Vertical" value={s.crop.y} min={0} max={100} step={1} unit=" %" onChange={(v) => setCrop(k, { y: v })} />
              <Slider label="Son" value={s.volume} min={0} max={1} step={0.05} onChange={(v) => setSlot(k, { volume: v })} />
            </section>
          );
        })}

        <section className="export">
          <h2>Export</h2>
          <button disabled={busy || !validation.success} onClick={exportMp4}>
            {busy ? (render.status === "bundling" ? "Préparation…" : `Rendu ${Math.round(render.progress * 100)} %`) : "Exporter la vidéo MP4 (H.264)"}
          </button>
          {busy && <progress value={render.progress} max={1} />}
          {render.status === "done" && render.file && (
            <a className="download" href={`/out/${render.file}`}>Télécharger {render.file}</a>
          )}
          {render.status === "error" && <p className="error">Échec de l'export : {render.error}</p>}
          {!validation.success && <p className="error">Réglages invalides : {validation.error.issues[0]?.message}</p>}
          {error && <p className="error">{error}</p>}
          <p className="hint">Réglages enregistrés automatiquement dans <code>ad-props.json</code> (aussi utilisés par <code>npm run render</code>).</p>
        </section>
      </aside>

      <main className="stage">
        <Player
          ref={playerRef}
          component={R92Ad}
          inputProps={{ ...props, showSafeZone }}
          durationInFrames={durationInFrames}
          fps={FPS}
          compositionWidth={WIDTH}
          compositionHeight={HEIGHT}
          style={{ height: "calc(100vh - 48px)", aspectRatio: "9 / 16", maxWidth: "100%" }}
          controls
          loop
          clickToPlay
          acknowledgeRemotionLicense
        />
      </main>
    </div>
  );
};
