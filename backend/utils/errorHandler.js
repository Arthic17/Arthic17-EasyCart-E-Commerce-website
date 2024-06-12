class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)  //This calls the constructor of the Error class with the provided message, initializing the error message.
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor)  // It ensures that the stack trace starts from where the error is created, rather than from within the ErrorHandler class itself.
    }
}
module.exports=ErrorHandler;