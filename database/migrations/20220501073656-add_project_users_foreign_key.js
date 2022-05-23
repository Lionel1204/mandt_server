'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('project_users', 'user_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: null, after: 'can_maintain_system'
    });

    await queryInterface.changeColumn('project_users', 'project_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'projects',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    await queryInterface.removeConstraint('project_users', 'project_users_ibfk_1');
    await queryInterface.removeConstraint('project_users', 'project_users_ibfk_2');
  }
};
