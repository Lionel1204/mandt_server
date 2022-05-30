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
    const records = [{
      name: 'itLogistics',
      type: 'LTD',
      license: '123456778910',
      company_id: 'it-id',
      contact: 1,
      capability: 10000,
      memo: 'The big company',
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
