import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import { admin } from "better-auth/plugins"


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
        },
        google: {
            prompt: "select_account",
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({email, otp}) {
                await resend.emails.send({
                    from: "Coursely <onboarding@resend.dev>",
                    to: [email],
                    subject: "Coursely - Email Verification",
                    html: `<p>Your verification code is <strong>${otp}</strong>.</p>`,
                });
            }, 
        }),
        admin(),  
    ]    
});

