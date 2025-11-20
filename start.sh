#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Stock Management System...${NC}\n"

# Start backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started on http://localhost:5000${NC}"
echo "  Backend PID: $BACKEND_PID"

# Wait a moment for backend to initialize
sleep 3

# Start frontend
echo -e "\n${BLUE}Starting Frontend Server...${NC}"
cd ../frontend
npm run dev

# This will keep frontend running in foreground
# Press Ctrl+C to stop both servers
