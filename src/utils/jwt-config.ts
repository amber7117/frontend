import jwt from 'jsonwebtoken';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || '42d3ca17c06a2ff1b436ab3d931be4c9';
const JWT_EXPIRES_IN = '7d'; // Token expiration time

export interface JwtPayload {
  _id: string;
  email: string;
  name?: string;
  cover?: any;
  status?: string;
  role?: string;
  exp?: number; // JWT expiration timestamp
  iat?: number; // JWT issued at timestamp
}

/**
 * Generate a JWT token
 * @param payload - The payload to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT token
 * @param token - The token to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

/**
 * Decode a JWT token without verification
 * @param token - The token to decode
 * @returns Decoded payload or null if invalid
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return null;
  }
};

/**
 * Check if a token is expired
 * @param token - The token to check
 * @returns Boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Extract token from authorization header
 * @param authHeader - Authorization header string
 * @returns Token string or null
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  extractTokenFromHeader,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
