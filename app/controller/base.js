const ResponseManager = require(APP_MANAGER_PATH + 'response' );
const BaseAutoBindedClass = require (APP_BASE_PACKAGE_PATH + 'base-autobind');
class BaseController extends BaseAutoBindedClass{
    constructor(){
        super();
        if( new.target === BaseController ){
            throw new TypeError("Cannot construct BaseController instance directly.")
        }
        this._responseManager = ResponseManager;
    }
    getAll(req, res){

    }
    get (req, res) {

    }
    create (req, res) {

    }
    update(req, res) {
        
    }

    remove(req, res) {

    }

    authenticate(req, res, callback) {

    }
}
module.exports = BaseController;