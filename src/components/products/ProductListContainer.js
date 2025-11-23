import React, { Component } from 'react';
import ProductItem from './ProductItem';
import productsData from '../../data/products';

const CART_KEY = 'magnetsys_cart';
const PRODUCTS_KEY = 'magnetsys_products';

class ProductListContainer extends Component {
  constructor(props) {
    super(props);

    // Intentar leer productos con stock desde localStorage
    const savedProductsJson = localStorage.getItem(PRODUCTS_KEY);
    const savedCartJson = localStorage.getItem(CART_KEY);

    let initialProducts;

    if (savedProductsJson) {
      try {
        const parsed = JSON.parse(savedProductsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialProducts = parsed;
        }
      } catch (err) {
        console.error('Error al leer productos desde localStorage', err);
      }
    }

    // Si no hay nada guardado, partimos de productsData y les agregamos stock
    if (!initialProducts) {
      initialProducts = productsData.map((p) => ({
        ...p,
        stock: 5 // stock inicial para cada vinilo
      }));
    }

    let initialCart = [];
    if (savedCartJson) {
      try {
        const parsed = JSON.parse(savedCartJson);
        if (Array.isArray(parsed)) {
          initialCart = parsed;
        }
      } catch (err) {
        console.error('Error al leer carrito desde localStorage', err);
      }
    }

    this.state = {
      products: initialProducts,
      cart: initialCart
    };
  }

  // Cada vez que cambien productos o carrito, guardar en localStorage
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.products !== this.state.products ||
      prevState.cart !== this.state.cart
    ) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.state.products));
      localStorage.setItem(CART_KEY, JSON.stringify(this.state.cart));
    }
  }

  // Agregar al carrito (descontando stock y sumando cantidades)
  handleAddToCart = (product) => {
    this.setState((prevState) => {
      const currentProduct = prevState.products.find(
        (p) => p.id === product.id
      );

      // Sin stock, no agregamos al carrito
      if (!currentProduct || currentProduct.stock <= 0) {
        alert('No hay stock disponible para este vinilo.');
        return null;
      }

      const updatedProducts = prevState.products.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      );

      const existingItem = prevState.cart.find(
        (item) => item.id === product.id
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = prevState.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
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

  // Eliminar un producto completo del carrito (devolviendo stock)
  handleRemoveFromCart = (productId) => {
    this.setState((prevState) => {
      const existingItem = prevState.cart.find(
        (item) => item.id === productId
      );
      if (!existingItem) {
        return null;
      }

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

  // Simulación de compra, sólo vacía carrito y deja stock como está (ya descontado)
  handleCheckout = () => {
    const { cart } = this.state;

    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    alert('Compra realizada con éxito. ¡Gracias por tu compra!');
    this.setState({ cart: [] });
  };

  getCartTotal = () => {
    const { cart } = this.state;
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  render() {
    const { products, cart } = this.state;

    return (
      <div className="row">
        {/* Lista de productos */}
        <div className="col-lg-9">
          {/* Grilla responsiva */}
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
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
        <div className="col-lg-3 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title">
                Carrito ({cart.reduce((acc, item) => acc + item.quantity, 0)})
              </h4>

              {cart.length === 0 ? (
                <p className="text-muted mb-0">El carrito está vacío.</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-muted">
                            Cantidad: {item.quantity} · ${item.price}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">
                            ${item.price * item.quantity}
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-1"
                            onClick={() =>
                              this.handleRemoveFromCart(item.id)
                            }
                            aria-label="Quitar del carrito"
                          >
                            {/* Icono de Bootstrap (bi-trash) */}
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">${this.getCartTotal()}</span>
                  </div>

                  {/* Botón pagar */}
                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={this.handleCheckout}
                  >
                    Pagar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductListContainer;
