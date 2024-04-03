import http from 'http';
import SocketService from './services/socket-old';
import "reflect-metadata"; // Required for TypeORM
import { DataSource } from "typeorm";

// require('dotenv').config();

let AppDataSource: DataSource;
if (process.env.NODE_ENV === "development") {
  AppDataSource = require("./development").AppDataSource;
} else {
  AppDataSource = require("./production").AppDataSource;
}

async function startServer() {
  try {
    // Establish database connection
    await AppDataSource.initialize();
    console.log("Connected to database");

    const socketService = new SocketService();
    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

    socketService.initListeners();
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit with an error code
  }
}

startServer();


// async function handleSomeRequest(req, res) {
//     try {
//       const users = await AppDataSource.manager.find(User); // Example: Find all users
//       res.json(users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).send("Internal Server Error"); // Handle errors gracefully
//     }
//   }
  

// import http from 'http';
// import SocketService from './services/socket-old';

// // as mentiond in typeorm docs
// import "reflect-metadata"

// async function startServer() {

//     const socketService = new SocketService();
//     const httpServer = http.createServer();
//     const PORT = process.env.PORT || 8000;

//     socketService.io.attach(httpServer);

//     httpServer.listen(PORT , () => console.log(`Server is running on port ${PORT}`));

//     socketService.initListeners();

    
//     }

// startServer();