const mongoose = require('mongoose');
const Joi = require('joi');

const userRegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true,
        minlength: 4,
        maxlength: 55,
        unique: true

    },
    email: {
        type: String,
        minlength: 0,
        maxlengh: 255,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlengh: 255,
        // required: true
    },
    role: {
        type: String,
        enum : ['user' , 'admin' , 'subAdmin'],
        default: "user"
    }


});


const userRegisterValidation = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(55).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
};

const logInValidation = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(55).required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
}

const userRegisterModel = new mongoose.model('user', userRegisterSchema);
module.exports = {
    userRegisterValidation,
    User: userRegisterModel,
    logInValidation
}
