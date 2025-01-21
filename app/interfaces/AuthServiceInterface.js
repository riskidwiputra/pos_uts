// src/interfaces/authService.js
class AuthServiceInterface {
    constructor(authRepository) {
      this.authRepository = authRepository;
    }
  
    async register(userData) {
      throw new Error('Method not implemented');
    }
  
    async login(credentials) {
      throw new Error('Method not implemented');
    }
  
    async logout(refreshToken) {
      throw new Error('Method not implemented');
    }
  }
  
  module.exports = AuthServiceInterface;