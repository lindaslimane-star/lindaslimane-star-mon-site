#!/usr/bin/env bash
# Génère 3 vidéos TEMPORAIRES clairement identifiées (aucune image de cheveux,
# aucun résultat simulé). Elles servent uniquement à vérifier la mise en page,
# la lecture simultanée et les boucles. Remplacez-les par vos vraies vidéos :
#   public/videos/avant.mp4  public/videos/apres-6-mois.mp4  public/videos/gummies.mp4
# Usage : npm run placeholders  (ajoutez --force pour écraser des fichiers existants)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/videos
mkdir -p "$OUT"
FONT=$(fc-match -f '%{file}' 'DejaVu Sans:bold' 2>/dev/null || echo /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf)
FORCE=${1:-}

make() { # fichier largeur hauteur durée couleur libellé
  local file=$1 w=$2 h=$3 d=$4 col=$5 label=$6
  if [[ -f "$OUT/$file" && "$FORCE" != "--force" ]]; then
    echo "• $OUT/$file existe déjà (gardé). --force pour régénérer."; return
  fi
  local m=$(( w < h ? w : h )); local fs=$(( m / 16 ))
  ffmpeg -loglevel error -y \
    -f lavfi -i "color=c=0x0b1f45:s=${w}x${h}:r=30:d=${d}" \
    -f lavfi -i "color=c=${col}@0.55:s=$((w/5))x$((h)):r=30:d=${d}" \
    -filter_complex "[0][1]overlay=x='mod(t*${w}/3, ${w}+${w}/5)-${w}/5':y=0,\
drawtext=fontfile=${FONT}:text='VIDÉO TEMPORAIRE':fontcolor=white@0.8:fontsize=${fs}:x=(w-tw)/2:y=h*0.18,\
drawtext=fontfile=${FONT}:text='${label}':fontcolor=white:fontsize=$((fs*3/2)):x=(w-tw)/2:y=h*0.36,\
drawtext=fontfile=${FONT}:text='remplacer public/videos/${file}':fontcolor=white@0.75:fontsize=$((fs*2/3)):x=(w-tw)/2:y=h*0.52,\
drawtext=fontfile=${FONT}:text='%{pts\:hms}':fontcolor=0x3B82F6:fontsize=$((fs*3/2)):x=(w-tw)/2:y=h*0.68,\
drawtext=fontfile=${FONT}:text='durée source ${d}s (boucle)':fontcolor=white@0.6:fontsize=$((fs*2/3)):x=(w-tw)/2:y=h*0.82" \
    -c:v libx264 -pix_fmt yuv420p -preset veryfast -crf 26 -movflags +faststart "$OUT/$file"
  echo "✓ $OUT/$file (${w}x${h}, ${d}s)"
}

make avant.mp4        720 1280  7 0x334155 'AVANT LA CURE'
make apres-6-mois.mp4 720 1280  9 0x3B82F6 'APRÈS 3 MOIS'
make gummies.mp4     1280  720 11 0x1d4ed8 'PRISE DES GUMMIES'
