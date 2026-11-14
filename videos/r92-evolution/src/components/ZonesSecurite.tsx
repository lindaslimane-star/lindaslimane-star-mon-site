import React from "react";
import { AbsoluteFill } from "remotion";
import { H, SECURITE, W } from "../theme";

/** Repères visuels des zones de sécurité (prévisualisation uniquement, désactivés à l'export). */
export const ZonesSecurite: React.FC = () => {
  const masque = "rgba(255,40,80,0.28)";
  const { haut, bas, gauche, droite } = SECURITE;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: haut, background: masque }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: bas, background: masque }} />
      <div style={{ position: "absolute", left: 0, top: haut, width: gauche, height: H - haut - bas, background: masque }} />
      <div style={{ position: "absolute", right: 0, top: haut, width: droite, height: H - haut - bas, background: masque }} />
      <div
        style={{
          position: "absolute",
          left: gauche,
          top: haut,
          width: W - gauche - droite,
          height: H - haut - bas,
          border: "3px dashed rgba(255,80,110,0.95)",
          boxSizing: "border-box",
        }}
      />
    </AbsoluteFill>
  );
};
