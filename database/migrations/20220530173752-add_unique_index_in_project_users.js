'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addIndex('project_users', {
      name: 'project_user_uniq',
      unique: true,
      fields: ['project_id', 'user_id']
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeIndex('project_users', {
      name: 'project_user_uniq'
    });
  }
};
