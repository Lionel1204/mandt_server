'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class manifest_notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  manifest_notes.init({
    note_no: DataTypes.STRING,
    creator: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
    cargo_amount: DataTypes.INTEGER,
    status: DataTypes.STRING,
    project_id: DataTypes.BIGINT,
    ended_at: DataTypes.DATE,
    published_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'manifest_notes',
  });
  return manifest_notes;
};