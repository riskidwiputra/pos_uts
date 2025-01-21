'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Sale.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'cashier'
      });

        Sale.hasMany(models.SaleItem, {
            foreignKey: 'sale_id',
            as: 'items'
        });
    }
  }
  Sale.init({
    receipt_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      receipt_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      cash: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      change: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    sequelize,
    modelName: 'Sale',
    timestamps: true
  });
  return Sale;
};