'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      tgl_lahir: {
        type: Sequelize.DATE
      },
      image: {
        type: Sequelize.TEXT
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: { model: 'roles', key: 'id' }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true // Izinkan nilai null
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true // Izinkan nilai null
      },
      deletedAt : {
        allowNull:true,
        type:Sequelize.DATE,
      }
    },{paranoid: true});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
