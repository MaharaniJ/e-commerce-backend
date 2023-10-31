const mongoose = require('mongoose');
require('dotenv').config()
const DB = process.env.DB_URI;
mongoose.connect(DB).then(()=>console.log("data base connected")).catch((error)=>console.log("error"+ error.message))