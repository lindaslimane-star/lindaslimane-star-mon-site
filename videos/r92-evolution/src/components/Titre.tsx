import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { COULEURS, LAYOUT, POLICE } from "../theme";

/** « 6 MOIS DE CURE [R92] » — visible pendant toute la vidéo. */
export const Titre: React.FC<{ titre: string; marque: string }> = ({ titre, marque }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mots = titre.split(" ");

  const boite = spring({ frame: f + 2, fps, config: { damping: 18, stiffness: 120 } });
  const pulse = 0.55 + 0.25 * Math.sin((f / fps) * 2.2);
  // reflet qui traverse l'encadré R92 toutes les ~5 s
  const cycle = (f + 40) % (fps * 5);
  const reflet = interpolate(cycle, [0, fps * 0.9], [-60, 160], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.titreTop,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        fontFamily: POLICE,
      }}
    >
      <div style={{ display: "flex", gap: 18 }}>
        {mots.map((mot, i) => {
          const p = spring({ frame: f + 8 - i * 3, fps, config: { damping: 20, stiffness: 140 } });
          return (
            <div key={i} style={{ overflow: "hidden", paddingBottom: 4 }}>
              <div
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  color: COULEURS.blanc,
                  letterSpacing: 1,
                  lineHeight: 1.1,
                  transform: `translateY(${(1 - p) * 100}%)`,
                  opacity: p,
                  textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                }}
              >
                {mot}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "8px 22px 10px",
          borderRadius: 14,
          background: `linear-gradient(160deg, ${COULEURS.secondaire} 0%, ${COULEURS.marine} 70%)`,
          border: `2px solid rgba(156,194,255,${0.55 + pulse * 0.35})`,
          boxShadow: `0 0 ${18 + pulse * 22}px rgba(59,139,255,${0.35 + pulse * 0.25}), inset 0 0 18px rgba(59,139,255,0.25)`,
          transform: `scale(${0.6 + boite * 0.4})`,
          opacity: boite,
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 900,
            color: COULEURS.blanc,
            letterSpacing: 2,
            lineHeight: 1.1,
          }}
        >
          {marque}
        </div>
        <div
          style={{
            position: "absolute",
            top: -20,
            bottom: -20,
            left: `${reflet}%`,
            width: 40,
            transform: "skewX(-20deg)",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          }}
        />
      </div>
    </div>
  );
};
