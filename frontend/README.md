# Food Ordering System

A full-stack food ordering platform with separate dashboards for users, restaurants, and delivery personnel.

## Features

### ✅ New Features Implemented
#### 1. Restaurant Delivery Boy Management
- Restaurants can now view a list of all available delivery boys
- Added "Assign Delivery Boy" button for orders that are "Ready for Delivery"
- Modal interface to select and assign delivery boys to specific orders

#### 2. Updated Order Status Flow
- Added new status: `assigned` (when delivery boy is assigned by restaurant)
- Order flow: `placed` → `confirmed` → `preparing` → `ready` → `assigned` → `picked_up` → `on_the_way` → `delivered`

#### 3. Delivery Boy Workflow Changes
- Delivery boys no longer "accept" orders - they are assigned by restaurants
- Delivery boys "confirm pickup" when they arrive at the restaurant
- Updated dashboard text and buttons accordingly

#### 4. Real-time Status Updates
- Customers can see all status updates including "Delivery Assigned"
- Delivery boy information is displayed on order details
- Status colors and labels updated across all dashboards

#### 5. Database & API Updates
- Added 3 sample delivery boys to the seed data
- New API endpoints:
  - `GET /api/delivery/available-boys` - Get available delivery boys
  - `POST /api/delivery/assign/:orderId` - Assign delivery boy to order
  - `POST /api/delivery/pickup/:orderId` - Confirm order pickup

#### 6. Frontend Updates
- **Restaurant Dashboard**: New delivery assignment modal and workflow
- **Delivery Dashboard**: Updated to show assigned orders and confirm pickup
- **User Dashboard**: Real-time status updates with new status labels
- **API Services**: Added new delivery management functions

### 🚀 How It Works Now
**Restaurant Process:**
1. Mark order as "Ready for Delivery"
2. Click "Assign Delivery Boy"
3. Select from available delivery boys
4. Order status becomes "Delivery Assigned"

**Delivery Boy Process:**
1. See assigned orders in their dashboard
2. Click "Confirm Pickup" when arriving at restaurant
3. Update status to "On the Way" and "Delivered" as they progress

**Customer Experience:**
1. See real-time updates: "Delivery Assigned" → "Order Picked Up" → "On the Way" → "Delivered"
2. Know exactly when their order is with a delivery person

---


### User Interface
The frontend is built with React (a modern JavaScript library for building user interfaces), providing a complete UI with pages for home, login, registration, restaurant listings, menus, cart, dashboards for users/restaurants/delivery, etc.

### REST API Backend
Implemented with Express.js, providing a full REST API.

### Database Integration
Uses MongoDB with Mongoose for data persistence.

### API Endpoints
The system has 22+ API endpoints across multiple routes:

- **Auth routes (3 endpoints)**: register, login, get current user
- **Menu routes (4 endpoints)**: get menu by restaurant, add/update/delete menu items
- **Order routes (6 endpoints)**: create order, get user/restaurant orders, get order by ID, update status, cancel order
- **Restaurant routes (4 endpoints)**: get all restaurants, get my restaurant, get by ID, update restaurant
- **Delivery routes (5 endpoints)**: get available orders, accept order, get my deliveries, update status, toggle availability

### CRUD Operations
Fully implemented for all entities:

- **Users**: Create (register), Read (login/get profile), Update (profile updates)
- **Restaurants**: Create, Read, Update
- **Menu Items**: Create, Read, Update, Delete
- **Orders**: Create, Read, Update (status), Delete (cancel)
- **Delivery assignments**: Create, Read, Update

### Error Handling
Includes comprehensive error handling with:

- Try-catch blocks in controllers
- Middleware for authentication and authorization
- Global error handler in the main server file
- Proper HTTP status codes and error messages

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/zadafiyaharsh2-ctrl/foodorderingsyatem.git
cd foodorderingsyatem
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
foodordering/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    ├── index.html
    └── package.json
```
