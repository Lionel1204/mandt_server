'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('projects', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    /*
    await queryInterface.changeColumn('manifest_notes', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });*/

    await queryInterface.changeColumn('packages', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('cargos', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('shipping_paths', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('companies', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('relationships', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });

    await queryInterface.changeColumn('permissions', 'id', {
      type: Sequelize.BIGINT,
      autoIncrement: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('projects', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('packages', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('cargos', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('shipping_paths', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('companies', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('relationships', 'id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.changeColumn('permissions', 'id', {
      type: Sequelize.INTEGER
    });
  }
};
