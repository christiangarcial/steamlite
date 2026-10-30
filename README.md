# SteamLite — Proyecto Integrador

Plataforma web de distribución digital de videojuegos web, inspirada en Steam.
Permite explorar un catálogo, filtrar juegos, comprar (simulación de pago) y
ejecutar mini-juegos clásicos directamente en el navegador.

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Vite | 5.x | Bundler y servidor de desarrollo |
| React | 18.x | Biblioteca de interfaz (SPA) |
| react-router-dom | 7.x | Enrutamiento de la SPA |
| Formik + Yup | 2.x / 1.x | Manejo y validación de formularios |
| Context + useReducer | — | Estado global (carrito y biblioteca) |
| localStorage | — | Persistencia de biblioteca y carrito |
| ESLint | 9.x | Linting (flat config) |

## Puesta en marcha

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Compilar para producción (carpeta dist/)
npm run preview  # Previsualizar la build de producción
npm run lint     # Ejecutar ESLint
```

## Estructura del proyecto

```
public/
  data/
    games.json          Catálogo (13 juegos), categorías y reseñas
src/
  components/
    layout/             Navbar, Footer, HeroBanner (carrusel destacado)
    catalog/            GameCard, CatalogFilter, GameCarousel
    cart/               CartWidgets (items + resumen), CheckoutForm (Formik/Yup)
    games/              ExternalGamePlaceholder (juegos sin implementación)
  context/
    StoreContext.jsx    Estado global: carrito + biblioteca (Context + useReducer)
  data/
    gameRegistry.js     Mapa id de juego -> componente de mini-juego
  games/                Mini-juegos en Canvas: Snake, Pong, Brick Breaker,
                        Neon Grid, Pixel Racer, Block Buster
  hooks/
    useCatalogData.js   Carga asíncrona del catálogo (useEffect)
    useFilteredGames.js Filtrado y ordenación (useMemo)
  pages/                CatalogPage, GameDetailPage, CartPage, LibraryPage,
                        PlayPage, NotFoundPage
  utils/
    format.js           Formato de precios, fechas y totales
    storage.js          Acceso seguro a localStorage
    validation.js       Esquema de validación Yup del checkout
  App.jsx               Router + StoreProvider
  main.jsx              Punto de entrada
  index.css             Estilos globales y responsive
```

## Rutas

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | Catálogo | Hero banner, carruseles, búsqueda y filtros |
| `/game/:id` | Detalle | Banner, pestañas (reseñas/capturas/detalles), relacionados |
| `/cart` | Carrito / Checkout | Resumen, totales y formulario de pago simulado |
| `/library` | Biblioteca | Juegos adquiridos, listos para jugar |
| `/play/:id` | Ejecutar juego | Lanza el mini-juego o el placeholder animado |
| `*` | 404 | Página no encontrada |

## Arquitectura de estado

`StoreContext.jsx` implementa un `useReducer` con las acciones:

- `CART/ADD`, `CART/REMOVE`, `CART/CLEAR` — gestión del carrito
- `LIBRARY/ADD`, `LIBRARY/REMOVE` — biblioteca del usuario
- `ORDER/COMPLETE` — finaliza la compra: mueve los juegos del carrito a la
  biblioteca y guarda el resumen del pedido

Dos efectos `useEffect` sincronizan el estado con `localStorage`:

- `steamlite.cart` — ids de los juegos en el carrito
- `steamlite.library` — ids de los juegos adquiridos

Ambos accesos están protegidos con `try/catch` (`utils/storage.js`) para que
el modo privado del navegador no rompa la aplicación.

## Formulario de Checkout

El esquema de validación (`utils/validation.js`) usa **Yup** dentro de
**Formik**. Reglas principales:

- Nombre: 3–60 caracteres, solo letras
- Email: formato válido
- Tarjeta: exactamente 16 dígitos
- Vencimiento: formato `MM/AA` y no vencido
- CVV: 3 o 4 dígitos
- Términos de simulación: obligatorios

El pago es una simulación: no se procesa ni se almacena ningún dato real.

## Mini-juegos

| Juego | Controles | Mecánica |
|---|---|---|
| Snake Classic | Flechas | Comer y evitar colisiones |
| Retro Pong 2D | Ratón | Rebotes con ángulo contra la IA, a 11 puntos |
| Brick Breaker X | ← → | Romper ladrillos, 3 vidas |
| Neon Grid | Clic | Rotar celdas sin repetir color en fila o columna |
| Pixel Racer '89 | ← → | Scroll infinito con obstáculos y velocidad creciente |
| Block Buster | ← → ↑ ↓ | Tetris simplificado con líneas y rotación |

Los juegos de tipo `external` del catálogo (sin implementación) muestran un
placeholder animado en Canvas en lugar de una vista vacía.

## Diseño

Tema oscuro inspirado en Steam con paleta propia:

- Fondo `#0e1116`
- Superficies `#1b2838`
- Bordes `#2a475e`
- Acento azul `#66c0f4`
- Acento verde `#a4d007`

El diseño es responsivo: por debajo de 900 px el Navbar colapsa en un menú
desplegable y las vistas de dos columnas pasan a una sola.

## Distribución del trabajo

- **Integrante 1 — Catálogo y Mini-Juegos**: `public/data/games.json`,
  `src/hooks/useFilteredGames.js`, `src/games/*`, `src/data/gameRegistry.js`
- **Integrante 2 — UI y Navegación**: `src/components/layout/*`,
  `src/components/catalog/*`, `src/pages/*`, `src/index.css`
- **Integrante 3 — Carrito, Checkout y Persistencia**: `src/context/StoreContext.jsx`,
  `src/components/cart/*`, `src/utils/storage.js`, `src/utils/validation.js`
