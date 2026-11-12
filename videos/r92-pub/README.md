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
