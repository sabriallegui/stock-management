# Quick Setup Guide

Follow these steps to get the stock management system running:

## Step 1: Setup PostgreSQL Database

### Option A: Using default postgres user (RECOMMENDED - EASIEST)

```bash
# Start PostgreSQL (if not running)
brew services start postgresql

# Create database (will use your Mac username by default)
createdb stock_management
```

Then edit `backend/.env` and change this line:
```
DATABASE_URL="postgresql://username:password@localhost:5432/stock_management?schema=public"
```

To this (replace `yourmacusername` with your actual Mac username):
```
DATABASE_URL="postgresql://yourmacusername@localhost:5432/stock_management?schema=public"
```

**To find your Mac username, run:** `whoami`

### Option B: Using postgres superuser

```bash
# Start PostgreSQL
brew services start postgresql

# Access PostgreSQL
psql postgres

# In PostgreSQL console, run these commands:
CREATE DATABASE stock_management;
CREATE USER stockuser WITH PASSWORD 'stockpass123';
GRANT ALL PRIVILEGES ON DATABASE stock_management TO stockuser;
\q
```

Then edit `backend/.env`:
```
DATABASE_URL="postgresql://stockuser:stockpass123@localhost:5432/stock_management?schema=public"
```

## Step 2: Setup Backend

```bash
cd backend

# Install dependencies (if not done)
npm install

# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Add sample data (admin user, sample gadgets)
npm run prisma:seed

# Start backend server
npm run dev
```

You should see: **🚀 Server running on port 5000**

## Step 3: Setup Frontend (Open NEW Terminal)

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

You should see: **Local: http://localhost:3000/**

## Step 4: Open Browser

Go to: **http://localhost:3000**

Login with:
- **Admin:** admin@stockmgmt.com / admin123
- **User:** user@stockmgmt.com / user123

---

## Troubleshooting

### "PostgreSQL not running"
```bash
brew services start postgresql
```

### "Database already exists" error
```bash
dropdb stock_management
createdb stock_management
```

### "Port 5000 already in use"
Edit `backend/.env` and change `PORT=5000` to `PORT=5001`

### "Cannot connect to database"
Make sure your DATABASE_URL in `.env` matches your PostgreSQL setup

---

## Your Current Status

You're at: **Step 1** - Need to set up the database URL in `.env` file
