'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class package_shippings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  package_shippings.init({
    manifest_id: DataTypes.BIGINT,
    package_id: DataTypes.BIGINT,
    path_id: DataTypes.BIGINT,
    path_node: DataTypes.INTEGER,
    way_bill_no: DataTypes.STRING,
    arrived: DataTypes.BOOLEAN,
    assignee: DataTypes.BIGINT,
    take_over: DataTypes.BOOLEAN,
    next: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'package_shippings',
  });
  return package_shippings;
};
