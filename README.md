# Meeting Room Booking System

### Live URL: [Visit the Live Site](https://level-2-assignment-3.onrender.com)

The **Meeting Room Booking System** is a web-based application that streamlines the process of reserving co-working spaces for meetings and discussions. It allows users to browse available rooms, book meeting slots, and manage their reservations. Admins can create and manage rooms, slots, and bookings efficiently.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Future Enhancements](#future-enhancements)

---

## Features

- **User Authentication**: Secure user registration and login using JWT tokens.
- **Room Management (Admin)**: Admins can create, update, and delete rooms, along with managing room details such as capacity, price per slot, and available amenities.
- **Slot Management (Admin)**: Admins can create, view, and manage time slots for each room.
- **Booking Management (User/Admin)**: Users can book multiple time slots, view their bookings, and receive feedback on slot availability.
- **Soft Deletion**: Rooms and bookings can be soft-deleted by admins.
- **Real-time Availability**: Users get instant feedback on available rooms and slots.
- **Validation & Error Handling**: Robust error handling with descriptive error messages and form validation using Zod.

---

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Zod
- **Environment Management**: dotenv
- **Development Tools**: ESLint, Prettier, Nodemon

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js (v14 or higher) from [here](https://nodejs.org/).
- **MongoDB**: Install MongoDB or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **npm or yarn**: Package manager for Node.js dependencies.

---

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AJAmran/level-2-assignment-3.git
   cd meeting-room-booking-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the root directory to store your environment variables. Add the following:

```plaintext
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
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

Once the server is up and running, the application will be available at [http://localhost:5000](http://localhost:5000).

---

## API Documentation

The API follows a RESTful architecture. Here are some key routes:

### Authentication Routes

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/api/auth/signup`  | Register a new user            |
| POST   | `/api/auth/login`   | Log in and get a token         |

### Room Management (Admin Only)

| Method | Endpoint             | Description                      |
|--------|----------------------|----------------------------------|
| POST   | `/api/rooms`         | Create a new room                |
| GET    | `/api/rooms`         | Retrieve all rooms               |
| GET    | `/api/rooms/:id`     | Retrieve a specific room         |
| PUT    | `/api/rooms/:id`     | Update room details              |
| DELETE | `/api/rooms/:id`     | Soft-delete a room               |

### Slot Management (Admin Only)

| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| POST   | `/api/slots`        | Create new time slots for a room |
| GET    | `/api/slots`        | Get all available slots          |

### Booking Management

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/bookings`       | Create a new booking           |
| GET    | `/api/bookings`       | Retrieve all bookings (Admin)  |
| GET    | `/api/my-bookings`    | Retrieve user's bookings       |
| PUT    | `/api/bookings/:id`   | Update a booking (Admin)       |
| DELETE | `/api/bookings/:id`   | Soft-delete a booking (Admin)  |

Refer to the [Postman Collection](#) for detailed API examples.

---

## Error Handling

The application uses a centralized error handler to catch and respond with appropriate error messages. Here’s an example error response:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorMessages": [
    {
      "path": "email",
      "message": "Email is required"
    }
  ],
  "stack": "Error stack trace (only in development mode)"
}
```

### Not Found Route

For any unmatched routes, the API responds with a 404 error:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Not Found"
}
```

---

## Future Enhancements

- **Room Availability Calendar**: A graphical calendar to show room availability.
- **Email Notifications**: Notify users about their bookings via email.
- **Payment Gateway**: Integration with a payment gateway to handle slot booking payments.
- **Admin Dashboard**: A UI dashboard for admins to manage rooms, slots, and bookings easily.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

### Contributors

- **MD Amran Hossen** - *Project Lead & Full Stack Developer*

"# meeting_room_booking-System" 
