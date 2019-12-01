var mongoose = require('mongoose');
var Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

var userSchema = new mongoose.Schema({
    email: {
        type:String, 
        unique : true,
        minlength : 8,
        maxlength : 255,
        match : /.*@.*/
    },
    password: {
        type:String, 
        minlength : 8,
        maxlength : 1024
    },
    isAdmin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    liked_shops: {type: Array}
});

userSchema.pre('save', function(next){
    var current_date = new Date();
    this.updated_at = current_date; 
    if(!this.created_at) created_at = current_date;
    next();
});

userSchema.methods.generateAuthToken = function name(params) {
    const token = jwt.sign({_id : this._id, isAdmin : this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}

function validateUser(user){
    const schema = {
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }
    return Joi.validate(user, schema);
}
const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser;
