'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt  from 'bcryptjs';

const client = await db.connect() // connect to database

const UserFormSchema = z.object({
    email: z.string(),
    password: z.string()
})

export async function authenticate( // called in the login form CredentialsSignInComp
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
    
        /** Sign in using the data from the form */
      await signIn('credentials', formData); // signIn function from NextAuth export in auth.ts
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
 
  /**
   * Register a user and insert into user db
   * @param prevState prev state of the form
   * @param formData  FormData containing name, email, etc.
   */
export async function registerUser(
    prevState: string | undefined,
    formData: FormData
){
    try {
        const validatedFields = UserFormSchema.safeParse({
            email : formData.get('email'),
            password: formData.get('password')
        });


        if (validatedFields.success) {
            const email = validatedFields.data?.email;
            const password = validatedFields.data?.password;
             const hashedPassword = bcrypt.hash(password, 10);
            await client.sql`
                INSERT INTO training_users (email, password)
                VALUES (${email}, ${password})
                ON CONFLICT (email) DO NOTHING;
            `
        }

    } catch (error) {
        console.log(error);
    }

}