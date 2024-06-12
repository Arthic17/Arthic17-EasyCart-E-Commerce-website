const catchAsyncError = require('../middlewares/catchAsyncError');   // handle asynchronous errors
const Product=require('../models/productModel');
const ErrorHandler=require('../utils/errorHandler');
const APIFeatures=require('../utils/apiFeatures');

// getproducts     http://localhost:8000/api/v1/products?keyword=Dell
exports.getProducts = catchAsyncError(async (req, res, next)=>{
    // is a function exported from a module, presumably used as a route handler in an Express application.
    //route handler function called getProducts for handling requests to retrieve products



   const resPerPage = 3;
   
   let buildQuery = () => {     //creates an instance of APIFeatures
       return new APIFeatures(Product.find(), req.query).search().filter()   //chain methods
   }
   
   const filteredProductsCount = await buildQuery().query.countDocuments({})  //using countDocuments counting filtered products
   const totalProductsCount = await Product.countDocuments({});   //counting total products
   let productsCount = totalProductsCount;

   if(filteredProductsCount !== totalProductsCount) {
       productsCount = filteredProductsCount;   //updating count
   }
   
   const products = await buildQuery().paginate(resPerPage).query;

   res.status(200).json({
       success : true,
       count: productsCount,
       resPerPage,
       products
   })
})




//createproduct      http://localhost:8000/api/v1/product/new
exports.newProduct=catchAsyncError(async (req,res,next)=>{    //next - call next middleware function in the Express middleware stack
   let images=[]
   let BASE_URL=process.env.BACKEND_URL;
   if(process.env.NODE_ENV==='production'){
       BASE_URL=`${req.protocol}://${req.get('host')}`
   }
   if(req.files.length>0){
   req.files.forEach(file=>{
      let url=`${BASE_URL}/uploads/product/${file.originalname}`
      images.push({image:url})
   })
   }
   req.body.images=images;
   req.body.user=req.user.id;
   const product= await Product.create(req.body);   //a promise that resolves to the newly created product once it's been saved to the database.
   res.status(201).json({
      success: true,
      product
   })
});


//get single product   http://localhost:8000/api/v1/product/:id
exports.getSingleProduct = async(req,res,next)=>{
   const product= await Product.findById(req.params.id).populate('reviews.user','name email');

   if(!product){
      return next(new ErrorHandler('Product not found',400));
   }
   
   res.status(201).json({
      success:true,
      product
     
   })
}



//update Product     http://localhost:8000/api/v1/product/:id
exports.updateproduct=async (req,res,next)=>{
 let product=await Product.findById(req.params.id)

//uploading images
let images=[]


//if images not cleared we keep existing images
if(req.body.imagesCleared==='false'){
   images=product.images;
}
let BASE_URL=process.env.BACKEND_URL;
if(process.env.NODE_ENV==='production'){
    BASE_URL=`${req.protocol}://${req.get('host')}`
}
   if(req.files.length>0){
   req.files.forEach(file=>{
      let url=`${BASE_URL}/uploads/product/${file.originalname}`
      images.push({image:url})
   })
   }
   req.body.images=images;



 if(!product){
   return res.status(404).json({
      success:false,
      message : "Product not found"
   })
}

product = await Product.findByIdAndUpdate(req.params.id,req.body,{
new : true,  //indicates that the method should return the modified document rather than the original document.
runValidators : true  // tells Mongoose to run any defined validators on the updated fields. Validators are functions that validate the data before it's saved to the database, ensuring that it meets certain criteria.
})
   res.status(200).json({
success:true,
product
   });
 
}


//delete
exports.deleteProduct=async(req,res,next)=>{
   const product=await Product.findById(req.params.id);
   if(!product){
      return res.status(404).json({
         success:false,
         message:"Product not found"
      });
   }
   await product.deleteOne();
   res.status(200).json({
      success:true,
      message:"Product deleted !"
   })
}




//create review    /api/v1/review
exports.createReview=catchAsyncError(async (req,res,next)=>{

   const {productId,rating,comment}=req.body;    // object destructuring to extract productId, rating, and comment from req.body. These values are expected to be provided in the request body when creating a review.
   const review={
      user:req.user.id,
      rating,
      comment
   }

   const product=await Product.findById(productId);

   //finding user already has review
   const isReviewed = product.reviews.find(review => {
      return review.user.toString() == req.user.id.toString()   // It compares the user property of each review to the ID of the authenticated user (req.user.id)
   })

   if(isReviewed){
       //updating the  review
       product.reviews.forEach(review => {
           if(review.user.toString() == req.user.id.toString()){
               review.comment = comment
               review.rating = rating
           }

       })

   }else{
       //creating the review
       product.reviews.push(review);
       product.numOfReviews = product.reviews.length;
   }

//finding average of product reviews
   product.ratings=product.reviews.reduce((acc,review)=>{
      return review.rating+acc;
   },0)/product.reviews.length;    //reduce will give total number of reviews and acc(accumulator) -> It will contain the value returned by the callback function in each iteration. The item parameter is simply the item from the array, which will change in each iteration just like in the forEach() method.
   product.ratings=isNaN(product.ratings)? 0:product.ratings



   await product.save({validateBeforeSave:false});
   res.status(200).json({
      success: true,
      
   })
});


//get reviews   /api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
   const product = await Product.findById(req.query.id).populate('reviews.user','name email');
                                                         //used to populate the reviews field of the product with additional data from the user collection
   res.status(200).json({
       success: true,
       reviews: product.reviews
   })
})





//deleteReview  /api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{
   const product = await Product.findById(req.query.productId);
 
   //filtering the reviews which does not match the deleting review id
const reviews=product.reviews.filter(review=>{
   return review._id.toString()!==req.query.id.toString()   //it stores except particular product ||id which is not = then it will be stored otherwise ot will ignored

});

//numofReviews
const numOfReviews=reviews.length;

//finding average with the filtered reviews
let ratings=reviews.reduce((acc,review)=>{
   return review.rating+acc;
},0)/product.reviews.length; 
ratings=isNaN(ratings)?0:ratings;


//save this
await Product.findByIdAndUpdate(req.query.productId,{
   reviews,
   numOfReviews,
   ratings
})
   res.status(200).json({
       success: true
   })
})


// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
   const products = await Product.find();
   res.status(200).send({
       success: true,
       products
   })
});