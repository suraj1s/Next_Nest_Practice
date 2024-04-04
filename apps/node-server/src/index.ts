import http from 'http';
import SocketService from './services/socket';
import "reflect-metadata"; // Required for TypeORM

// require('dotenv').config();

// let AppDataSource: DataSource;

// console.log(process.env.NODE_ENV , "process.env.NODE_ENV");
// if (process.env.NODE_ENV === "development") {
//   AppDataSource = require("./development").AppDataSource;
// } else {
//   AppDataSource = require("./production").AppDataSource;
// }

async function startServer() {
  try {
    // Establish database connection
    // await AppDataSource.initialize();
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