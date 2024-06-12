module.exports = func => (req, res, next)=>
        Promise.resolve(func(req, res, next)).catch(next)
        //it resolves the promise returned by calling the func function with the provided req, res, and next parameters.
        //However, if func returns a promise that is rejected (i.e., an error occurs), the .catch() method catches the error, and it's passed to the next function, which triggers the error-handling middleware in the Express.js application.