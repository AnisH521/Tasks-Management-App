// User Departments
export const USER_DEPARTMENTS = {
  FINANCE: "Finance",
  IT: "IT",
  CONTROLLER: "Controller",
  SUPERVISOR: "Supervisor"
};

// User Roles
export const USER_ROLES = {
  END_USER: "endUser",
  JAG: "JAG",
  SIC: "SIC",
  ASTOFFICER: "astOfficer",
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
