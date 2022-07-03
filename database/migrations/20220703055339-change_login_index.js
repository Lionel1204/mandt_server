'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn('logins', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('logins', 'user_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      defaultValue: null, after: 'can_maintain_system'
    });

    await queryInterface.changeColumn('logins', 'user_phone', {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'phone',
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
