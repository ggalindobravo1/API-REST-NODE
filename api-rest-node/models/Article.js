const {Schema, model} = require("mongoose");

const ArticleSchema = Schema({
    title:{
        type:String, 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    image:{
        type: String, 
        default: "default.pgn"
    }
});

module.exports = model("Article", ArticleSchema, "articles");
//3rd parameter indicates the table to point in DB