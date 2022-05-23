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

    const ownerId = await queryInterface.rawSelect('users', {
      where: {
        name: 'Lionel Shen'
      },
      logging: console.log
    }, ['id']);

    const receiverId = await queryInterface.rawSelect('users', {
      where: {
        name: 'Aric Liu'
      },
      logging: console.log
    }, ['id']);

    await queryInterface.bulkInsert('projects', [{
      name: 'testProj1',
      owner: ownerId,
      receiver: receiverId,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {logging: console.log});
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
