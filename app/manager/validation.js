const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH+'base-autobind');
const expressValidator = require('express-validator');
class ValidationManager extends BaseAutoBindedClass{
    constructor (){
        super();
    }
    provideDefaultValidator(){
        return expressValidator({
            errorFormatter:ValidationManager.errorFormatter
        })
    }
    static errorFormatter( param, msg, value){
        console.log('ValidationManager errorFormatter.');
        let namespace = param.split('.');
        let root = namespace.shift();
        let formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}
module.exports = ValidationManager;