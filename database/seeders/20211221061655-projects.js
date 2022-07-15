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
        phone: '13564536791'
      },
      logging: console.log
    }, ['id']);

    const receiverId = await queryInterface.rawSelect('companies', {
      where: {
        license: '123456778910'
      },
      logging: console.log
    }, ['id']);

    const records = [{
      name: 'testProj1',
      owner: ownerId,
      receiver: receiverId,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    }];

    await queryInterface.bulkInsert('projects', records, {
      logging: console.log
    });
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
