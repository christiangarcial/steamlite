import { useState } from 'react';
import { Form, Field, ErrorMessage, Formik } from 'formik';
import { formatPrice } from '../../utils/format';
import { checkoutSchema, checkoutInitialValues } from '../../utils/validation';

const fieldStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid #2a475e',
  backgroundColor: '#16202c',
  color: '#ffffff',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.35rem',
  fontSize: '0.82rem',
  color: '#c6d4df',
  fontWeight: '600',
};

const FieldWrapper = ({ label, name, type = 'text', placeholder, autoComplete, ...rest }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor={name} style={labelStyle}>
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={fieldStyle}
      {...rest}
    />
    <ErrorMessage
      name={name}
      render={(msg) => (
        <span style={{ color: '#ff6b6b', fontSize: '0.78rem', display: 'block', marginTop: '0.25rem' }}>
          {msg}
        </span>
      )}
    />
  </div>
);

export const CheckoutForm = ({ totals, onSubmitSuccess }) => {
  const [cardType, setCardType] = useState('visa');

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <Formik
      initialValues={checkoutInitialValues}
      validationSchema={checkoutSchema}
      onSubmit={(values, { setSubmitting }) => {
        // Simula el processamento de la pasarela de pago.
        setTimeout(() => {
          setSubmitting(false);
          onSubmitSuccess(values);
        }, 1200);
      }}
    >
      {({ values, errors, touched, isSubmitting, handleChange, handleBlur }) => (
        <Form noValidate>
          <section
            style={{
              backgroundColor: '#1b2838',
              border: '1px solid #2a475e',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <h3 style={{ margin: '0 0 1.2rem', fontSize: '1.1rem' }}>Datos del comprador</h3>

            <FieldWrapper
              label="Nombre completo"
              name="fullName"
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
            <FieldWrapper
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="ada@ejemplo.com"
              autoComplete="email"
            />
          </section>

          <section
            style={{
              backgroundColor: '#1b2838',
              border: '1px solid #2a475e',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <h3 style={{ margin: '0 0 1.2rem', fontSize: '1.1rem' }}>Método de pago</h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              {[
                { id: 'visa', label: 'Visa' },
                { id: 'mastercard', label: 'Mastercard' },
                { id: 'amex', label: 'American Express' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCardType(option.id)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    border: cardType === option.id ? '1px solid #66c0f4' : '1px solid #2a475e',
                    backgroundColor: cardType === option.id ? '#2a475e' : 'transparent',
                    color: cardType === option.id ? '#66c0f4' : '#8f98a0',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <FieldWrapper
              label="Número de tarjeta"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              autoComplete="cc-number"
              inputMode="numeric"
              value={values.cardNumber}
              onChange={(event) => {
                handleChange({ target: { name: 'cardNumber', value: formatCardNumber(event.target.value) } });
              }}
              onBlur={handleBlur}
            />

            <FieldWrapper
              label="Nombre del titular"
              name="cardName"
              placeholder="ADA LOVELACE"
              autoComplete="cc-name"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FieldWrapper
                label="Vencimiento (MM/AA)"
                name="expiry"
                placeholder="12/28"
                autoComplete="cc-exp"
                inputMode="numeric"
                value={values.expiry}
                onChange={(event) => {
                  handleChange({ target: { name: 'expiry', value: formatExpiry(event.target.value) } });
                }}
                onBlur={handleBlur}
              />
              <FieldWrapper
                label="CVV"
                name="cvv"
                placeholder="123"
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
              />
            </div>
          </section>

          <label
            style={{
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'flex-start',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: '#c6d4df',
              cursor: 'pointer',
            }}
          >
            <Field
              type="checkbox"
              name="terms"
              style={{ accentColor: '#66c0f4', width: '16px', height: '16px', marginTop: '2px' }}
            />
            <span>
              Entiendo que esta es una <strong>simulación</strong>: no se cobrara ni se guardara ningun dato
              real de tarjeta.
            </span>
          </label>
          <ErrorMessage
            name="terms"
            render={(msg) => (
              <span style={{ color: '#ff6b6b', fontSize: '0.78rem', display: 'block', marginBottom: '1rem' }}>
                {msg}
              </span>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              backgroundColor: isSubmitting ? '#4a5b6b' : '#a4d007',
              color: '#0e1116',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: isSubmitting ? 'wait' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isSubmitting ? 'Procesando pago...' : `Pagar ${formatPrice(totals.total)}`}
          </button>

          {Object.keys(errors).length > 0 && touched && Object.keys(touched).length > 0 && (
            <p
              style={{
                color: '#ff6b6b',
                fontSize: '0.82rem',
                marginTop: '0.75rem',
                textAlign: 'center',
              }}
            >
              Revisa los campos marcados antes de continuar.
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};
