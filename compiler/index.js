import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkRedisConnection from "./utils/redisCheck.js";
import code from "./routes/code.js";
import DBConnection from "./database/db.js";

dotenv.config();
DBConnection();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.SERVER_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Check Redis connection before starting the server
const startServer = async () => {
    try {
        await checkRedisConnection();
        
        app.use("/", code);
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();