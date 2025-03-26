
const mongoose = require('mongoose');

const connectToDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected!'); 
    } catch (error) {
        console.error('MongoDB Connection failed!');
        process.exit(1);
        
    }
}

module.exports = connectToDB;
