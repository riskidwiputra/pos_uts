const jwt       = require("jsonwebtoken")
const Users     = require("../app/models").Users;

const verifyToken  = async (req,res,next) => {
    // const refreshToken = req.cookies.refresh_token;
   
    // if(!refreshToken)
    // {
    //     console.log("anda Diwajibkan login terlebih dahulu");
    //     return  res.redirect('/login')
    // }  
    // const getUser = await Users.findOne({where : {refresh_token : refreshToken}});
    // console.log(getUser);
    // if(!getUser){
    //     return res.redirect('/login')
    // }
    // jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,decode) => {
    //     if(err) return res.redirect('/login')
    // });    
    // next();
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
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Access token tidak ditemukan'
            });
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
              return res.status(401).json({
                status: 'error',
                message: 'Token expired'
              });
            }
        
            return res.status(401).json({
              status: 'error',
              message: 'Token tidak valid'
            });
          }
}

module.exports = verifyToken;