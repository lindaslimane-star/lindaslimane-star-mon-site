import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { R92Ad } from "./R92Ad";
import { adSchema, defaultProps, type AdProps, type VideoSlot } from "./schema";
import { resolveSrc } from "./resolve-src";
import { FPS, HEIGHT, WIDTH } from "./theme";
import savedProps from "../ad-props.json";

const withDuration = async (slot: VideoSlot): Promise<VideoSlot> => {
  try {
    const meta = await getVideoMetadata(resolveSrc(slot.src));
    return { ...slot, sourceDuration: meta.durationInSeconds };
  } catch (e) {
    throw new Error(`Vidéo introuvable ou illisible : "${slot.src}". Placez le fichier dans public/ (voir README).`);
  }
};

/** Lit la durée réelle de chaque vidéo (pour les boucles) et fixe la durée de la pub. */
const calculateMetadata: CalculateMetadataFunction<AdProps> = async ({ props }) => {
  const [before, after, gummies] = await Promise.all([
    withDuration(props.before),
    withDuration(props.after),
    withDuration(props.gummies),
  ]);
  return {
    durationInFrames: Math.round(props.durationInSeconds * FPS),
    props: { ...props, before, after, gummies },
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="R92Cure"
    component={R92Ad}
    schema={adSchema}
    defaultProps={{ ...defaultProps, ...(savedProps as Partial<AdProps>) }}
    calculateMetadata={calculateMetadata}
    durationInFrames={Math.round(defaultProps.durationInSeconds * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
