const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "client", "lawyer"),
      allowNull: false,
    },
    phone_number: { type: DataTypes.STRING, allowNull: false },

    address: { type: DataTypes.TEXT },
    specialization: {
      type: DataTypes.JSON,
    },
    experience: { type: DataTypes.INTEGER },
    cnic: { type: DataTypes.STRING, allowNull: false },
    profession: { type: DataTypes.STRING },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    languages_spoken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website_or_social: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    profile_picture: { type: DataTypes.STRING, allowNull: false },
    certificate: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_seen: {
      type: DataTypes.DATE,
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

User.associate = (models) => {
  User.hasMany(models.Case, {
    foreignKey: "client_id",
    onDelete: "CASCADE",
    as: "cases",
  });
  User.hasMany(models.Bidding, {
    foreignKey: "lawyer_id",
    onDelete: "CASCADE",
    as: "biddings",
  });

  User.hasMany(models.Chat, { as: "sentMessages", foreignKey: "senderId" });
  User.hasMany(models.Chat, {
    as: "receivedMessages",
    foreignKey: "receiverId",
  });
};

module.exports = User;
