export const formatPrice = (value) => {
  if (value === 0) return 'Gratis';
  return `$${Number(value).toFixed(2)}`;
};

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('es-ES', {
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
  const taxRate = 0.19;
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
