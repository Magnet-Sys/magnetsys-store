# MagnetSys Store

Aplicación web desarrollada en **React** como parte de la evaluación de React + Firebase + Android.  
MagnetSys Store es una tienda de vinilos que permite:

- Navegar por un catálogo de 15 discos.
- Gestionar un carrito de compras con stock.
- Enviar consultas/pedidos mediante un formulario.
- Autenticarse con Firebase, subir foto de perfil y guardar datos de despacho.
- Generar un **build web** y empaquetar la app como **APK firmado** usando Cordova.

---

## 1. Stack tecnológico

- **React** (Create React App).
- **React Router DOM 5.x** (enrutamiento clásico con `BrowserRouter`, `Route`, `Switch`).
- **Firebase 8.10.1**:
  - Authentication (email/contraseña).
  - Cloud Firestore.
  - Cloud Storage.
- **simple-react-validator 1.6.2** (validación de formularios).
- **Axios** (disponible para peticiones HTTP).
- **Bootstrap 5** + **Bootstrap Icons** (estilos y grilla responsiva).
- **Cordova** (empaquetado Android).
- Node.js **v22.19.0**.

---

## 2. Estructura por ejercicios (requerimientos de la evaluación)

### 2.1. Ejercicio 1 – Catálogo de productos

**Ruta:** `/` (inicio)

Requerimientos cubiertos:

- Listado de **15 vinilos** definido en `src/data/products.js`.
- Vista en **grilla**:
  - 5 columnas en escritorio.
  - 2 columnas en pantallas pequeñas (Bootstrap grid).
- Cada tarjeta de producto muestra:
  - Imagen del vinilo.
  - Título + artista.
  - Precio.
  - Stock disponible.
  - Estado “**Sin stock**” cuando la cantidad es 0.
  - Botón **Agregar al carrito** (deshabilitado sin stock).
  - Botón **Ver detalle** que navega a `/producto/:id`.

### 2.2. Ejercicio 2 – Formulario de contacto / pedido

**Ruta:** `/formulario`

Funcionalidades:

- Formulario para consultas o reserva de vinilos con campos:
  - Nombre.
  - Correo electrónico.
  - Asunto.
  - Mensaje.
- Validación con **simple-react-validator**:
  - Campos requeridos.
  - Formato de correo válido.
  - Mínimo de caracteres en mensaje.
- Mensajes de error bajo cada campo con estilo de Bootstrap.
- Al enviar:
  - Se valida el formulario.
  - Si es válido, se guarda el registro en **Firestore**, colección `consultas`.
  - Se muestra una alerta de éxito.
  - Se limpian los campos **y** el estado de validaciones, dejando el formulario listo para una nueva consulta.
  - Ante errores de Firebase se muestra alerta de error amigable.

### 2.3. Ejercicio 3 – Autenticación, perfil y datos de despacho

**Ruta:** `/auth`

Funcionalidades:

- Registro e inicio de sesión con **Firebase Authentication** (email y contraseña).
- Vista de **perfil y despacho** para el usuario autenticado:
  - Muestra el correo del usuario actual.
  - **Foto de perfil**:
    - Selección de imagen (jpg/png).
    - Subida de archivo a **Firebase Storage**.
    - Barra de progreso y manejo de errores.
    - Visualización de la foto guardada.
  - **Datos de despacho**:
    - Nombre completo.
    - Dirección.
    - Teléfono.
    - Ciudad.
    - Región.
  - Guardado en **Firestore** bajo el documento `usuarios/{uid}`.
  - Carga automática de los datos existentes al ingresar nuevamente.


## 3. Carrito de compras (valor agregado)

Aunque el carrito no estaba especificado en detalle en la pauta, se implementó una solución completa:

- Panel de carrito fijo en el lado derecho de la vista de productos.
- Funciones principales:
  - Agregar productos desde las tarjetas.
  - Si se agrega el mismo vinilo, se incrementa la **cantidad**, sin duplicar filas.
  - Cálculo automático de:
    - Cantidad total de ítems.
    - Subtotal por producto.
    - Total general del carrito.
  - Botón de eliminar con **ícono de papelera** (Bootstrap Icons).
  - Botón **Pagar**:
    - Muestra el mensaje `Compra realizada con éxito`.
    - Limpia el carrito y restablece el estado visual.

### Manejo de stock

- Cada vez que se agrega un producto al carrito, se **descuenta** del stock visible.
- Cuando el stock llega a 0:
  - El botón cambia a **“Sin stock”**.
  - El botón queda deshabilitado.

### Persistencia del carrito (extra)

- El estado del carrito y del stock se guarda en **localStorage**.
- Si el usuario recarga la página o entra al detalle de un producto y vuelve al inicio:
  - El carrito y los stocks se mantienen.
- Al presionar **Pagar**, se limpia el carrito tanto en memoria como en `localStorage`.

---

## 4. Mejoras de interfaz y usabilidad

- Layout responsivo con Bootstrap:
  - 5 columnas en escritorio para mostrar cómodamente los 15 vinilos.
  - 2 columnas en tablets y móviles.
- Botones con colores intuitivos:
  - Verde (`btn-success`): **Agregar al carrito**.
  - Azul (`btn-primary`): **Ver detalle**.
  - Rojo (`btn-outline-danger`): eliminar en el carrito.
  - Botones deshabilitados para estado **Sin stock**.
- Formulario de contacto:
  - Botón de enviar ancho y adaptable (responsive).
  - Alertas de éxito/error en colores estándar de Bootstrap.
- Pantalla de perfil:
  - Muestra mensajes de error si falla la subida de imagen o el guardado en Firestore.
  - Muestra mensajes de éxito cuando los datos de despacho se guardan correctamente.

---

## 5. Estructura principal del código

- `src/App.js`  
  Definición de rutas (`/`, `/formulario`, `/auth`, `/producto/:id`) y layout principal.

- `src/components/ProductListContainer.js`  
  Lista todos los productos, gestiona el **carrito**, el **stock** y la persistencia en `localStorage`.

- `src/components/ProductItem.js`  
  Tarjeta individual de producto (imagen, título, precio, stock, botones).

- `src/pages/ProductDetailPage.js`  
  Vista de detalle para un vinilo específico.

- `src/pages/FormPage.js`  
  Formulario de contacto/pedido con validación y envío a Firestore.

- `src/pages/AuthStoragePage.js`  
  Autenticación, subida de foto a Storage y formulario de datos de despacho en Firestore.

- `src/firebaseConfig.js`  
  Inicialización de Firebase (contiene las claves del proyecto `magnetsys-store`).

- `src/data/products.js`  
  Arreglo con los 15 vinilos (título, artista, precio, stock e imagen).

---

## 6. Scripts disponibles (React)

En el directorio del proyecto de escritorio:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (http://localhost:3000)
npm start

# Construir versión de producción en /build
npm run build

# Ejecutar pruebas (no utilizadas en la evaluación, pero disponibles)
npm test
