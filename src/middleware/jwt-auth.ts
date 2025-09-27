import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, extractTokenFromHeader } from "src/utils/jwt-config";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
}

/**
 * JWT Authentication Middleware
 * This middleware verifies JWT tokens and attaches user data to the request
 */
export const jwtAuthMiddleware = (
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No authentication token provided",
        });
      }

      // Verify the token
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired authentication token",
        });
      }

      // Attach user data to the request
      req.user = decoded;

      // Continue to the actual handler
      return handler(req, res);
    } catch (error) {
      console.error("JWT Authentication Middleware Error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
  };
};

/**
 * Optional JWT Authentication Middleware
 * This middleware verifies JWT tokens if provided, but doesn't require them
 */
export const optionalJwtAuthMiddleware = (
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);
      
      if (token) {
        // Verify the token if provided
        const decoded = verifyToken(token);
        if (decoded) {
          req.user = decoded;
        }
      }

      // Continue to the actual handler (token is optional)
      return handler(req, res);
    } catch (error) {
      console.error("Optional JWT Authentication Middleware Error:", error);
      // Continue without authentication (it's optional)
      return handler(req, res);
    }
  };
};

export default jwtAuthMiddleware;
