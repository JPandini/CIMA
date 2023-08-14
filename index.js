require('dotenv').config();

const express = require('express');
const app = express();

app.get("/", (req, res)=>{
    res.json({message:"hello"})
})

app.listen(process.env.PORT, ()=>{
    console.log("App is running now!")
});