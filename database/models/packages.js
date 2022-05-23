'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  packages.init({
    package_no: DataTypes.STRING,
    wrapping_type: DataTypes.STRING,
    shipping_type: DataTypes.STRING,
    size: DataTypes.JSON,
    weight: DataTypes.FLOAT,
    amount: DataTypes.INTEGER,
    project_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'packages',
  });
  return packages;
};