const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl : {
        type:String
    },
    shortUrl : {
        type:Number,
        default:0,
        unique:true
    }
})

const UrlModel = mongoose.model('UrlModel', urlSchema);
module.exports = {
    UrlModel
}