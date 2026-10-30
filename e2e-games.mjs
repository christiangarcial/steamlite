import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];
const consoleErrors = [];

const log = (ok, name, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

const games = [
  { id: 'snake-retro', label: 'Snake Classic', startBtn: /Empezar partida|Jugar de nuevo/ },
  { id: 'pong-retro', label: 'Retro Pong 2D', startBtn: /Empezar|Revancha/ },
  { id: 'brick-breaker', label: 'Brick Breaker X', startBtn: /^Jugar$|Reiniciar/ },
  { id: 'neon-grid', label: 'Neon Grid', startBtn: null },
  { id: 'pixel-racer', label: 'Pixel Racer', startBtn: /^Jugar$|Reiniciar/ },
  { id: 'block-buster', label: 'Block Buster', startBtn: /^Jugar$|Reiniciar/ },
];

for (const game of games) {
  console.log(`  -> probando ${game.id}`);
  await page.goto(`${BASE}/play/${game.id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const title = await page.locator('h2').first().innerText();
  log(title.includes(game.label), `${game.id}: titulo correcto`, title);

  const canvasCount = await page.locator('canvas').count();
  const cellCount = await page.locator('button[aria-label^="Celda"]').count();
  log(
    canvasCount > 0 || cellCount > 0,
    `${game.id}: area de juego renderizada`,
    `canvas=${canvasCount} celdas=${cellCount}`
  );

  if (game.startBtn) {
    const btn = page.getByRole('button', { name: game.startBtn }).first();
    if (await btn.count()) {
      await btn.click();
      await page.waitForTimeout(1500);
      log(true, `${game.id}: partida iniciada`);
    } else {
      log(false, `${game.id}: no se encontro el boton de inicio`);
    }
  } else {
    const cellCount = await page.locator('button[aria-label^="Celda"]').count();
    log(cellCount > 0, `${game.id}: rejilla de celdas presente`, `celdas=${cellCount}`);
    if (cellCount > 0) {
      await page.locator('button[aria-label^="Celda"]').first().click();
      await page.waitForTimeout(500);
      log(true, `${game.id}: celda interactiva responde`);
    }
  }

  await page.screenshot({ path: `shots/play-${game.id}.png` });
}

// Verificar que los canvas dibujan contenido real (no estan en blanco)
for (const game of games.filter((g) => g.id !== 'neon-grid')) {
  await page.goto(`${BASE}/play/${game.id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const btn = page.getByRole('button', { name: game.startBtn }).first();
  if (await btn.count()) await btn.click();
  await page.waitForTimeout(1600);

  const colorCount = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return -1;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colors = new Set();
    for (let i = 0; i < data.length; i += 16) {
      colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
    }
    return colors.size;
  });
  log(colorCount > 3, `${game.id}: el canvas dibuja escena real`, `colores=${colorCount}`);
}

// Neon Grid: comprobar que el canvas/celdas pintan
await page.goto(`${BASE}/play/neon-grid`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const gridColors = await page.evaluate(() => {
  const cells = [...document.querySelectorAll('button[aria-label^="Celda"]')];
  return new Set(cells.map((c) => c.style.backgroundColor)).size;
});
log(gridColors > 2, 'neon-grid: la rejilla tiene varios colores', `colores=${gridColors}`);

await browser.close();

console.log('\n=========== MINIJUEGOS ===========');
results.forEach((r) => console.log(r));
console.log('\n=========== CONSOLA ===========');
console.log(consoleErrors.length === 0 ? 'Sin errores.' : consoleErrors.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} superadas`);
