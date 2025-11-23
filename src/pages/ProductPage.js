import React from 'react';
import ProductListContainer from '../components/products/ProductListContainer';

const ProductPage = () => {
  return (
    <div>
      <h2 className="mb-3">Lista de productos</h2>
      {/* Componente contenedor de la lista de productos */}
      <ProductListContainer />
    </div>
  );
};

export default ProductPage;
