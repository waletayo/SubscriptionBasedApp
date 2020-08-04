import mongoose from "mongoose";

const Schema = mongoose.Schema;

const planSchema = new Schema({
    //can only be monthly and weekly
    name: {
        type: String,
        enum: ['weekly', 'monthly']
    },
    price: {
        type: Number
    }
}, {timestamps: true});

const planModel = mongoose.model('plan', planSchema, 'Plan');
module.exports = planModel;
