# Complete Setup Guide for Stock Management System

This guide will help you set up and run the Stock Management System on a new machine after cloning from GitHub.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (version 14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **npm** (comes with Node.js)

## Step 1: Clone the Repository

```bash
git clone https://github.com/sabriallegui/stock-management.git
cd stock-management
```

## Step 2: Install PostgreSQL (if not already installed)

### macOS (using Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

## Step 3: Create the Database

### Option A: Using your system user (macOS/Linux - Easiest)

```bash
# Check your username
whoami

# Create the database
createdb stock_management
```

### Option B: Using PostgreSQL with custom user

```bash
# Connect to PostgreSQL
psql postgres

# In the PostgreSQL console, run:
CREATE DATABASE stock_management;
CREATE USER stockuser WITH PASSWORD 'stockpass123';
GRANT ALL PRIVILEGES ON DATABASE stock_management TO stockuser;
ALTER DATABASE stock_management OWNER TO stockuser;
\q
```

## Step 4: Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configure the .env file

Edit `backend/.env` and update the `DATABASE_URL`:

**If you used Option A (system user):**
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/stock_management?schema=public"
```
Replace `YOUR_USERNAME` with the output from `whoami` command.

**If you used Option B (custom user):**
```env
DATABASE_URL="postgresql://stockuser:stockpass123@localhost:5432/stock_management?schema=public"
```

**Full .env file should look like:**
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/stock_management?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

### Initialize the Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations (creates tables)
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

You should see:
```
✅ Created admin user: admin@stockmgmt.com
✅ Created regular user: user@stockmgmt.com
✅ Created 5 sample gadgets
🎉 Seed completed successfully!
```

### Start the Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📍 Health check: http://localhost:5000/health
```

**Keep this terminal running!**

## Step 5: Set Up the Frontend

Open a **NEW terminal window/tab** and run:

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file (optional - has default values)
cp .env.example .env
```

### Start the Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## Step 6: Access the Application

Open your browser and navigate to:

### **http://localhost:3000**

## Step 7: Login

Use the following credentials to access the system:

### Admin Account
- **Email:** `admin@stockmgmt.com`
- **Password:** `admin123`

### Regular User Account
- **Email:** `user@stockmgmt.com`
- **Password:** `user123`

## Quick Start Script (Alternative)

For convenience, you can use the provided startup script:

```bash
# From the project root directory
./start.sh
```

This will start both backend and frontend servers automatically.

## Verify Installation

1. **Backend Health Check:**
   - Open: http://localhost:5000/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   - Open: http://localhost:3000
   - Should show the login page

3. **Database:**
   ```bash
   # In a new terminal
   psql -d stock_management -c "SELECT * FROM users;"
   ```
   Should show 2 users (admin and regular user)

## Project Structure

```
stock-management/
├── backend/                 # Node.js + Express API
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── middleware/     # Authentication middleware
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Entry point
│   ├── .env                # Environment variables (create this)
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   ├── .env               # Environment variables (optional)
│   └── package.json
│
├── README.md              # Project overview
├── SETUP.md              # This file
└── start.sh              # Convenience startup script
```

## Development Workflow

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Stopping the Application

Press `Ctrl + C` in each terminal window.

### Resetting the Database

If you need to reset the database:

```bash
cd backend

# Drop and recreate the database
dropdb stock_management
createdb stock_management

# Run migrations and seed again
npm run prisma:migrate
npm run prisma:seed
```

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   brew services start postgresql@14
   
   # Linux
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. Verify your DATABASE_URL in `backend/.env` is correct

3. Test database connection:
   ```bash
   psql -d stock_management
   ```

### Issue: "Port 5000 already in use"

**Solution:**
1. Change the port in `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update `frontend/vite.config.ts` proxy target to match:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://localhost:5001',
       changeOrigin: true,
     },
   }
   ```

### Issue: "Port 3000 already in use"

**Solution:**
Kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or start on a different port
npm run dev -- --port 3001
```

### Issue: "PostCSS config error"

**Solution:**
The `postcss.config.js` should be renamed to `postcss.config.cjs` (already done in the repo).

### Issue: "Prisma Client not generated"

**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## API Endpoints

Once running, the following endpoints are available:

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `DELETE /api/users/:id` - Delete user

### Gadgets
- `GET /api/gadgets` - List all gadgets
- `POST /api/gadgets` - Create gadget (Admin)
- `PUT /api/gadgets/:id` - Update gadget (Admin)
- `DELETE /api/gadgets/:id` - Delete gadget (Admin)

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment (Admin)
- `PUT /api/assignments/:id/return` - Return gadget
- `DELETE /api/assignments/:id` - Delete assignment (Admin)

### Requests
- `GET /api/requests` - List requests
- `POST /api/requests` - Create request
- `PUT /api/requests/:id/approve` - Approve request (Admin)
- `PUT /api/requests/:id/reject` - Reject request (Admin)
- `DELETE /api/requests/:id` - Delete request

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/stock_management?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

For production deployment:

1. **Backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run build
   # Serve the 'dist' folder with a static server
   ```

3. Update environment variables:
   - Change `NODE_ENV` to `production`
   - Use strong `JWT_SECRET`
   - Use production database URL
   - Configure CORS properly

## Additional Commands

### Backend
```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Generate Prisma Client
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Need Help?

- Check the main [README.md](./README.md) for project overview
- Review [START-HERE.md](./START-HERE.md) for quick start guide
- Check the GitHub repository: https://github.com/sabriallegui/stock-management

## Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Database migrations completed
- [ ] Database seeded with sample data
- [ ] Backend server running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login with demo credentials

If all items are checked, you're ready to use the Stock Management System! 🎉
