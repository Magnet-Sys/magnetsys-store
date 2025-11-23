import React, { useState, useEffect } from 'react';
import { auth, storage, db } from '../firebaseConfig';

const AuthStoragePage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  // Foto de perfil
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');

  // Datos de despacho
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    region: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Detectar cambios en la autenticación (del usuario) 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (!u) {
        // Reseteo cuando se cierra sesión
        setFile(null);
        setUploadProgress(0);
        setDownloadURL('');
        setProfileForm({
          nombre: '',
          direccion: '',
          telefono: '',
          ciudad: '',
          region: ''
        });
        return;
      }

      try {
        // Buscar datos de perfil existentes
        const doc = await db.collection('usuarios').doc(u.uid).get();
        if (doc.exists) {
          const data = doc.data();
          setProfileForm({
            nombre: data.nombre || '',
            direccion: data.direccion || '',
            telefono: data.telefono || '',
            ciudad: data.ciudad || '',
            region: data.region || ''
          });
          if (data.fotoPerfilUrl) {
            setDownloadURL(data.fotoPerfilUrl);
          }
        } else {
          // Usuario nuevo, formulario vacío
          setProfileForm({
            nombre: '',
            direccion: '',
            telefono: '',
            ciudad: '',
            region: ''
          });
          setDownloadURL('');
        }
      } catch (error) {
        console.error(error);
        setErrorMsg('No se pudieron cargar los datos de perfil.');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    try {
      if (mode === 'register') {
        await auth.createUserWithEmailAndPassword(email, password);
        setMessage('Registro exitoso. Ya puedes completar tu perfil.');
      } else {
        await auth.signInWithEmailAndPassword(email, password);
        setMessage('Inicio de sesión exitoso. Bienvenido de vuelta.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Error en autenticación');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setMessage('Sesión cerrada.');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0);
    // Si se selecciona un nuevo archivo, limpiar la URL previa
  };

  const handleUpload = () => {
    setMessage('');
    setErrorMsg('');

    // Validar que haya un usuario autenticado
    if (!user) {
      setErrorMsg('Debes iniciar sesión para subir tu foto de perfil.');
      return;
    }

    // Validar que haya un archivo seleccionado
    if (!file) {
      setErrorMsg('Primero selecciona una imagen.');
      return;
    }

    const storageRef = storage.ref(`avatars/${user.uid}/${file.name}`);
    const uploadTask = storageRef.put(file);

    // Monitorear el progreso de la subida
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error(error);
        setErrorMsg('Error al subir la imagen.');
      },
      async () => {
        try {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          setDownloadURL(url);
          setMessage('Foto de perfil subida correctamente.');

          // Guardar URL en el documento del usuario
          await db
            .collection('usuarios')
            .doc(user.uid)
            .set(
              {
                fotoPerfilUrl: url,
                updatedAt: new Date()
              },
              { merge: true }
            );
        } catch (error) {
          console.error(error);
          setErrorMsg('Error al guardar la URL de la foto de perfil.');
        }
      }
    );
  };

  // Manejo de los cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  // Se guarda el perfil y datos de envío
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    // Validar que haya un usuario autenticado
    if (!user) {
      setErrorMsg('Debes iniciar sesión para guardar tus datos.');
      return;
    }

    try {
      setSavingProfile(true);
      await db
        .collection('usuarios')
        .doc(user.uid)
        .set(
          {
            ...profileForm,
            fotoPerfilUrl: downloadURL || null,
            updatedAt: new Date()
          },
          { merge: true }
        );
      setSavingProfile(false);
      setMessage('Datos de despacho guardados correctamente.');
    } catch (error) {
      console.error(error);
      setSavingProfile(false);
      setErrorMsg('Error al guardar los datos de despacho.');
    }
  };

  return (
    <div>
      <h2 className="mb-3">Perfil y despacho (Ejercicio 3)</h2>
      <p className="mb-4">
        Regístrate o inicia sesión para configurar tu perfil, subir una foto y
        completar tus datos de despacho para MagnetSys Store.
      </p>

      {/* Mensajes globales */}
      {message && <div className="alert alert-success">{message}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Sección de autenticación */}
      {!user && (
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title mb-3">
                  {mode === 'register' ? 'Registro' : 'Inicio de sesión'}
                </h4>
                <form onSubmit={handleAuth}>
                  <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary me-2">
                    {mode === 'register' ? 'Registrarse' : 'Iniciar sesión'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() =>
                      setMode((prev) =>
                        prev === 'register' ? 'login' : 'register'
                      )
                    }
                  >
                    {mode === 'register'
                      ? 'Ya tengo cuenta, iniciar sesión'
                      : 'No tengo cuenta, registrarme'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección de perfil + subida de foto – sólo cuando hay usuario */}
      {user && (
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="card-title mb-0">Perfil y datos de despacho</h4>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>

            <p className="mb-3">
              Usuario autenticado: <strong>{user.email}</strong>
            </p>

            <div className="row">
              {/* Columna izquierda: foto de perfil */}
              <div className="col-md-4 mb-4">
                <h5>Foto de perfil</h5>

                {downloadURL && (
                  <div className="mb-3 text-center">
                    <img
                      src={downloadURL}
                      alt="Foto de perfil"
                      className="img-fluid rounded-circle"
                      style={{ maxWidth: '180px' }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    Selecciona una imagen (jpg, png, etc.)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>

                <button
                  className="btn btn-success mb-3 w-100"
                  onClick={handleUpload}
                >
                  Subir foto de perfil
                </button>

                {/* Barra de progreso */}
                {uploadProgress > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Progreso:</label>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna derecha: datos de despacho */}
              <div className="col-md-8">
                <h5>Datos de despacho</h5>
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={profileForm.nombre}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      className="form-control"
                      value={profileForm.direccion}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control"
                      value={profileForm.telefono}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ciudad</label>
                      <input
                        type="text"
                        name="ciudad"
                        className="form-control"
                        value={profileForm.ciudad}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Región</label>
                      <input
                        type="text"
                        name="region"
                        className="form-control"
                        value={profileForm.region}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingProfile}
                  >
                    {savingProfile
                      ? 'Guardando...'
                      : 'Guardar datos de despacho'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthStoragePage;
