'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    id_card: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    company_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};
