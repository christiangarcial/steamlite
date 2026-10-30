import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const errors = [];
const results = [];

const log = (ok, name, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`);
  if (!ok) errors.push(name);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + err.message));

// ---------------------------------------------------------------
// 1. Catalogo principal
// ---------------------------------------------------------------
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const cards = await page.locator('.game-card').count();
log(cards === 13, 'Catalogo muestra 13 tarjetas', `encontradas=${cards}`);

log(await page.locator('text=Destacado').first().isVisible(), 'Hero banner visible');
log(await page.locator('text=Destacados de la temporada').isVisible(), 'Carrusel destacado visible');
log(await page.locator('text=Juegos gratis para jugar ahora').isVisible(), 'Carrusel de gratis visible');

// ---------------------------------------------------------------
// 2. Busqueda en tiempo real
// ---------------------------------------------------------------
await page.getByPlaceholder(/Buscar juego por t.tulo/).fill('snake');
await page.waitForTimeout(400);
const searchCount = await page.locator('.game-card').count();
log(searchCount === 1, 'Busqueda "snake" filtra a 1 resultado', `encontrados=${searchCount}`);

await page.getByPlaceholder(/Buscar juego por t.tulo/).fill('');
await page.waitForTimeout(300);

// Filtro por genero
await page.getByLabel(/Filtrar por g.nero/).selectOption('Puzzle');
await page.waitForTimeout(400);
const puzzleCount = await page.locator('.game-card').count();
log(puzzleCount === 2, 'Filtro por genero Puzzle -> 2 juegos', `encontrados=${puzzleCount}`);

await page.getByRole('button', { name: 'Limpiar filtros' }).click();
await page.waitForTimeout(400);
const resetCount = await page.locator('.game-card').count();
log(resetCount === 13, 'Limpiar filtros restaura 13 juegos', `encontrados=${resetCount}`);

// ---------------------------------------------------------------
// 3. Detalle del juego
// ---------------------------------------------------------------
await page.locator('.game-card a').first().click();
await page.waitForTimeout(600);
log(page.url().includes('/game/'), 'Navegacion a detalle de juego', page.url());
log(await page.locator('h1').first().isVisible(), 'Detalle muestra titulo');
log(await page.getByRole('button', { name: /Resenas/ }).isVisible(), 'Pestana Resenas presente');
log(await page.getByRole('button', { name: /Capturas/ }).isVisible(), 'Pestana Capturas presente');
log(await page.getByRole('button', { name: /Detalles/ }).isVisible(), 'Pestana Detalles presente');

await page.getByRole('button', { name: /Detalles/ }).click();
await page.waitForTimeout(300);
log(await page.locator('text=Desarrollador').isVisible(), 'Pestana Detalles muestra ficha tecnica');

// ---------------------------------------------------------------
// 4. Carrito
// ---------------------------------------------------------------
await page.goto(`${BASE}/game/snake-retro`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Agregar al carrito' }).click();
await page.waitForTimeout(400);
log(await page.getByRole('button', { name: 'Quitar del carrito' }).isVisible(), 'Boton cambia a "Quitar del carrito"');

const badge = await page.locator('header >> text=/^\\d+$/').first().textContent();
log(badge.trim() === '1', 'Badge del carrito muestra 1', `valor=${badge.trim()}`);

await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
log(await page.locator('text=Snake Classic').first().isVisible(), 'Carrito muestra el juego agregado');
log(await page.locator('text=Resumen del pedido').isVisible(), 'Resumen del pedido visible');

// -----------------------------------------------------
// 5. Checkout: validacion Formik + Yup
// -----------------------------------------------------
await page.getByRole('button', { name: 'Proceder al pago' }).click();
await page.waitForTimeout(500);
log(await page.locator('text=Datos del comprador').isVisible(), 'Formulario de checkout visible');

// Enviar vacio -> debe mostrar errores
await page.getByRole('button', { name: /^Pagar/ }).click();
await page.waitForTimeout(700);
const errorCount = await page.locator('span:text-matches("obligatorio")').count();
log(errorCount > 0, 'Yup bloquea el envio con campos vacios', `errores=${errorCount}`);

// Email invalido
await page.getByLabel(/Correo electr.nico/).fill('email-invalido');
await page.getByLabel('Nombre completo').fill('Ada Lovelace');
await page.waitForTimeout(400);
log(
  await page.locator('text=Introduce un email valido').isVisible(),
  'Yup valida formato de email'
);

// Tarjeta corta
await page.getByLabel(/Correo electr.nico/).fill('ada@ejemplo.com');
await page.getByLabel(/N.mero de tarjeta/).fill('1234');
await page.waitForTimeout(400);
log(
  await page.locator('text=La tarjeta debe tener 16 digitos').isVisible(),
  'Yup valida longitud de tarjeta'
);

// Rellenar todo correctamente
await page.getByLabel(/N.mero de tarjeta/).fill('4242424242424242');
await page.getByLabel('Nombre del titular').fill('ADA LOVELACE');
await page.getByLabel('Vencimiento \(MM/AA\)').fill('12/30');
await page.getByLabel('CVV').fill('123');
await page.getByLabel(/Entiendo que esta es una/).check();
await page.waitForTimeout(500);

const errorsVisible = await page.locator('span:text-matches("obligatorio|tiene que|valido|16 digitos|vencida")').count();
log(errorsVisible === 0, 'Formulario valido sin errores', `errores_restantes=${errorsVisible}`);

// ---------------------------------------------------------------
// 6. Compra simulada -> Biblioteca + localStorage
// ---------------------------------------------------------------
page.once('dialog', async (dialog) => {
  console.log('   [dialog] ' + dialog.message().replace(/\n/g, ' | '));
  await dialog.accept();
});

await page.getByRole('button', { name: /^Pagar/ }).click();
await page.waitForTimeout(2500);

log(await page.locator('text=¡Compra realizada!').isVisible(), 'Confirmacion de compra mostrada');

const ls = await page.evaluate(() => ({
  library: localStorage.getItem('steamlite.library'),
  cart: localStorage.getItem('steamlite.cart'),
}));
log(ls.library && ls.library.includes('snake-retro'), 'localStorage guarda la biblioteca', ls.library);
log(ls.cart === '[]', 'localStorage vacia el carrito tras la compra', ls.cart);

// ---------------------------------------------------------------
// 7. Biblioteca
// ---------------------------------------------------------------
await page.goto(`${BASE}/library`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
log(await page.locator('text=Snake Classic').first().isVisible(), 'Biblioteca muestra el juego comprado');
log(await page.getByRole('link', { name: 'Jugar' }).first().isVisible(), 'Biblioteca ofrece boton Jugar');

// ---------------------------------------------------------------
// 8. Ejecutar minijuego
// ---------------------------------------------------------------
await page.getByRole('link', { name: 'Jugar' }).first().click();
await page.waitForTimeout(800);
log(page.url().includes('/play/'), 'Navegacion a /play/:id', page.url());
log(await page.locator('canvas').first().isVisible(), 'Canvas del minijuego visible');
log(await page.locator('text=Snake Classic').first().isVisible(), 'Minijuego muestra su titulo');

// El boton Jugar debe aparecer en la ficha del juego comprado
await page.goto(`${BASE}/game/snake-retro`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
log(await page.getByRole('button', { name: 'Jugar ahora' }).isVisible(), 'Juego comprado muestra "Jugar ahora"');

// La insignia "EN TU BIBLIOTECA" vive en la tarjeta del catalogo
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
log(
  await page.locator('text=EN TU BIBLIOTECA').first().isVisible(),
  'Tarjeta del catalogo muestra insignia EN TU BIBLIOTECA'
);
const ownedCardButton = await page
  .locator('.game-card', { hasText: 'Snake Classic' })
  .getByRole('link', { name: 'Jugar' })
  .count();
log(ownedCardButton > 0, 'Tarjeta de juego comprado muestra boton Jugar');

// ---------------------------------------------------------------
// 9. Persistencia entre recargas
// ---------------------------------------------------------------
await page.goto(`${BASE}/game/snake-retro`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
log(await page.getByRole('button', { name: 'Jugar ahora' }).isVisible(), 'La biblioteca persiste tras recargar');

await page.goto(`${BASE}/library`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
log(await page.locator('text=Snake Classic').first().isVisible(), 'La biblioteca mantiene los juegos tras recargar');

// ---------------------------------------------------------------
// 10. Placeholder de juego externo
// ---------------------------------------------------------------
await page.goto(`${BASE}/play/cyber-runner`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
log(await page.locator('text=/Prximamente|Próximamente/').isVisible(), 'Placeholder de juego externo visible');
log(await page.locator('canvas').first().isVisible(), 'Placeholder dibuja canvas animado');

// ---------------------------------------------------------------
// 11. 404
// ---------------------------------------------------------------
await page.goto(`${BASE}/ruta-inexistente`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
log(await page.locator('text=/Pgina no encontrada|Página no encontrada/').isVisible(), 'Pagina 404');

// ---------------------------------------------------------------
// 12. Responsive (movil)
// ---------------------------------------------------------------
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const toggle = page.locator('.navbar-toggle');
log(await toggle.isVisible(), 'Boton de menu movil visible');
await toggle.click();
await page.waitForTimeout(400);
const mobileMenu = page.locator('.navbar-mobile-menu');
log(await mobileMenu.isVisible(), 'Menu movil desplegable');

await browser.close();

console.log('\n=========== RESULTADOS ===========');
results.forEach((r) => console.log(r));
console.log('\n=========== CONSOLA DEL NAVEGADOR ===========');
if (consoleErrors.length === 0) {
  console.log('Sin errores de consola.');
} else {
  consoleErrors.forEach((e) => console.log('  ' + e));
}
console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} pruebas superadas`);
process.exit(errors.length > 0 || consoleErrors.length > 0 ? 1 : 0);
