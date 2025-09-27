import { withAuth } from "next-auth/middleware";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Protect API routes that require authentication
      if (req.nextUrl.pathname.startsWith("/api/")) {
        // Allow auth-related API routes
        if (req.nextUrl.pathname.startsWith("/api/auth/") && 
            !req.nextUrl.pathname.startsWith("/api/auth/user")) {
          return true;
        }
        
        // Protect user-related API routes
        if (req.nextUrl.pathname.startsWith("/api/users") ||
            req.nextUrl.pathname.startsWith("/api/profile") ||
            req.nextUrl.pathname.startsWith("/api/wishlist") ||
            req.nextUrl.pathname.startsWith("/api/reviews") ||
            req.nextUrl.pathname.startsWith("/api/auth/user")) {
          return !!token;
        }
      }
      
      // Protect frontend routes
      if (req.nextUrl.pathname === "/profile") {
        return token?.userRole === "user";
      }
      
      // Allow all other routes
      return true;
    },
  },
});

export const config = { 
  matcher: [
    "/profile",
    "/api/users/:path*",
    "/api/profile/:path*", 
    "/api/wishlist/:path*",
    "/api/reviews/:path*",
    "/api/auth/user"
  ] 
};
