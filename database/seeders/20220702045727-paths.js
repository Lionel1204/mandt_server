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
    const manifestId = await queryInterface.rawSelect(
      'manifest_notes',
      {
        where: {
          note_no: 'M0001'
        },
        logging: console.log
      },
      ['id']
    );

    const records = [{
      manifest_id: manifestId,
      paths: JSON.stringify([{
        "address": "内蒙古自治区",
        "assignee": 1,
        "type": 0
      }, {
        "address": "河南省",
        "assignee": 1,
        "type": 2
      }, {
        "address": "甘肃省",
        "assignee": 1,
        "type": 1
      }]),
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    await queryInterface.bulkInsert('paths', records, {logging: console.log});
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
