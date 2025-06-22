# Chapter Performance Dashboard API

A RESTful API for managing chapter performance data with caching and rate limiting.

## Features

- RESTful API endpoints for managing chapters
- Redis caching for improved performance
- Rate limiting (30 requests/minute per IP)
- MongoDB integration with Mongoose
- Admin-only chapter upload functionality
- Filtering and pagination support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chapter-dashboard
REDIS_URL=redis://localhost:6379
ADMIN_API_KEY=secret-admin-key
```
## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Get All Chapters
```
GET /api/v1/chapters
```
Query Parameters:
- class (number): Filter by class
- unit (string): Filter by unit
- status (string): Filter by status (active/inactive)
- weakChapter (boolean): Filter weak chapters
- subject (string): Filter by subject
- page (number): Page number for pagination
- limit (number): Number of items per page

### Get Single Chapter
```
GET /api/v1/chapters/:id
```

### Upload Chapters (Admin Only)
```
POST /api/v1/chapters
```
Headers:
- x-api-key: Admin API key

Body:
- file: JSON file containing chapter data

## Rate Limiting

The API is rate-limited to 30 requests per minute per IP address using Redis as the store.

## Caching

Responses from the GET /chapters endpoint are cached in Redis for 1 hour. The cache is automatically invalidated when new chapters are added.

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
``` 
