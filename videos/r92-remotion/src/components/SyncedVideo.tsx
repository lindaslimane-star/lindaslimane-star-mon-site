import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, useVideoConfig } from "remotion";
import { resolveSrc } from "../resolve-src";
import type { VideoSlot } from "../schema";
import { COLORS } from "../theme";

/**
 * Vidéo calée sur la timeline principale (frame 0 = début de la pub).
 * - Démarre à la frame 0 comme les deux autres (aucun décalage).
 * - Si la source est plus courte que la pub, elle repart automatiquement au début (<Loop>).
 * - Recadrage : object-fit + point focal + zoom ≥ 1 → aucune déformation.
 * OffthreadVideo extrait chaque image exacte avec FFmpeg au rendu → synchronisation parfaite à l'export.
 */
export const SyncedVideo: React.FC<{ slot: VideoSlot }> = ({ slot }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { crop } = slot;
  const src = resolveSrc(slot.src);

  const video = (
    <OffthreadVideo
      src={src}
      muted={slot.volume <= 0}
      volume={slot.volume}
      pauseWhenBuffering
      style={{
        width: "100%",
        height: "100%",
        objectFit: crop.fit,
        objectPosition: `${crop.x}% ${crop.y}%`,
        transform: `scale(${crop.zoom})`,
        transformOrigin: `${crop.x}% ${crop.y}%`,
        backgroundColor: COLORS.night,
      }}
    />
  );

  const loopFrames = slot.sourceDuration ? Math.floor(slot.sourceDuration * fps) : 0;
  const needsLoop = loopFrames > 0 && loopFrames < durationInFrames;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.night }}>
      {needsLoop ? (
        <Loop durationInFrames={loopFrames} layout="none">
          {video}
        </Loop>
      ) : (
        video
      )}
    </AbsoluteFill>
  );
};
