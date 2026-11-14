import { z } from "zod";

export const cropSchema = z.object({
  /** cover = remplit le cadre (recadrage) ; contain = image entière, sans aucune coupe */
  fit: z.enum(["cover", "contain"]),
  /** Zoom ≥ 1 : agrandit sans déformer (proportions toujours conservées) */
  zoom: z.number().min(1).max(3).step(0.01),
  /** Point focal horizontal / vertical en % (0 = gauche/haut, 100 = droite/bas) */
  x: z.number().min(0).max(100).step(1),
  y: z.number().min(0).max(100).step(1),
});

export const videoSlotSchema = z.object({
  /** Chemin dans public/ (ex. videos/avant.mp4) ou URL complète */
  src: z.string(),
  label: z.string(),
  crop: cropSchema,
  volume: z.number().min(0).max(1).step(0.05),
  /** Durée de la source en secondes — calculée automatiquement (sert à la boucle) */
  sourceDuration: z.number().optional(),
});

export const adSchema = z.object({
  durationInSeconds: z.number().min(20).max(30).step(0.5),
  titleText: z.string(),
  titleBrand: z.string(),
  before: videoSlotSchema,
  after: videoSlotSchema,
  gummies: videoSlotSchema,
  messageLine1: z.string(),
  messageLine2: z.string(),
  disclaimer: z.string(),
});

export type AdProps = z.infer<typeof adSchema>;
export type VideoSlot = z.infer<typeof videoSlotSchema>;
export type Crop = z.infer<typeof cropSchema>;

export const defaultCrop: Crop = { fit: "cover", zoom: 1, x: 50, y: 35 };

export const defaultProps: AdProps = {
  durationInSeconds: 24,
  titleText: "3 MOIS DE CURE",
  titleBrand: "R92",
  before: { src: "videos/avant.mp4", label: "AVANT LA CURE", crop: { ...defaultCrop, y: 50 }, volume: 0 },
  after: { src: "videos/apres-6-mois.mp4", label: "APRÈS 3 MOIS", crop: { ...defaultCrop, y: 50 }, volume: 0 },
  gummies: { src: "videos/gummies.mp4", label: "", crop: { fit: "cover", zoom: 1, x: 50, y: 0 }, volume: 0 },
  messageLine1: "2 GUMMIES PAR JOUR",
  messageLine2: "PENDANT 3 MOIS",
  disclaimer: "Complément alimentaire · Résultats variables selon les personnes · Vidéos non retouchées",
};
