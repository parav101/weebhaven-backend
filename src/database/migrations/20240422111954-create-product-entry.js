'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductEntries', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Products",
          key: "id",
        },
    
      },
       colourId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Colours",
          key: "id",
        },
    
      },
       sizeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Sizes",
          key: "id",
        },
    
      },
      productImage: {
        type: Sequelize.STRING
      },
      productPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      discountedPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      title: {
        type: Sequelize.STRING
      },
      inStock: {
        defaultValue:true,
        type: Sequelize.BOOLEAN
      },
      qty: {
        allowNull: false,
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
    await queryInterface.dropTable('ProductEntries');
  }
};