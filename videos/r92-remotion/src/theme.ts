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

export type LayoutName = "classique" | "vedette" | "duo";

/** Grille (px) de la composition 1080×1920, entièrement dans la zone sûre. */
const makeLayout = (o: { pairVideoHeight: number; mainHeight: number; messageHeight: number; line1: number; line2: number; gapV: number }) => {
  const side = SAFE.side;
  const gap = 18;
  const titleTop = SAFE.top;
  const titleHeight = 108;
  const pairTop = titleTop + titleHeight + 18;
  const pairWidth = (WIDTH - side * 2 - gap) / 2; // 435 px chacune — strictement identiques
  const labelHeight = 60;
  const pairVideoHeight = o.pairVideoHeight;
  const pairHeight = labelHeight + pairVideoHeight;
  const mainTop = pairTop + pairHeight + o.gapV;
  const mainWidth = WIDTH - side * 2; // 888 px
  const mainHeight = o.mainHeight;
  const messageTop = mainTop + mainHeight + o.gapV - 4;
  const messageHeight = o.messageHeight;
  const messageMaxWidth = (SAFE.buttonsX - WIDTH / 2) * 2 - 20; // centré, sans passer sous les boutons
  const footerTop = messageTop + messageHeight + 8;
  return {
    side, gap, titleTop, titleHeight, pairTop, pairWidth, labelHeight,
    pairVideoHeight, pairHeight, mainTop, mainLeft: side, mainWidth, mainHeight,
    messageTop, messageHeight, messageMaxWidth, footerTop, line1: o.line1, line2: o.line2,
    /** Si défini : encadré message placé à côté de la vidéo gummies (au lieu de dessous, centré). */
    messageBox: undefined as undefined | { left: number; width: number },
  };
};

/** Avant/après en vedette + petite vidéo gummies VERTICALE à gauche, message à droite (hors boutons Instagram). */
const makeDuo = () => {
  const base = makeLayout({ pairVideoHeight: 798, mainHeight: 360, messageHeight: 360, line1: 62, line2: 40, gapV: 16 });
  const mainWidth = 288; // 4:5 — visage et pot visibles ensemble
  const messageLeft = base.side + mainWidth + base.gap;
  return {
    ...base,
    mainWidth,
    messageTop: base.mainTop,
    footerTop: base.mainTop + base.mainHeight + 10,
    messageBox: { left: messageLeft, width: SAFE.buttonsX - messageLeft },
  };
};

export const LAYOUTS = {
  /** Avant/après 435×640, vidéo gummies 888×400 */
  classique: makeLayout({ pairVideoHeight: 640, mainHeight: 400, messageHeight: 92, line1: 44, line2: 30, gapV: 18 }),
  /** Avant/après en vedette 435×774 (≈ 9:16, image entière), bandeau gummies fin 888×280 */
  vedette: makeLayout({ pairVideoHeight: 774, mainHeight: 280, messageHeight: 84, line1: 40, line2: 28, gapV: 16 }),
  /** Avant/après 435×798, vidéo gummies verticale 288×360 + message à côté */
  duo: makeDuo(),
};
export type Layout = ReturnType<typeof makeLayout>;
