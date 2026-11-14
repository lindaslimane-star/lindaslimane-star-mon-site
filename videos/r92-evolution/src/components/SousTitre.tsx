import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COULEURS, LAYOUT, POLICE } from "../theme";

/** Rectangle arrondi « MON ÉVOLUTION MOIS PAR MOIS » affiché au début. */
export const SousTitre: React.FC<{ texte: string; dureeSecondes: number }> = ({ texte, dureeSecondes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!texte || dureeSecondes <= 0) return null;

  const fin = Math.round(dureeSecondes * fps);
  const entree = spring({ frame: f + 14, fps, config: { damping: 20, stiffness: 110 } });
  const sortie = interpolate(f, [fin - 12, fin + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  if (sortie >= 1) return null;

  // ligne lumineuse qui parcourt le texte à l'entrée
  const balayage = interpolate(f, [18, 48], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.sousTitreTop,
left: LAYOUT.zoneX,
        width: LAYOUT.zoneW,
        display: "flex",
        justifyContent: "center",
        opacity: entree * (1 - sortie),
        transform: `translateY(${(1 - entree) * 24 - sortie * 16}px) scale(${1 - sortie * 0.05})`,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "16px 36px",
          borderRadius: 999,
          background: "rgba(6,26,64,0.92)",
          border: `2.5px solid ${COULEURS.bleuClair}`,
          boxShadow: "0 0 26px rgba(59,139,255,0.35), inset 0 0 14px rgba(59,139,255,0.18)",
          fontFamily: POLICE,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 3,
          color: COULEURS.blanc,
          whiteSpace: "nowrap",
        }}
      >
        {texte}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${balayage}%`,
            width: 90,
            transform: "skewX(-20deg)",
            background: "linear-gradient(90deg, transparent, rgba(156,194,255,0.35), transparent)",
          }}
        />
      </div>
    </div>
  );
};
