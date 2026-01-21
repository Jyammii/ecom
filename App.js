import { useState, useEffect } from "react";
import { Login } from "./.expo/components/Login"; 
import { Home} from "./.expo/components/Home";
import { Splash } from "./.expo/components/Splash";
import { Signup } from "./.expo/components/Signup";
import { Profile } from "./.expo/components/Profile";
import { ProductDetails} from "./.expo/components/ProductDetails";
import { Checkout } from "./.expo/components/Checkout";
import { Cart } from "./.expo/components/Cart";
import { Order } from "./.expo/components/Order";


export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");

  // Show splash screen for 2 seconds
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Navigation handlers
  const handleSplashComplete = () => {
    setCurrentScreen("login");
  };

  const handleLogin = () => {
    setCurrentScreen("home");
  };

  const handleSignUp = () => {
    setCurrentScreen("home");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentScreen("product-detail");
  };

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    
    // Show a brief confirmation and go back to home
    setCurrentScreen("home");
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setCurrentScreen("checkout");
  };

  const handleOrderComplete = () => {
    // Generate random order number
    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(randomOrderNumber);
    setCartItems([]);
    setCurrentScreen("order-success");
  };

  const handleGoHome = () => {
    setCurrentScreen("home");
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="app-container">
      {currentScreen === "splash" && (
        <Splash onComplete={handleSplashComplete} />
      )}

      {currentScreen === "login" && (
        <Login
          onLogin={handleLogin}
          onSignUp={() => setCurrentScreen("signup")}
        />
      )}

      {currentScreen === "signup" && (
        <Signup
          onSignUp={handleSignUp}
          onBack={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "home" && (
        <Home
          onProductClick={handleProductClick}
          onCartClick={() => setCurrentScreen("cart")}
          onProfileClick={() => setCurrentScreen("profile")}
          cartCount={cartCount}
        />
      )}

      {currentScreen === "product-detail" && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setCurrentScreen("home")}
          onAddToCart={handleAddToCart}
        />
      )}

      {currentScreen === "cart" && (
        <Cart
          items={cartItems}
          onBack={() => setCurrentScreen("home")}
          onCheckout={handleCheckout}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {currentScreen === "checkout" && (
        <Checkout
          total={cartTotal + 5.99 - 10}
          onBack={() => setCurrentScreen("cart")}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {currentScreen === "profile" && (
        <Profile onBack={() => setCurrentScreen("home")} />
      )}

      {currentScreen === "order-success" && (
        <Order
          onGoHome={handleGoHome}
          orderNumber={orderNumber}
        />
      )}
    </div>
  );
}
