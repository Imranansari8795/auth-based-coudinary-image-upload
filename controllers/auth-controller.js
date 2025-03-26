

// register controller


const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser = async function(req,res){
    try {
        
        // extract user information from our request body
        const {username,email,password} = req.body;

        if(!username || !password || !email){
            return res.status(400).json({
                success:false,
                message:'Please provide all details of input.'
            })
        }


        // check if the user is already exists in our database
        
        const checkExistingUser = await User.findOne({$or:[{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success:false,
                message:'User is already exists either with same username or same email. Please try with different username or email.'
            })
        }

        // hash user password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // create a new user and save in your database

        const newlyCreatedUser = new User({
            username,
            email,
            password:hashedPassword
        });

        await newlyCreatedUser.save();
        if(newlyCreatedUser){
            return res.status(201).json({
                success:true,
                message:"user registered successfully!",
                data:newlyCreatedUser
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"user unable to register! Please try again."
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"
        })
    }
}




// login controller

const loginUser = async(req,res) =>{

    try {
        const {username,password} = req.body;

        if(!username || !password){
            return res.status(400).json({
                success:false,
                message:'username or password are required! Please provide username and password to login.'
            })
        }
        const user = await User.findOne({$or:[{username},{password}]});

        if(!user){
            return res.status(404).json({
                success:false,
                message:'user is not registered! Please sign up first.'
            })
        }

        // if the password is correct or not
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials!"
            })
        }
        // create token here if user exist

        const token = jwt.sign({
            userId : user._id,
            username:user.username,
            role:user.role,
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'5m'
        });



        res.status(200).json({
            success: true,
            token:token,
            message: "Login successful!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"
        })
    }
}

const changePassword = async (req,res) => {
    try {
        const {userId} = req.userInfo;

        // extract old and new password

        const {oldPassword,newPassword} = req.body; 

        // find the current loggged in user
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success:false,
                message:'user is not found!'
            })
        }

        // check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'Old password is not correct! Please try again.',
            })
        }
        // hash the new password here

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt);

        // update user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:'Password has been changed!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"
        })
    }
}


module.exports = {registerUser,loginUser,changePassword};