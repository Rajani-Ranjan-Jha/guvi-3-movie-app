import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import ConnectToDB from "./connect";
import User from "@/models/user";

export const authOptions = {
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          await ConnectToDB();

          // Default: sign-in via credentials
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error(
              "Account uses social login. Please sign in with provider"
            );
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            name: user.name,
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   try {
    //     return true;
    //   } catch (error) {
    //     console.error("Error in signIn callback:", error);
    //     return false;
    //   }
    // },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  debug: process.env.NODE_ENV === "development",
};
