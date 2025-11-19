import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductForm from "./ProductForm";

export default function GroceriesAppContainer() {
  //states
  //setting products from db
  const [products, setProducts] = useState([]);
  //setting quantity for each product
  const [productQuantity, setProductQuantity] = useState({}); //use an empty object at the start
  //setting cart list
  const [cartList, setCartList] = useState([]);
  // add from form
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });
  const [postResponse, setPostResponse] = useState("");
  //editing flag
  const [isEditing, setIsEditing] = useState(false);

  //useEffects
  useEffect(() => {
    handleProductsDB();
  }, [postResponse]); //run array once on load

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

  //handle delete product
  const handleOnDelete = async (id) => {
    try{
      const response = await axios.delete(`http://localhost:3000/products/${id}`);
      setPostResponse(response.data.message);
      console.log(response)
    }catch(error){
      console.log(error.message);
    }
  };

  //handle edit product
  const handleOnEdit = async (id) => {
    try{
      const productToEdit = await axios.get(`http://localhost:3000/products/${id}`);
      console.log(productToEdit);
      setFormData({ 
        productName: productToEdit.data.productName,
        brand: productToEdit.data.brand,
        image: productToEdit.data.image,
        price: productToEdit.data.price,
        _id: productToEdit.data._id
      });
      setIsEditing(true);
    }catch(error){
      console.log(error.message);
    }
  };

  //handle the update after editing
  const handleOnUpdate = async (id) => {
    try{
      const result = await axios.patch(`http://localhost:3000/products/${id}`, formData);
      setPostResponse(result.data.message);
    }catch(error){
      console.log(error.message);
    }
  };

  //handle resetting the form after submission
  const handleResetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  };

  //form handlers

  //handle submission of data to db
  const handleOnSubmit = async (e) => {
    e.preventDefault(); //this is essential to prevent the page from refreshing and losing your data before posting
    try {
      if(isEditing){
        handleOnUpdate(formData._id);
        handleResetForm();
        setIsEditing(false);
      }else{
        await axios
        .post("http://localhost:3000/products", formData)
        .then((response) => setPostResponse(response.data.message))
        .then(()=> handleResetForm());
      }
      
    } catch (error) {
      console.log(error.message);
    }
  };

  //handle on change of form inputs
  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  

  //reders

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <div className="Form">
        <ProductForm
          productName={formData.productName}
          brand={formData.brand}
          image={formData.image}
          price={formData.price}
          handleOnSubmit={handleOnSubmit}
          handleOnChange={handleOnChange}
           isEditing={isEditing}
        />
        <p className="Form_Response">{postResponse}</p>
        </div>
        <ProductsContainer
          products={products}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
         
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