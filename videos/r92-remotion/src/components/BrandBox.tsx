import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT_DISPLAY } from "../theme";

/** Encadré « R92 » : fond bleu marine, bordure bleu électrique, reflet lumineux très lent (animation subtile du logo). */
export const BrandBox: React.FC<{ text: string; fontSize: number; padX?: number; padY?: number; radius?: number }> = ({
  text, fontSize, padX = 22, padY = 2, radius = 14,
}) => {
  const frame = useCurrentFrame();
  const cycle = 150; // un reflet toutes les 5 s
  const t = (frame % cycle) / 45; // le reflet traverse en 1,5 s puis repos
  const sweep = -60 + Math.min(t, 1) * 220; // en %
  const pulse = (Math.sin((frame / 30) * Math.PI * 0.5) + 1) / 2;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        padding: `${padY}px ${padX}px`,
        marginLeft: fontSize * 0.22,
        borderRadius: radius,
        border: `3px solid ${COLORS.electric}`,
        background: `linear-gradient(160deg, #0b2557 0%, ${COLORS.navy} 55%, ${COLORS.night} 100%)`,
        boxShadow: `0 0 ${14 + pulse * 10}px rgba(59,130,246,${0.35 + pulse * 0.15}), inset 0 0 18px rgba(59,130,246,0.18)`,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.12,
        color: COLORS.white,
      }}
    >
      {text}
      <span
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sweep}%`,
          width: "45%",
          background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          transform: "skewX(-18deg)",
        }}
      />
    </span>
  );
};
