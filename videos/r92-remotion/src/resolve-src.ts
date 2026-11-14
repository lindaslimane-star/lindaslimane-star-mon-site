import { staticFile } from "remotion";

/** Transforme "videos/avant.mp4" en URL du dossier public ; laisse passer http(s)/blob/data. */
export const resolveSrc = (src: string): string => {
  if (/^(https?:|blob:|data:)/.test(src)) return src;
  const [path, query] = src.replace(/^\/+/, "").replace(/^public\//, "").split("?");
  const url = staticFile(path);
  return query ? `${url}?${query}` : url;
};
