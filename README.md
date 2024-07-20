# social-media-backend

A backend service to manage some social media operations

# Steps Run and Configure Node.js Application

## 1. Clone the Repository

Clone your project repository from your version control system (e.g., GitHub).

HTTP

```BASH
https://github.com/kushhingol/social-media-backend.git
```

SSH

```BASH
git@github.com:kushhingol/social-media-backend.git
```

## 2. Install Dependencies

Install the project dependencies using npm.

```BASH
npm install
```

## 3. Create the .env File

Create a .env file in the root directory of your project and configure the necessary environment variables. Here is an example:

```env
# MongoDB connection string
MONGODB_URI=<your mongo server uri>

# JWT secret key
JWT_SECRET=your_jwt_secret


# Server port
PORT=3000
```

## 4. Start the Application

```BASH
npm run dev
```
