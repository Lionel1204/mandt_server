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
      name: 'Lionel Shen',
      title: 'Project Manager',
      id_card: '123456778910',
      phone: '13564536791',
      email: 'lionel12@163.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Aric Liu',
      title: 'Admin',
      id_card: '23456789101',
      phone: '18001693299',
      email: 'aric@163.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Kevin Wang',
      title: 'CEO',
      id_card: '34567891012',
      phone: '18654652911',
      email: 'kevin@163.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]
    await queryInterface.bulkInsert('users', records, {});
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
