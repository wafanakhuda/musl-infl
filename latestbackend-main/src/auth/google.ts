// File: /backend/src/auth/google.ts

import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { VerifyCallback } from "passport-oauth2";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ Enhanced Google OAuth Strategy with Profile Completion Detection
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
        let isNewUser = false;

        if (!user) {
          isNewUser = true;
          // ✅ Create user with minimal OAuth data
          const username = email.split("@")[0] + "-" + Math.floor(Math.random() * 10000);

          user = await prisma.user.create({
            data: {
              email,
              full_name: profile.displayName || "No Name",
              user_type: "creator", // Default to creator
              email_verified: true,
              password: "", // Placeholder for OAuth users
              username: username,
              // ✅ These fields will be null/empty for OAuth users initially
              bio: null,
              location: null,
              niche: null,
              platforms: [],
              // ✅ Add a flag to track OAuth registration
              avatar_url: profile.photos?.[0]?.value || null,
            },
          });
        }

        // ✅ Check if profile is complete
        const isProfileComplete = !!(
          user.bio && 
          user.location && 
          user.niche &&
          user.platforms && 
          user.platforms.length > 0
        );

        const token = jwt.sign(
          { 
            id: user.id, 
            user_type: user.user_type,
            profile_complete: isProfileComplete,
            is_new_oauth_user: isNewUser
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, { 
          token, 
          user,
          profile_complete: isProfileComplete,
          is_new_oauth_user: isNewUser
        });
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err as Error);
      }
    }
  )
);
