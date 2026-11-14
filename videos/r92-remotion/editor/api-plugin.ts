import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_VIDEOS = path.join(ROOT, "public", "videos");
const OUT_DIR = path.join(ROOT, "out");
/** Une pub = un fichier de réglages + un dossier de vidéos + un fichier exporté. */
const VARIANTS: Record<string, { props: string; dir: string; files: Record<string, string>; composition: string; output: string }> = {
  "3mois": {
    props: "ad-props.json", dir: "", composition: "R92Cure", output: "R92_cure_3_mois.mp4",
    files: { before: "avant.mp4", after: "apres-6-mois.mp4", gummies: "gummies.mp4" },
  },
  "1an": {
    props: "ad-props-1an.json", dir: "1an", composition: "R92Cure1An", output: "R92_cure_1_an.mp4",
    files: { before: "avant.mp4", after: "apres.mp4", gummies: "gummies.mp4" },
  },
};
const variantOf = (url: URL) => VARIANTS[url.searchParams.get("variant") ?? "3mois"] ?? VARIANTS["3mois"];

type RenderState = { status: "idle" | "bundling" | "rendering" | "done" | "error"; progress: number; file?: string; error?: string };
let renderState: RenderState = { status: "idle", progress: 0 };

const json = (res: ServerResponse, code: number, body: unknown) => {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};
const readBody = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let s = "";
    req.on("data", (c) => (s += c));
    req.on("end", () => resolve(s));
    req.on("error", reject);
  });

const run = (cmd: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "ignore" });
    p.on("error", reject);
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} a échoué (${code})`))));
  });

/** Convertit en MP4 H.264 lisible partout (aucun filtre, aucune retouche : simple ré-encodage haute qualité). */
const toH264 = async (input: string, output: string) => {
  const args = ["-y", "-i", input, "-map", "0:v:0", "-map", "0:a?", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-movflags", "+faststart", output];
  try {
    await run("ffmpeg", args);
  } catch {
    await run("npx", ["remotion", "ffmpeg", ...args]); // FFmpeg fourni par Remotion
  }
};

const startRender = async (props: Record<string, unknown>, v: (typeof VARIANTS)[string]) => {
  renderState = { status: "bundling", progress: 0 };
  try {
    const { bundle } = await import("@remotion/bundler");
    const { renderMedia, selectComposition } = await import("@remotion/renderer");
    const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src", "index.ts") });
    const browserExecutable = process.env.REMOTION_BROWSER || null;
    const composition = await selectComposition({ serveUrl, inputProps: props, browserExecutable, id: v.composition });
    renderState = { status: "rendering", progress: 0 };
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const file = v.output;
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      crf: 18,
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      imageFormat: "jpeg",
      jpegQuality: 95,
      inputProps: props,
      browserExecutable,
      outputLocation: path.join(OUT_DIR, file),
      onProgress: ({ progress }) => (renderState = { status: "rendering", progress }),
    });
    renderState = { status: "done", progress: 1, file };
  } catch (e) {
    renderState = { status: "error", progress: 0, error: (e as Error).message };
  }
};

export const apiPlugin = (): Plugin => ({
  name: "r92-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url ?? "/", "http://x");
      try {
        // Import d'une vidéo dans public/videos/
        if (url.pathname === "/api/upload" && req.method === "POST") {
          const v = variantOf(url);
          const slot = url.searchParams.get("slot") ?? "";
          const target = v.files[slot];
          if (!target) return json(res, 400, { error: "Emplacement inconnu" });
          const dir = path.join(PUBLIC_VIDEOS, v.dir);
          fs.mkdirSync(dir, { recursive: true });
          const ext = path.extname(url.searchParams.get("name") ?? ".mp4") || ".mp4";
          const tmp = path.join(dir, `.upload-${slot}${ext}`);
          await new Promise<void>((resolve, reject) => {
            const w = fs.createWriteStream(tmp);
            req.pipe(w);
            w.on("finish", resolve);
            w.on("error", reject);
          });
          const final = path.join(dir, target);
          try {
            await toH264(tmp, final);
          } finally {
            fs.rmSync(tmp, { force: true });
          }
          return json(res, 200, { src: ["videos", v.dir, target].filter(Boolean).join("/"), version: Date.now() });
        }
        // Sauvegarde / lecture des réglages (utilisés aussi par `npm run render`)
        if (url.pathname === "/api/props") {
          const PROPS_FILE = path.join(ROOT, variantOf(url).props);
          if (req.method === "POST") {
            fs.writeFileSync(PROPS_FILE, JSON.stringify(JSON.parse(await readBody(req)), null, 2) + "\n");
            return json(res, 200, { ok: true });
          }
          return json(res, 200, JSON.parse(fs.readFileSync(PROPS_FILE, "utf8")));
        }
        // Export MP4
        if (url.pathname === "/api/render") {
          if (req.method === "POST") {
            if (renderState.status === "bundling" || renderState.status === "rendering")
              return json(res, 409, { error: "Un export est déjà en cours" });
            const v = variantOf(url);
            const props = JSON.parse(await readBody(req));
            fs.writeFileSync(path.join(ROOT, v.props), JSON.stringify(props, null, 2) + "\n");
            void startRender(props, v);
            return json(res, 202, { ok: true });
          }
          return json(res, 200, renderState);
        }
        // Téléchargement du MP4 exporté
        if (url.pathname.startsWith("/out/")) {
          const file = path.join(OUT_DIR, path.basename(url.pathname));
          if (!fs.existsSync(file)) return json(res, 404, { error: "Introuvable" });
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader("Content-Disposition", `attachment; filename="${path.basename(file)}"`);
          return fs.createReadStream(file).pipe(res);
        }
      } catch (e) {
        return json(res, 500, { error: (e as Error).message });
      }
      next();
    });
  },
});
