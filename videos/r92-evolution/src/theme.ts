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

/** Mise en page (pixels, sur 1080 × 1920) */
export const LAYOUT = {
  titreTop: 176,
  sousTitreTop: 318,
  panneauX: 80,
  panneauW: 920,
  panneauTopAvecSousTitre: 438,
  panneauTopSansSousTitre: 350,
  panneauBas: 1424,
  friseTop: 1500,
  mentionTop: 1662,
};

export const glow = (alpha: number, blur = 40) =>
  `0 0 ${blur}px rgba(59,139,255,${alpha})`;
