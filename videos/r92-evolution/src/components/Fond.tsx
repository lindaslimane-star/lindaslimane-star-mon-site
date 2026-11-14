import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COULEURS } from "../theme";

/** Fond bleu marine profond, halos lents et reflets électriques discrets. */
export const Fond: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  const halo1X = 30 + Math.sin(t * 0.25) * 8;
  const halo1Y = 22 + Math.cos(t * 0.2) * 5;
  const halo2X = 72 + Math.cos(t * 0.18) * 8;
  const halo2Y = 78 + Math.sin(t * 0.22) * 5;
  const rayon = -20 + ((t * 6) % 140); // reflet diagonal très lent

  return (
    <AbsoluteFill style={{ backgroundColor: COULEURS.marineProfond }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% 42%, ${COULEURS.marine} 0%, ${COULEURS.marineProfond} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${halo1X}% ${halo1Y}%, rgba(18,59,120,0.75) 0%, rgba(18,59,120,0) 42%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${halo2X}% ${halo2Y}%, rgba(18,59,120,0.6) 0%, rgba(18,59,120,0) 40%)`,
        }}
      />
      {/* reflet bleu électrique diagonal */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${rayon - 12}%, rgba(59,139,255,0.07) ${rayon}%, transparent ${rayon + 12}%)`,
        }}
      />
      {/* fines lignes techniques */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(156,194,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(156,194,255,0.035) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 50%, black 0%, transparent 100%)",
        }}
      />
      {/* grain */}
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(1,6,18,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
