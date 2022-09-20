const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

// ************** init App **************
console.log("Node App Launched");

// ************** connect to DB **************
connection();

// ************** create Node server **************
const app = express();
const port = 3900;

// ************** config cors **************
app.use(cors());

// ************ convert body to JS object **************
app.use(express.json()); // recieve data with content-type app/json
app.use(express.urlencoded({extended: true})); // recieve data from url-encoded

// ******* CREATE ROUTES **************

//article routes
const articles_routes =  require("./routes/article");
//load article routes
app.use("/api", articles_routes);

// ** hardcoded test routes
app.get("/test", (req, res) => {
    console.log("End point testing running");

    //.json can be used to send objects or array of objects 

    return res.status(200).json([{
        course: "Project in React",
        author: "Gustavo Galindo",
        url: "google.com"
    },
    {
        course: "Project in React",
        author: "Gustavo Galindo",
        url: "google.com"  
    }
]);
})

app.get("/", (req, res) => {
    return res.status(200).send(
        "<h1>API REST testing with Node </h1>"
    );
})

// ************** create server y and listen http requests **************
app.listen(port, () => {
    console.log("Server running in port: "+port);
})
