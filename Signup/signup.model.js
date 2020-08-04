import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    //User fullname
    fullname: {
        type: String,
        required: true
    },
    //Boolean to check if user subscription is active
    is_paid: {
        type: Boolean,
        default: false
    },
    //User email
    email: {
        type: String,
        required: true
    },
    //User password
    password: {
        type: String,
        required: true
    },
    //User next payment date after First payment
    next_payment_date: {
        type: Date
    },

});

export const register = mongoose.model('user', userSchema, "register");
module.exports = register;
