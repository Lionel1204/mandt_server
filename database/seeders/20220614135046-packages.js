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
      manifest_id: manifestId,
      package_no: 'test001',
      wrapping_type: 'IRONCASE',
      shipping_type: 'CONTAINER',
      size: JSON.stringify({
        length: 20,
        width: 20,
        height: 20,
        unit: 'cm'
      }),
      weight: JSON.stringify({
        scale: 10,
        unit: 'kg'
      }),
      status: 'CREATED',
      amount: 0,
      creator: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    await queryInterface.bulkInsert('packages', records, {logging: console.log});

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
