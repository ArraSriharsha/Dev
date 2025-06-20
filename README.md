# ![logo](https://github.com/ArraSriharsha/Dev/blob/main/client/public/logo.svg)  Code Arena | Online Judge


A modern online coding platform that allows users to practice coding problems, submit solutions, and get real-time feedback.

![CodeArena](https://github.com/ArraSriharsha/Dev/blob/main/Home.png)

## 📽️ Demo Video

[Click here to watch the demo](https://www.loom.com/share/b0229c86986d4e2083c2d8c4efaca597)

## 📝 Description

Welcome to CodeArena, an Online Judge Platform, a comprehensive coding practice environment designed for developers of all skill levels. This platform combines the power of modern web technologies with advanced AI capabilities to provide an engaging and educational coding experience.

### What Makes This Platform Special?

- **Interactive Learning**: Practice coding problems with instant feedback and detailed explanations
- **Smart Code Analysis**: Get AI-powered suggestions and improvements for your solutions
- **Real-time Execution**: Test your code in a secure environment with support for multiple programming languages
- **Progress Tracking**: Monitor your improvement with detailed statistics and achievements

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library for building interactive user interfaces
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Material Tailwind** - Material Design components with Tailwind CSS
- **Monaco Editor** - VS Code's powerful code editor component
- **Framer Motion** - Production-ready motion library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **AWS S3** - Cloud storage for file management
- **Google AI** - AI-powered features
- **Nodemailer** - Email functionality
- **BullMQ** - Redis-based queue for job processing
- **Redis** - In-memory data store for queue management

## Blueprint of Logic
![Blueprint](https://github.com/ArraSriharsha/Dev/blob/main/Blueprint.png)


## ✨ Key Features

1. **User Authentication**
   - Secure JWT-based authentication
   - User registration and login
   - Password hashing with bcrypt

2. **Code Execution**
   - Real-time code compilation and execution
   - Support for multiple programming languages
   - Secure code execution environment
   - Distributed job processing with BullMQ
   - Automatic timeout handling for infinite loops

3. **Problem Management**
   - Create and manage coding problems
   - Test cases and validation
   - Problem difficulty levels

4. **File Storage**
   - AWS S3 integration for file storage
   - Secure file upload and retrieval
   - Efficient file management

5. **AI Integration**
   - Google AI-powered features
   - Intelligent code analysis
   - Automated feedback

6. **Queue Management**
   - Distributed job processing with BullMQ
   - Real-time job status tracking
   - Automatic retry mechanism for failed jobs
   - Job prioritization and scheduling
   - Efficient resource utilization

## 🔒 Security Features

- JWT-based authentication for secure user sessions
- Password hashing using bcrypt
- CORS protection
- Environment variable management
- Secure file upload handling

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- GCC,G++,Python3,Openjdk17 or later
- MongoDB
- Redis (for BullMQ)
- AWS S3 setup
- Google AI API credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/ArraSriharsha/Dev
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install compiler dependencies
cd ../compiler
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Server (.env)
PORT=your_port
CLIENT_URL=your_client_url
COMPILER_SERVICE_URL=your_compiler_url
MONGODB_URI =your_mondodb_uri
SECRET_KEY=your_jwt_secret_key 
GEMINI_API_KEY=your_api_key
EMAIL_USER=email_used_to_send_feedback
EMAIL_PASS=your_access_key
EMAIL=email_used_to_send_otp
PASS=your_access_key
AWS_ACCESS_KEY_ID=your_access_id
AWS_SECRET_ACCESS_KEY=your_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
COMPILER_API_KEY=your_gemini_api_key

# Client (.env)
VITE_API_URL=your_server_url

#Compiler (.env)
PORT=your_compiler_port
SERVER_URL=your_server_url
MONGODB_URI=your_mondodb_uri
REDIS_URL=your_redis_url
AWS_ACCESS_KEY_ID=your_access_id
AWS_SECRET_ACCESS_KEY=your_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

4. Start the development servers
```bash
# Start server
cd server
npm start

# Start compiler
cd ../compiler
npm start

# Start client
cd ../client
npm run dev
```

## 🌟 Benefits of Key Technologies

### JWT Authentication
- Stateless authentication
- Secure token-based sessions
- Reduced server load
- Cross-domain support

### AWS S3 Storage
- Scalable cloud storage
- High availability
- Cost-effective
- Secure file management
- CDN integration capability

### MongoDB
- Flexible schema design
- Horizontal scalability
- High performance
- Rich querying capabilities

### React + Vite
- Fast development experience
- Optimized build process
- Hot Module Replacement
- Modern development features

### BullMQ + Redis
- Distributed job processing
- Real-time job status updates
- Automatic retry mechanism
- Job prioritization
- Efficient resource utilization
- Scalable architecture
- Reliable job execution
- Built-in monitoring and metrics

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This project is licensed under the MIT License. See the [LICENSE](https://github.com/ArraSriharsha/Dev/tree/main/LICENSE) file for details.
