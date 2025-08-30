import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { USER_ROLES, VALID_ROLES } from '../constant/userMessage.js';
import { User } from '../models/user.model.js';
import { Ticket } from '../models/ticket.model.js';

// Sample data templates
const departments = ["Finance", "IT"];  // From Ticket model enum
const categories = ["Safety", "Non-Safety", "Asset-Failure"];  // From Ticket model enum
const statuses = ["open", "forwarded", "closed", "rejected"];  // From Ticket model enum

// Function to generate dummy users
const generateDummyUsers = async (count = 20) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const role = faker.helpers.arrayElement(VALID_ROLES);
    const isAdmin = role === USER_ROLES.ADMIN ? true : false;
    const isSIC = role === USER_ROLES.SIC ? true : false;
    const password = "SecurePassword123";  // Default password for all users
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      name: faker.person.firstName(),
      email: faker.internet.email().toLowerCase(),
      department: faker.helpers.arrayElement(departments),
      password: hashedPassword,
      role,
      isAdmin,
      isSIC
    });
  }
  return users;
};

// Function to generate dummy tickets
const generateDummyTickets = (users, count = 50) => {
  const tickets = [];
  for (let i = 0; i < count; i++) {
    const randomUser = faker.helpers.arrayElement(users.filter(u => u.role === USER_ROLES.END_USER));  // End users create tickets
    const randomSIC = faker.helpers.arrayElement(users.filter(u => u.isSIC));  // SIC for assignment

    tickets.push({
      category: faker.helpers.arrayElement(categories),
      complaintDescription: faker.lorem.sentences({ min: 1, max: 3 }),
      department: faker.helpers.arrayElement(departments),
      employeeName: `${randomUser.name} ${randomUser.surname}`,
      employeeEmail: randomUser.email,
      location: {
        building: faker.location.street(),
        floor: faker.helpers.arrayElement(["Ground Floor", "1st Floor", "2nd Floor"]),
        room: `Room ${faker.number.int({ min: 100, max: 999 })}`
      },
      status: faker.helpers.arrayElement(statuses),
      sicAssigned: `${randomSIC.name} ${randomSIC.surname}`,  // String as per your model
      sicAssignedDepartment: randomSIC.department,
      sicEmail: randomSIC.email,  // Assuming this is for reference
      messageBySIC: faker.datatype.boolean() ? faker.lorem.sentence() : null
    });
  }
  return tickets;
};

// Main seeder function
export const seedDatabase = async () => {
  try {
    console.log(' Starting database seeding...');

    // Optional: Clear existing data (comment out in production)
    if (process.env.NODE_ENV !== 'production') {
      await User.deleteMany({});
      await Ticket.deleteMany({});
      console.log('Cleared existing data');
    }

    // Generate and insert users
    const dummyUsers = await generateDummyUsers(20);
    const insertedUsers = await User.insertMany(dummyUsers);
    console.log(`Inserted ${insertedUsers.length} dummy users`);

    // Generate and insert tickets (linked to users)
    const dummyTickets = generateDummyTickets(insertedUsers, 50);
    const insertedTickets = await Ticket.insertMany(dummyTickets);
    console.log(`Inserted ${insertedTickets.length} dummy tickets`);

    console.log(' Seeding completed successfully!');
    return { usersInserted: insertedUsers.length, ticketsInserted: insertedTickets.length };

  } catch (error) {
    console.error(' Error during seeding:', error);
    throw error;
  }
};

