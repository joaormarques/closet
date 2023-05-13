import NextAuth from "next-auth";
import { FirebaseAdapter } from "next-auth/adapters";
import firebase from "firebase-admin";

const firebaseConfig = {};

// Initialize the Firebase app
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// Create a Firestore database instance
const db = app.firestore();

// Create a FirebaseAdapter instance using your Firestore database
const adapter = FirebaseAdapter(db);

const options = {
  providers: [
    {
      id: "google",
      name: "Google",
      type: "oauth",
      version: "2.0",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      params: { grant_type: "authorization_code" },
      accessTokenUrl: "https://oauth2.googleapis.com/token",
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
      profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  ],
  async signIn(user, account, profile) {
    if (account.provider === "google" && profile.verified_email === true) {
      return true;
    } else {
      return false;
    }
  },
  async session(session, token) {
    session.user.id = token.sub;
    return session;
  },
  adapter
};

export default (req, res) => NextAuth(req, res, options);
