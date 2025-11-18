import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/lib/mongo/client";
import { username } from "better-auth/plugins"
import { use } from "react";


const { client, db } = await connectToDatabase();
export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }
    },
    user: {
        deleteUser: {
            enabled: true
        }
    },
    plugins: [username()]
});