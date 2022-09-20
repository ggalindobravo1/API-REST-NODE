const express = require("express");
const router = express.Router();
const multer = require("multer");
const ArticleController = require("../controllers/article");


const tempStorage = multer.diskStorage({ //configure storage for uploaded images
    destination: function(req, file, cb) {
        cb(null, "./images/articles/");
    }, 
    filename: function(req, file, cb) {
        cb(null, "articulo_" + Date.now() + file.originalname);
    }
})

const uploads = multer({storage: tempStorage}); // middleware

//testing routes
router.get("/test-route", ArticleController.testArticle);
router.get("/courses", ArticleController.courses);

//prod routes
router.post("/create", ArticleController.create);
router.get("/getArticles/:limit?", ArticleController.getArticles); // :limit? => optional parameter
router.get("/getArticleById/:id", ArticleController.getArticleById); // :id => mandatory parameter
router.delete("/deleteArticle/:id", ArticleController.deleteArticle);
router.put("/editArticle/:id", ArticleController.editArticle);
router.post("/upload-img/:id", [uploads.single("file0")], ArticleController.uploadImg); 
router.get("/findArticle/:filter", ArticleController.findArticle); 


module.exports = router;