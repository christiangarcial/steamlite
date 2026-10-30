import * as Yup from 'yup';

/**
 * Esquema de validacion del formulario de checkout (Yup).
 * Se mantiene fuera del componente para permitir test unitarios aislados
 * y cumplir la regla de fast-refresh (un archivo = un componente).
 */
export const checkoutSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede superar los 60 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'El nombre solo puede contener letras')
    .required('El nombre completo es obligatorio'),

  email: Yup.string()
    .trim()
    .email('Introduce un email valido')
    .required('El email es obligatorio'),

  cardNumber: Yup.string()
    .transform((value) => (value ? value.replace(/\s/g, '') : value))
    .matches(/^[0-9]{16}$/, 'La tarjeta debe tener 16 digitos')
    .required('El número de tarjeta es obligatorio'),

  cardName: Yup.string()
    .trim()
    .min(3, 'El nombre del titular es obligatorio')
    .required('El nombre del titular es obligatorio'),

  expiry: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Usa el formato MM/AA')
    .test('valid-expiry', 'La tarjeta esta vencida o el mes no existe', (value) => {
      if (!value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return true;
      const [month, year] = value.split('/').map(Number);
      const expiryDate = new Date(2000 + year, month, 0, 23, 59, 59);
      return expiryDate >= new Date();
    })
    .required('La fecha de vencimiento es obligatoria'),

  cvv: Yup.string()
    .matches(/^[0-9]{3,4}$/, 'El CVV debe tener 3 o 4 digitos')
    .required('El CVV es obligatorio'),

  terms: Yup.boolean().oneOf([true], 'Debes aceptar los términos de la simulación'),
});

export const checkoutInitialValues = {
  fullName: '',
  email: '',
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvv: '',
  terms: false,
};
