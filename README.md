# Cafe Employee Manager

A full-stack application for managing cafes and their employees. Built with Node.js/TypeScript for the backend and React for the frontend.

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose
- npm or yarn package manager

## Getting Started

### 1. Database Setup

Create a `.env` file in the root directory with the following environment variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cafe_db
POSTGRES_PORT=5432
PGADMIN_PORT=5050
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin123
```

Start the PostgreSQL database and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- pgAdmin on port 5050 (http://localhost:5050)

To access pgAdmin:
1. Navigate to http://localhost:5050
2. Login with the credentials set in your .env file
3. Add a new server in pgAdmin:
   - Name: cafe_db
   - Host: postgres
   - Port: 5432
   - Username: postgres
   - Password: postgres

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cafe_db
PORT=3000
```

4. Run database migrations:
```bash
npm run migrate
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at http://localhost:3000

### 3. Frontend Setup

1. Navigate to the cafe-employee-manager directory:
```bash
cd cafe-employee-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the cafe-employee-manager directory:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be available at http://localhost:5173

## API Endpoints

### Cafes
- `GET /cafes` - Get all cafes (Optional query param: location)
- `GET /cafes/:id` - Get cafe by ID
- `POST /cafe` - Create new cafe
- `PUT /cafe` - Update existing cafe
- `DELETE /cafe` - Delete cafe

### Employees
- `GET /employees` - Get all employees (Optional query param: cafe)
- `GET /employees/:id` - Get employee by ID
- `POST /employee` - Create new employee
- `PUT /employee` - Update existing employee
- `DELETE /employee` - Delete employee

## Technologies Used

- Backend:
  - Node.js with TypeScript
  - Express.js
  - TypeORM
  - PostgreSQL

- Frontend (cafe-employee-manager):
  - React with TypeScript
  - Material-UI
  - AG Grid
  - Axios

## Development

For local development:
1. Keep the Docker containers running
2. Run the backend in one terminal: `npm run dev` (in backend directory)
3. Run the frontend in another terminal: `npm run dev` (in cafe-employee-manager directory)

Remember to restart the backend server when making changes to the database schema or entity files.
