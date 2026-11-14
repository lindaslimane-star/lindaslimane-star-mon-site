import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, INTRO_FRAMES } from "../theme";

/**
 * Cadre premium : coins arrondis, ombre douce, fin liseré bleu électrique
 * qui se « dessine » pendant l'intro (0,5 s) puis halo bleu qui respire très légèrement.
 * Le contenu (vidéo) est visible dès la frame 0 : seul le contour s'anime.
 */
export const Frame: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  radius?: number;
  phase?: number;
  children: React.ReactNode;
}> = ({ left, top, width, height, radius = 26, phase = 0, children }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, INTRO_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = (Math.sin(frame / 30 * Math.PI * 0.5 + phase) + 1) / 2; // cycle de 4 s
  const glow = draw * (0.22 + breathe * 0.1);
  const stroke = 3;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: COLORS.night,
        boxShadow: `0 22px 48px rgba(0,0,0,0.55), 0 0 ${26 + breathe * 10}px rgba(59,130,246,${glow})`,
      }}
    >
      {children}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* liseré fixe très discret (visible dès le début) */}
        <rect
          x={stroke / 2} y={stroke / 2} width={width - stroke} height={height - stroke}
          rx={radius - stroke / 2} fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth={stroke}
        />
        {/* liseré bleu électrique qui se dessine */}
        <rect
          x={stroke / 2} y={stroke / 2} width={width - stroke} height={height - stroke}
          rx={radius - stroke / 2} fill="none" stroke={COLORS.electric} strokeWidth={stroke}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
          style={{ opacity: 0.6 + draw * 0.4 }}
        />
      </svg>
    </div>
  );
};
