const AuthService = require('../services/AuthService');
const {validationResult}    = require('express-validator');


  class AuthController {

    static async login(req, res,next) {

      try {
          
          const { email, password } = req.body;
          
          const result = await AuthService.login(email, password);

          res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          
          return res.status(200).json({
            status: 'Login Success',
            data: {
              user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email
              },
              accessToken: result.accessToken
            },
            message: 'Login berhasil'
          });

      } catch (error) {
          next(error);
      }
    }

    static async register(req, res,next) {

      try {
        const errors = validationResult(req);
  
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            success: false,
            errors: errors.array() 
          });
        }
         const { fullname, email, password } = req.body;
          
          const result = await AuthService.register(fullname, email, password);
          
          res.json({
              status: 'Register Success',
              data: result
          });

      } catch (error) {
          next(error);
      }
    }
    
    static async refresh_token(req, res,next) {

      try {
        const refreshToken = req.cookies.refresh_token;
        
        if (!refreshToken) {
          return res.status(401).json({
            status: 'error',
            message: 'Refresh token tidak ditemukan'
          });
        }
    
        // Verifikasi refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Generate token baru
        const accessToken = jwt.sign(
          { user_id: decoded.user_id, nama: decoded.nama, email: decoded.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        );
    
        res.json({
          status: 'success',
          accessToken
        });
    
      } catch (error) {
        return res.status(401).json({
          status: 'error',
          message: 'Refresh token tidak valid'
        });
      }
    }
    static async logout(req, res) {
      try {
        
      const refresh_token = req.cookies.refresh_token;
  
      await AuthService.logout(refresh_token);
        res.clearCookie('refresh_token');
        res.json({
          status: 'success',
          message: 'Logout berhasil'
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: error.message
        });
      }
    }
  }
  
  module.exports = AuthController;