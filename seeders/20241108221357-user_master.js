'use strict';

const { DATE } = require('sequelize');
const { Roles } = require('../app/models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const roles = [
      {
        role_name: 'admin',
        description: "Admin memiliki akses dan otoritas yang lebih luas dibandingkan kasir. Mereka bertanggung jawab atas pengelolaan sistem secara keseluruhan, termasuk data pengguna, produk, dan laporan keuangan.",
      },
      {
        role_name: 'kasir',
        description: "Kasir bertanggung jawab langsung pada transaksi penjualan sehari-hari. Mereka berinteraksi dengan pelanggan dan mengelola pembayaran."
      },
    ];

    await Roles.bulkCreate(roles);
    console.log()
    const adminRole = await Roles.findOne({ where: { role_name: 'admin' }});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return await queryInterface.bulkInsert('Users', [{
      fullname: 'Admin Utama',
      email: 'admin@gmail.com',
      password: '$2b$10$uDnTGuxXg3GD/rsN2xXf2ObSBSQh8kXtmdJyKSq9UU62YAVggVNFK', // admin123
      role_id: adminRole.id
    }],
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
