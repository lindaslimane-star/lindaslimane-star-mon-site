# Pubs R92 — « 3 mois de cure » et « 1 an de cure » (Remotion)

Deux pubs partagent le même code :

| Pub | Réglages | Vidéos | Composition | Export | Mise en page |
|---|---|---|---|---|---|
| Cure 3 mois | `ad-props.json` | `public/videos/` | `R92Cure` | `npm run render` → `out/R92_cure_3_mois.mp4` | classique |
| Cure 1 an | `ad-props-1an.json` | `public/videos/1an/` (`avant.mp4`, `apres.mp4`, `gummies.mp4`) | `R92Cure1An` | `npm run render:1an` → `out/R92_cure_1_an.mp4` | vedette |
| Cure 3 mois (v2) | `ad-props-3mois-v2.json` | `public/videos/3mois-v2/` | `R92Cure3MoisV2` | `npm run render:3mois-v2` → `out/R92_cure_3_mois_v2.mp4` | vedette |
| Cure 1 an (v2) | `ad-props-1an-v2.json` | `public/videos/1an-v2/` | `R92Cure1AnV2` | `npm run render:1an-v2` → `out/R92_cure_1_an_v2.mp4` | duo |
| Cure 1 an (v3) | `ad-props-1an-v3.json` | `public/videos/1an-v3/` | `R92Cure1AnV3` | `npm run render:1an-v3` → `out/R92_cure_1_an_v3.mp4` | duo |

Mises en page (`layout`) : **classique** = avant/après 435×640 + gummies 888×400 ;
**vedette** = avant/après 435×774 (≈ 9:16, image entière) + bandeau gummies fin 888×280 ;
**duo** = avant/après 435×798 + petite vidéo gummies verticale 288×360 à gauche, message à droite (pour un clip gummies vertical).
Dans l'éditeur : boutons « Cure 3 mois / Cure 1 an » en haut, et menu « Mise en page ».

Préparer les vidéos de la pub 1 an (un seul clip gummies → gardé dans son format d'origine) :
`OUT=public/videos/1an bash scripts/prepare-sources.sh AVANT.mov APRES.mov GUMMIES.mov`

---

Détails de la pub 3 mois :

Publicité verticale **1080×1920, 9:16, 30 i/s, MP4 H.264**, durée réglable de **20 à 30 s** (24 s par défaut).
Trois vidéos jouent **en même temps**, du début à la fin, calées sur la timeline principale :

| Emplacement | Fichier à fournir | Cadre |
|---|---|---|
| Haut gauche — « AVANT LA CURE » | `public/videos/avant.mp4` | 435×640 px |
| Haut droite — « APRÈS 3 MOIS » | `public/videos/apres-6-mois.mp4` | 435×640 px (taille identique) |
| Bas — prise des gummies | `public/videos/gummies.mp4` | 888×400 px (bandeau secondaire, plus discret) |

Sous la 3ᵉ vidéo : encadré « 2 GUMMIES PAR JOUR / PENDANT 3 MOIS » (placé *sous* la vidéo pour ne jamais cacher le visage ni le produit).

## Zone sûre Instagram Reels
Tout le contenu (titres, vidéos, message) est placé entre 200 px et 1590 px de hauteur et à 96 px des bords,
hors de la colonne de boutons à droite : rien n'est caché par l'interface Instagram, même sur les téléphones
très allongés qui coupent les côtés. Valeurs dans `src/theme.ts` (`SAFE`). Dans l'éditeur, la case
« Afficher les zones masquées par Instagram » affiche ces zones en rouge (jamais dans l'export).

## Démarrage
```bash
cd videos/r92-remotion
npm install
npm run placeholders   # crée 3 vidéos TEMPORAIRES (n'écrase pas vos fichiers)
npm run editor         # interface d'édition → http://localhost:5173
```
Les vidéos temporaires affichent seulement un libellé et un chronomètre (aucune image de cheveux, aucun résultat simulé) :
le chronomètre permet de vérifier que les trois lectures sont simultanées et que les boucles repartent bien.

## Intégrer les vidéos du smartphone (verticales)
```bash
bash scripts/prepare-sources.sh AVANT.mov APRES.mov GUMMIES_PLAN_LARGE.mov GUMMIES_GROS_PLAN.mov
```
- Avant / après : le flux vidéo d'origine est copié tel quel (MOV → MP4, aucune ré-compression).
- Gummies : les clips sont mis bout à bout. Clips horizontaux → 1920×1004 (simple mise à l'échelle) ;
  clips verticaux → affichés entiers sur un fond flouté du même plan. Aucun filtre sur le sujet.

### Plusieurs clips dans un même cadre avant / après
`bash scripts/concat-vertical.sh public/videos/1an-v3/avant.mp4 CLIP_1 CLIP_2` : clips mis bout à bout en 1080×1920 ;
un clip horizontal est affiché en entier sur un fond flouté du même plan. Aucune retouche du sujet.

## Interface d'édition (`npm run editor`)
- **Importer** chaque vidéo (MP4, MOV…) : elle est copiée dans `public/videos/` et convertie en MP4 H.264 sans aucun filtre ni retouche.
- Aperçu en direct des **3 lectures simultanées** (lecteur Remotion).
- Modifier les **titres**, le message, la mention de bas de page.
- **Cadrage indépendant** par vidéo : « Remplir le cadre » ou « Image entière (sans coupe) », zoom ≥ 1 (jamais de déformation), point focal horizontal / vertical, volume.
- Régler la **durée** (20–30 s).
- **Exporter** le MP4 final → `out/R92_cure_3_mois.mp4` + lien de téléchargement.

Les réglages sont enregistrés automatiquement dans `ad-props.json`.

## Autres commandes
```bash
npm run studio   # Remotion Studio (aperçu image par image, réglages dans le panneau de droite)
npm run render   # export MP4 H.264 avec les réglages de ad-props.json → out/R92_cure_3_mois.mp4
npm run still    # image d'aperçu PNG (frame 45)
```
Si Remotion ne peut pas télécharger son navigateur (réseau restreint), indiquez un Chromium « headless shell » existant :
`REMOTION_BROWSER=/chemin/chrome-headless-shell npm run render` (fonctionne aussi pour `npm run editor`).

## Règles de lecture (garanties par le code)
- Les 3 vidéos démarrent à la frame 0 et restent visibles à chaque image (aucun remplacement, aucune superposition).
- Une source plus courte que la pub repart automatiquement au début (`<Loop>` + durée lue dans le fichier).
- `<OffthreadVideo>` extrait l'image exacte de chaque frame avec FFmpeg → synchronisation parfaite à l'export.
- Aucun bouton, minuterie ou barre de lecture dans l'export (les contrôles n'existent que dans l'éditeur).
- Intro de 0,5 s : les contours se dessinent et les titres apparaissent en fondu ; les vidéos sont visibles dès le début.
- Animations : halo bleu qui respire légèrement, reflet lent sur le logo R92, fondus d'opacité sur les textes. Aucun zoom animé.

## Structure
```
src/theme.ts              couleurs, polices, grille 1080×1920 (toutes les dimensions)
src/schema.ts             réglages modifiables (zod) + valeurs par défaut
src/R92Ad.tsx             la composition
src/components/           SyncedVideo (lecture + boucle + recadrage), Frame (cadre + halo), BrandBox (logo R92)
editor/                   interface d'édition (Vite + @remotion/player) et API locale (import / export)
scripts/make-placeholders.sh   vidéos temporaires
```

## Authenticité
- Utiliser uniquement les vidéos authentiques du client, non retouchées (aucune génération ni modification de cheveux).
- Le texte ne promet pas de repousse ; vérifier que « 2 gummies par jour » correspond bien à la notice du produit avant diffusion.
- Les vidéos réelles ne sont pas versionnées dans Git (`public/videos/` est ignoré).

## Licence Remotion
Remotion est gratuit pour les particuliers et les entreprises jusqu'à 3 personnes ; au-delà, une licence entreprise est requise (remotion.pro).
