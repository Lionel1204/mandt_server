'use strict';
const _ = require('lodash');

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
    const pkg = await queryInterface.select(
      null,
      'packages',
      {
        attributes: ['id', 'manifest_id'],
        where: {
          package_no: 'test001',
        },
        logging: console.log
      }
    );
    const pid = pkg[0].id;
    const mid = pkg[0].manifest_id;

    const paths = await queryInterface.select(
      null,
      'paths',
      {
        where: {
          manifest_id: mid
        },
        logging: console.log
      }
    );

    const pathId = paths[0].id;
    const records = _.map(paths[0].paths, (p, ind) => {
      return {
        manifest_id: mid,
        package_id: pid,
        path_id: pathId,
        path_node: ind,
        way_bill_no: 'test001',
        arrived: ind === 0,
        assignee: p.assignee,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert('package_shippings', records, {logging: console.log});
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
