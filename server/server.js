import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';
import DBConnection from './database/db.js';
import problems from './routes/problems.js';
import upload from './routes/upload.js';
import profile from './routes/profile.js';
import run from './routes/run.js';
import submit from './routes/submit.js';
import submission from './routes/submission.js';
import users from './routes/users.js';
import aiReview from './routes/aiReview.js';
import homeproblem from './routes/homeproblem.js';
import message from './routes/message.js';
import forgotpassword from './routes/forgotpassword.js';
import review from './routes/review.js';
dotenv.config();
DBConnection();

const app = express(); // creates an express application

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = process.env.CLIENT_URL.split(',').map(url => url.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin is allowed
      callback(null, true);
    } else {
      // Origin is not allowed
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Routes
app.use('/', auth); 
app.use('/problems', problems);
app.use('/upload',upload);
app.use('/profile', profile);
app.use('/run', run);
app.use('/submit', submit);
app.use('/submissions', submission);
app.use('/users', users);
app.use('/ai-review', aiReview);
app.use('/homeproblem',homeproblem);
app.use('/message',message);
app.use('/password',forgotpassword);
app.use('/review',review);
// Basic route


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`); // ("runing on port" + process.env.PORT)
});
