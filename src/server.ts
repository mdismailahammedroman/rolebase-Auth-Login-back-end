import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/envVars";

let server: Server;

const startServer = async () => {
   try {
    
     await mongoose.connect(envVars.DB_URL);
     console.log("DB connected!");
     
     server = app.listen(envVars.PORT, () => {
        console.log(`Server is listening to port ${envVars.PORT}`);
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
