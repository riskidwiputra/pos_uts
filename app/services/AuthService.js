const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const userRepository = require('../repositories/UserRepository');

class AuthService {


  constructor() {
    this.userRepository = userRepository;
  }

  async login(email, password) {

    // Validasi input
    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi', 400);
    }

    // Cari pengguna
    const user = await this.userRepository.findByEmail(email);


    if (!user) {
      throw new AppError('Email tidak terdaftar', 404);
    }
    const user_id = user.id;
    const nama = user.name;
    console.log(user);
    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Password anda salah', 401);
    }

    // Generate token
        const accessToken = jwt.sign(
            { user_id,nama, email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
      const refreshToken = jwt.sign(
        { user_id, nama, email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      console.log(refreshToken);

     await this.userRepository.updateRefreshToken(refreshToken , user.id);

    return {
        user,
        accessToken,
        refreshToken
     };
  }

  async register(fullname, email, password){
   
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
  
    const data = {
        'fullname' : fullname,
        email,
        'password' : hashPassword,
        role_id: 2
    };
    const user = await this.userRepository.createUser(data);

    return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
    };
  }
  async logout(refresh_token) {

    const user =  await this.userRepository.findByRefreshToken( refresh_token );

    if (!user) {
      throw new AppError('user tidak ditemukan', 404);
    }
  
    const user_id = user.id;

    await this.userRepository.updateRefreshToken(null, user_id);
  }
}

module.exports = new AuthService();