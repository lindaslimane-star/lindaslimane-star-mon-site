# Pub R92 — « 6 mois de cure » (Remotion)

Publicité verticale **1080×1920, 9:16, 30 i/s, MP4 H.264**, durée réglable de **20 à 30 s** (24 s par défaut).
Trois vidéos jouent **en même temps**, du début à la fin, calées sur la timeline principale :

| Emplacement | Fichier à fournir | Cadre |
|---|---|---|
| Haut gauche — « AVANT LA CURE » | `public/videos/avant.mp4` | 492×720 px |
| Haut droite — « APRÈS 6 MOIS » | `public/videos/apres-6-mois.mp4` | 492×720 px (taille identique) |
| Bas — prise des gummies | `public/videos/gummies.mp4` | 1008×590 px (horizontal) |

Sous la 3ᵉ vidéo : encadré « 2 GUMMIES PAR JOUR / PENDANT 6 MOIS » (placé *sous* la vidéo pour ne jamais cacher le visage ni le produit).

## Démarrage
```bash
cd videos/r92-remotion
npm install
npm run placeholders   # crée 3 vidéos TEMPORAIRES (n'écrase pas vos fichiers)
npm run editor         # interface d'édition → http://localhost:5173
```
Les vidéos temporaires affichent seulement un libellé et un chronomètre (aucune image de cheveux, aucun résultat simulé) :
le chronomètre permet de vérifier que les trois lectures sont simultanées et que les boucles repartent bien.

## Interface d'édition (`npm run editor`)
- **Importer** chaque vidéo (MP4, MOV…) : elle est copiée dans `public/videos/` et convertie en MP4 H.264 sans aucun filtre ni retouche.
- Aperçu en direct des **3 lectures simultanées** (lecteur Remotion).
- Modifier les **titres**, le message, la mention de bas de page.
- **Cadrage indépendant** par vidéo : « Remplir le cadre » ou « Image entière (sans coupe) », zoom ≥ 1 (jamais de déformation), point focal horizontal / vertical, volume.
- Régler la **durée** (20–30 s).
- **Exporter** le MP4 final → `out/R92_cure_6_mois.mp4` + lien de téléchargement.

Les réglages sont enregistrés automatiquement dans `ad-props.json`.

## Autres commandes
```bash
npm run studio   # Remotion Studio (aperçu image par image, réglages dans le panneau de droite)
npm run render   # export MP4 H.264 avec les réglages de ad-props.json → out/R92_cure_6_mois.mp4
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
