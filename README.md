# Ticket Management System


## Overview

The Ticket Management System is a application designed to complaint registration, tracking, and resolution in an organizational setting.

## Features

### Core Features
- **User Management**: Registration, login, profile updates, password reset (self and admin-initiated).
- **Ticket Management**: Create complaints with categories, departments, locations, and SIC assignment.
- **Role-Based Access Control (RBAC)**:
  - **End Users**: Create and view own tickets.
  - **SIC Users**: View department tickets, update status, add messages.
  - **Admins**: View all tickets, manage users, reset passwords.
- **Dashboards**: Role-specific summaries with ticket counts, breakdowns by status/category/department, and recent activity.
- **Authentication**: JWT-based with secure cookies (HTTP-only, secure in production).
- **Data Seeding**: Script to populate dummy data for testing.

## Prerequisites

- Node.js v14+ (with npm)
- MongoDB Atlas account (or local MongoDB)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AnisH521/Tasks-Management-App.git
cd ticket-management-system
```

### 2. Backend Setup
1. Navigate to backend directory (if structured as such):
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Create `.env` file in backend root:
   ```
   NODE_ENV=development
   DB_CONN=mongodb+srv://:@cluster.mongodb.net/ticketdb?retryWrites=true&w=majority
   ```

4. Seed the database (optional for testing):
   ```bash
   // uncomment await seedDatabase(); in server.js
   npm run dev
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api/v1`.

## Usage

### Key API Endpoints

#### Authentication
- **POST /api/v1/users/register**: Register new user (admin only)
- **POST /api/v1/users/login**: User login (returns JWT cookie)
- **POST /api/v1/users/logout**: Logout (clears cookie)

#### Users
- **GET /api/v1/users/getEndUsers**: Get all end users (admin only)
- **GET /api/v1/users/getSICUsers**: Get all SIC users (admin only)
- **GET /api/v1/users/:id**: Get user by ID (admin or self)
- **PATCH /api/v1/users/update/:userId**: Update user (admin only)
- **DELETE /api/v1/users/delete/:id**: Delete user (admin only)

#### Tickets
- **POST /api/v1/tickets/register**: Create new ticket
- **GET /api/v1/tickets/get-all**: Get current user's department's tickets
- **GET /api/v1/tickets/get/:ticketId**: Get tcket info by id
- **GET /api/v1/tickets/dashboard**: Get all tickets stats of a particular department
- **PUT /api/v1/tickets/forward/:ticketId**: forward ticket to particular dpt
- **PUT /api/v1/tickets/update/:ticketId**: update tcket status

## Contact

For questions, contact [anishnaskar99@gmail.com] or open an issue on GitHub.