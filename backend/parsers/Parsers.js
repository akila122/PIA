
const bodyParser = require('express').json();
//const formParser = require('express').urlencoded({extended:true});
const formParser = require('express').urlencoded({extended:true});
module.exports = {
    bodyParser : bodyParser,
    formParser : formParser,
}
//Add multer!!!