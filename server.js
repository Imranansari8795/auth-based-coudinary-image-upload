
require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth-routes.js')
const homeRoute = require('./routes/home-routes.js')
const adminRoutes = require('./routes/admin-routes.js');
const uploadImageRoutes = require('./routes/image-routes.js');
const fetchAllImages = require('./controllers/image-controller.js')
const connectToDB = require('./database/db');

const app = express();

// db connection
connectToDB()

// middleware
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/home',homeRoute);
app.use('/api/admin',adminRoutes);
app.use('/api/image',uploadImageRoutes);
// app.use('/api/image',uploadImageRoutes);


const port = process.env.PORT || 4000;
app.listen(port, () =>{
    console.log(`server is running at port ${port}`);
})