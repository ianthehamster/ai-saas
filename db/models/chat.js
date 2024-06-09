'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Chat.init(
    {
      chat_contents: DataTypes.JSONB,
      user_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'chat',
      tableName: 'chats',
    },
  );
  return Chat;
};
