// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import FormPage from './pages/FormPage';
import AuthStoragePage from './pages/AuthStoragePage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <div className="container py-4">
      <nav className="mb-4">
        <h1 className="mb-3">MagnetSys Store</h1>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className="nav-link" to="/">Productos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/formulario">Formulario</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/auth">Auth & Archivos</Link>
          </li>
        </ul>
      </nav>

      {/* Define las rutas de la aplicación */}
      <Switch>
        <Route exact path="/" component={ProductPage} />
        <Route path="/formulario" component={FormPage} />
        <Route path="/auth" component={AuthStoragePage} />
        <Route exact path="/" component={ProductPage} />
        <Route path="/producto/:id" component={ProductDetailPage} />
      </Switch>
    </div>
  );
}

export default App;
