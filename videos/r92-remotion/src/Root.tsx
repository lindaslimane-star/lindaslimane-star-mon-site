import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { R92Ad } from "./R92Ad";
import { adSchema, defaultProps, type AdProps, type VideoSlot } from "./schema";
import { resolveSrc } from "./resolve-src";
import { FPS, HEIGHT, WIDTH } from "./theme";
import saved3Mois from "../ad-props.json";
import saved1An from "../ad-props-1an.json";
import saved1AnV2 from "../ad-props-1an-v2.json";
import saved3MoisV2 from "../ad-props-3mois-v2.json";
import saved1AnV3 from "../ad-props-1an-v3.json";
import saved3MoisV3 from "../ad-props-3mois-v3.json";

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

const Variant: React.FC<{ id: string; saved: unknown }> = ({ id, saved }) => (
  <Composition
    id={id}
    component={R92Ad}
    schema={adSchema}
    defaultProps={{ ...defaultProps, ...(saved as Partial<AdProps>) }}
    calculateMetadata={calculateMetadata}
    durationInFrames={Math.round(defaultProps.durationInSeconds * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

/** R92Cure = pub « 3 mois » (ad-props.json) ; R92Cure1An = pub « 1 an » (ad-props-1an.json) ; R92Cure1AnV2 = 2e pub « 1 an » (ad-props-1an-v2.json). */
export const RemotionRoot: React.FC = () => (
  <>
    <Variant id="R92Cure" saved={saved3Mois} />
    <Variant id="R92Cure1An" saved={saved1An} />
    <Variant id="R92Cure1AnV2" saved={saved1AnV2} />
    <Variant id="R92Cure3MoisV2" saved={saved3MoisV2} />
    <Variant id="R92Cure1AnV3" saved={saved1AnV3} />
    <Variant id="R92Cure3MoisV3" saved={saved3MoisV3} />
  </>
);
