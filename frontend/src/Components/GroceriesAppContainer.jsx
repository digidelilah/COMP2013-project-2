import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductForm from "./ProductForm";

export default function GroceriesAppContainer() {
  //useEffects
  useEffect(() => {
    handleProductsDB();
  }, []); //run array once on load

  //states
  //setting products from db
  const [products, setProducts] = useState([]);
  //setting quantity for each product
  const [productQuantity, setProductQuantity] = useState({}); //use an empty object at the start
  //setting cart list
  const [cartList, setCartList] = useState([]);
  // add from form 
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    image: "",
    price: "",
  });

  //handelers
  //connecting to products db
  //GET data from db handler
  const handleProductsDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");

      console.log(response);
      setProducts(response.data);
      setProductQuantity(
        response.data.map((product) => ({ id: product.id, quantity: 0 }))
      ); //this is the new line to initilize the productQuantity after fetching the products.
    } catch (error) {
      console.log(error.message);
      console.error("Error fetching products:", error);
    }
  };

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  //form handlers
  

 //handle submission of data to db
  const handleOnSubmit = async () => {
    try{
      await axios.post("http://localhost:3000/products",formData)
      .then((response)=>console.log(response));
      
    }catch(error){
      console.log(error.message);
    }
  };

 //handle on change of form inputs
 const handleOnChange = (e) => {
  setFormData((prevData)=>{
    return {...prevData,[e.target.name]:e.target.value};
  });
 };

  //reders

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductForm 
          productName={formData.name}
          brand={formData.brand}
          image={formData.image}
          price={formData.price}
          handleOnSubmit={handleOnSubmit}
          handleOnChange={handleOnChange}
        />
        <ProductsContainer
          products={products}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
        
      </div>
    </div>
  );
}