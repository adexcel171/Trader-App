Crypto Trading Platform

Overview

The Crypto Trading Platform is a Node.js-based web application designed to facilitate cryptocurrency trading. It allows users to manage cryptocurrencies, execute transactions (buy/sell), and track their transaction history in real-time using Socket.IO for live updates. The app is built with Express.js, MongoDB, and includes robust user authentication and authorization features.

Target Audience





Crypto Enthusiasts: Individuals interested in trading cryptocurrencies.



Developers: Backend developers learning about RESTful APIs, real-time updates with Socket.IO, and MongoDB integration.



Small Businesses: Platforms looking to integrate crypto trading functionalities.

Features





Cryptocurrency Management: Admins can create, update, and delete cryptocurrencies with real-time updates to all users.



Transaction Processing: Users can create buy/sell transactions, with admins able to update transaction statuses (pending, completed, etc.) within 24 hours.



User Management: Secure user registration, login, profile updates, and admin controls for managing users.



Real-Time Updates: Socket.IO ensures instant notifications for crypto and transaction changes.



Pagination and Filtering: Transaction history supports pagination, date range filtering, and search by crypto name or username.

Tech Stack





Backend: Node.js, Express.js



Database: MongoDB with Mongoose



Real-Time: Socket.IO



Authentication: JWT (JSON Web Tokens), bcrypt for password hashing



Error Handling: express-async-handler for async route handling

API Documentation

Crypto Controller (cryptoController.js)

Manages cryptocurrency data with real-time updates.

Endpoints





GET /api/cryptos





Description: Retrieve all cryptocurrencies.



Response: 200 with array of cryptocurrencies or 500 with error message.



Example:

[
  { "_id": "123", "name": "Bitcoin", "rate": 50000 },
  { "_id": "124", "name": "Ethereum", "rate": 3000 }
]



POST /api/cryptos





Description: Create a new cryptocurrency (admin only).



Body: { "name": "Bitcoin", "rate": 50000 }



Response: 201 with created crypto or 400 with error message.



Socket Event: Emits cryptoAdded with new crypto data.



PUT /api/cryptos/:id





Description: Update a cryptocurrency (admin only).



Body: { "name": "Bitcoin", "rate": 51000 }



Response: 200 with updated crypto or 404 if not found.



Socket Event: Emits cryptoUpdated with updated crypto data.



DELETE /api/cryptos/:id





Description: Delete a cryptocurrency (admin only).



Response: 200 with { "message": "Crypto removed" } or 404 if not found.



Socket Event: Emits cryptoDeleted with crypto ID.

Transaction Controller (transactionController.js)

Handles buy/sell transactions with admin controls and user transaction history.

Endpoints





POST /api/transactions





Description: Create a new transaction.



Body: { "cryptoName": "Bitcoin", "quantity": 0.5, "totalAmount": 25000, "type": "buy", "userName": "john_doe" }



Response: 201 with transaction data or 400 if invalid.



Socket Event: Emits transactionCreated with transaction data.



PUT /api/transactions/:id





Description: Update transaction status (admin only, within 24 hours).



Body: { "status": "completed" }



Response: 200 with updated transaction or 403 if not allowed.



Socket Event: Emits transactionUpdated with updated transaction data.



GET /api/transactions/user





Description: Get authenticated user’s transactions with pagination, filtering, and search.



Query Params: page, limit, startDate, endDate, search



Response: 200 with { transactions, totalPages, currentPage } or 401 if not authenticated.



Example:

{
  "transactions": [{ "_id": "123", "cryptoName": "Bitcoin", "quantity": 0.5, "totalAmount": 25000, "type": "buy", "status": "pending" }],
  "totalPages": 2,
  "currentPage": 1
}



GET /api/transactions





Description: Get all transactions (admin only) with pagination, filtering, and search.



Query Params: page, limit, startDate, endDate, search



Response: 200 with { transactions, totalPages, currentPage } or 403 if not admin.

User Controller (userController.js)

Manages user authentication and profiles.

Endpoints





POST /api/users





Description: Register a new user.



Body: { "username": "john_doe", "email": "john@example.com", "password": "secure123" }



Response: 201 with user data and JWT cookie or 400 if invalid.



POST /api/users/login





Description: Log in a user.



Body: { "email": "john@example.com", "password": "secure123" }



Response: 200 with user data and JWT cookie or 401 if invalid.



POST /api/users/logout





Description: Log out the current user.



Response: 200 with { "message": "Logged out successfully" }.



GET /api/users





Description: Get all users (admin only).



Response: 200 with array of users.



GET /api/users/profile





Description: Get current user’s profile.



Response: 200 with user data or 404 if not found.



PUT /api/users/profile





Description: Update current user’s profile.



Body: { "username": "john_doe", "email": "john@example.com", "password": "newpass123" }



Response: 200 with updated user data or 404 if not found.



DELETE /api/users/:id





Description: Delete a user (admin only, non-admins only).



Response: 200 with { "message": "User removed" } or 400 if admin user.



GET /api/users/:id





Description: Get user by ID (admin only).



Response: 200 with user data or 404 if not found.



PUT /api/users/:id





Description: Update user by ID (admin only).



Body: { "username": "john_doe", "email": "john@example.com", "isAdmin": true }



Response: 200 with updated user data or 404 if not found.

Setup Instructions





Clone the Repository:

git clone https://github.com/yourusername/crypto-trading-platform.git
cd crypto-trading-platform



Install Dependencies:

npm install



Environment Variables: Create a .env file with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000



Run the Application:

npm start



Access the API:





Base URL: http://localhost:5000



Use tools like Postman to test endpoints.

Taking Snapshots
