import React from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ product, onAddToCart }) => {
  const handleClick = () => {
    onAddToCart(product);
  };

  const outOfStock = product.stock <= 0;

  return (
    <div className="card h-100 text-center shadow-sm product-card">
      {product.cover && (
        <img
          src={product.cover}
          className="card-img-top mx-auto d-block"
          alt={product.name}
          style={{ height: '160px', objectFit: 'cover' }}
        />
      )}

      <div className="card-body d-flex flex-column">
        {/* Nombre y precio */}
        <h6 className="card-title mb-1 fw-semibold">{product.name}</h6>
        <p className="card-text mb-1 text-muted">Precio: ${product.price}</p>

        {/* Stock */}
        <p className="card-text mb-3">
          <small className="text-muted">
            Stock:{' '}
            {outOfStock ? (
              <span className="text-danger">Agotado</span>
            ) : (
              `${product.stock} uds.`
            )}
          </small>
        </p>

        {/* Botones: verde, azul para agregar y ver detalle */}
        <div className="mt-auto d-grid gap-2">
          <button
            className="btn btn-success btn-sm"
            onClick={handleClick}
            disabled={outOfStock}
          >
            {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          <Link
            className="btn btn-primary btn-sm"
            to={`/producto/${product.id}`}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
