'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class logins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  logins.init({
    user_id: DataTypes.BIGINT,
    user_phone: DataTypes.STRING,
    password: DataTypes.STRING,
    captcha: DataTypes.STRING,
    login_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'logins',
  });
  return logins;
};
