const express=require('express');
const { getProducts, getSingleProduct, updateproduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController'); //This function is presumably a controller function responsible for handling requests related to products.
const { newProduct } = require('../controllers/productController');
const router=express.Router();

const {isAuthenticatedUser, authorizeRoles} =require('../middlewares/authenticate')
const multer=require('multer');
const path=require('path')
const upload=multer({storage:multer.diskStorage({
    destination:function(req,filename,cb){
        cb(null,path.join(__dirname,'..','uploads/product'))
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})


router.route('/products').get(getProducts);  //specifies that when a GET request is made to the '/products' route, the getProducts function imported from the productController will be called to handle the request.
router.route('/product/:id')
                            .get(getSingleProduct)  //chain function
                            
router.route('/review').put(isAuthenticatedUser,createReview);






//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),newProduct); 
router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles('admin'),getAdminProducts); 
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct); 
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),updateproduct); 
router.route('/admin/reviews').get(isAuthenticatedUser,authorizeRoles('admin'),getReviews);
router.route('/admin/review').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteReview);



module.exports=router;