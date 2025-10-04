## 🚦 Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/gevillca/frontend-notes.git
   cd frontend-notes
   ```

2. **Install Yarn (if you don't have it):**

   ```sh
   npm install -g yarn
   ```

3. **Install dependencies:**

   ```sh
   yarn install
   ```

4. **Start the development server:**

   ```sh
   yarn start
   ```

5. **(Optional) Start the mock API server:**

   ```sh
   yarn json-server --watch db/db.json --port 3000
   ```

6. The app will be running at `http://localhost:4200` and the API at `http://localhost:3000`.

# Notes Frontend (Digital Harbor Code Challenge)

## 🛠️ Tech Stack

- **Angular 20.2.0**
- **PrimeNG**
- **Tailwind CSS**
- **TypeScript**
- **JSON Server** (mock REST API for development)
- **ESLint + Prettier** (code quality and formatting)
- **Husky + Commitlint** (git hooks and commit message linting)

This project is a modern, scalable, and maintainable frontend application for managing personal notes, built as part of the Digital Harbor code challenge.

## 🚀 Features

- User authentication (login/register)
- Responsive and accessible UI
- Notification system for user actions
- Error pages (404, etc.)
- Theming with light/dark mode support

## ⚡ Angular CLI Commands

You can also use the Angular CLI directly for common tasks:

- `ng serve` — Run the app in development mode
- `ng build` — Build the app for production
- `ng test` — Run unit tests
- `ng lint` — Run ESLint to check code quality
- `ng generate component|service|module ...` — Generate Angular code scaffolding

All CLI commands are available via Yarn scripts as well (see below).

## 📁 Project Structure

- `src/app/features/` — Feature modules (auth, notes, error pages)
- `src/app/shared/` — Shared components, layouts, services, and utilities
- `src/app/shared/utils/validators.ts` — Centralized form validators and patterns
- `src/assets/` — Global styles and static assets
- `db/db.json` — JSON Server database for development/testing

## 🧑‍💻 How to Run

### Frontend

1. Install dependencies:
   ```sh
   yarn install
   ```
2. Start the development server:
   ```sh
   yarn start
   ```

### Mock API (JSON Server)

The project includes a JSON Server for development and testing:

1. Start the mock API server:

   ```sh
   yarn json-server --watch db/db.json --port 3000
   ```

2. The API will be available at: `http://localhost:3000`

## 📦 Scripts

- `yarn start` — Run the app in development mode
- `yarn build` — Build the app for production
- `yarn test` — Run unit tests
- `yarn lint` — Run ESLint to check code quality
- `yarn lint:fix` — Fix ESLint issues automatically
- `yarn format` — Format code with Prettier
- `yarn code:check` — Check both linting and formatting
- `yarn code:fix` — Fix both linting and formatting issues

## 📚 Notes

- This project is the frontend for a notes management system. It is designed for clarity, maintainability, and scalability, following clean code and SOLID principles.
- **JSON Server** provides a full fake REST API for development and testing without needing a real backend.
- API endpoints available at `http://localhost:3000` (users, notes, etc.)
- For production, replace JSON Server with your actual backend API.
