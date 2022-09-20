const fs = require("fs");
const Article = require("../models/Article");
const { validate_data } = require("../helpers/validateData");

const testArticle = (req, res) => {
    return res.status(200).json({
        message: "Test message in article controller",
    });
};

const courses = (req, res) => {
    return res.status(200).json([
        {
            course: "Project in React",
            author: "Gustavo Galindo",
            url: "react.com",
        },
        {
            course: "Project in Angular",
            author: "Gustavo Galindo",
            url: "angular.com",
        },
    ]);
};

const create = (req, res) => {
    // Retrieve data to save from user
    let params = req.body;
    // Validate data
    try {
        validate_data(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Forbidden data format sent",
        });
    }
    // Create object to save
    const article = new Article(params); //by pasing params in (), we assign values automatic

    // Assign values to object based on the model (manual and automatic)
    // ** manual:  ==> article.title = params.title;

    // Save article in DB
    article.save((error, result) => {
        if (error || !result) {
            return res.status(400).json({
                status: "error",
                message: "Article not saved in DB, error",
            });
        }

        // Return result
        return res.status(200).json({
            status: "Save Success",
            message: "Article saved with success",
            article: result,
        });
    });
};

const getArticles = (req, res) => {
    let request = Article.find({});

    if (req.params.limit) {
        // if optional parameter is passed
        request.limit(3); // get only 3 elements
    }

    request
        .sort({ date: -1 }) //sort by date from newest to old
        .exec((error, articles) => {
            if (error || !articles) {
                return res.status(400).json({
                    status: "error",
                    message: "Article not saved in DB, error",
                });
            }

            return res.status(200).send({
                status: "success",
                param_url: req.params.limit, //optional element passed from routes
                count: articles.length, //count the output elements
                articles,
            });
        });
};

const getArticleById = (req, res) => {
    //pick ID from URL
    let id = req.params.id;

    //Find article by ID
    Article.findById(id, (error, article) => {
        //if no article, send error
        if (error || !article) {
            return res.status(400).json({
                status: "error",
                message: "Article not saved in DB, error",
            });
        }

        //return article found
        return res.status(200).send({
            status: "success",
            article,
        });
    });
};

const deleteArticle = (req, res) => {
    let id = req.params.id;

    Article.findByIdAndDelete({ _id: id }, (error, deletedArticle) => {
        if (error || !deletedArticle) {
            return res.status(500).json({
                status: "error",
                message: "Error when deleting",
            });
        }

        return res.status(200).json({
            status: "succes",
            DeletedArt: deletedArticle,
            message: "Article successfully removed",
        });
    });
};

const editArticle = (req, res) => {
    //get article id
    let id = req.params.id;
    //get new data from the body
    let params = req.body;

    //validate data
    try {
        validate_data(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Invalid Data Format",
        });
    }

    //find and update article
    Article.findByIdAndUpdate(
        { _id: id },
        params,
        { new: true },
        (error, updtArticle) => {
            //new: true returns updated article

            if (error || !updtArticle) {
                return res.status(500).json({
                    status: "error",
                    message: "Error when updating",
                });
            }

            //return response
            return res.status(200).json({
                status: "succes",
                DeletedArt: updtArticle,
                message: "Article successfully updated",
            });
        }
    );
};

const uploadImg = (req, res) => {
    // config multer => done in routes.js

    // Retrieve file uploaded
    console.log(req.file);
    if (!req.file) {
        return res.status(404).json({
            status: "error",
            message: "No file uploaded",
        });
    }

    // file name
    let fileName = req.file.originalname;

    // file extension
    let fileExtension = fileName.split(".")[1];

    // verify valid extension for imgs
    let imgExtensions = [
        "jpg",
        "jpeg",
        "JPG",
        "JPEG",
        "png",
        "PNG",
        "gif",
        "GIF",
    ];

    if (!imgExtensions.includes(fileExtension)) {
        // delete file from folder and return error
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                message: "Invalid file type",
            });
        });
    } else {
        // return response and upload article with image in DB
        //get article id
        let id = req.params.id;

        //find and update article
        Article.findByIdAndUpdate(
            { _id: id },
            { image: req.file.filename },
            { new: true },
            (error, updtArticle) => {
                //new: true returns updated article

                if (error || !updtArticle) {
                    return res.status(500).json({
                        status: "error",
                        message: "Error when updating",
                    });
                }

                //return response
                return res.status(200).json({
                    status: "succes",
                    DeletedArt: updtArticle,
                    message: "Article successfully updated",
                    imgUpld: req.file
                });
            }
        );

    }
};

const findArticle = (req, res) => {
    // get string filter from url
    let filter = req.params.filter;

    // filter DB using OR
    Article.find({ "$or": [  // similar to => SELECT * FROM ARTICLES WHERE title INCLUDES(filter) OR content INCLUDES(filter)
        {"title": {"$regex": filter, "$options": "i"}}, //using regex to match all possible options. "i" means include in all the title/content 
        {"content": {"$regex": filter, "$options": "i"}}
    ]})
    .sort({date: -1})
    .exec((error, result) => {
        if(error || !result || !result.length){
            return res.status(404).json({
                status: "error",
                message: "No such files",
            });
        }

        return res.status(200).json({
            status: "succes",
            message: "Article successfully found",
            result
        });

    })

    // Order

    // Exec read

    // Return result
}

module.exports = {
    testArticle,
    courses,
    create,
    getArticles,
    getArticleById,
    deleteArticle,
    editArticle,
    uploadImg,
    findArticle
};
