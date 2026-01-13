import { useState, useRef } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  // ⚠️ REEMPLAZA ESTA URL CON TU URL DE GOOGLE APPS SCRIPT
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwV-G9j2h91nijpqK53hOTGiZ7yUOQeJdf63Teopwpv5eTzESy7YjLveRltWmZAL5yPjg/exec";

  const validateName = (name) => {
    const nameRegex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
    if (!name.trim()) {
      return "El nombre es obligatorio";
    }
    if (!nameRegex.test(name)) {
      return "El nombre solo puede contener letras y espacios";
    }
    if (name.trim().length < 3) {
      return "El nombre debe tener al menos 3 caracteres";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      return "El correo electrónico es obligatorio";
    }
    if (!emailRegex.test(email)) {
      return "Ingresa tu correo electrónico válido";
    }
    return "";
  };

  const validateMessage = (message) => {
    if (!message.trim()) {
      return "El mensaje es obligatorio";
    }
    if (message.trim().length < 10) {
      return "El mensaje debe tener al menos 10 caracteres";
    }
    return "";
  };

  const handleBlur = (field) => {
    let error = "";
    if (field === "name") {
      error = validateName(nameRef.current.value);
    } else if (field === "email") {
      error = validateEmail(emailRef.current.value);
    } else if (field === "message") {
      error = validateMessage(messageRef.current.value);
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    const nameError = validateName(nameRef.current.value);
    const emailError = validateEmail(emailRef.current.value);
    const messageError = validateMessage(messageRef.current.value);

    setErrors({
      name: nameError,
      email: emailError,
      message: messageError
    });

    if (nameError || emailError || messageError) {
      return;
    }

    // Verificar que la URL esté configurada
    if (GOOGLE_SCRIPT_URL === "TU_URL_DE_GOOGLE_SCRIPT_AQUI") {
      alert('⚠️ Por favor, configura primero la URL de Google Script en el código');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const formData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        message: messageRef.current.value
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Con mode: 'no-cors', no podemos leer la respuesta, pero el envío funciona
      setLoading(false);
      setSuccess(true);

      // Limpiar campos
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (messageRef.current) messageRef.current.value = "";
      
      setErrors({ name: "", email: "", message: "" });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);

    } catch (error) {
      console.error('Error al enviar:', error);
      setLoading(false);
      alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      maxWidth: '48rem',
      margin: '0 auto'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          Contáctame
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#4b5563'
        }}>
          ¿Tienes alguna pregunta o proyecto en mente? ¡Me encantaría saber de ti!
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <svg style={{ height: '1.25rem', width: '1.25rem', color: '#16a34a', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p style={{ color: '#15803d', fontWeight: '600', margin: 0 }}>
            ¡Mensaje enviado exitosamente! Te responderé pronto.
          </p>
        </div>
      )}

      {/* Form fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Name and Email row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Nombre <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Ingresa tu nombre completo"
              onBlur={() => handleBlur("name")}
              onChange={() => {
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: "" }));
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '1rem',
                borderRadius: '0.5rem',
                border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#111827',
                outline: 'none',
                transition: 'all 0.15s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.name) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = errors.name ? '#ef4444' : '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.name && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Correo electrónico <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              ref={emailRef}
              type="email"
              placeholder="example@domain.com"
              onBlur={() => handleBlur("email")}
              onChange={() => {
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: "" }));
                }
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '1rem',
                borderRadius: '0.5rem',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#111827',
                outline: 'none',
                transition: 'all 0.15s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Mensaje <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            ref={messageRef}
            rows={6}
            placeholder="Escribe tu mensaje aquí... Cuéntame sobre tu proyecto o pregunta."
            onBlur={() => handleBlur("message")}
            onChange={() => {
              if (errors.message) {
                setErrors(prev => ({ ...prev, message: "" }));
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '1rem',
              borderRadius: '0.5rem',
              border: errors.message ? '1px solid #ef4444' : '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#111827',
              outline: 'none',
              transition: 'all 0.15s',
              resize: 'vertical',
              minHeight: '150px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.message) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.borderColor = errors.message ? '#ef4444' : '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.message && (
            <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {errors.message}
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: 0 }}>
          <span style={{ color: '#ef4444' }}>*</span> Campos obligatorios. Al hacer clic en "Enviar mensaje" aceptas que te contacte.
        </p>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'white',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = '#2563eb';
          }}
        >
          {loading && (
            <svg 
              style={{ 
                animation: 'spin 1s linear infinite',
                height: '1rem', 
                width: '1rem' 
              }} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
          Responderé tan pronto como sea posible 📧
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}