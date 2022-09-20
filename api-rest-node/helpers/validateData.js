const validator = require("validator");

const validate_data = (params) => {
    
    let isValidTitle = !validator.isEmpty(params.title) && validator.isLength(params.title, {min: 5, max:50});
    let isValidContent = !validator.isEmpty(params.content);

    if(!isValidTitle || !isValidContent){
        throw new Error("Information not valid");
    }
}

module.exports = {validate_data}