import React from "react";
import { Img, OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { COULEURS, POLICE } from "../theme";
import { estVideo, type PeriodeResolue } from "../timing";

const source = (fichier: string) =>
  /^https?:\/\//.test(fichier) ? fichier : staticFile(fichier.replace(/^\/+/, ""));

/**
 * Affiche la photo / vidéo réelle telle quelle (aucun filtre, aucune retouche).
 * Seul le cadrage (object-position) et le zoom global du conteneur s'appliquent.
 */
export const Media: React.FC<{ periode: PeriodeResolue; vitesse?: number }> = ({ periode, vitesse = 1 }) => {
  const { fps } = useVideoConfig();
  if (periode.absente) return <EmplacementVide periode={periode} />;

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: periode.cadrage || "50% 50%",
  };

  if (estVideo(periode.fichier)) {
    return (
      <OffthreadVideo
        src={source(periode.fichier)}
        muted
        playbackRate={vitesse}
        startFrom={Math.round(periode.debutVideo * fps)}
        style={style}
      />
    );
  }
  return <Img src={source(periode.fichier)} style={style} />;
};

/** Emplacement neutre (mode maquette) : aucune image de cheveux n'est inventée. */
const EmplacementVide: React.FC<{ periode: PeriodeResolue }> = ({ periode }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      containerType: "size",
      background: `linear-gradient(180deg, ${COULEURS.secondaire} 0%, ${COULEURS.marine} 100%)`,
      fontFamily: POLICE,
      color: "rgba(255,255,255,0.75)",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: "3.6cqw",
        borderRadius: 26,
        border: "3px dashed rgba(156,194,255,0.35)",
      }}
    />
    <svg style={{ width: "13cqw", height: "13cqw" }} viewBox="0 0 24 24" fill="none" stroke={COULEURS.bleuClair} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
    <div style={{ fontSize: "4.2cqw", fontWeight: 800, letterSpacing: "0.4cqw" }}>PHOTO À IMPORTER</div>
    <div style={{ fontSize: "2.8cqw", fontWeight: 600, color: COULEURS.bleuClair, letterSpacing: 1 }}>
      public/{periode.fichier || "evolution/…"}
    </div>
  </div>
);
