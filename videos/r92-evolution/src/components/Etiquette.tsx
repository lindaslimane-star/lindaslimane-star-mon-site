import React from "react";
import { COULEURS, POLICE } from "../theme";

/** Encadré blanc, typographie bleu marine (« AVANT LA CURE », « 1er MOIS »…). */
export const Etiquette: React.FC<{
  texte: string;
  date?: string;
  taille?: number;
  style?: React.CSSProperties;
}> = ({ texte, date, taille = 54, style }) => (
  <div
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${taille * 0.26}px ${taille * 0.62}px ${taille * 0.3}px`,
      borderRadius: taille * 0.26,
      background: COULEURS.blanc,
      boxShadow: "0 14px 40px rgba(1,8,24,0.45), 0 0 0 1px rgba(255,255,255,0.6)",
      fontFamily: POLICE,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <div
      style={{
        fontSize: taille,
        fontWeight: 900,
        color: COULEURS.marine,
        letterSpacing: taille * 0.04,
        lineHeight: 1.05,
      }}
    >
      {renderOrdinal(texte)}
    </div>
    {date ? (
      <div
        style={{
          marginTop: 6,
          fontSize: taille * 0.42,
          fontWeight: 700,
          color: COULEURS.secondaire,
          letterSpacing: 2,
        }}
      >
        {date.toUpperCase()}
      </div>
    ) : null}
  </div>
);

/** Met « er » / « e » en exposant : 1er MOIS, 2e MOIS. */
const renderOrdinal = (texte: string) => {
  const m = texte.match(/^(\d+)(er|re|e|ème|eme)(\s.*)$/i);
  if (!m) return texte;
  return (
    <>
      {m[1]}
      <span style={{ fontSize: "0.55em", verticalAlign: "0.7em", marginLeft: 2 }}>{m[2]}</span>
      {m[3]}
    </>
  );
};
