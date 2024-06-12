// const mongoose = require('mongoose');
// const uri= 'mongodb://127.0.0.1:27017/easycart';
// const connectDatabase = ()=>{
//     mongoose.connect(uri,{
//         useNewUrlParser:true,  // to ensure compatibility with the latest versions of MongoDB and Mongoose.
//         useUnifiedTopology:true
//     }).then(con=>{
//         console.log(`MongoDB is connected to the host: ${con.connection.host} `)
//     })
// }
// //process.env.DB_LOCAL_URI
// module.exports = connectDatabase;



const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connected to the host: ${con.connection.host} `)
    })
}

module.exports = connectDatabase;