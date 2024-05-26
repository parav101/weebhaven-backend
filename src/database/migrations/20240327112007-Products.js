'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
      },
      productName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      productDesc: {
        type: Sequelize.STRING
      },
      orderIndex: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      isFeatured: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};