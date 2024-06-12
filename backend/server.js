const app = require('./app'); // Import the Express application instance from the './app' file

const path = require('path'); // Import the path module for working with file and directory paths
const connectDatabase = require('./config/database');





connectDatabase(); //connect database


// Start the Express server and listen on the specified port
const server=app.listen(process.env.PORT,() => {
    console.log(`Server Listening: ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1);
    })
})

