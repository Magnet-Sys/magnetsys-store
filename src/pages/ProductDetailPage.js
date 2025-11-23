import React from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div>
        <h2>Producto no encontrado</h2>
        <Link to="/" className="btn btn-secondary mt-3">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-5">
        {product.cover && (
          <img
            src={product.cover}
            alt={product.name}
            className="img-fluid mb-3"
          />
        )}
      </div>
      <div className="col-md-7">
        <h2>{product.name}</h2>
        <p className="lead">Precio: ${product.price}</p>
        {product.description && <p>{product.description}</p>}
        <Link to="/" className="btn btn-primary mt-3">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailPage;
