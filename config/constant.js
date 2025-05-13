const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  LAWYER: "lawyer",
};

const URGENCY_LEVELS = {
  STANDERED: "standard",
  PRIORITY: "priority",
  URGENT: "urgent",
};

const BUDGET_TYPES = {
  FIXED: "fixed",
  HOURLY: "hourly",
};

const CASE_STATUS = {
  OPEN: "open",
  ONGOING: "ongoing",
  CLOSED: "closed",
};

const Bid_STATUS = {
  NOT_SEEN: "not_seen",
  SEEN: "seen",
  ACCEPTED: "accepted",
  DEACTIVATED: "deactivated",
};

module.exports = {
  ROLES,
  URGENCY_LEVELS,
  BUDGET_TYPES,
  CASE_STATUS,
  Bid_STATUS
};
