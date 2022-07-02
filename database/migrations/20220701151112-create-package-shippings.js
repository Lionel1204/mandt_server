'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('package_shippings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      manifest_id: {
        type: Sequelize.BIGINT
      },
      package_id: {
        type: Sequelize.BIGINT
      },
      path_id: {
        type: Sequelize.BIGINT
      },
      current_node: {
        type: Sequelize.INTEGER
      },
      way_bill_no: {
        type: Sequelize.STRING
      },
      arrived: {
        type: Sequelize.BOOLEAN
      },
      assignee: {
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('package_shippings');
  }
};
