#!/usr/bin/env bash
# Prépare les vidéos réelles fournies (smartphone, verticales) pour la pub.
# Usage : bash scripts/prepare-sources.sh AVANT.mov APRES.mov GUMMIES_1.mov [GUMMIES_2.mov ...]
#
# Aucune retouche du sujet : pas de filtre couleur, pas de lissage, pas de modification des cheveux.
#  - avant / après : simple changement de conteneur MOV → MP4 (flux vidéo copié à l'identique).
#    Le recadrage se règle ensuite dans l'éditeur (point focal, zoom ≥ 1).
#  - gummies : les clips sont mis bout à bout dans un plan horizontal 1080×726 (même ratio que le cadre du bas).
#    Le 1er clip (plan large : visage + pot) est affiché en entier en hauteur utile, centré, sur un fond
#    formé du même plan flouté et assombri. Les clips suivants (gros plans) sont recadrés autour du visage et du geste.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/videos
mkdir -p "$OUT"
[[ $# -ge 3 ]] || { echo "Usage : $0 AVANT APRES GUMMIES_1 [GUMMIES_2 ...]"; exit 1; }
AVANT=$1; APRES=$2; shift 2

ffmpeg -loglevel error -y -i "$AVANT" -map 0:v:0 -map 0:a? -c copy -movflags +faststart "$OUT/avant.mp4"
ffmpeg -loglevel error -y -i "$APRES" -map 0:v:0 -map 0:a? -c copy -movflags +faststart "$OUT/apres-6-mois.mp4"
echo "✓ avant.mp4, apres-6-mois.mp4 (flux d'origine copiés)"

W=1080; H=726
# Plan large : fenêtre utile de 7 % à 86 % de la hauteur (visage → pot), entière, centrée sur fond flouté.
WIDE="split[a][b];[a]crop=iw:ih*${H}/${W}*iw/ih*${W}/iw:0:ih*0.30,scale=${W}:${H},boxblur=40:2,eq=brightness=-0.22[bg];\
[b]crop=iw:ih*0.79:0:ih*0.07,scale=-2:${H}[fg];[bg][fg]overlay=(W-w)/2:0"
# Gros plan : bande horizontale de 23 % à ~61 % de la hauteur (yeux → bouche + gummy + doigts).
CLOSE="crop=iw:iw*${H}/${W}:0:ih*0.23,scale=${W}:${H}"

inputs=(); filters=""; concat=""; i=0
for f in "$@"; do
  inputs+=(-i "$f")
  if [[ $i -eq 0 ]]; then vf=$WIDE; else vf=$CLOSE; fi
  filters+="[$i:v]${vf},fps=30,setsar=1,format=yuv420p[v$i];[$i:a]aresample=48000,aformat=channel_layouts=stereo[a$i];"
  concat+="[v$i][a$i]"; i=$((i+1))
done
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "${filters}${concat}concat=n=$i:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$OUT/gummies.mp4"
echo "✓ gummies.mp4 ($i clip(s) → ${W}x${H})"
