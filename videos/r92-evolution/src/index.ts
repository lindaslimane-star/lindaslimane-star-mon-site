import { continueRender, delayRender, registerRoot } from "remotion";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import { RemotionRoot } from "./Root";

// Attendre le chargement de la police avant de rendre les images.
const attente = delayRender("Chargement de la police Montserrat");
Promise.all(
  [500, 600, 700, 800, 900].map((w) => document.fonts.load(`${w} 40px Montserrat`, "ÉÈ6 MOIS R92")),
)
  .catch(() => undefined)
  .then(() => continueRender(attente));

registerRoot(RemotionRoot);
