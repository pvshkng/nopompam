import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
 
export const config = {
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
  ],
  pages: {
    signIn: "/chat",
    signOut: "/"
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)