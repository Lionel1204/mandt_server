'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class packages_shippings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  packages_shippings.init({
    package_id: DataTypes.BIGINT,
    shipping_id: DataTypes.BIGINT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'packages_shippings',
  });
  return packages_shippings;
};