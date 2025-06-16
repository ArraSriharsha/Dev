# Code Arena - HLD Document 

## 1. System Overview

Code Arena is a competitive programming platform that provides a secure and efficient environment for users to practice coding problems, participate in contests, and improve their programming skills with AI-powered assistance.

### 1.1 Key Features
- Secure code execution using Docker containers
- Real-time job queue system with BullMQ
- AI-powered code review and hints
- Interactive code editor with syntax highlighting
- Problem management system
- User authentication and authorization
- Real-time submission status updates

## 2. System Architecture

### 2.1 Frontend Architecture
- **Technology Stack**: React.js with Vite
- **Key Components**:
  - Navbar: Navigation and user authentication
  - Home: Landing page with features,info and feedback section
  - Problems: List of coding problems
  - ProblemDetails: Individual problem view with editor and submissions for respective problem
  - Compiler: Standalone code editor
  - Profile: User profile and statistics

### 2.2 Backend Architecture
- **Technology Stack**: Node.js with Express
- **Key Services**:
  - Authentication Service
  - Problem Management Service
  - Code Execution Service
  - Queue Management Service
  - AI Integration Service
  - Contest Management Service

### 2.3 Database Schema Overview

#### User Schema
```javascript
{
  _id: ObjectId,
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String (hashed),
  role: String,
  submissions: [ObjectId],
  createdAt: Date
}
```

#### Problem Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: String,
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: String
}
```

#### Submission Schema
```javascript
{
  _id: ObjectId,
  problemId: ObjectId,
  userId: ObjectId,
  code: String,
  language: String,
  status: String,
  inputestcase: String
  outputtestcase: String
  createdAt: Date
}
```

## 3. Component Details

### 3.1 Frontend Components

#### 3.1.1 Code Editor
- Monaco Editor integration
- Language selection
- Theme customization
- Real-time syntax highlighting
- Code execution controls
- Input/Output display
- AI review integration

#### 3.1.2 Problem Management
- Problem listing with filters
- Problem details view
- Test case display
- Submission history
- Problem statistics

### 3.2 Backend Services

#### 3.2.1 Code Execution Service
- Docker container management
- Resource limiting
- Security sandboxing
- Multi-language support
- Input/output handling

#### 3.2.2 Queue Management Service
- BullMQ integration
- Job prioritization
- Real-time status updates
- Error handling
- Retry mechanisms

## 4. Data Flow

### 4.1 Code Submission Flow
- User submits code
- Code is validated
- Job is queued in BullMQ
- Docker container is created
- Code is executed
- Results are processed
- Status is updated in real-time
- AI review is generated (if requested)

## 5. Security Measures

### 5.1 Code Execution Security
- Docker container isolation
- Resource limits
- Network restrictions
- File system restrictions
- Time limits

### 5.2 Application Security
- JWT authentication
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## 6. Deployment Architecture

### 6.1 Production Environment
- Frontend: Vercel
- Backend: AWS
- Database: MongoDB Atlas
- Queue: Redis Cloud
- Docker: AWS Elastic Container Registry
