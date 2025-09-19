# Superhero Database

A full-stack application for managing superhero information with images, built with NestJS backend and React frontend.

## Features

- ✅ Create, read, update, and delete superheroes
- ✅ Image management via URL links
- ✅ Search functionality
- ✅ Pagination
- ✅ Responsive design
- ✅ TypeScript support

## Tech Stack

### Backend

- **NestJS** - Framework
- **TypeORM** - ORM
- **PostgreSQL** - Database
- **Zod** - Validation
- **Joi** - Environment validation

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **React Router** - Navigation
- **Tailwind CSS** - Styling

## Prerequisites

- Node.js v16+
- PostgreSQL 12+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Dweller1/SuperheroDB.git
```

## Backend Setup

### 2. Switch to backend and install dependencies

```bash
cd backend
npm i
```

### 3. Create the database in postgresql

```bash
Create PostgreSQL database

Make sure PostgreSQL is running and create a database (e.g. superheroes).
```

### 4. Configure environment

Create a .env file in backend/:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=superheroes
PORT=3000
```

### 5. Start backend

```bash
npm run start
# Backend will run at http://localhost:3000
```

## Frontend setup

### 6. Switch to frontend and install dependencies

```bash
cd frontend
npm i
```

### 7. Start frontend

```bash
npm run dev
```
