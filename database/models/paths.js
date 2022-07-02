'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paths extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  paths.init({
    manifest_id: DataTypes.BIGINT,
    paths: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'paths',
  });
  return paths;
};
