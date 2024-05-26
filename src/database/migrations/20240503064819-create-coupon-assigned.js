'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CouponAssigned', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4 
      },
      orderId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
           model: "Orders",
          key: "id",
          allowNull: true,
        },
    
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "Users",
          key: "id",
        },
    
      },
      couponInfoId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
           model: "CouponInfos",
          key: "id",
        },
    
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
   
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CouponAssigned');
  }
};