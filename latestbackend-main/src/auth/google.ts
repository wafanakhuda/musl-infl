// auth/google.ts

import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { VerifyCallback } from "passport-oauth2";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ Google OAuth Strategy Setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await prisma.user.findUnique({ where: { email } });

if (!user) {
  // ✅ Generate a unique fallback username
  const username = email.split("@")[0] + "-" + Math.floor(Math.random() * 10000)

  user = await prisma.user.create({
    data: {
      email,
      full_name: profile.displayName || "No Name",
      user_type: "creator",
      email_verified: true,
      password: "", // Placeholder
      username: username, // ✅ Assign value explicitly
    },
  });
}

        const token = jwt.sign(
          { id: user.id, user_type: user.user_type },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, { token });
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);
