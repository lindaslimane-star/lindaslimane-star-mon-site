#!/usr/bin/env bash
# Met plusieurs clips bout à bout dans UNE vidéo verticale 1080×1920 (30 i/s) pour un cadre avant/après.
# Usage : bash scripts/concat-vertical.sh SORTIE.mp4 CLIP_1 CLIP_2 [...]
#  - clip vertical   → mis à l'échelle pour remplir 1080×1920 (recadrage minime si le ratio diffère un peu) ;
#  - clip horizontal → affiché en ENTIER au centre, sur un fond formé du même plan flouté et assombri.
# Aucun filtre sur le sujet (ni couleur, ni netteté, ni lissage). Un clip sans son reçoit une piste muette.
set -euo pipefail
OUTFILE=$1; shift
W=1080; H=1920
inputs=(); filters=""; concat=""; i=0
for f in "$@"; do
  inputs+=(-i "$f")
  IFS=x read -r w h < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$f")
  if (( w > h )); then
    vf="split[a$i][b$i];[a$i]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=40:2,eq=brightness=-0.25[bg$i];[b$i]scale=${W}:-2[fg$i];[bg$i][fg$i]overlay=0:(H-h)/2"
  else
    vf="scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}"
  fi
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  filters+="[$i:v]${vf},fps=30,setsar=1,format=yuv420p[v$i];"
  if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$f" | grep -q .; then
    filters+="[$i:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${d}[a$i];"
  else
    filters+="anullsrc=r=48000:cl=stereo,atrim=0:${d}[a$i];"
  fi
  concat+="[v$i][a$i]"; i=$((i+1))
done
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "${filters}${concat}concat=n=$i:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$OUTFILE"
echo "✓ $OUTFILE ($i clip(s) → ${W}x${H})"
