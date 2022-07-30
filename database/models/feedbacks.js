'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedbacks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  feedbacks.init({
    user_id: DataTypes.BIGINT,
    user_phone: DataTypes.STRING,
    problem: DataTypes.TEXT,
    idea: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'feedbacks',
  });
  return feedbacks;
};
