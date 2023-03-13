const authorise = (permittedRoles) =>{
    return (req,res,next) =>{
     const userRole = req.user.role
     if(permittedRoles.includes(userRole)){
       next()
     }
     else{
       res.send("UnAuthorised")
     }
    }
   }

   module.exports = {authorise};