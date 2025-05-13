const { User } = require("../models");
const { Op } = require("sequelize");

const markUsersOffline = async () => {
    const threshold = new Date(Date.now() - 15 * 1000);
  await User.update(
    { is_online: false },
    {
      where: {
        is_online: true,
        last_seen: { [Op.lt]: threshold },
      },
    }
  );
};

module.exports = markUsersOffline;
