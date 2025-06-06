# ![logo](https://raw.githubusercontent.com/ArraSriharsha/Dev/main/client/public/logo.svg)  Code Arena | Online Judge


A modern online coding platform that allows users to practice coding problems, submit solutions, and get real-time feedback.

![CodeArena](https://raw.githubusercontent.com/ArraSriharsha/Dev/main/Home.png)

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

## Blueprint of Logic
![Blueprint](https://raw.githubusercontent.com/ArraSriharsha/Dev/main/Blueprint.png)


## ✨ Key Features

1. **User Authentication**
   - Secure JWT-based authentication
   - User registration and login
   - Password hashing with bcrypt

2. **Code Execution**
   - Real-time code compilation and execution
   - Support for multiple programming languages
   - Secure code execution environment

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

## 🔒 Security Features

- JWT-based authentication for secure user sessions
- Password hashing using bcrypt
- CORS protection
- Environment variable management
- Secure file upload handling

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ArraSriharsha/Dev/tree/main/LICENSE) file for details.

## 👥 Author

Harsha 
