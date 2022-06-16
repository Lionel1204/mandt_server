'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('cargos', 'manifest_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'manifest_notes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null
    });
    await queryInterface.changeColumn('cargos', 'package_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null
    });
    await queryInterface.addColumn('cargos', 'creator', {
      type: Sequelize.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
