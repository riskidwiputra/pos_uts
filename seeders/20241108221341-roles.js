'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('roles', [
        {
          role_name: 'admin',
          description: "Admin memiliki akses dan otoritas yang lebih luas dibandingkan kasir. Mereka bertanggung jawab atas pengelolaan sistem secara keseluruhan, termasuk data pengguna, produk, dan laporan keuangan.",
        },
        {
          role_name: 'kasir',
          description: "Kasir bertanggung jawab langsung pada transaksi penjualan sehari-hari. Mereka berinteraksi langsung dengan pelanggan dan mengelola pembayaran."
        },
      ]);
    } catch (error) {
      console.error('Error seeding roles:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};