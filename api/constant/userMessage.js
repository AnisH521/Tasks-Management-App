// User Departments
export const USER_DEPARTMENTS = {
  FINANCE: "Finance",
  IT: "IT",
};

// User Roles
export const USER_ROLES = {
  END_USER: "endUser",
  SIC: "SIC",
  ADMIN: "admin"
};

// Arrays for validation
export const VALID_DEPARTMENTS = Object.values(USER_DEPARTMENTS);
export const VALID_ROLES = Object.values(USER_ROLES);

// Validation Messages
export const VALIDATION_MESSAGES = {
  INVALID_DEPARTMENT: `Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(', ')}`,
  INVALID_ROLE: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`
};
