

const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    public_id:{
        type:String,
        required:true,
        unique:true
    },
    url:{
        type:String,
        required:true,

    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Image',ImageSchema);