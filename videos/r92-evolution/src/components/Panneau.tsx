import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COULEURS, LAYOUT } from "../theme";
import type { Timeline, Segment } from "../timing";
import type { EvolutionProps } from "../schema";
import { Media } from "./Media";
import { Etiquette } from "./Etiquette";
import { Comparaison } from "./Comparaison";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Cadre central : photos / vidéos successives + encadré de période. */
export const Panneau: React.FC<{ tl: Timeline; props: EvolutionProps }> = ({ tl, props }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Le cadre monte doucement quand le sous-titre disparaît.
  const finSousTitre = Math.round(props.dureeSousTitre * fps);
  const aSousTitre = props.sousTitre.trim() !== "" && props.dureeSousTitre > 0;
  const top = aSousTitre
    ? interpolate(f, [finSousTitre - 10, finSousTitre + 14], [LAYOUT.panneauTopAvecSousTitre, LAYOUT.panneauTopSansSousTitre], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      })
    : LAYOUT.panneauTopSansSousTitre;
  const hauteur = LAYOUT.panneauBas - top;

  const apparition = spring({ frame: f - 4, fps, config: { damping: 22, stiffness: 90 } });
  const pulse = 0.5 + 0.5 * Math.sin((f / fps) * 1.6);

  // Balayage lumineux du contour à chaque changement de période
  const dernierDebut = [...tl.segments, ...(tl.compDur ? [{ from: tl.compFrom }] : [])]
    .map((s) => s.from)
    .filter((d) => d <= f)
    .pop() ?? 0;
  const balayage = interpolate(f - dernierDebut, [0, 26], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.panneauX,
        width: LAYOUT.panneauW,
        top,
        height: hauteur,
        opacity: apparition,
        transform: `scale(${0.96 + apparition * 0.04})`,
      }}
    >
      {/* halo extérieur */}
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: 44,
          boxShadow: `0 0 ${50 + pulse * 20}px rgba(59,139,255,${0.18 + pulse * 0.08}), 0 30px 80px rgba(0,0,0,0.5)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 42,
          overflow: "hidden",
          background: COULEURS.marine,
        }}
      >
        {tl.segments.map((s) => (
          <Couche key={s.index} s={s} tl={tl} zoom={props.zoom} />
        ))}

        {/* léger dégradé en haut pour la lisibilité de l'encadré */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 260,
            background: "linear-gradient(180deg, rgba(3,14,38,0.55) 0%, rgba(3,14,38,0) 100%)",
          }}
        />

        {tl.segments.map((s) => (
          <EtiquettePeriode key={`e${s.index}`} s={s} tl={tl} />
        ))}

        {tl.compDur > 0 && tl.segments.length >= 2 ? (
          <Comparaison
            tl={tl}
            avant={tl.segments[0].periode}
            apres={tl.segments[tl.segments.length - 1].periode}
            slogan={props.comparaisonFinale.slogan}
            marque={props.marque}
          />
        ) : null}
      </div>

      {/* contour bleu clair + balayage électrique */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 42,
          border: "2px solid rgba(156,194,255,0.55)",
          pointerEvents: "none",
        }}
      />
      {balayage > 0 && balayage < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 42,
            padding: 3,
            background: `conic-gradient(from ${balayage * 360 - 90}deg, transparent 0deg, rgba(120,180,255,0.95) 30deg, transparent 70deg)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: Math.sin(balayage * Math.PI),
          }}
        />
      ) : null}
    </div>
  );
};

/** Une période : fondu enchaîné + zoom cinématique lent. */
const Couche: React.FC<{ s: Segment; tl: Timeline; zoom: number }> = ({ s, tl, zoom }) => {
  const f = useCurrentFrame();
  const premiere = s.index === 0;
  const debut = premiere ? 0 : s.from;
  const finVisible = s.from + s.dur + tl.trans;
  const estDerniere = s.index === tl.segments.length - 1;
  const finAbsolue = estDerniere ? (tl.compDur > 0 ? tl.compFrom + tl.trans + 2 : tl.total) : finVisible;
  if (f < debut || f > finAbsolue) return null;

  const dureeFondu = premiere ? Math.max(tl.intro, 10) + 6 : tl.trans;
  const opacite = interpolate(f, [debut, debut + dureeFondu], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const entree = interpolate(f, [debut, debut + dureeFondu * 1.6], [1, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const zoomLent = interpolate(f, [debut, s.from + s.dur + tl.trans], [1, 1 + zoom], clamp);
  const echelle = zoomLent + entree * 0.035;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: opacite,
        filter: entree > 0.01 ? `blur(${entree * 7}px)` : undefined,
      }}
    >
      <div style={{ width: "100%", height: "100%", transform: `scale(${echelle})` }}>
        <Media periode={s.periode} />
      </div>
    </div>
  );
};

/** Encadré blanc au-dessus des cheveux. */
const EtiquettePeriode: React.FC<{ s: Segment; tl: Timeline }> = ({ s, tl }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const debut = s.index === 0 ? Math.max(6, tl.intro) : s.from + Math.round(tl.trans * 0.55);
  const fin = s.from + s.dur; // sortie terminée avant l'entrée de la suivante
  if (f < debut - 1 || f > fin + 1) return null;

  const entree = spring({ frame: f - debut, fps, config: { damping: 16, stiffness: 140, mass: 0.8 } });
  const sortie = interpolate(f, [fin - 9, fin], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(entree, 1) * (1 - sortie),
        transform: `translateY(${(1 - entree) * 40 - sortie * 30}px) scale(${0.9 + Math.min(entree, 1) * 0.1})`,
      }}
    >
      <Etiquette texte={s.periode.intitule} date={s.periode.date} />
    </div>
  );
};
