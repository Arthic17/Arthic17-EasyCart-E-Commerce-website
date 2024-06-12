const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError=require('./catchAsyncError');
const jwt=require('jsonwebtoken')
const User= require('../models/userModel')

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
 const {token } = req.cookies;    //assumes that the token is stored in a cookie named 'token'.


 if(!token){
    return next(new ErrorHandler('Login first to handle this resource',401))
 }

 const decode= jwt.verify(token,process.env.JWT_SECRET)
 req.user= await User.findById(decode.id)
 next();
})
                          //getting values in the name of roles
exports.authorizeRoles =(...roles)=>{
   return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
      return next(new ErrorHandler(`Role ${req.user.role} is not allowed`,401))
}
next()
}

}
