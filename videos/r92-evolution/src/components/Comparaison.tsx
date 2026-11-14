import React from "react";
import { Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COULEURS, POLICE } from "../theme";
import { vitesseLecture, type PeriodeResolue, type Timeline } from "../timing";
import type { EvolutionProps } from "../schema";
import { Media } from "./Media";
import { Etiquette } from "./Etiquette";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Premier et dernier mois côte à côte (accroche du début et écran de fin). */
export const Comparaison: React.FC<{
  tl: Timeline;
  props: EvolutionProps;
  avant: PeriodeResolue;
  apres: PeriodeResolue;
  slogan: string;
  marque: string;
  debut: number;
  duree: number;
  /** true = visible dès la 1re image (accroche), sans fondu d'entrée. */
  immediat?: boolean;
}> = ({ tl, props, avant, apres, slogan, marque, debut, duree, immediat = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < debut || f > debut + duree + tl.trans) return null;
  const l = f - debut;
  const avance = immediat ? 24 : 0; // l'accroche est déjà presque en place à la frame 0

  const fond = immediat ? 1 : interpolate(l, [0, tl.trans], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const gauche = spring({ frame: l + avance - 4, fps, config: { damping: 20, stiffness: 100 } });
  const droite = spring({ frame: l + avance - 7, fps, config: { damping: 20, stiffness: 100 } });
  const texte = spring({ frame: l - 22, fps, config: { damping: 22, stiffness: 110 } });
  const zoom = interpolate(l, [0, duree], [1, 1.05], clamp);
  const fleche = spring({ frame: l + avance - 12, fps, config: { damping: 14, stiffness: 120 } });

  const carte = (p: PeriodeResolue, prog: number, dir: number, libelle: string) => (
    <div
      style={{
        position: "relative",
        flex: 1,
        height: "100%",
        borderRadius: 30,
        overflow: "hidden",
        border: "2px solid rgba(156,194,255,0.6)",
        boxShadow: "0 0 34px rgba(59,139,255,0.25)",
        opacity: prog,
        transform: `translateX(${(1 - prog) * 60 * dir}px)`,
      }}
    >
      <div style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}>
        <Sequence from={debut} layout="none">
          <Media periode={p} vitesse={vitesseLecture(props, p, (duree + tl.trans) / fps)} />
        </Sequence>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(3,14,38,0.5) 0%, rgba(3,14,38,0) 30%)",
        }}
      />
      <div style={{ position: "absolute", top: 26, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Etiquette texte={libelle} taille={34} />
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fond,
        background: `linear-gradient(180deg, ${COULEURS.marine} 0%, ${COULEURS.marineProfond} 100%)`,
        display: "flex",
        flexDirection: "column",
        padding: 26,
        gap: 26,
      }}
    >
      <div style={{ position: "relative", display: "flex", gap: 22, flex: 1 }}>
        {carte(avant, gauche, -1, avant.intitule)}
        {carte(apres, droite, 1, apres.intitule)}
        {/* pastille centrale */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 78,
            height: 78,
            marginLeft: -39,
            marginTop: -39,
            borderRadius: 999,
            background: COULEURS.marine,
            border: "3px solid #FFFFFF",
            boxShadow: "0 0 30px rgba(59,139,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${fleche})`,
          }}
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
      {slogan ? (
      <div
        style={{
          height: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          fontFamily: POLICE,
          opacity: texte,
          transform: `translateY(${(1 - texte) * 24}px)`,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 900, color: COULEURS.blanc, letterSpacing: 3, textAlign: "center" }}>
          {slogan}
        </div>
        <div
          style={{
            width: interpolate(texte, [0, 1], [0, 260]),
            height: 4,
            borderRadius: 4,
            background: `linear-gradient(90deg, transparent, ${COULEURS.electrique}, transparent)`,
            boxShadow: `0 0 16px ${COULEURS.electrique}`,
          }}
        />
        <div style={{ fontSize: 24, fontWeight: 700, color: COULEURS.bleuClair, letterSpacing: 8 }}>{marque}</div>
      </div>
      ) : null}
    </div>
  );
};
