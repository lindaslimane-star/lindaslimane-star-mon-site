import subprocess, json, sys
lines=[l.rstrip('\n').split('\t') for l in open('vo/lines.tsv')]
inputs=[];filters=[];labels=[]
for i,(s,e,txt) in enumerate(lines):
    s,e=float(s),float(e); wav=f'vo/f_{i}.wav'
    subprocess.run(['./tts/bin/piper','-m','voices/fr_FR-siwis-medium.onnx','-f',wav,'--length-scale','1.0','--','%s'%txt],check=True,capture_output=True)
    # durée utile (sans silences)
    out=subprocess.run(['ffmpeg','-i',wav,'-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse','-f','wav','vo/t.wav','-y'],capture_output=True)
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','vo/t.wav'],capture_output=True,text=True).stdout)
    tempo=max(1.0,d/(e-s)); print(f'{i:2d} dur={d:.2f} slot={e-s:.2f} tempo={tempo:.3f}')
    inputs+=['-i',wav]
    filters.append(f'[{i}:a]silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo={tempo:.4f},aresample=48000,adelay={int(s*1000)}:all=1[v{i}]')
    labels.append(f'[v{i}]')
n=len(lines)
filters.append(''.join(labels)+f'amix=inputs={n}:normalize=0,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,aecho=0.8:0.5:40:0.12,apad=whole_dur=31[voice]')
cmd=['ffmpeg','-y','-loglevel','error']+inputs+['-filter_complex',';'.join(filters),'-map','[voice]','-ar','48000','-ac','1','vo/voice.wav']
subprocess.run(cmd,check=True)
