// Ticket Categories
export const TICKET_CATEGORIES = {
  SAFETY: "Safety",
  NON_SAFETY: "Non-Safety", 
  ASSET_FAILURE: "Asset-Failure"
};

// Ticket Statuses
export const TICKET_STATUSES = {
  OPEN: "open",
  FORWARDED: "forwarded",
  CLOSED: "closed",
  REJECTED: "rejected"
};

// Arrays for validation
export const VALID_CATEGORIES = Object.values(TICKET_CATEGORIES);
export const VALID_STATUSES = Object.values(TICKET_STATUSES);

// Validation Messages
export const VALIDATION_MESSAGES = {
  INVALID_CATEGORY: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
  INVALID_STATUS: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
};
