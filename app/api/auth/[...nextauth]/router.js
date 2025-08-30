import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import ConnectToDB from "@/utils/connect";
import User from "@/models/user";
import { authOptions } from "@/utils/auth";


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };