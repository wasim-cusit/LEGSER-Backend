const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Review = sequelize.define("reviews", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  client_id: { type: DataTypes.INTEGER, allowNull: false },
  lawyer_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
});

Review.associate = (models) => {
  Review.belongsTo(models.User, { foreignKey: "lawyer_id", as: "lawyer" });
  Review.belongsTo(models.User, { foreignKey: "client_id", as: "client" });
};

module.exports = Review;
