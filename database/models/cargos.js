'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cargos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  cargos.init({
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    package_id: DataTypes.BIGINT,
    creator: DataTypes.BIGINT,
    manifest_id: DataTypes.BIGINT,
    size: DataTypes.JSON,
    weight: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'cargos',
  });
  return cargos;
};
