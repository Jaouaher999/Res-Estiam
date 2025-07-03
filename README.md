# School Room Reservation System

A web-based application for reserving school rooms. Users can browse available rooms, view room photos, and book rooms for specific time periods. Admins can manage rooms and bookings, including uploading room photos to AWS S3.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)

---

## Features

- **User Authentication**: Register and log in securely using JWT tokens.
- **Room Management (Admin)**: Admins can create, update, delete rooms, and upload a photo for each room (stored in S3, public URL in `imagePath`).
- **Room Photo Upload**: Each room can have a photo, uploaded to AWS S3 and accessible via a public URL.
- **Booking Management**: Users can book any room for any time range (start and end date/time). The system prevents overlapping bookings.
- **Soft Deletion**: Rooms and bookings can be soft-deleted by admins.
- **Validation & Error Handling**: Robust error handling and validation.

---

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Token)
- **File Uploads**: AWS S3, multer, multer-s3
- **Environment Management**: dotenv

---

## Prerequisites

- **Node.js**: v14 or higher
- **MongoDB**: Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **AWS S3**: An S3 bucket with public read access for objects
- **npm**: For managing dependencies

---

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the root directory with:

```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET_NAME=your-bucket-name
```

---

## Running the Application

1. **Start the development server:**
   ```bash
   npm run start:dev
   ```
2. **Build for production:**
   ```bash
   npm run build
   ```
3. **Run production build:**
   ```bash
   npm run start:prod
   ```

---

## API Documentation

### Authentication

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | /api/auth/signup          | Register a new user                  |
| POST   | /api/auth/login           | Log in and get a token               |
| POST   | /api/auth/change-password | Change user password (auth required) |
| PUT    | /api/auth/update-profile  | Update user profile (auth required)  |

### Room Management (Admin Only unless specified)

| Method | Endpoint             | Description                                        |
| ------ | -------------------- | -------------------------------------------------- |
| POST   | /api/rooms           | Create a new room (Admin)                          |
| GET    | /api/rooms           | Retrieve all rooms (Public)                        |
| GET    | /api/rooms/:id       | Retrieve a specific room (Auth required)           |
| PUT    | /api/rooms/:id       | Update room details (Admin)                        |
| DELETE | /api/rooms/:id       | Soft-delete a room (Admin)                         |
| POST   | /api/rooms/:id/photo | Upload a room photo (Admin, form-data, key: photo) |

### Booking Management

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| POST   | /api/bookings     | Create a new booking (Auth)     |
| GET    | /api/bookings     | Retrieve all bookings (Admin)   |
| GET    | /api/my-bookings  | Retrieve user's bookings (Auth) |
| PUT    | /api/bookings/:id | Update a booking (Admin)        |
| DELETE | /api/bookings/:id | Soft-delete a booking (Admin)   |

#### Booking Example (JSON):

```json
{
  "room": "<roomId>",
  "user": "<userId>",
  "startDate": "2024-07-01T09:00:00Z",
  "endDate": "2024-07-01T11:00:00Z"
}
```

#### Room Photo Upload Example (Postman):

- Method: POST
- URL: http://localhost:5000/api/rooms/<roomId>/photo
- Headers: Authorization: Bearer <admin_token>
- Body: form-data, key: `photo`, type: File

---

## Error Handling

All errors return a JSON response with a message and details. Example:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorMessages": [{ "path": "email", "message": "Email is required" }]
}
```

---


