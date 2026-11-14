import React from "react";

/** Dégradés sombres discrets en haut et en bas : lisibilité du titre et de la frise. */
export const Degrades: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 440,
        background:
          "linear-gradient(180deg, rgba(3,14,38,0.82) 0%, rgba(3,14,38,0.45) 55%, rgba(3,14,38,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 400,
        background:
          "linear-gradient(0deg, rgba(3,14,38,0.88) 0%, rgba(3,14,38,0.5) 50%, rgba(3,14,38,0) 100%)",
      }}
    />
  </>
);
