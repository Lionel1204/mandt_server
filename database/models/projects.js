'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  projects.init({
    name: DataTypes.STRING,
    owner: DataTypes.BIGINT,
    receiver: DataTypes.BIGINT,
    status: DataTypes.STRING,
    hidden: DataTypes.BOOLEAN,
    ended_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'projects',
  });
  return projects;
};
