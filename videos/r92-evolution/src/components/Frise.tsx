import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COULEURS, LAYOUT, POLICE } from "../theme";
import { indexActif, type Timeline } from "../timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LARGEUR = 880;

/** Frise horizontale AVANT → 1 → … → 6, synchronisée avec les images. */
export const Frise: React.FC<{ tl: Timeline }> = ({ tl }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = tl.segments.length;
  if (n === 0) return null;

  const pas = n > 1 ? LARGEUR / (n - 1) : 0;
  const x0 = n > 1 ? 0 : LARGEUR / 2;

  // position continue (0 … n-1) : glisse pendant chaque transition
  let position = 0;
  tl.segments.forEach((s, i) => {
    if (i === 0) return;
    position += interpolate(f, [s.from, s.from + tl.trans], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
  });
  const actif = indexActif(tl, f);
  const pulse = 0.5 + 0.5 * Math.sin((f / fps) * 3.2);

  const apparition = spring({ frame: f - 14, fps, config: { damping: 22, stiffness: 90 } });
  const traceBase = interpolate(f, [12, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.friseTop,
        left: (1080 - LARGEUR) / 2,
        width: LARGEUR,
        height: 120,
        opacity: apparition,
        transform: `translateY(${(1 - apparition) * 30}px)`,
        fontFamily: POLICE,
      }}
    >
      {/* ligne de fond */}
      <div
        style={{
          position: "absolute",
          top: 27,
          left: 0,
          width: LARGEUR * traceBase,
          height: 3,
          borderRadius: 3,
          background: "rgba(255,255,255,0.22)",
        }}
      />
      {/* progression */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 0,
          width: n > 1 ? position * pas : 0,
          height: 5,
          borderRadius: 5,
          background: `linear-gradient(90deg, rgba(255,255,255,0.9), ${COULEURS.electrique})`,
          boxShadow: `0 0 14px rgba(59,139,255,0.8)`,
        }}
      />

      {tl.segments.map((s, i) => {
        const x = x0 + i * pas;
        const estActif = i === actif;
        const passe = i < actif;
        const activation = spring({ frame: f - s.from, fps, config: { damping: 13, stiffness: 160 } });
        const etat = estActif ? Math.min(activation, 1.15) : 0;
        const taille = 26 + etat * 22; // 26 → 48 px
        const onde = estActif ? interpolate((f - s.from) % Math.round(fps * 1.4), [0, fps * 1.4], [0, 1]) : 0;
        const delai = spring({ frame: f - 16 - i * 3, fps, config: { damping: 20, stiffness: 120 } });

        return (
          <div key={i} style={{ position: "absolute", left: x, top: 29, transform: `scale(${delai})` }}>
            {estActif ? (
              <div
                style={{
                  position: "absolute",
                  left: -(taille / 2) - onde * 22,
                  top: -(taille / 2) - onde * 22,
                  width: taille + onde * 44,
                  height: taille + onde * 44,
                  borderRadius: 999,
                  border: `2px solid rgba(120,180,255,${0.6 * (1 - onde)})`,
                }}
              />
            ) : null}
            <div
              style={{
                position: "absolute",
                left: -taille / 2,
                top: -taille / 2,
                width: taille,
                height: taille,
                borderRadius: 999,
                background: estActif
                  ? `radial-gradient(circle at 35% 30%, ${COULEURS.secondaire}, ${COULEURS.marine})`
                  : passe
                    ? COULEURS.blanc
                    : "rgba(220,228,240,0.45)",
                border: estActif ? "4px solid #FFFFFF" : "none",
                boxShadow: estActif
                  ? `0 0 ${18 + pulse * 22}px rgba(59,139,255,${0.65 + pulse * 0.3}), inset 0 0 10px rgba(59,139,255,0.5)`
                  : passe
                    ? "0 0 10px rgba(255,255,255,0.35)"
                    : "none",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 40,
                left: -80,
                width: 160,
                textAlign: "center",
                fontSize: estActif ? 30 : 26,
                fontWeight: estActif ? 900 : 700,
                letterSpacing: 1.5,
                color: estActif ? COULEURS.blanc : passe ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)",
                textShadow: estActif ? "0 0 18px rgba(59,139,255,0.8)" : "none",
              }}
            >
              {s.periode.etape}
            </div>
          </div>
        );
      })}
    </div>
  );
};
