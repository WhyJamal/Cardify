# Cadify

Cardify is a modern web-based project management application built
with **Next.js** and **Prisma ORM**. The system allows users to create
boards, manage tasks, organize workflows using drag-and-drop
functionality, and collaborate efficiently through an intuitive Kanban
interface.

## Purpose

The goal of Cardify is to simplify task and project management by
providing a fast, scalable, and developer-friendly platform. Users can
create boards, columns, and cards to visually track work progress from
planning to completion.

## Key Features

-   User authentication and authorization
-   Create and manage Kanban boards
-   Drag & drop task cards
-   Column-based workflow (To Do / In Progress / Done)
-   Real-time UI updates
-   Responsive modern UI
-   Database management via Prisma ORM
-   Server Actions & API routes (Next.js)
-   Type-safe backend using TypeScript

## Technologies

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Database ORM:** Prisma
-   **Database:** PostgreSQL / SQLite (configurable)
-   **Authentication:** NextAuth.js
-   **UI:** Tailwind CSS + shadcn/ui
-   **Drag & Drop:** React DnD
-   **Icons:** Lucide React

## Installation (Development)

Follow these steps to run the project locally.

### 1. Clone repository

``` bash
git clone https://github.com/WhyJamal/Cardify.git
cd Cardify
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file in root folder:

``` env
DATABASE_URL="file:./dev.db"

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

If using PostgreSQL:

``` env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/db_name"
```

## Prisma Setup

This project uses **Prisma ORM** for database management.

### Initialize Prisma (if needed)

``` bash
npx prisma init
```

### Run Prisma Migration

Create database tables:

``` bash
npx prisma migrate dev --name init
```

This command will:

-   Create database
-   Apply schema migrations
-   Generate Prisma Client automatically

### Generate Prisma Client (manual)

If schema changes:

``` bash
npx prisma generate
```

### Open Prisma Studio (Database GUI)

``` bash
npx prisma studio
```

Opens database editor in browser.

## Running the Project

Start development server:

``` bash
npm run dev
```

## Production Build

``` bash
npm run build
npm start
```

## Usage

-   Sign in or create an account
-   Create a new board
-   Add columns to represent workflow stages
-   Create task cards
-   Drag cards between columns
-   Track project progress visually

## License

This project is licensed under the [MIT License](LICENSE).

## Author & Contact

-   **Author:** WhyJamal
-   **Project:** Cardify
-   **Stack:** Next.js + Prisma
-   **Description:** Fullstack Kanban board built with modern web technologies for organizing projects, managing tasks,
    and collaborative workflows.
-   **Contact:** sayyodbee2006@gmail.com
