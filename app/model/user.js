let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let UserSchema = new Schema({
    firstName:String,
    lastName:String,
    salt: {
        type: String,
        required: true
    },
    isActive: {type: Boolean, default: true},
    dateCreated: {type: Date, default: Date.now},
    email: String,
    hashedPassword: {
        type: String,
        required: true,
    }
});
UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.__v;
    delete obj.salt;
    return obj;
};
UserSchema.virtual('id').get(function () {
    return this._id;
});
UserSchema.virtual('password')
    .set(function (password) {
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password, this.salt);
    })
    .get(function () {
        return this.hashedPassword;
    });
UserSchema.methods.encryptPassword = function (password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password, this.salt) === this.hashedPassword;
};
module.exports.UserModel = mongoose.model('User', UserSchema);
/*
For accessing the MongoDB database we will use Mongoose, 
an object data modeling library for MongoDB, this is much easier than writing raw queries, 
since you think in terms of JavaScript objects rather than database semantics.

Some explanations for the code above. In the toJSON function, we are removing secret fields that should not be returned when user info is requested. 
There are some other ways, but I’ve found this the most convenient.There is the the password virtual property defined, 
that has the getter and the setter functions. In this case the setter function, 
rather than store a password in plaintext, creates a hashed, salted version of the password provided as an argument. 
In addition we implement the checkPassword method, that compares a password provided in plain text by a user, 
with a password stored in the database. */