import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709"); // couleurs standard (compatibles Instagram / TikTok / Meta)
Config.setOverwriteOutput(true);
// Optionnel : utiliser un Chromium déjà installé (ex. REMOTION_BROWSER=/chemin/vers/chrome-headless-shell)
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
