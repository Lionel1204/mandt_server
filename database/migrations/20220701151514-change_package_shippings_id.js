'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('package_shippings', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });
    await queryInterface.changeColumn('package_shippings', 'manifest_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'manifest_notes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
    });
    await queryInterface.changeColumn('package_shippings', 'package_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'packages',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
    });
    await queryInterface.changeColumn('package_shippings', 'path_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'paths',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
    });
    await queryInterface.changeColumn('package_shippings', 'assignee', {
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
