//change MONGODB folder db path: mongod.exe --dbpath C:/data6/db
// run application in console with npm start

const mongoose = require("mongoose");

const connection = async() => {
    try{

        await mongoose.connect("mongodb://localhost:27017/my_blog")

        //parameters to pass in object to conn string
        //useNewUrlParser: true
        //useUnifiedTopology: true
        //useCreateIndex: true

        console.log("Successfully connected to DB");

    }catch(error){
        console.log(error);
        throw new Error("Error while connecting to DB");

    }
}

module.exports = {
    connection
}