# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS backend application for a clinic management system. The application uses PostgreSQL as its database with Prisma as the ORM. The system manages users (admins, doctors, receptionists), patients, doctors, appointments, medical records, and related entities.

## Code Architecture and Structure

### Core Modules
- **Auth Module**: Handles authentication and authorization
- **Users Module**: Manages user creation and retrieval
- **Database Module**: Configures Prisma database connection
- **Common Module**: Shared utilities and configurations

### Key Entities
- **User**: Base user entity with roles (ADMIN, DOCTOR, RECEPTIONIST)
- **Doctor**: Extended profile for doctors with specialization and schedules
- **Patient**: Patient profiles with medical history
- **Appointment**: Scheduling system linking doctors and patients
- **Medical Records**: Clinical documentation for appointments
- **Examination**: Physical examination records
- **Treatment Plans**: Prescribed treatment plans
- **Progression Notes**: Ongoing patient progress documentation

### Data Flow
1. Users authenticate through the Auth module
2. User data is stored in PostgreSQL via Prisma ORM
3. Business logic is implemented in services
4. Controllers expose RESTful endpoints
5. Repositories handle database operations

## Common Development Commands

### Building and Running
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Testing
```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Format code with prettier
npm run format

# Run ESLint to check for issues
npm run lint
```

## Development Workflow

1. Create feature branches from main
2. Follow NestJS module structure (controller, service, module)
3. Use DTOs for data validation with class-validator
4. Use Prisma for database operations through repositories
5. Write unit tests for services
6. Update Prisma schema when adding new entities
7. Run migrations with `npx prisma migrate dev`

## Key Dependencies
- NestJS v11 - Framework
- Prisma v7 - ORM
- PostgreSQL - Database
- Argon2 - Password hashing
- Class Validator/Transformer - Input validation
- Jest - Testing framework

## Environment Setup
1. Copy `.env.example` to `.env` and configure database connection
2. Run `npx prisma generate` to generate Prisma client
3. Run `npx prisma migrate dev` to set up database schema
4. Seed database if needed with `npx prisma db seed`

## Testing Approach
- Unit tests for services using Jest
- End-to-end tests for API endpoints
- Test database should be configured separately
- Mock external services where appropriate