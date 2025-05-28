import { BetterAuth } from "better-auth";
import { PrismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = BetterAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/create-account",
  },
});
