'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class relationships extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  relationships.init({
    from: DataTypes.BIGINT,
    to: DataTypes.BIGINT,
    contact_to: DataTypes.BIGINT,
    memo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'relationships',
  });
  return relationships;
};