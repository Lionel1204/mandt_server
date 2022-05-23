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

    await queryInterface.bulkInsert('manifest_notes', [{
      note_no: 'M0001',
      creator: 1,
      receiver: null,
      project_id: 1,
      status: 'ACTIVE',
      cargo_amount: 3,
      published_at: new Date(),
      ended_at: null,
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
