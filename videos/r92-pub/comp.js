// usage: node comp.js overlay.html base.mp4 out.mp4      -> vidéo finale (base + calque animé)
//        node comp.js overlay.html base.mp4 stills t1 t2 -> images de contrôle
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
(async () => {
  const [html, base, out, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(html));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  if (out === 'stills') {
    for (const t of times) {
      await page.evaluate(t => window.render(t), +t);
      await page.screenshot({ path: `ov_${t}.png`, omitBackground: true });
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', t, '-i', base, '-i', `ov_${t}.png`, '-filter_complex', 'overlay', '-frames:v', '1', `rs_${t}.png`]);
    }
  } else {
    const fps = 30, dur = await page.evaluate(() => window.DURATION), n = Math.round(dur * fps);
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-i', base, '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
      '-filter_complex', '[0:v][1:v]overlay=format=auto,format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', out],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await page.screenshot({ type: 'png', omitBackground: true });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
