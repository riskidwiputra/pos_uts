
const Users  = require("../models").Users;
const { AppError } = require('../utils/errorHandler');
class UserRepository {

    async findByEmail(email) {
        return await Users.findOne({ where: { email: email } });
    }
    async findByRefreshToken(refresh_token) {
        return await Users.findOne({ where: { refresh_token: refresh_token } });
    }
    async findByUsername(username) {
        return this.items.find(user => user.username === username);
    }
    async updateRefreshToken(refresh_token,user_id){
       return Users.update({ refresh_token: refresh_token },{ where: { id: user_id } });
    }
    async findAll(options = {}) {
        try {
          const users = await Users.findAll(options);
          return users;
        } catch (error) {
          throw error;
        }
      }
    async updateRefreshToken(refreshToken, userId) {
        try {
            await Users.update(
            { refresh_token: refreshToken },
            { where: { id: userId } }
            );
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData) {

        const existingUser = await this.findByEmail(userData.email);

        if (existingUser) {
            throw new AppError('Email already exists', 409);
        }
        
        const newUser = {
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return Users.create(newUser);
    }
    async findByName(name) {
        try {
          const users = await Users.findAll({
            where: {
              name: {
                [Op.like]: `%${name}%`
              }
            }
          });
          return users;
        } catch (error) {
          throw error;
        }
    }
}

module.exports = new UserRepository();