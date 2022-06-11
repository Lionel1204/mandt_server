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
    const userId = await queryInterface.rawSelect(
      'users',
      {
        where: {
          phone: '13564536791'
        },
        logging: console.log
      },
      ['id']
    );

    const records = [{
      name: 'itLogistics',
      type: 'LOGISTICS',
      license: '123456778910',
      contact: userId,
      capability: 5,
      transport: ['HIGHWAY'],
      scope: 'INLAND',
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    await queryInterface.bulkInsert('companies', records, {logging: console.log});
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
