
const Image = require('../models/Image');
const uploadToCloudinary = require('../cloudinary-helpers/cloudinaryHelper')
const cloudinary = require('../config/cloudinary.js');

const uploadImageController = async (req,res) => {
    try {
        const imageFile = req.file;
        // check if file is missing 
        
        if(!imageFile){
            return res.status(400).json({
                success:false,
                message:'File is required! Please upload an image.'
            })
        }
        // upload to cloudinary 
        const {url,public_id} = await uploadToCloudinary(imageFile.path);

        // store the image url and public id along with the uploaded user id
        const newlyUploadedImage = new Image({
            url,
            public_id,
            uploadedBy:req.userInfo.userId
        })
        await newlyUploadedImage.save();

        res.status(201).json({
            success:true,
            message:'Image uplaoded successfully',
            image:newlyUploadedImage
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something went wrong! Please try again later.'
        })
    }
}

const fetchAllImages = async (req,res) => {
    
    try {
        const images = await Image.find({});
        return res.status(201).json({
            success:true,
            message:'all images fetched!',
            images:images
        })
    } catch (error) {
        res.status(401).json({
            success:false,
            message:'something went wrong during feaching images.',
            image:newlyUploadedImage
        })
    }
    
}

const deleteImageController = async(req,res) =>{

    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const {userId} = req.userInfo;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if(!image){
            return res.status(404).json({
                success:false,
                message:'Image not found'
            })
        }
        // check if this image is uploaded by the current user who is trying to delete this image
        // console.log("image.uploadedBy:", image.uploadedBy.toString());
        // console.log("userId:", userId.toString());
        // console.log("Comparison Result:", image.uploadedBy.toString() === userId.toString());

        if(image.uploadedBy.toString() !== userId.toString()){
            return res.status(404).json({
                success:false,
                message:'you are not authorize to delete this image bcz you havent uploaded it'
            })
        }
        // delete this image from clooudinary first
        await cloudinary.uploader.destroy(image.public_id);
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success:true,
            message:'Image deleted!'
        })

    } catch (error) {
        res.status(401).json({
            success:false,
            message:'something went wrong during feaching images.',
            image:newlyUploadedImage
        })
    }
}

module.exports = {uploadImageController,fetchAllImages,deleteImageController};