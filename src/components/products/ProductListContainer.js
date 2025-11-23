import React, { Component } from 'react';
import ProductItem from './ProductItem';
import productsData from '../../data/products';

class ProductListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: productsData,
      cart: []
    };
  }

  // Agregar al carrito respetando stock y sumando cantidad
  handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('No hay stock disponible para este vinilo.');
      return;
    }

    this.setState((prevState) => {
      // Actualizamos stock en la lista de productos
      const updatedProducts = prevState.products.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      );

      // Buscamos si ya existe en el carrito
      const existingItem = prevState.cart.find(
        (item) => item.id === product.id
      );

      let updatedCart;
      if (existingItem) {
        // Aumentamos cantidad
        updatedCart = prevState.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Lo agregamos por primera vez
        updatedCart = [
          ...prevState.cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ];
      }

      return {
        products: updatedProducts,
        cart: updatedCart
      };
    });
  };

  // Eliminar un producto completo del carrito y devolver stock
  handleRemoveFromCart = (productId) => {
    this.setState((prevState) => {
      const existingItem = prevState.cart.find(
        (item) => item.id === productId
      );

      if (!existingItem) {
        return null;
      }

      // Devolvemos al stock la cantidad que estaba en el carrito
      const updatedProducts = prevState.products.map((p) =>
        p.id === productId
          ? { ...p, stock: p.stock + existingItem.quantity }
          : p
      );

      const updatedCart = prevState.cart.filter(
        (item) => item.id !== productId
      );

      return {
        products: updatedProducts,
        cart: updatedCart
      };
    });
  };

  // Total general del carrito
  getCartTotal = () => {
    const { cart } = this.state;
    return cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  // Cantidad total de unidades en el carrito
  getCartQuantity = () => {
    const { cart } = this.state;
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Simular pago
  handleCheckout = () => {
    const { cart } = this.state;

    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    alert('Compra realizada con éxito. ¡Gracias por tu compra!');

    // Se vacía el carrito para simular pago
    this.setState({ cart: [] });
  };

  render() {
    const { products, cart } = this.state;

    return (
      <div className="row">
        {/* Grilla de productos */}
        <div className="col-lg-9 mb-4">
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
            {products.map((product) => (
              <div key={product.id} className="col">
                <ProductItem
                  product={product}
                  onAddToCart={this.handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div className="col-lg-3">
          <h3 className="mb-3">Productos en el carrito</h3>

          {cart.length === 0 ? (
            <div className="alert alert-info">
              El carrito está vacío.
            </div>
          ) : (
            <>
              <p className="mb-2 text-muted">
                Artículos: {this.getCartQuantity()}
              </p>

              <ul className="list-group mb-3">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold">{item.name}</div>
                      <small className="text-muted">
                        Cantidad: {item.quantity} × ${item.price}
                      </small>
                    </div>

                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-2">
                        ${item.price * item.quantity}
                      </span>

                      {/* Botón para eliminar con icono */}
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => this.handleRemoveFromCart(item.id)}
                        aria-label="Eliminar del carrito"
                        title="Eliminar del carrito"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="fw-bold">Total: ${this.getCartTotal()}</p>

              {/* Botón pagar */}
              <button
                className="btn btn-success w-100"
                onClick={this.handleCheckout}
              >
                Pagar
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default ProductListContainer;
