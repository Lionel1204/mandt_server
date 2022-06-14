'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('packages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      manifest_id: {
        type: Sequelize.BIGINT
      },
      package_no: {
        type: Sequelize.STRING
      },
      wrapping_type: {
        type: Sequelize.STRING
      },
      shipping_type: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.JSON
      },
      weight: {
        type: Sequelize.JSON
      },
      amount: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('packages');
  }
};
