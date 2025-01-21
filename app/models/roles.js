'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  Roles.init({
    role_name: {
        type: DataTypes.ENUM,
        values: ['admin', 'kasir']
      },
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Roles',
    timestamps: true
  });
  return Roles;
};