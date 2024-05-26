'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
      },
      orderId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Orders",
          key: "id",
        },
    
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Products",
          key: "id",
        },
    
      },
      productName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      productImage: {
        type: Sequelize.STRING
      },
      productPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      category: {
        type: Sequelize.STRING
      },
      size: {
        allowNull: false,
        type: Sequelize.STRING
      },
      colour: {
        allowNull: false,
        type: Sequelize.STRING
      },
      quantity: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('OrderItems');
  }
};