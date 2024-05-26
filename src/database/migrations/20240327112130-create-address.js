'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
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
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.CHAR(11)
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.CHAR
      },
      country: {
        allowNull: false,
        type: Sequelize.CHAR
      },
      state: {
        type: Sequelize.CHAR
      },
      pincode: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      type:{
        type:   Sequelize.ENUM,
        values: ['shipping', 'billing'],
        defaultValue :  'shipping'
      },
      isDefault:{
        defaultValue :  false,
        type: Sequelize.BOOLEAN
      },
      isDeleted:{
        defaultValue :  false,
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
    await queryInterface.dropTable('Addresses');
  }
};