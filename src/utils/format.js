/**
 * Configuracion de moneda de la plataforma.
 * Cambia SOLES: true para mostrar los precios en soles peruanos (S/).
 */
export const CURRENCY = {
  SOLES: true,
  code: 'PEN',
  locale: 'es-PE',
  symbol: 'S/',
  taxLabel: 'IGV',
};

/**
 * Formatea un importe con el simbolo y los decimales de la moneda activa.
 * @param {number} value
 */
export const formatPrice = (value) => {
  if (value === 0) return 'Gratis';
  const amount = Number(value).toFixed(2);
  return CURRENCY.SOLES ? `${CURRENCY.symbol} ${amount}` : `$${amount}`;
};

/**
 * Nombre del impuesto que se muestra en el resumen del pedido.
 */
export const taxName = CURRENCY.SOLES ? CURRENCY.taxLabel : 'IVA';

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(CURRENCY.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calcula el total del carrito con impuestos.
 * @param {Array<{price:number}>} items
 */
export const calculateTotals = (items = []) => {
  const subtotal = items.reduce((acc, item) => acc + Number(item.price || 0), 0);
  // IGV (Peru) = 18% · IVA generico = 19%
  const taxRate = CURRENCY.SOLES ? 0.18 : 0.19;
  const tax = subtotal * taxRate;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
    taxRate,
  };
};

export const pluralize = (count, singular, plural) =>
  `${count} ${count === 1 ? singular : plural}`;
