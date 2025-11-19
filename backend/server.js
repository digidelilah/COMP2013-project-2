//initalizing  server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const { DB_URI } = process.env;
const cors = require("cors"); //disable default browser security
const Product = require("./models/products"); //import product model schema
const { request } = require("http");

//middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

//connect to mongodb database
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Database is connected\nServer is running on port: ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

//Routes
//root route
server.get("/", (request, response) => {
  response.send("server is live");
});

//get all products
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    responce.status(500).send({ message: error.message });
  }
});

//add new product
server.post("/products", async (request, response) => {
  const { productName, brand, image, price } = request.body;
  const id = crypto.randomUUID(); // to create a random id to comply with the model
  try {
    console.log("POST /products body:", request.body);
    //your product posted must match your model with all the attributes required
    const newProduct = new Product({
      productName,
      brand,
      price,
      image,
      id,
    });
    console.log("New product to save:", newProduct);
    await newProduct.save();
    response.status(200).send({ message: `${productName} added successfully with ${id} `});
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//delete a product
server.delete("/products/:id",async (request, response) => {
  const { id } = request.params;
  try{
    await Product.findByIdAndDelete(id);
    response.send({message: `${productName} deleted successfully`});
  }catch(error){
    response.status(400).send({ message: error.message });
  }
});

//to get product by id for editing
server.get("/products/:id", async (request, response) => {
  const {id} = request.params;
  try{
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  }catch(error){
    response.status(500).send({message: error.message});
  }
});

//patch request to edit a product
server.patch("/products/:id", async (request, response) => {
  const{id} = request.params;
  const{productName, brand, image, price} = request.body;
  try{
    await Product.findByIdAndUpdate(id, {
      productName,
      brand,
      image,
      price
    });
    response.send({message: `${productName} updated successfully with id: ${id}`});
  
  }catch(error){
    response.status(500).send({message: error.message});
  }
});