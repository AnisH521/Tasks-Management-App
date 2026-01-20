// User Departments
export const USER_DEPARTMENTS = {
  Administration: "Administration",
  Operating: "Operating",
  Commercial: "Commercial",
  Engineering: "Engineering",
  Mechanical_C_W: "Mechanical (C & W)",
  Mechanical_D_DM: "Mechanical (D & DM)",
  EnHM: "EnHM",
  Electrical_TRS: "Electrical/TRS",
  Electrical_TRD: "Electrical /TRD",
  Electrical_OP: "Electrical/OP",
  Electrical_Genl: "Electrical /Genl",
  Signal_and_Telecom: "Signal and Telecom",
  Medical: "Medical",
  Personnel: "Personnel",
  Accounts: "Accounts",
  Railway_Protection_Force: "Railway Protection Force",
  Store: "Store",
  RAJBHASHA: "RAJBHASHA"
};

// User Roles
export const USER_ROLES = {
  OFFICER: "Officer",
  SUPERVISOR: "Supervisor",
  CONTROLLER: "Controller",
  ADMIN: "Admin",
};

export const deptPrefixMap = {
    'Mechanical (C & W)': 'MECH',
    'Mechanical (D & DM)': 'MECH_D_DM',
    'Engineering': 'ENG',
    'Electrical/TRS': 'ELEC_TRS',
    'Electrical/TRD': 'ELEC_TRD',
    'Electrical/OP': 'ELEC_OP',
    'Electrical/Genl': 'ELEC_GEN',
    'Signal and Telecom': 'ST',
    'Commercial': 'COM',
    'Operating': 'OPT',
    'Administration': 'ADM',
    'Railway Protection Force': 'RPF',
    'Store': 'STORE',
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
