'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('companies', 'scope', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('companies', 'transport', {
      type: Sequelize.JSON
    });
    await queryInterface.removeColumn('companies', 'company_id');
    await queryInterface.removeColumn('companies', 'memo');
    await queryInterface.changeColumn('companies', 'contact', {
      type: Sequelize.BIGINT,
      references: {
        model: 'users',
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
