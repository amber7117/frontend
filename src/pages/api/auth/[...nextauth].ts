import NextAuth from "next-auth";
import CredentialsContainer from "next-auth/providers/credentials";
import Users from "models/Users";
import bcrypt from "bcryptjs";

export const authOptions: any = {
   session: {
     strategy: "jwt",
   },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      token.userRole = "user";
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
  },
  providers: [
    CredentialsContainer({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Connect to database
        const mongoose = require('mongoose');
        const dbConnect = require('lib/dbConnect').default;
        await dbConnect();

        const user = await Users.findOne({ email: email });

        if (!user) {
          return null;
        }

        // Check if password is already hashed (starts with $2a$)
        const isPasswordHashed = password.startsWith('$2a$');
        
        let passwordValid = false;
        if (isPasswordHashed) {
          // If password is already hashed, compare directly
          passwordValid = password === user.password;
        } else {
          // If password is plain text, hash it with the same salt and compare
          const hashedPassword = bcrypt.hashSync(password, "$2a$10$CwTycUXWue0Thq9StjUM0u");
          passwordValid = hashedPassword === user.password;
        }

        if (!passwordValid) {
          return null;
        }

        return {
          id: user?._id,
          email: user?.email,
          name: user?.fullName,
          image: user?.cover ? user?.cover : null,
        };
      },
    }),
  ],
};
export default NextAuth(authOptions);
