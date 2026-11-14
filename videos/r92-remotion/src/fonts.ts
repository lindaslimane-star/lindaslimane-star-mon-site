import "@fontsource/oswald/500.css";
import "@fontsource/oswald/700.css";
import "@fontsource/inter/500.css";
import { continueRender, delayRender } from "remotion";

// Attend le chargement réel des polices avant de capturer la première image.
const handle = delayRender("Chargement des polices");
Promise.all([
  document.fonts.load("700 96px Oswald"),
  document.fonts.load("500 40px Oswald"),
  document.fonts.load("500 22px Inter"),
])
  .catch(() => undefined)
  .finally(() => continueRender(handle));
