const express = require('express');
const app = express()
app.use(express.json())
require("dotenv").config()
const {connection} = require("./db")
const {authMiddleware} = require("./middleware/authentication")
const {authorise} = require("./middleware/authorisation")
const {userRouter} = require("./routes/user.routes")
const {ProductRouter} = require("./routes/product.routes")
const {User} = require('./models/user.models');
const {blacklist} = require("./blacklisted");


app.get("/",(req,res) =>{
    res.send("WELCOME TO HOME PAGE")
  })

app.use("/users", userRouter)
app.use("/product", ProductRouter)


app.listen(`${process.env.port}`, async ()=>{
    try{
        await connection
        console.log("Connected to DB")
    } catch(err){
        console.log(err.message)
    }
    console.log(`Server is listening at port ${process.env.port}`)
})