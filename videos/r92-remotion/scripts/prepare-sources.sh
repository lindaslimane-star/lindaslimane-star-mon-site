#!/usr/bin/env bash
# Prépare les vidéos réelles fournies pour la pub.
# Usage : bash scripts/prepare-sources.sh AVANT.mov APRES.mov GUMMIES_1.mov [GUMMIES_2.mov ...]
#
# Aucune retouche du sujet : pas de filtre couleur, pas de lissage, pas de modification des cheveux.
#  - avant / après : simple changement de conteneur MOV → MP4 (flux copié à l'identique) si H.264,
#    sinon conversion H.264 haute qualité. Le recadrage se règle ensuite dans l'éditeur.
#  - gummies : les clips sont mis bout à bout dans un plan horizontal.
#      · clip horizontal → mis à l'échelle (recadrage de quelques pixels au plus pour égaliser les tailles) ;
#      · clip vertical   → affiché en entier (7 % → 86 % de la hauteur) sur un fond flouté du même plan.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${OUT:-public/videos}            # ex. OUT=public/videos/1an pour la pub « 1 an »
APRES_NAME=${APRES_NAME:-$([[ $OUT == public/videos || $OUT == public/videos/ ]] && echo apres-6-mois.mp4 || echo apres.mp4)}
mkdir -p "$OUT"
[[ $# -ge 3 ]] || { echo "Usage : $0 AVANT APRES GUMMIES_1 [GUMMIES_2 ...]"; exit 1; }
AVANT=$1; APRES=$2; shift 2

copy_or_h264() { # entrée sortie
  local codec; codec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$1")
  if [[ $codec == h264 ]]; then
    ffmpeg -loglevel error -y -i "$1" -map 0:v:0 -map 0:a? -c copy -movflags +faststart "$2"
  else
    ffmpeg -loglevel error -y -i "$1" -map 0:v:0 -map 0:a? -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
      -c:a aac -b:a 160k -movflags +faststart "$2"
  fi
}
copy_or_h264 "$AVANT" "$OUT/avant.mp4"
copy_or_h264 "$APRES" "$OUT/$APRES_NAME"
echo "✓ avant.mp4, $APRES_NAME"

# Un seul clip gummies : conservé tel quel (format d'origine), simplement converti en H.264 si besoin.
if [[ $# -eq 1 ]]; then copy_or_h264 "$1" "$OUT/gummies.mp4"; echo "✓ gummies.mp4 (format d'origine)"; exit 0; fi

# Taille du plan gummies : d'après le 1er clip (horizontal → 1920×1004, vertical → 1080×726)
IFS=x read -r W0 H0 < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$1")
if (( W0 > H0 )); then W=1920; H=1004; else W=1080; H=726; fi

inputs=(); filters=""; concat=""; i=0
for f in "$@"; do
  inputs+=(-i "$f")
  IFS=x read -r w h < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$f")
  if (( w > h )); then
    vf="scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}"
  else
    vf="split[a$i][b$i];[a$i]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=40:2,eq=brightness=-0.22[bg$i];\
[b$i]crop=iw:ih*0.79:0:ih*0.07,scale=-2:${H}[fg$i];[bg$i][fg$i]overlay=(W-w)/2:0"
  fi
  filters+="[$i:v]${vf},fps=30,setsar=1,format=yuv420p[v$i];[$i:a]aresample=48000,aformat=channel_layouts=stereo[a$i];"
  concat+="[v$i][a$i]"; i=$((i+1))
done
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "${filters}${concat}concat=n=$i:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$OUT/gummies.mp4"
echo "✓ gummies.mp4 ($i clip(s) → ${W}x${H})"
