import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { BrandBox } from "./components/BrandBox";
import { Frame } from "./components/Frame";
import { SyncedVideo } from "./components/SyncedVideo";
import type { AdProps } from "./schema";
import { COLORS, FONT_DISPLAY, FONT_TEXT, INTRO_FRAMES, LAYOUT as L, WIDTH } from "./theme";

/** Fondu d'opacité uniquement (pas de déplacement, pas de zoom). */
const useFade = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const PairLabel: React.FC<{ text: string; highlight?: boolean }> = ({ text, highlight }) => {
  const opacity = useFade(2, INTRO_FRAMES);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        height: L.labelHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: highlight
          ? `linear-gradient(180deg, ${COLORS.electric} 0%, #2563eb 100%)`
          : `linear-gradient(180deg, #0b2557 0%, ${COLORS.navy} 100%)`,
        borderBottom: `2px solid ${highlight ? "rgba(255,255,255,0.35)" : "rgba(59,130,246,0.6)"}`,
      }}
    >
      <span
        style={{
          opacity,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 2,
          color: COLORS.white,
          textShadow: "0 2px 6px rgba(0,0,0,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const R92Ad: React.FC<AdProps> = (props) => {
  const frame = useCurrentFrame();
  const titleOpacity = useFade(0, INTRO_FRAMES);
  const line1 = useFade(6, INTRO_FRAMES + 6);
  const line2 = useFade(12, INTRO_FRAMES + 12);
  const footer = useFade(8, INTRO_FRAMES + 8);
  const ambient = Math.sin((frame / 30) * Math.PI * 0.2); // dérive lumineuse très lente

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 70% at 50% ${18 + ambient * 3}%, #0d2a63 0%, ${COLORS.navy} 42%, ${COLORS.night} 100%)`,
        fontFamily: FONT_TEXT,
      }}
    >
      {/* Lueur d'ambiance très subtile derrière le bloc avant/après */}
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 420,
          top: L.pairTop + 120,
          width: 840,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(59,130,246,0.16), transparent)",
          filter: "blur(30px)",
        }}
      />

      {/* TITRE PRINCIPAL — visible toute la vidéo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: L.titleTop,
          height: L.titleHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 90,
          letterSpacing: 1,
          color: COLORS.white,
          whiteSpace: "nowrap",
          textShadow: "0 4px 18px rgba(0,0,0,0.45)",
        }}
      >
        <span>{props.titleText}</span>
        {props.titleBrand ? <BrandBox text={props.titleBrand} fontSize={90} /> : null}
      </div>

      {/* VIDÉO 1 — AVANT (haut gauche) */}
      <Frame left={L.side} top={L.pairTop} width={L.pairWidth} height={L.pairHeight} phase={0}>
        <div style={{ position: "absolute", left: 0, right: 0, top: L.labelHeight, height: L.pairVideoHeight }}>
          <SyncedVideo slot={props.before} />
        </div>
        <PairLabel text={props.before.label} />
      </Frame>

      {/* VIDÉO 2 — APRÈS 6 MOIS (haut droite) — même taille exacte */}
      <Frame
        left={L.side + L.pairWidth + L.gap}
        top={L.pairTop}
        width={L.pairWidth}
        height={L.pairHeight}
        phase={Math.PI / 2}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: L.labelHeight, height: L.pairVideoHeight }}>
          <SyncedVideo slot={props.after} />
        </div>
        <PairLabel text={props.after.label} highlight />
      </Frame>

      {/* VIDÉO 3 — PRISE DES GUMMIES (grande, horizontale) */}
      <Frame left={L.side} top={L.mainTop} width={L.mainWidth} height={L.mainHeight} phase={Math.PI}>
        <SyncedVideo slot={props.gummies} />
        {props.gummies.label ? (
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 22,
              padding: "8px 18px",
              borderRadius: 12,
              background: "rgba(6,26,64,0.78)",
              border: `2px solid ${COLORS.electric}`,
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: 1.5,
              color: COLORS.white,
              opacity: line1,
            }}
          >
            {props.gummies.label}
          </div>
        ) : null}
      </Frame>

      {/* MESSAGE — sous la vidéo pour ne jamais cacher le visage ni le produit */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: L.messageTop,
          height: L.messageHeight,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            minWidth: 700,
            height: "100%",
            padding: "0 56px",
            borderRadius: 22,
            border: `2px solid rgba(59,130,246,${0.4 + titleOpacity * 0.6})`,
            background: `linear-gradient(180deg, rgba(13,42,99,0.9) 0%, rgba(6,26,64,0.92) 100%)`,
            boxShadow: `0 16px 36px rgba(0,0,0,0.45), 0 0 22px rgba(59,130,246,${0.2 * titleOpacity})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <div
            style={{
              opacity: line1,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 52,
              lineHeight: 1.05,
              letterSpacing: 1.5,
              color: COLORS.white,
              whiteSpace: "nowrap",
            }}
          >
            {props.messageLine1}
          </div>
          <div
            style={{
              opacity: line2,
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: 36,
              lineHeight: 1.1,
              letterSpacing: 6,
              color: COLORS.electric,
              whiteSpace: "nowrap",
            }}
          >
            {props.messageLine2}
          </div>
        </div>
      </div>

      {/* Pied : mention discrète */}
      <div
        style={{
          position: "absolute",
          left: L.side,
          right: L.side,
          top: L.footerTop,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: footer * 0.85,
        }}
      >
        <span
          style={{
            fontFamily: FONT_TEXT,
            fontWeight: 500,
            fontSize: 21,
            lineHeight: 1.3,
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
          }}
        >
          {props.disclaimer}
        </span>
      </div>
    </AbsoluteFill>
  );
};
