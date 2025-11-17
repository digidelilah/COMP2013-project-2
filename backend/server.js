//initalizing  server
const express = require('express');
const server = express();
const port = 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const {DB_URI} = process.env;
const cors = require('cors');//disable default browser security
const Product = require('./models/products');//import product model schema

//middleware
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(cors());

//connect to mongodb database
mongoose.connect(DB_URI).then(() => {
    server.listen(port,() =>{
        console.log(`Database is connected\nServer is running on port: ${port}`);
    });
}).catch((error) => console.log(error.message));

//Routes
//root route
server.get('/', (request,response) => {
    response.send("server is live");
});

//get all products
server.get("/products", async (request, response) => {
    try{
        const products = await Product.find();
        response.send(products);
    }catch(error){
        responce.status(500).send({message: error.message});
    }
});

//add new product
server.post("/products", async (request, response) => {
    const{ name, brand, image, price } = request.body;
    const newProduct = new Product({
        name,
        product:{ brand, price},
        image
    });
    try{
        await newProduct.save();
        response.status(200).send({message: "Product added successfully"});
    }catch(error){
        response.status(400).send({message: error.message});
    }
});