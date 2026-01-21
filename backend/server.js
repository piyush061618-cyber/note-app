// import express from 'express';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import authRoutes from './routes/auth.js';
// import noteRoutes from './routes/notes.js';

// dotenv.config();

// const PORT =process.env.PORT || 5000;

// const app =express();

// app.use(express.json());
// app.use("/api/users", authRoutes)
// app.use("/api/notes",noteRoutes);

// // app.get('/' ,(req ,res) =>{
// //     res.send("hello world");
// // });

// connectDB();

// app.listen(PORT ,() =>{
//     console.log(`server started at port ${PORT}`);
// });

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <--- Import this
import { connectDB } from './config/db.js'; // Corrected import path to assume db.js is in /config
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';


// Load environment variables (like PORT, MONGO_URI)
dotenv.config();

const PORT = process.env.PORT || 5000 || note-app-smoky-kappa.vercel.app;

const app = express();
app.use(cors({
    origin: ["https://note-app-smoky-kappa.vercel.app",
         "http://localhost:5173"
        ], // Allow Vercel & Localhost
    credentials: true // Important if you use cookies or sessions
}));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", authRoutes);
app.use("/api/notes", noteRoutes);

// --- Server & DB Connection Setup ---

const startServer = async () => {
    try {
        // 1. Await the database connection to ensure readiness
        await connectDB();

        // 2. Start the Express server
        app.listen(PORT, () => {
            console.log(`✅ Server is now running on port ${PORT}`);
        });

    } catch (error) {
        console.error("FATAL ERROR: Server startup failed.", error);
        // Exit process with failure code
        process.exit(1);
    }
};

startServer();

// --- Global Error Handling for Robustness ---
// Catch unhandled promise rejections (e.g., in utility functions)
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
    console.error('Reason:', reason);
    // Exit process with failure code
    process.exit(1);
});

// Catch synchronous exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...');
    console.error('Error:', err);
    // Exit process with failure code
    process.exit(1);
});
