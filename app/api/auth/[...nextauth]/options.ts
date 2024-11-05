/* import { AuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

let accountInfoProcessed = false;

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope:
            "offline_access openid profile user.Read email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user = token;
      }
      // console.log("Session:", session);
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // console.log("JWT token", token);
      if (account && !accountInfoProcessed) {
        // console.log("Account Info:", account);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        //console.log("Refresh Token:", token.refreshToken);
        // Set the flag to true to indicate that account info has been processed
        accountInfoProcessed = true;
      }
      return token;
    },
  },
  session: {
    maxAge: 60 * 10,
  },
};
 */