// Ticket Categories
/**
 * Detention Categories and Subcategories
 */

export const DETENTION_CATEGORIES = {
  // 1. ALARM CHAIN PULLING
  ACP: {
    description: "ALARM CHAIN PULLING",
    group: "LAW AND ORDER",
    subcategories: [
      { code: "DACP", description: "DIRECT ALARM CHAIN PULLING" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "IACP", description: "INDIRECT ALARM CHAIN PULLING" }
    ]
  },

  // 2. MISCREANTS ACTIVITY
  MA: {
    description: "MISCREANTS ACTIVITY",
    group: "LAW AND ORDER",
    subcategories: [
      { code: "ODAC", description: "OTHER THEN PASSENGER DECOITY" },
      { code: "OTFT", description: "OTHER THEN PASSENGER THEFT" },
      { code: "PDAC", description: "PASSENGER DECOITY" },
      { code: "PTFT", description: "PASSENGER THEFT" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 3. AGITATION
  AGT: {
    description: "AGITATION",
    group: "LAW AND ORDER",
    subcategories: [
      { code: "AGT", description: "AGITATION" }
    ]
  },

  // 4. ACCIDENT
  ACC: {
    description: "ACCIDENT",
    group: "UNUSUAL",
    subcategories: [
      { code: "ACC", description: "ACCIDENT" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 5. DIESEL LOCO (DIRECT)
  DDSL: {
    description: "DIESEL LOCO (DIRECT)",
    group: "MECHANICAL",
    subcategories: [
      { code: "DSDF", description: "DIESEL LOCO DIRECT FAILURE" },
      { code: "DSLT", description: "DIESEL LOCO LATE TURNOUT FROM SHED" },
      { code: "DSRC", description: "DIESEL RUNNING CREW LATE TURN UP OR MISSMANAGED BY CREW" },
      { code: "DSRF", description: "DIESEL RUNNING FUELING ACCOUNT" },
      { code: "DSRL", description: "DIESEL RUNNING LINE BOX" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "SNWWEA", description: "SANDER NOT WORKING/WEATHER" },
      { code: "OTH", description: "OTHERS" }
    ]
  },

  // 6. DIESEL LOCO (INDIRECT)
  IDSL: {
    description: "DIESEL LOCO (INDIRECT)",
    group: "MECHANICAL",
    subcategories: [
      { code: "IDSF", description: "DIESEL LOCO INDIRECT FAILURE" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "IDSR", description: "DIESEL RUNNING INDIRECT" },
      { code: "SNWWEA", description: "SANDER NOT WORKING/WEATHER" },
      { code: "UDDMU", description: "UNIT DEFECT DMU" }
    ]
  },

  // 7. ELECTRIC LOCO (DIRECT)
  DELC: {
    description: "ELECTRIC LOCO (DIRECT)",
    group: "ELECTRICAL",
    subcategories: [
      { code: "DSDF", description: "ELECTRIC LOCO DIRECT FAILURE" },
      { code: "DSLT", description: "ELECTRIC LOCO LATE TURNOUT FROM SHED" },
      { code: "DSRC", description: "ELECTRIC RUNNING CREW LATE TURN UP OR MISMANAGEMENT BY CREW" },
      { code: "DSRF", description: "ELECTRIC RUNNING FULING ACCOUNT" },
      { code: "DSRL", description: "ELECTRIC RUNNING LINE BOX" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "SNWWEA", description: "SANDER NOT WORKING/WEATHER" },
      { code: "OTH", description: "OTHERS" }
    ]
  },

  // 8. ELECTRIC LOCO (INDIRECT)
  IELC: {
    description: "ELECTRIC LOCO (INDIRECT)",
    group: "ELECTRICAL",
    subcategories: [
      { code: "IDSF", description: "ELECTRIC LOCO INDIRECT FAILURE" },
      { code: "IDSR", description: "ELECTRIC RUNNING INDIRECT" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "SNWWEA", description: "SANDER NOT WORKING/WEATHER" }
    ]
  },

  // 9. INCIDENT
  INC: {
    description: "INCIDENT",
    group: "UNUSUAL",
    subcategories: [
      { code: "INC", description: "INCIDENT" },
      { code: "MED", description: "DOCTOR ON CALL ATTENDED PASSENGER" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 10. CARRIAGE AND WAGON (DIRECT)
  DCW: {
    description: "CARRIAGE AND WAGON (DIRECT)",
    group: "MECHANICAL",
    subcategories: [
      { code: "ACO", description: "ANGLE COCK OPERATED" },
      { code: "HP", description: "CONTINUITY PIPE DISCONNECTED" },
      { code: "OTH", description: "OTHERS" },
      { code: "PAR", description: "PARTING" },
      { code: "PT", description: "PRESSURE TROUBLE" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "HA", description: "HOT AXLE" }
    ]
  },

  // 11. CARRIAGE AND WAGON (INDIRECT)
  ICW: {
    description: "CARRIAGE AND WAGON (INDIRECT)",
    group: "MECHANICAL",
    subcategories: [
      { code: "ACO", description: "ANGLE COCK OPERATED" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "HP", description: "CONTINUITY PIPE DISCONNECTED" },
      { code: "PAR", description: "PARTING" },
      { code: "PT", description: "PRESSURE TROUBLE" },
      { code: "OTH", description: "OTHERS" },
      { code: "HA", description: "HOT AXLE" }
    ]
  },

  // 12. OHE/GRID FAILURE
  OHE: {
    description: "OHE/GRID FAILURE",
    group: "ELECTRICAL",
    subcategories: [
      { code: "ATF", description: "AT FAILURE" },
      { code: "BBOHE", description: "OHE BLOCK BURST" },
      { code: "CT", description: "OHE THEFT" },
      { code: "GRID", description: "OHE GRID FAILURE" },
      { code: "OHE", description: "OHE FAILURE" },
      { code: "OTH", description: "OTHERS" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "WEA", description: "WEATHER" }
    ]
  },

  // 13. ENGINEERING
  ENG: {
    description: "ENGINEERING",
    group: "ENGINEERING",
    subcategories: [
      { code: "BB", description: "BLOCK BURSTING" },
      { code: "BF", description: "BANNER FLAG" },
      { code: "CD", description: "EXTRA CAUTION DEPLOYED" },
      { code: "GM", description: "GATEMAN" },
      { code: "GTF", description: "GLUED JOINT FAILURE" },
      { code: "NPM", description: "NIGHT PATROL MAN NOT TURNED UP" },
      { code: "OTH", description: "OTHERS" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "RF", description: "RAIL FAILURE" },
      { code: "WF", description: "WELD FAILURE" },
      { code: "WL", description: "WATER LOGGING" },
      { code: "TRB", description: "TONGUE RAIL BROKEN" }
    ]
  },

  // 14. SIGNAL AND TELECOM
  ST: {
    description: "SIGNAL AND TELECOM",
    group: "SIGNAL AND TELE",
    subcategories: [
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "SF", description: "SIGNAL FAILURE(OTHER THAN ADV STARTER AND HOME)" },
      { code: "HSF", description: "HOME SIGNAL FAILURE" },
      { code: "ADF", description: "ADVANCE STARTER FAILURE" },
      { code: "AUF", description: "AUTOMATIC SIGNAL FAILURE" },
      { code: "GF", description: "GATE SIGNAL FAILURE" },
      { code: "IBSF", description: "INTERMEDIATE BLOCK SIGNAL FAILURE" },
      { code: "BIF", description: "BLOCK INSTRUMENT FAILURE" },
      { code: "BACF", description: "BLOCK AXLE COUNTER FAILURE" },
      { code: "TCF", description: "TRACK CIRCUIT FAILURE" },
      { code: "PTF", description: "POINT FAILURE" },
      { code: "RRIPIF", description: "RRI/PI FAILURE" },
      { code: "SSIF", description: "SOLID STATE INTERLOCKING FAILURE" },
      { code: "SPEF", description: "SIGNAL POWER EQUIPMENT FAILURE" },
      { code: "CCF", description: "CONTROL COMMUNICATION FAILURE" },
      { code: "BB", description: "BLOCK BURST" },
      { code: "CT", description: "CABLE THEFT" },
      { code: "ET", description: "EQUIPMENT DAMAGE/THEFT BY OUTSIDER" },
      { code: "WEA", description: "WEATHER" },
      { code: "LIG", description: "LIGHTENING" },
      { code: "OTH", description: "OTHERS" }
    ]
  },

  // 15. ELECTRIC DEFECT
  ELEC: {
    description: "ELECTRIC DEFECT",
    group: "ELECTRICAL",
    subcategories: [
      { code: "DAC", description: "AC PLANT DEFECT OR NOT WORKING" },
      { code: "DTL", description: "TRAIN LIGHTING PROBLEM" },
      { code: "ENG.EL", description: "ENGG.ELEC" },
      { code: "OTH", description: "OTHERS" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "UDMU", description: "UNIT DEFECT OF EMU" }
    ]
  },

  // 16. BAD WEATHER
  WEA: {
    description: "BAD WEATHER",
    group: "UNUSUAL",
    subcategories: [
      { code: "CY", description: "CYCLONE" },
      { code: "FL", description: "FLOOD" },
      { code: "FOG", description: "FOG" },
      { code: "LD", description: "LANDSLIDE" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 17. RUN OVER
  RUNO: {
    description: "RUN OVER",
    group: "UNUSUAL",
    subcategories: [
      { code: "CRO", description: "CATTLE RUNOVER" },
      { code: "HRO", description: "HUMAN RUNOVER" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 18. CONSTRUCTION
  CNST: {
    description: "CONSTRUCTION",
    group: "BLOCKS",
    subcategories: [
      { code: "DFCCIL", description: "DEDICATED FREIGHT CORRIDOR CORPORATION OF INDIA LIMITED" },
      { code: "ELEC", description: "ELECTRICAL" },
      { code: "ENG", description: "ENGINEERING CNST" },
      { code: "IRCON", description: "CONSTRUCTION BY IRCON" },
      { code: "IRSDC", description: "CONSTRUCTION BY IRSDC" },
      { code: "K-RIDE", description: "CONSTRUCTION BY K-RIDE" },
      { code: "MRVC", description: "MUMBAI RAIL VIKAS CORPORATION" },
      { code: "OHE", description: "OVER HEAD" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "RITES", description: "CONSTRUCTION BY RITES" },
      { code: "RLDA", description: "RAIL LAND DEVELOPMENT AUTHORITY" },
      { code: "RVNL", description: "CONSTRUCTION BY RVNL" },
      { code: "ST", description: "SIGNAL CNST" }
    ]
  },

  // 19. TRAFFIC
  TFC: {
    description: "TRAFFIC",
    group: "OTHER",
    subcategories: [
      { code: "D", description: "PRECEDENCE" },
      { code: "E", description: "CROSSING" },
      { code: "FC", description: "FREIGHT CONVOY" },
      { code: "GM", description: "GATEMAN" },
      { code: "K", description: "WAITING FOR SIGNAL" },
      { code: "PF", description: "FOR PLATFORM" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "RGNG", description: "REGAINING" },
      { code: "SHNT", description: "SHUNTING" },
      { code: "TFC", description: "TRAFFIC" }
    ]
  },

  // 20. COMMERCIAL
  COM: {
    description: "COMMERCIAL",
    group: "UNUSUAL",
    subcategories: [
      { code: "CP", description: "CHART PASTING" },
      { code: "LD", description: "LOADING" },
      { code: "OTH", description: "OTHERS" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "RES", description: "RESERVATION" },
      { code: "TKT", description: "TICKETING" },
      { code: "ULD", description: "UNLOADING" }
    ]
  },

  // 21. OUT OF PATH
  PATH: {
    description: "OUT OF PATH",
    group: "OTHER",
    subcategories: [
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 22. LAW AND ORDER
  LO: {
    description: "LAW AND ORDER",
    group: "LAW AND ORDER",
    subcategories: [
      { code: "B", description: "BANDH" },
      { code: "LOP", description: "LAW AND ORDER PROBLEM" },
      { code: "RALLY", description: "RALLY" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "SEC", description: "SECURITY THREATS" }
    ]
  },

  // 23. LC GATE
  LC: {
    description: "LC GATE",
    group: "UNUSUAL",
    subcategories: [
      { code: "BR", description: "BOOM BROKEN" },
      { code: "RD", description: "HEAVY ROAD TRAFFIC" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "V DASH", description: "VECHILE DASHED" },
      { code: "VD", description: "VECHILE DISABLE" }
    ]
  },

  // 24. RAILWAY ELECTRIFICATION
  RE: {
    description: "RAILWAY ELECTRIFICATION",
    group: "ELECTRICAL",
    subcategories: [
      { code: "CT", description: "CABLE THEFT" },
      { code: "OHE", description: "OHE" },
      { code: "OTH", description: "OTHERS" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "ST", description: "SIGNAL AND TELECOM" }
    ]
  },

  // 25. NON INTERLOCKING WORKING CONSTRUCTION
  CONNI: {
    description: "NON INTERLOCKING WORKING CONSTRUCTION",
    group: "NON INTERLOCK",
    subcategories: [
      { code: "PENG", description: "NON INETRLOCKING WORKING PLANNED ENGGN" },
      { code: "POHE", description: "NON INTERLOCKING WORKING PLANNED OHE" },
      { code: "PST", description: "NON INTERLOCKING WORKING PLANNED S AND T" },
      { code: "PTR", description: "NON INTERLOCKING WORKING PLANNED TRAFIC" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "UPENG", description: "NON INTERLOCKING WORKING UNPLANNED ENGGN" },
      { code: "UPOHE", description: "NON INTERLOCKING WORKING UNPLANNED OHE" },
      { code: "UPST", description: "NON INTERLOCKING WORKING UNPLANNED S AND T" },
      { code: "UPTR", description: "NON INTERLOCKING WORKING UNPLANNED TRAFFIC" }
    ]
  },

  // 26. NON INTERLOCKING WORKING PROJECT
  PRONI: {
    description: "NON INTERLOCKING WORKING PROJECT",
    group: "NON INTERLOCK",
    subcategories: [
      { code: "PENG", description: "NON INTERLOCKING WORKING PLANNED ENGGN" },
      { code: "POHE", description: "NON INTERLOCKING WORKING PLANNED OHE" },
      { code: "PST", description: "NON INTERLOCKING WORKING PLANNED S AND T" },
      { code: "PTR", description: "NON INTERLOCKING WORKING PLANNED TRAFFIC" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "UPENG", description: "NON INTERLOCKING WORKING UNPLANNED ENGGN" },
      { code: "UPOHE", description: "NON INTERLOCKING WORKING UNPLANNED OHE" },
      { code: "UPST", description: "NON INTERLOCKING WORKING UNPLANNED S AND T" },
      { code: "UPTR", description: "NON INTERLOCKING WORKING WORKING UNPLANNED TRAFFIC" }
    ]
  },

  // 27. NON INTERLOCKING WORKING OPEN LINE
  OPLNI: {
    description: "NON INTERLOCKING WORKING OPEN LINE",
    group: "NON INTERLOCK",
    subcategories: [
      { code: "PST", description: "PLANNED SIGNAL AND TELECOM" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" },
      { code: "PENG", description: "PLANNED ENGINEERING" },
      { code: "POHE", description: "PLANNED OHE" },
      { code: "PTR", description: "PLANNED TRAFFIC" },
      { code: "UPST", description: "UNPLANNED SIGNAL AND TELECOM" },
      { code: "UPENG", description: "UNPLANNED ENGINEERING" },
      { code: "UPOHE", description: "UNPLANNED OHE" },
      { code: "UPTR", description: "UNPLANNED TRAFFIC" }
    ]
  },

  // 28. PLANNED BLOCK OPEN LINE
  PBOL: {
    description: "PLANNED BLOCK OPEN LINE",
    group: "BLOCKS",
    subcategories: [
      { code: "PBELOL", description: "PLANNED BLOCK ELECTRICAL" },
      { code: "PBEOL", description: "PLANNED BLOCK ENGINEERING" },
      { code: "PBOHEO", description: "PLANNED BLOCK OHE" },
      { code: "PBSTOL", description: "PLANNED BLOCK S AND T" },
      { code: "PBTOL", description: "PLANNED BLOCK TRAFFIC" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },

  // 29. PLANNED BLOCK CONSTRUCTION
  PBC: {
    description: "PLANNED BLOCK CONSTRUCTION",
    group: "BLOCKS",
    subcategories: [
      { code: "PBEC", description: "PLANNED BLOCK ENGINEERING" },
      { code: "PBELC", description: "PLANNED BLOCK ELECTRICAL" },
      { code: "PBOHEC", description: "PLANNED BLOCK OHE" },
      { code: "PBSTC", description: "PLANNED BLOCK S AND T" },
      { code: "PBTC", description: "PLANNED BLOCK TRAFFIC" },
      { code: "REPER_N", description: "REPERCUSSION OF LINE NOT CLEAR FROM OTHER RAILWAY" },
      { code: "REPER_P", description: "REPERCUSSION OF PAST RUNNING DELAY" }
    ]
  },
  
  // 30. LINE NOT CLEAR
  LINENC: {
    description: "LINE NOT CLEAR",
    group: "OTHER",
    subcategories: [
      { code: "REPER_N", description: "LINE NOT CLEAR FROM OTHER RAILWAY" }
    ]
  }
};

export const SECTIONS = [
  "MAIN LINE",
  "CCR LINE",
  "CENTRAL",
  "BRP-SPR",
  "CG-SEC",
  "DH",
  "LKPR-NMKA",
  "BGB",
  "HNB",
  "GXD",
  "LGL",
  "RHA-BNJ",
  "SDAH-BNJ-RHA",
  "BNJ-STB",
  "STB-KNJ",
  "KNJ-AHT",
  "NH-BDC"
];


// Helper function to get list of main categories
export const getMainCategories = () => {
  return Object.keys(DETENTION_CATEGORIES).map(key => ({
    code: key,
    description: DETENTION_CATEGORIES[key].description,
    group: DETENTION_CATEGORIES[key].group
  }));
};

// Helper function to get subcategories for a specific main category
export const getSubCategories = (mainCategoryCode) => {
  return DETENTION_CATEGORIES[mainCategoryCode]?.subcategories || [];
};


// Ticket Statuses
export const TICKET_STATUSES = {
  OPEN: "open",
  FORWARDED: "forwarded",
  CLOSED: "closed",
  REJECTED: "rejected"
};

export const VALID_STATUSES = Object.values(TICKET_STATUSES);
