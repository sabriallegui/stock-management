# Stock Management System

A full-stack web application for managing gadget inventory, tracking stock, and handling user requests. Built with modern technologies including Node.js, React, PostgreSQL, and Prisma.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **PostgreSQL** - Database
- **Prisma ORM** - Type-safe database access
- **JWT** - Authentication
- **TypeScript** - Type safety
- **Zod** - Input validation
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## 📋 Features

### Admin Features
- ✅ Create, update, and delete gadgets
- ✅ Manage gadget inventory (name, description, quantity, status, category)
- ✅ Create and manage users
- ✅ Assign gadgets to users
- ✅ View gadget assignment history
- ✅ Approve or reject user gadget requests
- ✅ View overall stock levels and statistics

### User Features
- ✅ Browse available gadgets
- ✅ Request gadgets with reason
- ✅ View currently assigned gadgets
- ✅ Return assigned gadgets
- ✅ Track request status (pending/approved/rejected)

## 🏗️ Project Structure

```
stock-management/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seeding script
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT authentication & role checks
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # Login & authentication
│   │   │   ├── user.routes.ts     # User management (admin only)
│   │   │   ├── gadget.routes.ts   # Gadget CRUD
│   │   │   ├── assignment.routes.ts # Gadget assignments
│   │   │   └── request.routes.ts   # Gadget requests
│   │   └── server.ts              # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.ts           # API client & type definitions
    │   ├── contexts/
    │   │   └── AuthContext.tsx    # Authentication context
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── admin/
    │   │   │   ├── Dashboard.tsx
    │   │   │   ├── GadgetsPage.tsx
    │   │   │   ├── UsersPage.tsx
    │   │   │   ├── AssignmentsPage.tsx
    │   │   │   └── RequestsPage.tsx
    │   │   └── user/
    │   │       ├── Dashboard.tsx
    │   │       ├── GadgetListPage.tsx
    │   │       ├── MyGadgetsPage.tsx
    │   │       └── MyRequestsPage.tsx
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ installed and running

### 1. Clone and Setup

```bash
cd stock-management
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and update DATABASE_URL
# Example: DATABASE_URL="postgresql://username:password@localhost:5432/stock_management?schema=public"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed

# Start the development server
npm run dev
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults to http://localhost:5000/api)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:3000**

## 🔑 Default Credentials

After seeding the database, you can login with:

**Admin Account:**
- Email: `admin@stockmgmt.com`
- Password: `admin123`

**User Account:**
- Email: `user@stockmgmt.com`
- Password: `user123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

### Gadgets
- `GET /api/gadgets` - Get all gadgets
- `GET /api/gadgets/:id` - Get gadget with history
- `POST /api/gadgets` - Create gadget (admin only)
- `PUT /api/gadgets/:id` - Update gadget (admin only)
- `DELETE /api/gadgets/:id` - Delete gadget (admin only)

### Assignments
- `GET /api/assignments` - Get assignments (all for admin, own for users)
- `POST /api/assignments` - Create assignment (admin only)
- `PUT /api/assignments/:id/return` - Mark gadget as returned
- `DELETE /api/assignments/:id` - Delete assignment (admin only)

### Requests
- `GET /api/requests` - Get requests (all for admin, own for users)
- `POST /api/requests` - Create gadget request
- `PUT /api/requests/:id/approve` - Approve request (admin only)
- `PUT /api/requests/:id/reject` - Reject request (admin only)
- `DELETE /api/requests/:id` - Delete request

## 🗄️ Database Schema

### User
- id, email (unique), name, password (hashed), role (ADMIN/USER)

### Gadget
- id, name, description, quantity, status (AVAILABLE/IN_USE/BROKEN/MAINTENANCE), category

### Assignment
- id, userId, gadgetId, startDate, endDate, returned, returnedAt, notes

### Request
- id, userId, gadgetId, status (PENDING/APPROVED/REJECTED), reason, quantity

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean Tailwind CSS components
- **Real-time Updates** - React Query auto-refetches data
- **Role-based Access** - Different dashboards for admins and users
- **Form Validation** - Input validation on both frontend and backend
- **Error Handling** - User-friendly error messages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based authorization middleware
- Protected API routes
- Input validation with Zod
- SQL injection protection via Prisma

## 📦 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Development Commands

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Notes

- The backend uses **port 5000** by default
- The frontend uses **port 3000** by default
- Make sure PostgreSQL is running before starting the backend
- The seed script creates sample gadgets and two users (admin and regular user)
- All dates are stored in ISO 8601 format
- API responses are in JSON format

## 🤝 Contributing

This is a production-ready template. Feel free to customize and extend as needed.

## 📄 License

MIT
