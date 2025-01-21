'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('products', [
        
        {
          name: "Beef Burger",
          price: 45000,
          image: "assets/img/beef-burger.png"
        },
        {
          name: "Sandwich",
          price: 32000,
          image: "assets/img/sandwich.png"
        },
        {
          "name": "Sawarma",
          price: 30000,
          image: "assets/img/sawarma.png"
        },
        {
          "name": "Croissant",
          price: 16000,
          image: "assets/img/croissant.png"
        },
        {
          "name": "Cinnamon Roll",
          price: 20000,
          image: "assets/img/cinnamon-roll.png"
        },
        {
          "name": "Choco Glaze Donut with Peanut",
          price: 10000,
          image: "assets/img/choco-glaze-donut-peanut.png"
        },
        {
          "name": "Choco Glazed Donut",
          price: 10000,
          image: "assets/img/choco-glaze-donut.png"
        },
        {
          "name": "Red Glazed Donut",
          price: 10000,
          image: "assets/img/red-glaze-donut.png"
        },
        {
          "name": "Iced Coffee Latte",
          price: 25000,
          image: "assets/img/coffee-latte.png"
        },
        {
          "name": "Iced Chocolate",
          price: 20000,
          image: "assets/img/ice-chocolate.png"
        },
        {
          "name": "Iced Tea",
          price: 15000,
          image: "assets/img/ice-tea.png"
        },
        {
          "name": "Iced Matcha Latte",
          price: 22000,
          image: "assets/img/matcha-latte.png"
        }
       
      ]);
    } catch (error) {
      console.error('Error seeding roles:', error);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
