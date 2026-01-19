import xlsx from "xlsx";
import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";
import { USER_ROLES } from "../constant/userMessage.js";

/* -------------------- Load Excel -------------------- */

const workbook = xlsx.readFile(
  "C:/Users/anish/OneDrive/Documents/projects/ticket-management-system/docs/UNUSUAL REPORT.xlsx",
);
const sheetName = workbook.SheetNames[1];
const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
  defval: null,
});

/* -------------------- User Cache -------------------- */

const userCache = new Map();

/* -------------------- Create or Get User -------------------- */

// const getOrCreateUser = async ({ name, department, userID, role, scale }) => {
//   if (userCache.has(userID)) {
//     return userCache.get(userID);
//   }

//   const user = await User.create({
//     name,
//     department,
//     userID,
//     password: "SecurePassword123", // hashed by pre-save hook
//     role,
//     isSrScale: scale === true,
//     isJrScale: scale === true,
//     isSrDME: scale === false,
//   });

//   userCache.set(userID, user);
//   return user;
// };

// /* -------------------- Main Seeder -------------------- */

export const seedDatabaseFromExcel = async () => {
  try {
    console.log("Starting Excel-based seeding...");

    if (process.env.NODE_ENV !== "development") {
      await User.deleteMany({});
      await Ticket.deleteMany({});
      console.log("Existing data cleared");
    }

    const tickets = [];

    for (const row of rows) {
      /* ---------- Employee (Ticket Creator) ---------- */

      const employee = await getOrCreateUser({
        name: row["Employee Name"],
        department: row["Department"],
        userID: row["Employee ID"],
        role: USER_ROLES.END_USER,
      });

      /* ---------- Assigned Officer ---------- */

      const officer = await getOrCreateUser({
        name: row["Assigned Officer"],
        department: row["Department"],
        userID: row["Assigned Officer ID"],
        role: row["Assigned Officer Role"],
        scale: row["Assigned Officer Scale"], // SR / JR / DME
      });

      /* ---------- Ticket ---------- */

      tickets.push({
        category: row["CATEGORY"],
        subCategory: row["Sub Category"],
        complaintDescription: row["Complaint Description"],
        train_NO: row["Train No"],
        department: row["Department"],
        employeeName: employee.name,
        employeeID: employee.userID,
        assignedUser: officer.name,
        section: row["Section"],
        status: row["Status"] || "open",
        message: row["Initial Message"],
        replies: [],
      });
    }

    const insertedTickets = await Ticket.insertMany(tickets);

    console.log(`Users inserted: ${userCache.size}`);
    console.log(`Tickets inserted: ${insertedTickets.length}`);
    console.log("Excel seeding completed successfully!");

    return {
      usersInserted: userCache.size,
      ticketsInserted: insertedTickets.length,
    };
  } catch (error) {
    console.error("Excel seeding failed:", error);
    throw error;
  }
};
