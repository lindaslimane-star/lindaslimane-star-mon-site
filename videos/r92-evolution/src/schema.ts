import { z } from "zod";

export const periodeSchema = z.object({
  /** Texte de l'encadré blanc affiché au-dessus des cheveux. */
  intitule: z.string(),
  /** Texte court sous le cercle de la frise (ex. « AVANT », « 1 »). */
  etape: z.string(),
  /** Date ou mention libre affichée sous l'intitulé (vide = rien). */
  date: z.string(),
  /** Fichier dans public/ (ex. « evolution/mois-1.jpg ») ou URL https. Vide = période non documentée. */
  fichier: z.string(),
  /** Durée d'affichage de la période, en secondes. */
  duree: z.number().min(0.5).max(20),
  /** Cadrage de la photo (CSS object-position), ex. « 50% 35% ». */
  cadrage: z.string(),
  /** Pour une vidéo : seconde de départ dans le fichier. */
  debutVideo: z.number().min(0),
  /** Décocher pour masquer la période sans supprimer la ligne. */
  afficher: z.boolean(),
  /** true = étape de la frise (mois). false = plan libre (ex. produit), hors frise et hors comparaison. */
  dansLaFrise: z.boolean(),
});

export const evolutionSchema = z.object({
  titre: z.string(),
  marque: z.string(),
  sousTitre: z.string(),
  /** Durée pendant laquelle le sous-titre reste visible au début (s). */
  dureeSousTitre: z.number().min(0).max(30),
  /** Courte ouverture avant la première période (s). */
  introSecondes: z.number().min(0).max(5),
  /** Durée des fondus entre périodes (s). */
  transitionSecondes: z.number().min(0.1).max(2),
  /** Intensité du zoom cinématique (0.07 = +7 % sur la durée d'une période). */
  zoom: z.number().min(0).max(0.3),
  periodes: z.array(periodeSchema),
  comparaisonFinale: z.object({
    active: z.boolean(),
    duree: z.number().min(1).max(15),
    slogan: z.string(),
  }),
  /** Petite mention en bas de l'écran (vide = rien). */
  mention: z.string(),
  /** Musique facultative dans public/ (ex. « musique.mp3 »). Vide = aucune. */
  musique: z.string(),
  volumeMusique: z.number().min(0).max(1),
  /**
   * true  = les périodes sans fichier apparaissent comme emplacements « PHOTO À IMPORTER »
   *         (pour caler la mise en page).
   * false = seules les périodes réellement documentées sont montrées (export final).
   */
  modeMaquette: z.boolean(),
  /** Rempli automatiquement : fichiers introuvables dans public/. Ne pas modifier. */
  fichiersManquants: z.array(z.string()).optional(),
  /** Rempli automatiquement : durée (s) de chaque fichier vidéo. Ne pas modifier. */
  dureesFichiers: z.record(z.string(), z.number()).optional(),
});

export type EvolutionProps = z.infer<typeof evolutionSchema>;
export type Periode = z.infer<typeof periodeSchema>;
