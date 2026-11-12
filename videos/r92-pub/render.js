// usage: node render.js page.html out.mp4            -> full video
//        node render.js page.html stills t1 t2 ...    -> PNG stills (still_<t>.png)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [page_, out, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(page_));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  if (out === 'stills') {
    for (const t of times) {
      await page.evaluate(t => window.render(t), +t);
      await page.screenshot({ path: `still_${t}.png` });
    }
  } else {
    const fps = 30, dur = await page.evaluate(() => window.DURATION);
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(dur * fps);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
