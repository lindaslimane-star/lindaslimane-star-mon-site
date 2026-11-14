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
  /** Segments qui sont des étapes de la frise (mois). */
  frise: Segment[];
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

  const frise = segments.filter((s) => s.periode.dansLaFrise);
  const premiere = frise[0]?.periode;
  const derniere = frise[frise.length - 1]?.periode;
  const comparaisonPossible =
    props.comparaisonFinale.active &&
    frise.length >= 2 &&
    (props.modeMaquette || (!premiere?.absente && !derniere?.absente));

  const compDur = comparaisonPossible
    ? Math.round(props.comparaisonFinale.duree * fps)
    : 0;
  const total = Math.max(
    fps * 2,
    finPeriodes + (compDur > 0 ? compDur : Math.round(0.8 * fps)),
  );

  return { segments, frise, intro, trans, finPeriodes, compFrom: finPeriodes, compDur, total };
};

/** Index de l'étape active de la frise à la frame f (-1 = aucune encore). */
export const indexActif = (tl: Timeline, f: number) => {
  let idx = -1;
  tl.frise.forEach((s, i) => {
    if (f >= s.from) idx = i;
  });
  return idx;
};

/** Vitesse de lecture pour qu'une vidéo trop courte couvre tout son créneau (léger ralenti, jamais < 0,6). */
export const vitesseLecture = (
  props: { dureesFichiers?: Record<string, number> },
  periode: Periode,
  secondesNecessaires: number,
) => {
  const total = props.dureesFichiers?.[periode.fichier];
  if (!total || !estVideo(periode.fichier)) return 1;
  const dispo = total - periode.debutVideo - 0.05;
  return Math.max(0.6, Math.min(1, dispo / secondesNecessaires));
};
