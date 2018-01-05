const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
const AlreadyExistsError = require(APP_ERROR_PATH+ 'already-exists');
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');

class UserHandler {
    constructor(){
        this._validator = require('validator');
    }

    static get USER_VALIDATION_SCHEME(){
        return {
            'firstName':{
                nonEmpty:true,
                isLength:{
                    options:[{ min:2, max:15 }],
                    errorMessage: 'First Name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid first name'

            },
            'lastName':{
                nonEmpty:true,
                isLength :{
                    options:[ { min:2, max:15 } ],
                    errorMessage: 'Last name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid last name'
            },
            'email':{
                isEmail:{
                    errorMessage: 'Invalid email'
                },
                errorMessage: 'Invalid email provided'
            },
            'password':{
                nonEmpty:true,
                isLength:{
                    options:[ { min:8, max:35 } ],
                    errorMessage: 'password must bebetween 6 and 35 chars long'
                },
                errorMessage: 'invalid Password format'

            }
        };
    }
    getUserInfo (req, userToken, callback) {
        req.checkParams( 'id', 'Invalid User ID provided').isMongoId();
        req.getValidationResult()
            .then( (result) =>{
                if( !result.isEmpty() ){
                    let errorMessages = result.array().map(function (elem){
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;
                if (userToken.id !== userId) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                }
                else {
                    return new Promise(function (resolve, reject) {
                        UserModel.findById(userId, function (err, user) {
                            if (user === null) {
                                throw new UnauthorizedError("User not found against Provided id "+ userId);
                            } else {
                                resolve(user);
                            }
                        });
                    });
                }
            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch( (error) => {
                callback.onError(error);
            })
    }
    createNewUser ( req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserHandler.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then( function (result){
                if ( !result.isEmpty() ){
                    let errorMessages = result.array().map(function(elem){
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new UserModel({
                    firstName: validator.trim(data.firstName),
                    lastName: validator.trim(data.lastName),
                    email: validator.trim(data.email),
                    password: validator.trim(data.password)
                });
            })
            .then( (user) =>{
                console.log('UserHandler 22: ', user);
                return new Promise(function (resolve, reject) {
                    UserModel.find({email: user.email}, function (err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User already exists"));
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then( (user) => {
                console.log('UserHandler 33: ', user);
                user.save();
                return user;
            })
            .then( (saved) => {
                console.log('UserHandler 44: ', saved);
                callback.onSuccess(saved);
            })
            .catch( (error) =>{
                console.log('UserHandler 55: ', error);
                callback.onError(error);
            })
    }
}
module.exports = UserHandler;