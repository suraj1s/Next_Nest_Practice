import http from 'http';
import SocketService from './services/socket';

// as mentiond in typeorm docs
import "reflect-metadata"

async function startServer() {

    const socketService = new SocketService();
    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT , () => console.log(`Server is running on port ${PORT}`));

    socketService.initListeners();

    
    }

startServer();