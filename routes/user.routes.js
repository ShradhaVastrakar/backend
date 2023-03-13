const express = require("express");
const {User} = require("../models/user.models")
const {authMiddleware} = require("../middleware/authentication")
const {authorise} = require("../middleware/authorisation")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const userRouter = express.Router();

userRouter.get("/", async (req,res) =>{
    const user = await User.find()
    res.send(user)
  })
  
  
  userRouter.post('/signup', async (req, res, next) => {
    try {
      const {  email, password, role } = req.body;
  
      // Check if user already exists
      const userExists = await User.findOne({ email  });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user
      const hashed = bcrypt.hashSync(password,5)
      const user = new User({ email, password : hashed,role });
      await user.save();
  
      res.json({ message: 'User created successfully' });
    } catch (error) {
      res.send(error);
    }
  });


  
  userRouter.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Compare the password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Create a JWT
      const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRET}`, {
        expiresIn: '1h'
      });
      const reftoken = jwt.sign({userId:user._id },
        `${process.env.REF_SECRET}`,{expiresIn:'5m'
       });

       res.cookie("token",token,{
        httpOnly : true
       });
       res.cookie("refToken",reftoken,{
        httpOnly : true
       });

       res.send({ msg : "Login Successfull",token, reftoken});

      
  
    } catch (error) {
      console.log(error);
    }
  });


  userRouter.post('/api/refresh', (req, res) => {
   
    let refToken = req.body.refToken;
      // Verify refresh token
     jwt.verify(refToken, `${process.env.REF_SECRET}` , (err,decode) =>{
    if(err){
      res.send(err.message)
    }
    else{
      let token = jwt.sign({ _id: decode._id }, `${process.env.JWT_SECRET}`, {
        expiresIn: '10m'
      });
      let refToken = req.body.refToken
      res.status(400).json({
        message : "Token Refreshed Successfully",
        token
      })
    }
     })
    });
  

    userRouter.delete("/delete/:id", authMiddleware ,authorise(["seller"]),async(req,res) =>{
        const role = req.user.role;
        if(role === "admin" || role === "super admin"){
          let user = req.params.id
          await User.findByIdAndDelete({_id:user})
          res.send({"msg": `Note with id ${user} has been deleted`})
        }
        else{
          res.send("Not Authorized")
        }
      })
    
    
      userRouter.patch("/update/:id", authMiddleware ,authorise(["seller","admin"]),async (req,res) =>{
        const role = req.user.role;
        if(role === "admin" || role === "super admin"){
          let user = req.params.id
          await User.findByIdAndDelete({_id:user})
          res.send({"msg": `Note with id ${user} has been updated`})
        }
        else{
          res.send("Not Authorized")
        }
      })

      userRouter.get("/logout", (req,res) =>{
        blacklist.push(req.headers.authorization.split(" ")[1])
        res.send("Logout Successfully")
      })

      userRouter.get("/profile", authMiddleware,authorise(["user"]),(req,res) =>{
        const role = req.user.role;
        if(role === "user"){
          res.send("profile...")
        }
        else{
          res.send("Not Authorized")
        }
      })











module.exports = {
    userRouter
}