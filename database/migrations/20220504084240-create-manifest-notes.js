'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('manifest_notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      note_no: {
        type: Sequelize.STRING
      },
      creator: {
        type: Sequelize.BIGINT
      },
      receiver: {
        type: Sequelize.BIGINT
      },
      package_amount: {
        type: Sequelize.INTEGER
      },
      cargo_amount: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      project_id: {
        type: Sequelize.BIGINT
      },
      ended_at: {
        type: Sequelize.DATE
      },
      published_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('manifest_notes');
  }
};
