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

/** Mise en page (pixels, sur 1080 × 1920) — cadre vidéo maximisé. */
export const LAYOUT = {
  titreTop: 92,
  sousTitreTop: 204,
  panneauX: 28,
  panneauW: 1024,
  panneauTopAvecSousTitre: 304,
  panneauTopSansSousTitre: 204,
  panneauBas: 1652,
  friseTop: 1704,
  mentionTop: 1840,
};

export const glow = (alpha: number, blur = 40) =>
  `0 0 ${blur}px rgba(59,139,255,${alpha})`;
