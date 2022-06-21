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
    await queryInterface.removeColumn('cargos', 'package_id');
    await queryInterface.addColumn('cargos', 'package_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'packages',
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

    await queryInterface.removeConstraint('cargos', 'cargos_creator_foreign_idx');
    await queryInterface.removeConstraint('cargos', 'cargos_manifest_id_foreign_idx');
    await queryInterface.removeColumn('cargos', 'creator');
    await queryInterface.removeColumn('cargos', 'manifest_id');
  }
};
