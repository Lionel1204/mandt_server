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
    const companyId = await queryInterface.rawSelect(
      'companies',
      {
        where: {
          license: '123456778910'
        },
        logging: console.log
      },
      ['id']
    );

    const phones = ['13564536791', '18001693299', '18654652911', '17737720115'];

    await queryInterface.bulkUpdate(
      'users',
      { company_id: companyId },
      {
        phone: phones
      }
    );
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
