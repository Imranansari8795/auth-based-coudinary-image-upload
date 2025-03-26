
const express =require('express');
const authMiddleware = require('../middleware/auth-middleware.js')
const adminMiddleware = require('../middleware/admin-middleware.js')
const uploadMiddleware = require('../middleware/upload-middleware.js');
const {uploadImageController,fetchAllImages,deleteImageController} = require('../controllers/image-controller.js')

const router  = express.Router();

// upload image
router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImageController);


// to get all images
router.get('/get',authMiddleware,fetchAllImages);

// delete an image route
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController);

module.exports = router;