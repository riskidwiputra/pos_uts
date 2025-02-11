const jwt       = require("jsonwebtoken")
const Users     = require("../app/models").Users;

const checkToken  = async (req,res,next) => {
    const refreshToken = req.cookies.refresh_token;
   
    if(!refreshToken)
    {
        console.log("anda Diwajibkan login terlebih dahulu");
        return  res.redirect('/login')
    }  
    const getUser = await Users.findOne({where : {refresh_token : refreshToken}});
    console.log(getUser);
    if(!getUser){
        return res.redirect('/login')
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,decode) => {
        if(err) return res.redirect('/login')
    });    
    next();
        // console.log("header")
        // const authHeader = req.headers['authorization'];
        // const token = authHeader && authHeader.split(' ')[1];
        
        // if(token == null){
        //     return res.redirect('/login')
        // } 
        // console.log(process.env.ACCESS_TOKEN_SECRET);
        // jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decode) => {
        //     if(err) return res.redirect('/login')
        // });    
      
}

module.exports = checkToken;