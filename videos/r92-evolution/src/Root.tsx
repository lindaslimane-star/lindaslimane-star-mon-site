import React from "react";
import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import { R92Evolution } from "./R92Evolution";
import { evolutionSchema, type EvolutionProps } from "./schema";
import { configuration } from "./config";
import { construireTimeline, estVideo } from "./timing";
import { getVideoMetadata } from "@remotion/media-utils";
import { FPS, H, W } from "./theme";

/** Vérifie quels fichiers existent vraiment dans public/ et calcule la durée totale. */
const calculerMetadonnees: CalculateMetadataFunction<EvolutionProps> = async ({ props }) => {
  const fichiers = props.periodes.map((p) => p.fichier.trim()).filter(Boolean);
  const manquants: string[] = [];
  await Promise.all(
    fichiers.map(async (fichier) => {
      if (/^https?:\/\//.test(fichier)) return;
      try {
        const r = await fetch(staticFile(fichier.replace(/^\/+/, "")), { method: "HEAD" });
        if (!r.ok) manquants.push(fichier);
      } catch {
        manquants.push(fichier);
      }
    }),
  );
  const durees: Record<string, number> = {};
  await Promise.all(
    fichiers
      .filter((f) => estVideo(f) && !manquants.includes(f))
      .map(async (fichier) => {
        try {
          const src = /^https?:\/\//.test(fichier) ? fichier : staticFile(fichier.replace(/^\/+/, ""));
          const m = await getVideoMetadata(src);
          durees[fichier] = m.durationInSeconds;
        } catch {
          /* durée inconnue : lecture à vitesse normale */
        }
      }),
  );
  const resolues = { ...props, fichiersManquants: manquants, dureesFichiers: durees };
  const tl = construireTimeline(resolues, FPS);
  return { durationInFrames: tl.total, props: resolues };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="R92Evolution"
    component={R92Evolution}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={FPS * 32}
    schema={evolutionSchema}
    defaultProps={configuration}
    calculateMetadata={calculerMetadonnees}
  />
);
