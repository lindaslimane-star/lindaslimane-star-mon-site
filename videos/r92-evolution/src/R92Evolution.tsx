import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import type { EvolutionProps } from "./schema";
import { construireTimeline } from "./timing";
import { COULEURS, LAYOUT, POLICE } from "./theme";
import { Fond } from "./components/Fond";
import { Titre } from "./components/Titre";
import { SousTitre } from "./components/SousTitre";
import { Panneau } from "./components/Panneau";
import { Frise } from "./components/Frise";
import { ZonesSecurite } from "./components/ZonesSecurite";

export const R92Evolution: React.FC<EvolutionProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const tl = construireTimeline(props, fps);

  return (
    <AbsoluteFill style={{ fontFamily: POLICE, backgroundColor: COULEURS.marineProfond }}>
      <Fond />
      {tl.segments.length === 0 ? (
        <AucunePhoto />
      ) : (
        <>
          <Panneau tl={tl} props={props} />
          <Frise tl={tl} />
        </>
      )}
      <SousTitre texte={props.sousTitre} dureeSecondes={props.dureeSousTitre} />
      <Titre titre={props.titre} marque={props.marque} />
      {props.mention ? (
        <div
          style={{
            position: "absolute",
            top: LAYOUT.mentionTop,
            left: LAYOUT.zoneX,
            width: LAYOUT.zoneW,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 0.5,
          }}
        >
          {props.mention}
        </div>
      ) : null}
      {props.afficherZonesSecurite ? <ZonesSecurite /> : null}
      {props.musique ? (
        <Audio
          src={/^https?:\/\//.test(props.musique) ? props.musique : staticFile(props.musique)}
          volume={(f) =>
            props.volumeMusique *
            interpolate(f, [0, fps * 0.8, durationInFrames - fps * 1.5, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};

const AucunePhoto: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 120 }}>
    <div style={{ color: "white", fontSize: 40, fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
      Aucune photo trouvée.
      <br />
      <span style={{ fontSize: 30, color: COULEURS.bleuClair }}>
        Déposez vos fichiers dans public/evolution/ et vérifiez src/config.ts
      </span>
    </div>
  </AbsoluteFill>
);
