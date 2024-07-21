'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class apilimit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      apilimit.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  apilimit.init(
    {
      user_id: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'apilimit',
      underscored: true,
    },
  );
  return apilimit;
};
