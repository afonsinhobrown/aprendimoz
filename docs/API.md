# AprendiMoz API Documentation

## Overview

The AprendiMoz API is a RESTful API built with NestJS that provides endpoints for managing users, courses, payments, certificates, and AI-powered features.

## Base URL

- **Development**: `http://localhost:3001/api/v1`
- **Production**: `https://api.aprendimoz.co.mz/api/v1`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "firstName": "João",
  "lastName": "Silva",
  "phone": "+258841234567",
  "role": "aluno",
  "bio": "Estudante de tecnologia",
  "institution": "Universidade Eduardo Mondlane"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "João",
      "lastName": "Silva",
      "role": "aluno",
      "status": "active"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /auth/logout
```
*Requires authentication*

### Users

#### Get Current User Profile
```http
GET /users/profile
```
*Requires authentication*

#### Update User Profile
```http
PUT /users/:id
```
*Requires authentication*

#### Get User Dashboard
```http
GET /users/dashboard
```
*Requires authentication*

#### Get All Users (Admin only)
```http
GET /users
```
*Requires admin role*

### Courses

#### Get All Courses
```http
GET /courses
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `level`: Filter by level (beginner, intermediate, advanced)
- `search`: Search in title and description
- `instructor`: Filter by instructor ID
- `priceRange`: Filter by price range (min-max)
- `rating`: Filter by minimum rating

#### Get Course by ID
```http
GET /courses/:id
```

#### Create Course
```http
POST /courses
```
*Requires instructor role*

**Request Body:**
```json
{
  "title": "Introdução à Programação",
  "description": "Aprenda os fundamentos da programação",
  "price": 1500.00,
  "currency": "MZN",
  "level": "beginner",
  "category": "Tecnologia",
  "tags": ["programação", "javascript", "web"],
  "requirements": "Nenhum pré-requisito",
  "whatYouWillLearn": "Variáveis, funções, estruturas de controle",
  "targetAudience": "Iniciantes em programação"
}
```

#### Update Course
```http
PUT /courses/:id
```
*Requires instructor role*

#### Delete Course
```http
DELETE /courses/:id
```
*Requires instructor role*

#### Publish Course
```http
POST /courses/:id/publish
```
*Requires instructor role*

### Modules

#### Get Course Modules
```http
GET /courses/:courseId/modules
```

#### Create Module
```http
POST /courses/:courseId/modules
```
*Requires instructor role*

**Request Body:**
```json
{
  "title": "Introdução ao JavaScript",
  "description": "Fundamentos da linguagem JavaScript",
  "order": 1,
  "isRequired": true,
  "price": 200.00,
  "isAvailableSeparately": true
}
```

#### Update Module
```http
PUT /modules/:id
```
*Requires instructor role*

#### Delete Module
```http
DELETE /modules/:id
```
*Requires instructor role*

### Lessons

#### Get Module Lessons
```http
GET /modules/:moduleId/lessons
```

#### Create Lesson
```http
POST /modules/:moduleId/lessons
```
*Requires instructor role*

**Request Body:**
```json
{
  "title": "Variáveis e Tipos de Dados",
  "description": "Aprenda sobre variáveis em JavaScript",
  "type": "video",
  "videoUrl": "https://example.com/video.mp4",
  "duration": 15,
  "order": 1,
  "isRequired": true,
  "isPreview": false
}
```

#### Update Lesson
```http
PUT /lessons/:id
```
*Requires instructor role*

#### Delete Lesson
```http
DELETE /lessons/:id
```
*Requires instructor role*

### Enrollments

#### Enroll in Course
```http
POST /enrollments
```
*Requires authentication*

**Request Body:**
```json
{
  "courseId": "uuid"
}
```

#### Get User Enrollments
```http
GET /enrollments
```
*Requires authentication*

#### Get Enrollment Progress
```http
GET /enrollments/:id/progress
```
*Requires authentication*

#### Update Lesson Progress
```http
POST /enrollments/:id/progress
```
*Requires authentication*

**Request Body:**
```json
{
  "lessonId": "uuid",
  "completed": true,
  "timeSpent": 900,
  "position": 450
}
```

### Payments

#### Create Payment
```http
POST /payments
```
*Requires authentication*

**Request Body:**
```json
{
  "courseId": "uuid",
  "amount": 1500.00,
  "method": "mpesa",
  "phoneNumber": "+258841234567"
}
```

#### Get Payment Status
```http
GET /payments/:id
```
*Requires authentication*

#### Get User Payments
```http
GET /payments
```
*Requires authentication*

#### Process M-Pesa Payment
```http
POST /payments/mpesa/process
```

**Request Body:**
```json
{
  "paymentId": "uuid",
  "transactionId": "mpesa-transaction-id"
}
```

### Certificates

#### Get User Certificates
```http
GET /certificates
```
*Requires authentication*

#### Get Certificate by ID
```http
GET /certificates/:id
```

#### Verify Certificate
```http
GET /certificates/verify/:verificationCode
```

#### Download Certificate
```http
GET /certificates/:id/download
```
*Requires authentication*

### AI Features

#### Get Recommendations
```http
GET /ai/recommendations
```
*Requires authentication*

**Query Parameters:**
- `type`: Recommendation type (course, module, track)
- `limit`: Number of recommendations (default: 5)

#### Ask Virtual Tutor
```http
POST /ai/tutor
```
*Requires authentication*

**Request Body:**
```json
{
  "question": "Como funciona um loop em JavaScript?",
  "courseId": "uuid",
  "lessonId": "uuid"
}
```

#### Generate Quiz Questions
```http
POST /ai/quiz/generate
```
*Requires instructor role*

**Request Body:**
```json
{
  "lessonId": "uuid",
  "numberOfQuestions": 5,
  "difficulty": "medium"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional error details",
  "timestamp": "2024-02-26T10:30:00.000Z",
  "path": "/api/v1/courses",
  "method": "GET"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **General endpoints**: 100 requests per minute
- **Authentication endpoints**: 10 requests per minute
- **AI endpoints**: 20 requests per minute

## File Uploads

### Supported File Types

**Videos:**
- MP4, AVI, MOV
- Maximum size: 100MB

**Documents:**
- PDF, DOC, DOCX, PPT, PPTX
- Maximum size: 10MB

**Images:**
- JPEG, PNG, GIF, WebP
- Maximum size: 5MB

### Upload Endpoint

```http
POST /upload
```
*Requires authentication*

**Request:** Multipart form data with file field

## Webhooks

### Payment Webhook

```http
POST /webhooks/payment
```

**Headers:**
- `X-AprendiMoz-Signature`: HMAC signature

**Payload:**
```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "uuid",
    "status": "completed",
    "amount": 1500.00,
    "currency": "MZN"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @aprendimoz/sdk
```

```javascript
import { AprendiMozAPI } from '@aprendimoz/sdk';

const api = new AprendiMozAPI({
  baseURL: 'http://localhost:3001/api/v1',
  apiKey: 'your-api-key'
});

// Get courses
const courses = await api.courses.list();

// Create course
const course = await api.courses.create({
  title: 'My Course',
  description: 'Course description'
});
```

### Python

```bash
pip install aprendimoz-python
```

```python
from aprendimoz import AprendiMozAPI

api = AprendiMozAPI(
    base_url='http://localhost:3001/api/v1',
    api_key='your-api-key'
)

# Get courses
courses = api.courses.list()

# Create course
course = api.courses.create({
    'title': 'My Course',
    'description': 'Course description'
})
```

## Testing

### Postman Collection

Download the Postman collection from:
`https://docs.aprendimoz.co.mz/postman-collection.json`

### Environment Variables

For testing, set these environment variables:

```bash
API_BASE_URL=http://localhost:3001/api/v1
API_KEY=your-test-api-key
JWT_TOKEN=your-jwt-token
```

## Support

For API support and questions:
- **Email**: api-support@aprendimoz.co.mz
- **Documentation**: https://docs.aprendimoz.co.mz
- **Status Page**: https://status.aprendimoz.co.mz

## Changelog

### v1.0.0 (2024-02-26)
- Initial API release
- Authentication endpoints
- User management
- Course marketplace
- Payment processing
- Certificate generation
- AI recommendations and virtual tutor
