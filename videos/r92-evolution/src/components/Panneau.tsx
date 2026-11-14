import React from "react";
import { Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COULEURS, LAYOUT } from "../theme";
import { vitesseLecture, type Timeline, type Segment } from "../timing";
import type { EvolutionProps } from "../schema";
import { Media } from "./Media";
import { Etiquette } from "./Etiquette";
import { Comparaison } from "./Comparaison";
import { Degrades } from "./Degrades";

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

  const apparition = tl.accrocheDur > 0 ? 1 : spring({ frame: f - 4, fps, config: { damping: 22, stiffness: 90 } });
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
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: COULEURS.marine,
        }}
      >
        {tl.segments.map((s) => (
          <Couche key={s.index} s={s} tl={tl} props={props} />
        ))}

        {tl.accrocheDur > 0 ? (
          <Accroche tl={tl} props={props} />
        ) : null}

        {tl.compDur > 0 && tl.frise.length >= 2 ? (
          <Comparaison
            tl={tl}
            props={props}
            debut={tl.compFrom}
            duree={tl.compDur}
            avant={tl.frise[0].periode}
            apres={tl.frise[tl.frise.length - 1].periode}
            slogan={props.comparaisonFinale.slogan}
            marque={props.marque}
          />
        ) : null}

        <Degrades />

        {tl.segments.map((s) => (
          <EtiquettePeriode key={`e${s.index}`} s={s} tl={tl} />
        ))}

        {tl.segments.map((s) => (
          <TexteBas key={`t${s.index}`} s={s} />
        ))}
      </div>

    </div>
  );
};

/** Une période : fondu enchaîné + zoom cinématique lent. */
const Couche: React.FC<{ s: Segment; tl: Timeline; props: EvolutionProps }> = ({ s, tl, props }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = props.zoom;
  const premiere = s.index === 0;
  // Avec l'accroche, la 1re période démarre juste sous le fondu de sortie de l'accroche.
  const debut = premiere ? (tl.accrocheDur > 0 ? Math.max(0, s.from - tl.trans) : 0) : s.from;
  const finVisible = s.from + s.dur + tl.trans;
  const estDerniere = s.index === tl.segments.length - 1;
  const finAbsolue = estDerniere ? (tl.compDur > 0 ? tl.compFrom + tl.trans + 2 : tl.total) : finVisible;
  if (f < debut || f > finAbsolue) return null;
  const vitesse = vitesseLecture(props, s.periode, (finAbsolue - debut) / fps);

  const dureeFondu = premiere && tl.accrocheDur === 0 ? Math.max(tl.intro, 10) + 6 : tl.trans;
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
        {/* La vidéo démarre à sa propre seconde 0 quand la période apparaît */}
        <Sequence from={debut} layout="none">
          <Media periode={s.periode} vitesse={vitesse} />
        </Sequence>
      </div>
    </div>
  );
};

/** Encadré blanc au-dessus des cheveux. */
const EtiquettePeriode: React.FC<{ s: Segment; tl: Timeline }> = ({ s, tl }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!s.periode.intitule.trim()) return null;
  const debut = s.index === 0 ? Math.max(6, tl.intro) : s.from + Math.round(tl.trans * 0.55);
  const fin = s.from + s.dur; // sortie terminée avant l'entrée de la suivante
  if (f < debut - 1 || f > fin + 1) return null;

  const entree = spring({ frame: f - debut, fps, config: { damping: 16, stiffness: 140, mass: 0.8 } });
  const sortie = interpolate(f, [fin - 9, fin], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.etiquetteTop,
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

/** Accroche des 3 premières secondes : 1er et dernier mois côte à côte. */
const Accroche: React.FC<{ tl: Timeline; props: EvolutionProps }> = ({ tl, props }) => {
  const f = useCurrentFrame();
  const fin = tl.accrocheDur;
  if (f > fin) return null;
  const sortie = interpolate(f, [fin - tl.trans, fin], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - sortie }}>
      <Comparaison
        tl={tl}
        props={props}
        debut={0}
        duree={fin}
        immediat
        avant={tl.frise[0].periode}
        apres={tl.frise[tl.frise.length - 1].periode}
        slogan=""
        marque={props.marque}
      />
    </div>
  );
};

/** Grand texte en bas de la vidéo (ex. « 2 GUMMIES PAR JOUR / PENDANT 6 MOIS »). */
const TexteBas: React.FC<{ s: Segment }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texte = s.periode.texteBas.trim();
  if (!texte) return null;
  const debut = s.from + 6;
  const fin = s.from + s.dur;
  if (f < debut || f > fin + 2) return null;
  const lignes = texte.split(/\\n|\n/);
  const sortie = interpolate(f, [fin - 8, fin], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: LAYOUT.texteBasBottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: 1 - sortie,
      }}
    >
      {lignes.map((ligne, i) => {
        const p = spring({ frame: f - debut - i * 7, fps, config: { damping: 16, stiffness: 130 } });
        const principale = i === 0;
        return (
          <div
            key={i}
            style={{
              padding: principale ? "16px 34px 18px" : "12px 28px 14px",
              borderRadius: 18,
              background: principale ? "#FFFFFF" : "rgba(6,26,64,0.92)",
              border: principale ? "none" : `2.5px solid ${COULEURS.bleuClair}`,
              boxShadow: principale ? "0 16px 44px rgba(1,8,24,0.5)" : "0 0 26px rgba(59,139,255,0.45)",
              color: principale ? COULEURS.marine : "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: principale ? 64 : 46,
              fontWeight: 900,
              letterSpacing: principale ? 1.5 : 3,
              whiteSpace: "nowrap",
              opacity: Math.min(1, p),
              transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + Math.min(1, p) * 0.1})`,
            }}
          >
            {ligne}
          </div>
        );
      })}
    </div>
  );
};

