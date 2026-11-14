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

/** Grille (px) de la composition 1080×1920. Tout est calculé ici pour garder des proportions exactes. */
export const LAYOUT = (() => {
  const side = 36;
  const gap = 24;
  const titleTop = 50;
  const titleHeight = 140;
  const pairTop = 212;
  const pairWidth = (WIDTH - side * 2 - gap) / 2; // 492 px chacune — strictement identiques
  const labelHeight = 72;
  const pairVideoHeight = 720;
  const pairHeight = labelHeight + pairVideoHeight;
  const mainTop = pairTop + pairHeight + 26;
  const mainWidth = WIDTH - side * 2; // 1008 px
  const mainHeight = 680; // ratio ≈ 1,49 (même ratio que gummies.mp4 préparé en 1080×726)
  const messageTop = mainTop + mainHeight + 22;
  const messageHeight = 132;
  const footerTop = messageTop + messageHeight + 18;
  return {
    side, gap, titleTop, titleHeight, pairTop, pairWidth, labelHeight,
    pairVideoHeight, pairHeight, mainTop, mainWidth, mainHeight,
    messageTop, messageHeight, footerTop,
  };
})();
