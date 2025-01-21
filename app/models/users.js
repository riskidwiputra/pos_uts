'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.belongsTo(models.Roles, {
        foreignKey: 'role_id' 
      });

      Users.hasMany(models.Sale, {
        foreignKey: 'user_id',
        as: 'sales'
      });
      
    }
  }
  Users.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.TEXT,
    tgl_lahir: DataTypes.DATE,
    image: DataTypes.TEXT,
    refresh_token: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: true
  });
  return Users;
};