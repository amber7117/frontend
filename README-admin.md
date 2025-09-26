# Admin Setup Script

This script allows you to add an admin user to the database for the Next.js e-commerce application.

## Admin Login URL

Based on the project analysis, here are the login URLs:

### Frontend User Login
- **URL**: `http://localhost:3000/auth/login`
- **Description**: Regular user login page

### Admin Dashboard (External)
- **URL**: `https://e-cosmetics-admin.vercel.app`
- **Description**: Separate admin dashboard application (as mentioned in demo.tsx)

### Admin API Endpoints
- **Admin Registration**: `POST /api/admin/auth/register`
- **Admin Login**: `POST /api/admin/auth/login`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install mongoose bcrypt
```

### 2. Run the Script

```bash
# Basic usage
node add-admin.js <email> <password> [name]

# Example
node add-admin.js admin@example.com AdminPassword123 "Admin User"
```

### 3. Password Requirements

The password must meet the following criteria:
- At least 8 characters long
- Contains at least one uppercase letter
- Contains at least one lowercase letter  
- Contains at least one number

### 4. Database Connection

The script uses the MongoDB connection string from the `.env.development` file:
- **Database**: `mongodb+srv://client2:5252Meimei@cluster0.bkbwpfb.mongodb.net/blog`

## Script Features

- ✅ Validates password strength
- ✅ Checks for existing admin users
- ✅ Ensures only one "Owner" role exists
- ✅ Hashes passwords securely using bcrypt
- ✅ Provides clear success/error messages

## Example Usage

```bash
# Add admin user
node add-admin.js admin@mycompany.com MySecurePass123 "Site Administrator"

# Output on success:
✅ Admin user created successfully!
📧 Email: admin@mycompany.com
👤 Name: Site Administrator
🔑 Role: Owner
📊 Status: active
🔌 Database connection closed
```

## Notes

- The first admin created will have the "Owner" role
- Subsequent admin users will need to be assigned different roles
- The admin dashboard appears to be a separate application from the main frontend
- Regular user authentication uses NextAuth.js, while admin authentication uses JWT tokens

## Troubleshooting

If you encounter connection issues:
1. Check that the MongoDB connection string is correct
2. Ensure your network can connect to MongoDB Atlas
3. Verify that the database is accessible

If the script fails due to existing admin:
- Only one admin with "Owner" role can exist
- Use a different email if the email already exists
