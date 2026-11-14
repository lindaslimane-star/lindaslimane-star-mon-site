import { Config } from "@remotion/cli/config";

// Export MP4 haute qualité (H.264, CRF bas = meilleure qualité).
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

// Facultatif : utiliser un Chrome déjà installé (CHROME_PATH=/chemin/vers/chrome).
if (process.env.CHROME_PATH) {
  Config.setBrowserExecutable(process.env.CHROME_PATH);
}
