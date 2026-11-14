export const COLORS = {
  navy: "#061A40", // bleu marine profond
  night: "#020B1F", // bleu nuit
  electric: "#3B82F6", // bleu électrique
  white: "#FFFFFF",
} as const;

export const FONT_DISPLAY = "Oswald, 'Arial Narrow', sans-serif";
export const FONT_TEXT = "Inter, Arial, sans-serif";

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const INTRO_FRAMES = 15; // 0,5 s

/**
 * Zone sûre Instagram Reels (en px de la vidéo 1080×1920).
 * - Haut : barre d'état, flèche retour, « + » → rien d'important au-dessus de 200 px.
 * - Bas : nom du compte, légende, barre de progression → rien d'important sous 1590 px.
 * - Côtés : sur les téléphones très allongés, Instagram coupe ≈ 95 px de chaque côté.
 * - Droite : colonne de boutons (j'aime, commentaires…) entre ≈ 1130 et 1650 px de hauteur, à partir de x ≈ 895.
 */
export const SAFE = { top: 200, bottom: 1590, side: 96, buttonsX: 895, buttonsTop: 1130, buttonsBottom: 1650 } as const;

/** Grille (px) de la composition 1080×1920, entièrement dans la zone sûre. */
export const LAYOUT = (() => {
  const side = SAFE.side;
  const gap = 18;
  const titleTop = SAFE.top;
  const titleHeight = 108;
  const pairTop = titleTop + titleHeight + 18;
  const pairWidth = (WIDTH - side * 2 - gap) / 2; // 435 px chacune — strictement identiques
  const labelHeight = 60;
  const pairVideoHeight = 640; // la vedette : cheveux visibles de la racine aux pointes
  const pairHeight = labelHeight + pairVideoHeight;
  const mainTop = pairTop + pairHeight + 18;
  const mainWidth = WIDTH - side * 2; // 888 px
  const mainHeight = 400; // bandeau secondaire, plus discret que l'avant/après
  const messageTop = mainTop + mainHeight + 14;
  const messageHeight = 92;
  const messageMaxWidth = (SAFE.buttonsX - WIDTH / 2) * 2 - 20; // centré, sans passer sous les boutons
  const footerTop = messageTop + messageHeight + 8;
  return {
    side, gap, titleTop, titleHeight, pairTop, pairWidth, labelHeight,
    pairVideoHeight, pairHeight, mainTop, mainWidth, mainHeight,
    messageTop, messageHeight, messageMaxWidth, footerTop,
  };
})();
