'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const projectId = await queryInterface.rawSelect('projects', {
      where: {
        name: 'testProj1'
      },
      logging: console.log
    }, ['id']);

    const userId1 = await queryInterface.rawSelect('users', {
      where: {
        name: 'Lionel Shen'
      },
      logging: console.log
    }, ['id']);

    const userId2 = await queryInterface.rawSelect('users', {
      where: {
        name: 'Aric Liu'
      },
      logging: console.log
    }, ['id']);

    const userId3 = await queryInterface.rawSelect('users', {
      where: {
        name: 'Kevin Wang'
      },
      logging: console.log
    }, ['id']);

    const records = [userId1, userId2, userId3].map((u) => {
      return {
        user_id: u,
        project_id: projectId,
        project_role: 'Project Manager',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('project_users', records, {logging: console.log});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
