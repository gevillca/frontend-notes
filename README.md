# 📝 Notes Frontend (Digital Harbor Code Challenge)

![Angular](https://img.shields.io/badge/Angular-20-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20-purple?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-brightgreen?style=flat-square)

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

## ✨ Funcionalidades y Cumplimiento de Requerimientos

### ✅ Requerimientos Funcionales Implementados

| #   | Requerimiento                                           | Estado             | Implementación                            |
| --- | ------------------------------------------------------- | ------------------ | ----------------------------------------- |
| 1   | Los usuarios pueden crear cuenta (SignUp)               | ✅ Completo        | Página de registro con validación         |
| 2   | Los usuarios pueden iniciar sesión (Login)              | ✅ Completo        | Autenticación JWT con refresh token       |
| 3   | Los usuarios pueden crear, ver, editar y eliminar notas | ✅ Completo        | Operaciones CRUD completas                |
| 4   | Los usuarios pueden navegar por todas sus notas         | ✅ Completo        | Vista de lista con paginación             |
| 5   | Los usuarios pueden filtrar notas por etiquetas         | ✅ Completo        | Sistema de filtrado por tags              |
| 6   | Los usuarios pueden buscar notas por título             | ✅ Completo        | Búsqueda en tiempo real                   |
| 7   | Edición colaborativa en tiempo real                     | ❌ No implementado | _Requeriría integración WebSocket_        |
| 8   | Buscar notas por título, etiquetas o contenido          | ✅ Completo        | Búsqueda avanzada con múltiples criterios |
| 9   | Los usuarios pueden archivar notas                      | ✅ Completo        | Funcionalidad de archivar/desarchivar     |
| 10  | Los usuarios pueden desarchivar notas                   | ✅ Completo        | Restaurar desde sección de archivados     |
| 11  | Recordar estado de filtros y búsquedas entre sesiones   | ✅ Completo        | Persistencia de estado con localStorage   |

### 📊 Resumen de Cumplimiento

- **Implementados:** 10 de 11 requerimientos (90.9%)
- **No Implementado:** Edición colaborativa en tiempo real (requerimiento #7)

### 💡 Por qué no se implementó la Edición Colaborativa

El requerimiento #7 (edición colaborativa en tiempo real) no fue implementado debido a:

1. **Complejidad Técnica:** Requiere infraestructura WebSocket/SignalR para sincronización en tiempo real
2. **Requerimientos de Backend:** Necesitaría cambios significativos en el backend (resolución de conflictos, operational transforms)
3. **Restricciones de Tiempo:** La implementación requeriría ciclos adicionales de desarrollo
4. **Priorización de Scope:** Se priorizaron las funcionalidades CRUD core y experiencia de usuario

**Nota:** La arquitectura está preparada para esta funcionalidad a través de:

- Manejo de estado reactivo basado en Signals
- Abstracción de capa de servicios
- Arquitectura basada en componentes

Agregar servicios WebSocket y lógica de resolución de conflictos habilitaría esta funcionalidad en futuras iteraciones.

### 🎯 Funcionalidades Adicionales Implementadas

Más allá de los requerimientos, se agregaron las siguientes características:

- ✅ **Tema Claro/Oscuro** - Persistencia de preferencias del usuario
- ✅ **Diseño Responsive** - Enfoque mobile-first con layouts adaptativos
- ✅ **Editor de texto enriquecido** - Experiencia de edición mejorada
- ✅ **Estados de carga** - Mejoras de UX con indicadores de carga
- ✅ **Manejo de errores** - Mensajes de error y validación comprehensivos
- ✅ **Sistema de avatares** - Perfil de usuario con visualización de avatar
- ✅ **Diálogos de confirmación** - Prevenir eliminaciones accidentales
- ✅ **Notificaciones toast** - Feedback al usuario para todas las acciones

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

---

## 🧪 Testing

**Test Coverage:** 73 unit tests implemented and passing

**Running Tests:**

```sh
# Run tests in watch mode
yarn test

# Run tests once (headless)
npm test -- --browsers=ChromeHeadless --watch=false
```

**Test Strategy:**

- ✅ All services covered
- ✅ Critical component flows tested
- ✅ Guards and interceptors validated
- ✅ HTTP requests mocked with HttpTestingController
- ✅ Authentication flows verified

**Key Testing Practices:**

- Standalone component testing configuration
- Proper provider setup for each test
- Mock services for isolated testing
- Environment-based URL configuration in tests

---

## 🔧 Troubleshooting

### Cannot connect to backend

- ✅ Verify backend is running: `yarn api`
- ✅ Check port 3000 is available
- ✅ Verify `API_URL` in `environment.development.ts` is `http://localhost:3000`

### Database not found

- ✅ Copy the sample: `cp db/db.json.sample db/db.json`
- ✅ Restart the backend: `yarn api`

### Build errors

- ✅ Delete `node_modules` and reinstall: `rm -rf node_modules && yarn install`
- ✅ Clear Angular cache: `rm -rf .angular`
- ✅ Verify Node.js version: `node -v` (should be 18.x or higher)

---
