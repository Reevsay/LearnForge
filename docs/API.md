# API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Routes

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "student" // optional, defaults to "student"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt-token-here"
}
```

#### POST /auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt-token-here"
}
```

#### GET /auth/profile
Get current user profile (Protected).

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "student",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Learning Paths Routes

#### GET /learning-paths
Get all learning paths for the authenticated user (Protected).

**Response:**
```json
[
  {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn the basics of JavaScript",
    "content": "Detailed learning content...",
    "status": "active",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /learning-paths
Create a new learning path (Protected).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "content": "string" // optional, can be AI-generated
}
```

**Response:**
```json
{
  "id": 1,
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript",
  "content": "Detailed learning content...",
  "status": "active",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### AI Generation Routes

#### POST /ai/generate
Generate AI content for learning paths or quizzes.

**Request Body:**
```json
{
  "prompt": "string",
  "type": "learning-path" // or "quiz"
}
```

**Response:**
```json
{
  "candidates": [
    {
      "output": "Generated content here..."
    }
  ]
}
```

### Progress Tracking Routes

#### GET /progress/:pathId
Get progress for a specific learning path (Protected).

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "learningPathId": 1,
  "completedModules": 3,
  "totalModules": 10,
  "progressPercentage": 30,
  "lastAccessed": "2024-01-01T00:00:00.000Z"
}
```

#### POST /progress
Update progress for a learning path (Protected).

**Request Body:**
```json
{
  "learningPathId": 1,
  "completedModules": 4,
  "totalModules": 10
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "learningPathId": 1,
  "completedModules": 4,
  "totalModules": 10,
  "progressPercentage": 40,
  "lastAccessed": "2024-01-01T00:00:00.000Z"
}
```

### Quiz Routes

#### GET /quiz/:id
Get a specific quiz by ID.

**Response:**
```json
{
  "id": 1,
  "title": "JavaScript Quiz",
  "topic": "JavaScript Basics",
  "questions": [
    {
      "question": "What is JavaScript?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ],
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /quiz
Create a new quiz (Protected).

**Request Body:**
```json
{
  "title": "string",
  "topic": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API requests are limited to:
- **100 requests per minute** for authenticated users
- **20 requests per minute** for unauthenticated users

## CORS

The API supports CORS for the following origins:
- `http://localhost:5173` (Development)
- `http://localhost:5174` (Development)
- `http://localhost:5175` (Development)
- Production domain (when deployed)
