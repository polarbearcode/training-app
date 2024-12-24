/** Integrate external authentication providers. Exports some objects needed for signing in. */
import NextAuth, { Session } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { string, z } from 'zod';
import { sql } from '@vercel/postgres'
import type { User } from 'app/lib/definitions';
import bcryptjs from 'bcryptjs';
import Strava from 'next-auth/providers/strava';
import { JWT } from 'next-auth/jwt';


async function getUser(email: string): Promise<User | undefined> {
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }


export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig, // adds props of authconfig to this object being passed to NextAuth
    providers: [Strava, GitHub, 
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z 
                    .object({email: z.string().email(), password: z.string().min(6)})
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                   
                    if (!user) return null;
                   
                    const passwordsMatch = password === user.password;
                    
                   
                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
    
  })