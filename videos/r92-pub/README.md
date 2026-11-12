# Pub vidéo R92 — Gummies pousse cheveux

Vidéo verticale 9:16 (1080×1920, 30 i/s, ~19,5 s) pour Reels / TikTok / Stories.

Scènes : accroche → avant/après (3 clientes) → produit + bénéfices → offre cure 3 mois + appel à l'action.

## Régénérer la vidéo
```
cd videos/r92-pub
npm install
node render.js ad.html ../R92_pub_avant-apres_v1.mp4
```
Les textes, prix et durées se modifient dans `ad.html`. Les photos sont dans `assets/`.

## Reel ads v2 (avec les rushs)
Accroche « résultat d'abord » → avant → gummies → après → avant/après côte à côte → offre -45 %.
Les rushs (`rush/avant.mov`, `rush/apres.mov`, `rush/gummies.mp4`) ne sont pas versionnés (visages de personnes réelles).
1. Monter `base.mp4` à partir des rushs (commande ffmpeg dans l'historique de la session).
2. `node comp.js reel.html base.mp4 ../R92_reel_ads_v2.mp4` ajoute les textes animés.

## Vidéo futuriste 3D v3 (explicative, ~33 s)
Rendu Three.js (gummies 3D, fibre de kératine, actifs en orbite, HUD) + rush « gummies » entre 24,5 s et 27 s.
1. `base3d.mp4` = noir + `rush/gummies.mp4` (3,2 s → fin) placé à 24,5 s.
2. `node comp3d.js futur.html base3d.mp4 ../R92_futuriste_3D_v3.mp4` (sert le dossier en HTTP local, WebGL logiciel).

## Vidéo hologramme v4 (style « Comment ça fonctionne », ~31 s)
Fond noir, hologrammes cyan dans une bande centrale, sous-titres courts façon voix off.
`node comp3d.js holo.html black31.mp4 ../R92_hologramme_v4.mp4` (black31.mp4 = 31 s de noir 1080×1920).

## Voix off (vidéo hologramme)
Voix de synthèse Piper `fr_FR-siwis-medium` (hors ligne, gratuite).
- `voix/lines.tsv` : début, fin et texte de chaque phrase (écrit phonétiquement : « gummys », « R quatre-vingt-douze »).
- `voix/build.py` : génère chaque phrase et la place à son horodatage → `vo/voice.wav`.
- Mixage : voix +12 dB, ambiance de synthèse -8 dB avec ducking, normalisation -14 LUFS.
