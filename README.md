# Multi-Tenant RBAC Authentication API

## Introduction

This project is an API built using TypeScript, Drizzle ORM, Fastify, and PostgreSQL, with the database hosted on Neon. It provides a comprehensive role-based access control (RBAC) system for managing multi-tenant applications. Key features include application creation, user registration, login, role management, and permission checks.

## Features

- Application creation
- User registration for an application
- User login
- Role creation
- Role assignment to users
- Permission checks with guards
- Multi-tenant support

## Installation

To get started with the project, follow these steps:

### Prerequisites

- Node.js v14+
- PostgreSQL database (hosted on Neon or local)
- A Neon account and database set up

### Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Anujdhanger/Multi-Tenant-Role-Based-Access-Control-Authentication-API.git
cd Multi-Tenant-Role-Based-Access-Control-Authentication-API
```
### Install Dependencies
```bash
pnpm install
```

### Usage
```bash
pnpm dev
```

### Configure the Database

#### Step 1: Set Up Neon Database

1. **Sign up for a Neon account**:


2. **Create a new PostgreSQL database**:


3. **Retrieve Connection Details**:
    It will look something like this:
     ```
     postgres://user:password@host:port/database
     ```

#### Step 2: Configure Environment Variables

1. **Create a `.env` file**:
   - In your project root directory, create a new file named `.env`.

2. **Add your database connection details**:
   

```
     DATABASE_URL=postgres://user:password@host:port/database
```

3. **Ensure the `.env` file is in your `.gitignore`**:
   - To prevent sensitive information from being exposed, ensure that your `.env` file is listed in your `.gitignore` file.


