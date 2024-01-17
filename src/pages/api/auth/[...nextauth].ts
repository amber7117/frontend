import NextAuth from "next-auth";
import CredentialsContainer from "next-auth/providers/credentials";
import Users from "models/Users";
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
      credentials: {},

      async authorize(credentials, req) {
        const { email, password, verify } = credentials as {
          email: string;
          password: string;
          verify?: string;
        };

        const user = await Users.findOne({
          email: email,
          ...(!verify && {
            password: password,
          }),
        });

        if (!user) {
          return null;
        }
        // create a jwt token that is valid for 7 days
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
