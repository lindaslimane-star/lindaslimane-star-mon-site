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
/**
 * Zones de sécurité Instagram Reels / Meta Ads (marges de conception conservatrices) :
 * 250 px en haut, 420 px en bas, 90 px à gauche, 150 px à droite.
 * Titres, labels, frise et textes restent dans x = 90 → 930, y = 250 → 1500.
 * Les vidéos, elles, occupent tout l'écran.
 */
export const SECURITE = { haut: 250, bas: 420, gauche: 90, droite: 150 };

export const LAYOUT = {
  zoneX: SECURITE.gauche,
  zoneW: 1080 - SECURITE.gauche - SECURITE.droite, // 840
  titreTop: 266,
  sousTitreTop: 360,
  panneauX: 0,
  panneauW: 1080,
  panneauTopAvecSousTitre: 0,
  panneauTopSansSousTitre: 0,
  panneauBas: 1920,
  /** Encadré de période, sous le titre et le sous-titre */
  etiquetteTop: 458,
  /** Bas des grands textes (au-dessus de la frise) */
  texteBasBottom: 600,
  friseTop: 1338,
  mentionTop: 1462,
};

export const glow = (alpha: number, blur = 40) =>
  `0 0 ${blur}px rgba(59,139,255,${alpha})`;
