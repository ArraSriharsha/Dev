import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import auth from './routes/auth.js';
import DBConnection from './database/db.js';


dotenv.config();
DBConnection();

const app = express(); // creates an express application

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', auth); 

// Basic route
// app.get('/', (req, res) => {
//     res.send('Welcome to the API')
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`); // ("runing on port" + process.env.PORT)
});
