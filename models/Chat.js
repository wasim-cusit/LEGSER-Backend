const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Chat = sequelize.define("chats", {
  senderId: { type: DataTypes.INTEGER },
  receiverId: { type: DataTypes.INTEGER },
  message: { type: DataTypes.TEXT },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedBySender: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedByReceiver: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Chat.associate = (models) => {
  Chat.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
  Chat.belongsTo(models.User, { as: "receiver", foreignKey: "receiverId" });
};

module.exports = Chat;
