# Curvvtech Backend API

A Smart Device Management Platform Backend built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start - Local Development

### Prerequisites

Make sure you have these installed on your machine:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (Community Edition) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Postman** (for API testing) - [Download here](https://www.postman.com/downloads/)

### Installation & Setup

1. **Clone the repository**
git clone https://github.com/Astitva-Bhardwaj/curvvtech-backend.git
cd curvvtech-backend

2. **Install dependencies**
npm install

3. **Set up environment variables**
Copy the environment template
cp .env.example .env

Edit .env file with your settings (use any text editor)
notepad .env

**Update your `.env` file:**
PORT=3000
MONGODB_URI=mongodb://localhost:27017/curvvtech
JWT_SECRET=your-super-secure-jwt-secret-key-here-change-this
JWT_EXPIRES_IN=24h
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

4. **Start MongoDB**

Development mode (auto-restart on changes)
npm run dev
6. **Verify it's running**

Open your browser and go to:
- **Health Check**: http://localhost:3000/health
- **API Info**: http://localhost:3000/

You should see a JSON response confirming the server is running.

## 📋 API Endpoints

### Base URL
http://localhost:3000


### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login (returns JWT token)

### Device Management (Requires Authentication)
- `POST /devices` - Register new device
- `GET /devices` - List all devices
- `PATCH /devices/:id` - Update device
- `DELETE /devices/:id` - Delete device
- `POST /devices/:id/heartbeat` - Device heartbeat

### Analytics (Requires Authentication)
- `POST /devices/:id/logs` - Create device log
- `GET /devices/:id/logs` - Get device logs
- `GET /devices/:id/usage` - Get device usage data
