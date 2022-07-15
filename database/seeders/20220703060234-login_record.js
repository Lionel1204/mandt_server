'use strict';
const _ = require('lodash');
const { encrypt } = require('../../helper/utils');
const { SALT } = require('../../helper/constants');
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
    const users = await queryInterface.select(
      null,
      'users',
      {
        where: {
          phone: ['13564536791', '18001693299', '18654652911', '17737720115']
        },
        logging: console.log
      }
    );

    const records = _.map(users, (u, index) => {
      return {
        user_id: u.id,
        user_phone: u.phone,
        password: encrypt('sha1', `User${index}`, 'base64', SALT),
        captcha: '',
        login_time: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    await queryInterface.bulkInsert('logins', records, { updateOnDuplicate: ['user_id']});
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
