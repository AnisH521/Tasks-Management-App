// User Departments
export const USER_DEPARTMENTS = {
  FINANCE: "Finance",
  IT: "IT",
  CONTROLLER: "Controller",
  SUPERVISOR: "Supervisor",
    SRDMECO: "SRDMECO",
  SRDMEENHM: "SRDMEENHM",
  SRDOM: "SRDOM",
  SRDFM: "SRDFM",
  SRDCM: "SRDCM",
  SRDSC: "SRDSC",
  SRDSO: "SRDSO",
  SRDPO: "SRDPO",
  SRDEEG: "SRDEEG",
  SRDEEEMU: "SRDEEEMU",
  SRDEETRS: "SRDEETRS",
  SRDEEOP: "SRDEEOP",
  SRDMELOCO: "SRDMELOCO",
  SRDST: "SRDST",
  SRDEN: "SRDEN",
};

// User Roles
export const USER_ROLES = {
  END_USER: "endUser",
  JAG: "JAG",
  SIC: "SIC",
  ASTOFFICER: "astOfficer",
  ADMIN: "admin",
  CONTROLLER: "controller",
};

// Arrays for validation
export const VALID_DEPARTMENTS = Object.values(USER_DEPARTMENTS);
export const VALID_ROLES = Object.values(USER_ROLES);

// Validation Messages
export const VALIDATION_MESSAGES = {
  INVALID_DEPARTMENT: `Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(
    ", "
  )}`,
  INVALID_ROLE: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
};
