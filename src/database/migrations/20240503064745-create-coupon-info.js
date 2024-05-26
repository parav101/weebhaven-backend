"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CouponInfos", {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      code: {
        allowNull: false,
        unique:true,
        type: Sequelize.CHAR,
      },
      desc: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM,
        values: ["percent", "total"],
        defaultValue: "percent",
      },
      minAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      discountValue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      validOnce: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isVisible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expiryDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CouponInfos");
  },
};
