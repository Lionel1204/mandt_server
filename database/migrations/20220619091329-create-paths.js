'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('paths', {
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
      address: {
        type: Sequelize.STRING
      },
      assignee: {
        type: Sequelize.BIGINT
      },
      waybill_no: {
        type: Sequelize.STRING
      },
      arrived: {
        type: Sequelize.BOOLEAN
      },
      type: {
        type: Sequelize.INTEGER
      },
      sequence_no: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('paths');
  }
};
