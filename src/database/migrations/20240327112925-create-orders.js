'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Users",
          key: "id",
        },
    
      },
      addressId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Addresses",
          key: "id",
        },
    
      },
      totalItems: {
        type: Sequelize.INTEGER
      },
      total: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      extra: {
        type: Sequelize.DECIMAL(10,2),
      },
      deleviryDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
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
    await queryInterface.dropTable('Orders');
  }
};