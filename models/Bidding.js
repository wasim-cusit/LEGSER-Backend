const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");

const Bidding = sequelize.define("bidding", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  lawyer_id: { type: DataTypes.INTEGER, allowNull: false },
  case_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  bid_status: {
    type: DataTypes.ENUM("not_seen", "seen", "accepted","deactivated"),
    defaultValue: "not_seen",
  }
});


Bidding.associate = (models) => {
    Bidding.belongsTo(models.User, { foreignKey: "lawyer_id", as: "lawyer" });
    Bidding.belongsTo(models.Case, { foreignKey: "case_id", as: "case" });
  };

module.exports = Bidding;
