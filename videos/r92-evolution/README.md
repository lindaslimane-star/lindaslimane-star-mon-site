# R92 — « 6 MOIS DE CURE » (vidéo d'évolution, Remotion)

Vidéo verticale 9:16 · 1080 × 1920 · 30 i/s · ~31 s (avec les 7 périodes) · MP4 H.264 (CRF 16).
Pour Instagram Reels, TikTok et Meta Ads.

## Démarrage
```bash
cd videos/r92-evolution
npm install
npm run preview          # Remotion Studio : http://localhost:3000
```

## 1. Importer vos photos / vidéos
Déposez-les dans `public/evolution/` (JPG, PNG, WEBP, MP4, MOV, WEBM).
Noms par défaut : `avant.jpg`, `mois-1.jpg` … `mois-6.jpg` (ou `.mp4`).

Les médias sont affichés **tels quels** : aucun filtre, aucune retouche, aucune génération.
Seuls le cadrage et un léger zoom lent du cadre sont appliqués.

## 2. Modifier textes, dates et durées
Tout est dans **`src/config.ts`** (ou en direct dans le panneau *Props* du Studio) :

| Champ | Rôle |
|---|---|
| `titre`, `marque` | « 6 MOIS DE CURE » + encadré « R92 » (visible toute la vidéo) |
| `sousTitre`, `dureeSousTitre` | rectangle « MON ÉVOLUTION MOIS PAR MOIS » affiché au début (s) |
| `periodes[].intitule` | texte de l'encadré blanc (« AVANT LA CURE », « 1er MOIS »…) |
| `periodes[].etape` | texte sous le cercle de la frise (« AVANT », « 1 »…) |
| `periodes[].date` | date facultative sous l'intitulé (ex. « Mars 2026 ») |
| `periodes[].fichier` | chemin dans `public/` ou URL https ; vide = non documenté |
| `periodes[].duree` | durée de la période (s) |
| `periodes[].cadrage` | position de l'image, ex. `"50% 35%"` pour remonter vers le cuir chevelu |
| `periodes[].debutVideo` | pour une vidéo : seconde de départ |
| `transitionSecondes`, `zoom` | douceur des fondus, intensité du zoom cinématique |
| `comparaisonFinale` | écran final avant / dernier mois côte à côte + slogan |
| `mention` | petite mention en bas (vide = rien) |
| `musique`, `volumeMusique` | fichier audio facultatif dans `public/` (fondu entrée/sortie automatique) |
| `modeMaquette` | `true` = emplacements « PHOTO À IMPORTER » pour les fichiers manquants |

**Périodes non documentées** : si un fichier est absent de `public/`, la période est
retirée automatiquement de la vidéo **et** de la frise (en export final). Rien n'est inventé.
La durée totale s'adapte toute seule.

## 3. Exporter le MP4
```bash
npm run render             # export final → out/R92_evolution_6_mois.mp4 (périodes documentées uniquement)
npm run render:maquette    # avec emplacements vides, pour valider la mise en page
```
Si Remotion ne peut pas télécharger son navigateur, indiquez un Chrome local :
`CHROME_PATH=/chemin/vers/chrome npm run render`.

## Structure
- `src/config.ts` — **la configuration à modifier**
- `src/schema.ts` — description des champs (formulaire du Studio)
- `src/timing.ts` — calcul du minutage, périodes visibles
- `src/components/` — `Fond`, `Titre`, `SousTitre`, `Panneau` (médias + encadrés), `Frise`, `Comparaison`, `Media`, `Etiquette`
- `src/theme.ts` — couleurs (#061A40, #123B78, #FFFFFF, bleu électrique) et mise en page

## Conformité
Aucune promesse de repousse ni affirmation médicale dans les textes par défaut.
Vérifiez que les textes que vous ajoutez restent descriptifs (« mon évolution », dates, mois).
