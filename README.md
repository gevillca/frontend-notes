# 📝 Notes Frontend (Digital Harbor Code Challenge)

Modern notes management application with user authentication, built with Angular 20 and NgRx Signals.

## 🚦 Quick Start

1. **Clone and install:**

   ```sh
   git clone https://github.com/gevillca/frontend-notes.git
   cd frontend-notes
   yarn install
   ```

2. **Setup configuration files:**

   ```sh
   # Copy sample database
   cp db/db.json.sample db/db.json

   # Copy sample environment
   cp src/environments/environment.development.sample.ts src/environments/environment.development.ts
   ```

   **Note:** Both `db.json` and `environment.development.ts` are gitignored to protect local configurations.

3. **Start backend and frontend:**

   ```sh
   # Terminal 1 - Backend API
   yarn api

   # Terminal 2 - Frontend
   ng serve
   ```

4. **Access:** `http://localhost:4200`

5. **Demo login:**
   - Email: `user@example.com`
   - Password: `user12345`

---

## 🛠️ Tech Stack

- **Angular 20** - Standalone components + Signals
- **NgRx Signals** - State management
- **PrimeNG** - UI components
- **Tailwind CSS** - Styling
- **Node.js Server** - Custom backend with JWT auth
- **ESLint + Prettier** - Code quality
- **Husky + Commitlint** (git hooks and commit message linting)

---

## ✨ Features

- ✅ CRUD operations for notes
- ✅ User authentication (JWT)
- ✅ Tag system and search
- ✅ Archive functionality
- ✅ Dark/Light theme
- ✅ Responsive design

## ⚡ Angular CLI Commands

You can also use the Angular CLI directly for common tasks:

- `ng serve` — Run the app in development mode
- `ng build` — Build the app for production
- `ng test` — Run unit tests
- `ng lint` — Run ESLint to check code quality
- `ng generate component|service|module ...` — Generate Angular code scaffolding

## 📁 Project Structure

```
src/
├── app/
│   ├── core/           # Guards, interceptors
│   ├── features/       # Auth, Notes (components, services, store)
│   └── shared/         # Reusable components, layouts, services
└── environments/
    ├── environment.ts                      # Production config
    ├── environment.development.ts          # Development config
    └── environment.development.sample.ts   # Development template

db/
├── server.js       # Custom Node.js API with JWT
├── db.json         # JSON database
└── db.json.sample  # Database template with demo data
```

## ⚙️ Configuration Files

**Environment files:**

- `environment.development.sample.ts` - Template for local development
- `environment.development.ts` - Your local config (not committed)
- `environment.ts` - Production configuration

**Database files:**

- `db.json.sample` - Template with demo users and notes
- `db.json` - Your local database (not committed)

**Why gitignored?** To prevent committing sensitive data or local configurations to the repository.

## 🔐 Backend API

**Custom Node.js server** with JWT authentication on `http://localhost:3000`

**Key endpoints:**

```
POST /auth/register    - Create user
POST /auth/login       - Get JWT token
GET  /notes            - Get user's notes
POST /notes            - Create note
GET  /tags             - Get all tags
```

**Demo users (from `db.json.sample`):**

- `user@example.com` / `user12345`
- `nataly@example.com` / `nataly12345`
- `carlos@example.com` / `carlos12345`

**Important:**

- Each user only sees their own notes (validated server-side)
- Copy `db.json.sample` to `db.json` before first run
- Modify `db.json.sample` to customize demo data

## 📦 Scripts

- `yarn start` - Start frontend (http://localhost:4200)
- `yarn api` - Start backend (http://localhost:3000)
- `yarn build` - Build for production
- `yarn lint` - Check code quality
- `yarn test` - Run unit tests

---

## 🏗️ Architecture

**Clean Architecture** with separation of concerns:

- **Core** - Guards, interceptors
- **Features** - Auth, Notes (NgRx Signals store)
- **Shared** - Reusable components, services

**Key patterns:**

- OnPush change detection (all components)
- Lazy loading routes
- JWT authentication with interceptors
