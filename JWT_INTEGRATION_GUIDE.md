# JWT Token Authentication Integration Guide

## Overview
This guide documents the JWT token authentication system that has been integrated into the application. The system replaces hardcoded JWT secrets with centralized configuration and provides middleware for consistent authentication handling.

## What Was Implemented

### 1. Centralized JWT Configuration (`src/utils/jwt-config.ts`)
- **Environment-based JWT secret**: Uses `JWT_SECRET` environment variable
- **Standardized token generation**: 7-day expiration by default
- **Token verification utilities**: Safe token validation with error handling
- **Payload interface**: Type-safe JWT payload structure

### 2. JWT Authentication Middleware (`src/middleware/jwt-auth.ts`)
- **Required authentication middleware**: Enforces JWT token validation
- **Optional authentication middleware**: Validates tokens if provided but doesn't require them
- **Request extension**: Adds `user` property to authenticated requests

### 3. Updated Authentication Endpoints

#### `/api/auth/login` ✅
- Uses centralized `generateToken` function
- Returns user data along with token
- Proper error handling and status codes

#### `/api/auth/register` ✅
- Uses centralized `generateToken` function for email verification
- Maintains existing email functionality
- Proper error handling

#### `/api/auth/user` ✅
- Uses JWT middleware for authentication
- Returns refreshed token with updated user data
- Proper authorization header handling

#### `/api/auth/reset-password` ✅
- Uses centralized token verification
- Proper token expiration checking
- Enhanced error handling

## Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET=your_secure_jwt_secret_key_here
```

**Important**: Change the default secret in production!

## Usage Examples

### Generating Tokens
```javascript
import { generateToken } from 'src/utils/jwt-config';

const token = generateToken({
  _id: user._id.toString(),
  email: user.email,
  name: user.name,
  role: user.role,
});
```

### Verifying Tokens
```javascript
import { verifyToken, extractTokenFromHeader } from 'src/utils/jwt-config';

const token = extractTokenFromHeader(req.headers.authorization);
const decoded = verifyToken(token);
```

### Using Middleware
```javascript
import { jwtAuthMiddleware } from 'src/middleware/jwt-auth';

// For endpoints requiring authentication
export default jwtAuthMiddleware(async (req, res) => {
  // req.user is available here
  const user = req.user;
  // Your handler logic
});
```

## API Endpoint Changes

### Before (Hardcoded Secrets)
```javascript
const token = jwt.sign(payload, `absjdkas`, { expiresIn: "7d" });
```

### After (Centralized Configuration)
```javascript
const token = generateToken(payload);
```

## Security Improvements

1. **No hardcoded secrets**: All JWT secrets come from environment variables
2. **Centralized validation**: Consistent token verification across all endpoints
3. **Proper error handling**: Clear error messages for authentication failures
4. **Type safety**: TypeScript interfaces for JWT payloads

## Testing the Integration

1. **Build verification**: Run `npm run build` to ensure no compilation errors
2. **API testing**: Test authentication endpoints with valid/invalid tokens
3. **Middleware testing**: Verify protected routes require authentication

## Migration Notes

- All existing JWT tokens will need to be reissued after deployment
- Update any client-side code that handles JWT tokens to use the new response format
- Ensure the `JWT_SECRET` environment variable is set in all environments

## Next Steps

1. **Update client-side authentication**: Ensure frontend handles the new token format
2. **Add token refresh mechanism**: Implement token refresh for long sessions
3. **Add role-based access control**: Extend JWT payload for role-based permissions
4. **Monitor authentication logs**: Set up logging for authentication attempts

## Troubleshooting

### Common Issues

1. **"Invalid token" errors**: Check that `JWT_SECRET` is set correctly
2. **Token expiration**: Verify token expiration settings match client expectations
3. **Middleware errors**: Ensure middleware is properly applied to endpoints

### Debugging

Enable debug logging by adding console logs to the JWT utilities or using a JWT debugger tool to inspect token contents.

---

This integration provides a secure, maintainable foundation for JWT-based authentication in your application.
