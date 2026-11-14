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
  sousTitre: "MON ÉVOLUTION MOIS PAR MOIS",
  dureeSousTitre: 4,
  introSecondes: 0.5,
  transitionSecondes: 0.7,
  zoom: 0.07,

  periodes: [
    { intitule: "AVANT LA CURE", etape: "AVANT", date: "", fichier: "evolution/avant.jpg",  duree: 4.2, cadrage: "50% 40%", debutVideo: 0, afficher: true },
    { intitule: "1er MOIS",      etape: "1",     date: "", fichier: "evolution/mois-1.jpg", duree: 3.6, cadrage: "50% 40%", debutVideo: 0, afficher: true },
    { intitule: "2e MOIS",       etape: "2",     date: "", fichier: "evolution/mois-2.jpg", duree: 3.6, cadrage: "50% 40%", debutVideo: 0, afficher: true },
    { intitule: "3e MOIS",       etape: "3",     date: "", fichier: "evolution/mois-3.jpg", duree: 3.6, cadrage: "50% 40%", debutVideo: 0, afficher: true },
    { intitule: "4e MOIS",       etape: "4",     date: "", fichier: "evolution/mois-4.jpg", duree: 3.6, cadrage: "50% 40%", debutVideo: 0, afficher: true },
    { intitule: "5e MOIS",       etape: "5",     date: "", fichier: "evolution/mois-5.jpg", duree: 3.6, cadrage: "50% 40%", debutVideo: 0, afficher: true },
    { intitule: "6e MOIS",       etape: "6",     date: "", fichier: "evolution/mois-6.jpg", duree: 4.2, cadrage: "50% 40%", debutVideo: 0, afficher: true },
  ],

  comparaisonFinale: {
    active: true,
    duree: 4.5,
    slogan: "MOIS APRÈS MOIS, AVEC R92",
  },

  mention: "Résultats individuels, susceptibles de varier d'une personne à l'autre.",
  musique: "",
  volumeMusique: 0.6,
  modeMaquette: true,
};
