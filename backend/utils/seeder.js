const products=require('../data/products.json');
const Product=require('../models/productModel');
const dotenv=require('dotenv');
const connectDatabase =require('../config/database');


dotenv.config({path:'backend/config/config.env'}); //This line loads environment variables from the specified .env file 
connectDatabase();

const seedProducts=async ()=>{  //This defines an asynchronous function named seedProducts responsible for seeding products into the database.
    try{
    await Product.deleteMany();  //This line deletes all existing products from the database using the deleteMany() method of the Product model.
    console.log("Products deleted")
    await Product.insertMany(products);    //This line inserts the products loaded from the JSON file into the database using the insertMany() method of the Product model.
    console.log("All products added");
}
catch(error){
console.log(error.message);

}
process.exit();  //This line exits the Node.js process after the seeding operation completes.
}
seedProducts();
