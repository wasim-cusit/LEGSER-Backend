# Node.js Authentication & Authorization Setup

This repository contains a Node.js application with authentication and authorization features. It provides various API operations to manage users, roles, permissions, and two-factor authentication (2FA).

## Features
- **User Authentication**
  - Signup (Register a new user)
  - Login (Authenticate an existing user and generate a token)
  - Two-factor Authentication (2FA) verification
- **Permissions Management**
  - Create, Update, Delete, and Get permissions
- **Roles Management**
  - Create, Update, Delete, and Get roles
  - Roles can have assigned permissions
- **User Management**
  - Create, Update, Delete, and Get users
  - Users are assigned roles

The project is configured with **Postman** for testing and easy API interaction.

## Setup

### Prerequisites
Ensure the following are installed on your machine:
- **Node.js** and **npm** (Node Package Manager)
- A running **Node.js server** for the backend
- **Postman** to test the API requests

### Environment Variables
Make sure to set the following environment variables in your Postman collection or `.env` file before using the API:

#### Backend Configuration:
- `PORT`: The port for your server to run (default: `3000`)
- `JWT_SECRET`: The secret key used for signing JWT tokens (replace with your own secret)
  
#### Database Configuration:
- `DB_USERNAME`: Your database username (default: `root`)
- `DB_PASSWORD`: Your database password (default: `root`)
- `DB_DATABASE`: The name of your database (default: `node_setup`)
- `DB_HOST`: The host of your database (default: `localhost`)

#### Twilio Configuration (for 2FA):
- `ACCOUNT_SID`: Your Twilio Account SID
- `AUTH_TOKEN`: Your Twilio Auth Token
- `FROM_NO`: The phone number to send the 2FA code from (e.g., `+1234567890`)

#### Email Configuration:
- `EMAIL_USER`: Your email address (e.g., `xyz@gmail.com`)
- `EMAIL_PASS`: Your email password (ensure to handle securely)

### Postman Collection
The Postman collection `postman-collection` contains predefined API requests for the following categories:

#### 1. **Authentication**
- **Signup**: Registers a new user
- **Login**: Authenticates an existing user and generates a token
- **Forgot Password**: Sends a password reset link or verification code to the user's email
- **Reset Password**: Allows the user to set a new password after verification of the reset link or code
- **2FA Verification**: Verifies 2FA details for login

#### 2. **Permissions Management**
- **Create**: Creates a new permission
- **Update**: Updates an existing permission
- **Delete**: Deletes a permission
- **Get**: Retrieves all permissions

#### 3. **Roles Management**
- **Create**: Creates a new role with assigned permissions
- **Update**: Updates an existing role and its permissions
- **Delete**: Deletes a role
- **Get**: Retrieves all roles with their associated permissions

#### 4. **User Management**
- **Create**: Creates a new user with assigned roles
- **Update**: Updates an existing user and their roles
- **Delete**: Deletes a user
- **Get**: Retrieves all users along with their assigned roles

### Location of Postman Collection
The Postman collection is located in the `/tests` folder of the project. You can import this collection into Postman for easy testing of the API endpoints.

## How to Use
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install


## Company Information
### K2x
K2x is a leading company providing innovative solutions in various fields. We specialize in the following services:

### Our Services:
- **Web Development**
- **Mobile App Development**
- **UX/UI Designing**
- **AI/Machine Learning**
- **Data Analytics**

### Contact Us:
- **Location (HQ)**: 
  - Office 7B, 5th floor, Mall of KPK, University Road, Peshawar, Pakistan
- **Phone**: (+92) 917255 498
- **Email**: hello@k2x.tech
