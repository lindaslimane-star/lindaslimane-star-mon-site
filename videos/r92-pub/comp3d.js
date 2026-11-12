// usage: node comp3d.js page.html base.mp4 out.mp4 | stills t1 t2 ...
// Sert le dossier en HTTP (modules ES), rend la page 3D image par image et la superpose à base.mp4.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
(async () => {
  const [html, base, out, ...times] = process.argv.slice(2);
  const root = process.cwd();
  const srv = http.createServer((q, s) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
    fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return } s.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(d) }) });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('PAGE:', m.text()) });
  page.on('pageerror', e => console.error('PAGEERR:', e.message));
  await page.goto(`http://127.0.0.1:${srv.address().port}/${html}`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
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
    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await page.screenshot({ type: 'png', omitBackground: true });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 60 === 0) console.log(`frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close(); srv.close();
})();
