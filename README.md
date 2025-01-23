# PinPoint Backend

This repository contains the backend implementation for the PinPoint application, built using Node.js and Express.js.

## Project Setup

Before setting up the project, ensure that Node.js is installed on your system. If not, download and install it from the [official website](https://nodejs.org/).

### Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/divy-sh/pinpoint-backend.git
   cd pinpoint-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create a `.env` file in the project root directory and add the following environment variables:

   ```env
   MONGODB_URL="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   EMAILJS_PRIVATE_KEY="your_emailjs_private_key"
   EMAILJS_TEMPLATEID="your_emailjs_template_id"
   EMAILJS_SERVICEID="your_emailjs_service_id"
   EMAILJS_PUBLIC_KEY="your_emailjs_public_key"
   ```

   Replace the placeholder values with your actual credentials.

### Starting the Server

To start the development server, run:

```bash
npm run dev
```

The server will start, and you can begin using the backend services.

## About

This project serves as the backend for the PinPoint application, providing necessary APIs and services.

## Contributors

- [Divyendu Shekhar](https://github.com/divy-sh)
- [Prathamesh Akole](https://github.com/prathameshakole)
