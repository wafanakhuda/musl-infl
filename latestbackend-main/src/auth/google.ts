// auth/google.ts
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
      passReqToCallback: true // ✅ Enable access to request object for session data
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          console.error('❌ No email found in Google profile')
          return done(null, false);
        }

        console.log(`🔐 Processing Google OAuth for email: ${email}`)

        // ✅ Get user type from session (set in /google route)
        const userType = (req.session?.oauth_user_type) || "creator";
        console.log(`📋 User type from session: ${userType}`)

        let user = await prisma.user.findUnique({ where: { email } });
        let isNewUser = false;

        if (!user) {
          isNewUser = true;
          console.log(`👤 Creating new ${userType} user for: ${email}`)
          
          // ✅ Generate unique username
          const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, '');
          const username = `${baseUsername}-${Math.floor(Math.random() * 10000)}`;

          user = await prisma.user.create({
            data: {
              email,
              full_name: profile.displayName || "No Name",
              user_type: userType as "creator" | "brand",
              email_verified: true,
              password: "", // Placeholder for OAuth users
              username: username,
              // ✅ OAuth users start with minimal profile data
              bio: null,
              location: null,
              niche: null,
              platforms: [],
              avatar_url: profile.photos?.[0]?.value || null,
              // ✅ Set created timestamp
              created_at: new Date(),
            },
          });

          console.log(`✅ Created new user: ${user.id}`)
        } else {
          console.log(`🔄 Existing user found: ${user.id}`)
          
          // ✅ Update avatar if it's from Google and user doesn't have one
          if (profile.photos?.[0]?.value && !user.avatar_url) {
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                avatar_url: profile.photos[0].value,
                updated_at: new Date()
              }
            });
            console.log(`🖼️ Updated avatar for user: ${user.id}`)
          }
        }

        // ✅ Check profile completion status (especially for creators)
        let isProfileComplete = true;
        let needsOnboarding = false;

        if (user.user_type === "creator") {
          // ✅ Check if creator has completed essential profile fields
          const hasRequiredFields = !!(
            user.bio && 
            user.location && 
            user.niche &&
            user.platforms && 
            user.platforms.length > 0
          );

          isProfileComplete = hasRequiredFields;
          needsOnboarding = !hasRequiredFields;

          console.log(`📊 Creator profile check:`, {
            hasBio: !!user.bio,
            hasLocation: !!user.location,
            hasNiche: !!user.niche,
            hasPlatforms: !!(user.platforms && user.platforms.length > 0),
            isComplete: isProfileComplete,
            needsOnboarding: needsOnboarding
          });
        } else if (user.user_type === "brand") {
          // ✅ For brands, basic info is usually sufficient from OAuth
          // But you could add brand-specific requirements here
          isProfileComplete = !!(user.full_name && user.email);
          needsOnboarding = false;
          
          console.log(`🏢 Brand profile check: complete = ${isProfileComplete}`)
        }

        // ✅ Generate JWT with comprehensive user data
        const tokenPayload = {
          id: user.id,
          user_type: user.user_type,
          email: user.email,
          profile_complete: isProfileComplete,
          is_new_oauth_user: isNewUser
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

        console.log(`🎫 Generated JWT for user ${user.id}:`, {
          userType: user.user_type,
          profileComplete: isProfileComplete,
          isNewUser: isNewUser,
          needsOnboarding: needsOnboarding
        });

        // ✅ Return comprehensive auth result
        const authResult = {
          token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            user_type: user.user_type,
            username: user.username,
            avatar_url: user.avatar_url,
            bio: user.bio,
            location: user.location,
            niche: user.niche,
            platforms: user.platforms,
            email_verified: user.email_verified
          },
          profile_complete: isProfileComplete,
          is_new_oauth_user: isNewUser,
          needs_onboarding: needsOnboarding
        };

        return done(null, authResult);

      } catch (err) {
        console.error("❌ Google OAuth strategy error:", err);
        return done(err as Error);
      }
    }
  )
);

// ✅ Passport serialization (required for session support)
passport.serializeUser((user: any, done) => {
  done(null, user.token || user.id);
});

passport.deserializeUser(async (tokenOrId: string, done) => {
  try {
    // If it looks like a JWT token, verify it
    if (tokenOrId.includes('.')) {
      const decoded = jwt.verify(tokenOrId, JWT_SECRET) as any;
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      return done(null, user);
    } else {
      // Otherwise treat as user ID
      const user = await prisma.user.findUnique({ where: { id: tokenOrId } });
      return done(null, user);
    }
  } catch (error) {
    console.error("❌ Passport deserialize error:", error);
    return done(error);
  }
});

export default passport;
