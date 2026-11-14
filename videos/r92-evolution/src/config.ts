import type { EvolutionProps } from "./schema";

/**
 * ============================================================
 *  CONFIGURATION DE LA VIDÉO R92 — à modifier ici
 * ============================================================
 *  1. Déposez vos photos / vidéos dans  public/evolution/
 *  2. Indiquez le nom du fichier dans « fichier » ci-dessous
 *  3. Ajustez intitulés, dates et durées (en secondes)
 *  Tout est aussi modifiable en direct dans la prévisualisation
 *  (panneau « Props » à droite de Remotion Studio).
 * ============================================================
 */
export const configuration: EvolutionProps = {
  titre: "6 MOIS DE CURE",
  marque: "R92",
  sousTitre: "ÉVOLUTION MOIS PAR MOIS",
  dureeSousTitre: 3,
  introSecondes: 0.5,
  transitionSecondes: 0.6,
  zoom: 0.07,

  // 0 à 3 s : 1er et dernier mois côte à côte pour capter l'attention
  accroche: { active: true, duree: 3 },

  periodes: [
    // Plan produit (non utilisé pour l'instant : afficher = false)
    { intitule: "MA CURE R92",   etape: "",      date: "", fichier: "evolution/gummies-1.mp4", duree: 1.9, cadrage: "50% 40%", debutVideo: 0, afficher: false, dansLaFrise: false, texteBas: "" },
    // Pas de vidéo « avant » fournie : la ligne reste vide, donc masquée.
    { intitule: "AVANT LA CURE", etape: "AVANT", date: "", fichier: "",                         duree: 3.5, cadrage: "50% 30%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    { intitule: "1er MOIS",      etape: "1",     date: "", fichier: "evolution/mois-1.mp4",     duree: 3.0, cadrage: "50% 35%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    { intitule: "2e MOIS",       etape: "2",     date: "", fichier: "evolution/mois-2.mp4",     duree: 3.4, cadrage: "50% 30%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    { intitule: "3e MOIS",       etape: "3",     date: "", fichier: "evolution/mois-3.mp4",     duree: 3.0, cadrage: "50% 35%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    { intitule: "4e MOIS",       etape: "4",     date: "", fichier: "evolution/mois-4.mp4",     duree: 3.8, cadrage: "50% 30%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    { intitule: "5e MOIS",       etape: "5",     date: "", fichier: "evolution/mois-5.mp4",     duree: 3.8, cadrage: "50% 30%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    { intitule: "6e MOIS",       etape: "6",     date: "", fichier: "evolution/mois-6.mp4",     duree: 3.8, cadrage: "50% 30%", debutVideo: 0, afficher: true, dansLaFrise: true, texteBas: "" },
    // Plan produit avant la comparaison finale (hors frise) — vidéo ralentie ×3 (images intermédiaires)
    { intitule: "", etape: "", date: "", fichier: "evolution/gummies-lent.mp4", duree: 6.0, cadrage: "50% 40%", debutVideo: 0, afficher: true, dansLaFrise: false, texteBas: "2 GUMMIES PAR JOUR\nPENDANT 6 MOIS" },
  ],

  comparaisonFinale: {
    active: true,
    duree: 4.0,
    slogan: "MOIS APRÈS MOIS, AVEC R92",
  },

  mention: "Résultats individuels, susceptibles de varier d'une personne à l'autre.",
  musique: "",
  volumeMusique: 0.6,
  modeMaquette: false,
};
