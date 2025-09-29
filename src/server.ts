import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
   try {
     await mongoose.connect("mongodb+srv://library-Management:6JX3iBYpUatStV2o@cluster0.dyugevw.mongodb.net/Role_BaseLogin_system?retryWrites=true&w=majority&appName=Cluster0");
     console.log("DB connected!");
     
     server = app.listen(5000, () => {
        console.log('Server is listening to port 5000');
     });
     
   } catch (error) {
    console.error("Server startup failed:", error);
   }
};

startServer();

// Handle SIGTERM signal: graceful shutdown when process terminated externally
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1); 
        });
    }

    process.exit(1); 
});

// Handle SIGINT signal: shutdown on Ctrl+C from terminal interrupt
process.on("SIGINT", () => {
    console.log("SIGINT signal received... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1); 
        });
    }

    process.exit(1); 
});

// Handle unhandled promise rejections: catch async errors globally
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1); 
        });
    }

    process.exit(1); 
});

// Handle uncaught exceptions: catch synchronous errors globally
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1); 
        });
    }

    process.exit(1); 
});
