'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    try {
      await queryInterface.dropTable('shipping_paths');
      await queryInterface.dropTable('package_shippings');
    } catch (ex) {
      // Do not do anything
    }

    await queryInterface.changeColumn('paths', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });
    await queryInterface.changeColumn('paths', 'manifest_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'manifest_notes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
    });
    await queryInterface.changeColumn('paths', 'package_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'packages',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
    });
    await queryInterface.changeColumn('paths', 'assignee', {
      type: Sequelize.BIGINT,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
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
