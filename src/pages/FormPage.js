import React, { useState, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { db } from '../firebaseConfig';

const FormPage = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Forzar actualización para SimpleReactValidator
  const [, forceUpdate] = useState(false);

  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: 'Este campo es obligatorio',
        email: 'Ingresa un correo electrónico válido',
        min: 'Debe tener al menos :min caracteres.'
      }
    })
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (validator.current.allValid()) {
      try {
        setSending(true);

        // Se guarda formulario en la colección "consultas"
        await db.collection('consultas').add({
          ...form,
          createdAt: new Date()
        });

        setSending(false);
        setSuccessMsg('Tus datos fueron enviados correctamente. ¡Gracias por contactarnos!');

        // Limpiar formulario
        setForm({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: ''
        });

        // Ocultar mensajes de validación cuando se envía correctamente
        validator.current.hideMessages();
        forceUpdate((v) => !v);
      } catch (error) {
        console.error(error);
        setSending(false);
        setErrorMsg('Ocurrió un error al guardar tu consulta. Intenta nuevamente.');
      }
    } else {
      // Mostrar mensajes de validación
      validator.current.showMessages();
      forceUpdate((v) => !v);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Formulario de contacto (Ejercicio 2)</h2>
      <p className="mb-4">
        Completa el formulario para solicitar información o reservar un vinilo en MagnetSys Store.
      </p>

      {/* Mensajes globales */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
          />
          <small className="text-danger">
            {validator.current.message('nombre', form.nombre, 'required|min:2')}
          </small>
        </div>

        {/* Correo electrónico */}
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
          <small className="text-danger">
            {validator.current.message('email', form.email, 'required|email')}
          </small>
        </div>

        {/* Asunto */}
        <div className="mb-3">
          <label className="form-label">Asunto</label>
          <input
            type="text"
            name="asunto"
            className="form-control"
            value={form.asunto}
            onChange={handleChange}
          />
          <small className="text-danger">
            {validator.current.message('asunto', form.asunto, 'required|min:2')}
          </small>
        </div>

        {/* Mensaje */}
        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea
            name="mensaje"
            className="form-control"
            rows="4"
            value={form.mensaje}
            onChange={handleChange}
          />
          <small className="text-danger">
            {validator.current.message('mensaje', form.mensaje, 'required|min:5')}
          </small>
        </div>

        <div className="row mt-3">
          <div className="col-12 col-md-6 col-lg-4 mx-auto d-grid">
            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={sending}
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
