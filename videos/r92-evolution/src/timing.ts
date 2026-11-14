import type { EvolutionProps, Periode } from "./schema";

export type PeriodeResolue = Periode & { absente: boolean };

export type Segment = {
  periode: PeriodeResolue;
  index: number;
  from: number; // frame de début
  dur: number; // durée en frames
};

export type Timeline = {
  segments: Segment[];
  intro: number;
  trans: number;
  finPeriodes: number;
  compFrom: number;
  compDur: number;
  total: number;
};

export const estVideo = (fichier: string) =>
  /\.(mp4|mov|webm|m4v|mkv)$/i.test(fichier.split("?")[0]);

export const periodesVisibles = (props: EvolutionProps): PeriodeResolue[] => {
  const manquants = new Set(props.fichiersManquants ?? []);
  return props.periodes
    .filter((p) => p.afficher)
    .map((p) => ({
      ...p,
      absente: p.fichier.trim() === "" || manquants.has(p.fichier),
    }))
    .filter((p) => !p.absente || props.modeMaquette);
};

export const construireTimeline = (
  props: EvolutionProps,
  fps: number,
): Timeline => {
  const periodes = periodesVisibles(props);
  const intro = Math.round(props.introSecondes * fps);
  const trans = Math.max(2, Math.round(props.transitionSecondes * fps));

  let t = intro;
  const segments: Segment[] = periodes.map((periode, index) => {
    const dur = Math.max(trans + 2, Math.round(periode.duree * fps));
    const s = { periode, index, from: t, dur };
    t += dur;
    return s;
  });
  const finPeriodes = t;

  const premiere = segments[0]?.periode;
  const derniere = segments[segments.length - 1]?.periode;
  const comparaisonPossible =
    props.comparaisonFinale.active &&
    segments.length >= 2 &&
    (props.modeMaquette || (!premiere?.absente && !derniere?.absente));

  const compDur = comparaisonPossible
    ? Math.round(props.comparaisonFinale.duree * fps)
    : 0;
  const total = Math.max(
    fps * 2,
    finPeriodes + (compDur > 0 ? compDur : Math.round(0.8 * fps)),
  );

  return { segments, intro, trans, finPeriodes, compFrom: finPeriodes, compDur, total };
};

/** Index de la période active à la frame f. */
export const indexActif = (tl: Timeline, f: number) => {
  let idx = 0;
  tl.segments.forEach((s, i) => {
    if (f >= s.from) idx = i;
  });
  return idx;
};
