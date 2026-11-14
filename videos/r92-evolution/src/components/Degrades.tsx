import React from "react";

/**
 * Dégradés sombres discrets derrière les textes (haut : titre/labels ; bas : texte, frise, mention).
 * Ils ne recouvrent que la partie utile pour garder un maximum de vidéo visible.
 */
export const Degrades: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 600,
        background:
          "linear-gradient(180deg, rgba(3,14,38,0.55) 0%, rgba(3,14,38,0.6) 40%, rgba(3,14,38,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 720,
        background:
          "linear-gradient(0deg, rgba(3,14,38,0.55) 0%, rgba(3,14,38,0.7) 55%, rgba(3,14,38,0) 100%)",
      }}
    />
  </>
);
