export const COULEURS = {
  marine: "#061A40",
  marineProfond: "#030E26",
  secondaire: "#123B78",
  blanc: "#FFFFFF",
  electrique: "#3B8BFF",
  bleuClair: "#9CC2FF",
  gris: "rgba(255,255,255,0.38)",
};

export const POLICE = "'Montserrat', 'Helvetica Neue', Arial, sans-serif";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** Mise en page (pixels, sur 1080 × 1920) — vidéos en plein écran, textes en surimpression. */
export const LAYOUT = {
  titreTop: 92,
  sousTitreTop: 204,
  panneauX: 0,
  panneauW: 1080,
  panneauTopAvecSousTitre: 0,
  panneauTopSansSousTitre: 0,
  panneauBas: 1920,
  /** Encadré de période, sous le titre et le sous-titre */
  etiquetteTop: 312,
  /** Bas des grands textes (au-dessus de la frise) */
  texteBasBottom: 330,
  friseTop: 1704,
  mentionTop: 1840,
};

export const glow = (alpha: number, blur = 40) =>
  `0 0 ${blur}px rgba(59,139,255,${alpha})`;
