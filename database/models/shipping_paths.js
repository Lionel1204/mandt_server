'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipping_paths extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  shipping_paths.init({
    node_name: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    owner: DataTypes.BIGINT,
    shipping_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'shipping_paths',
  });
  return shipping_paths;
};