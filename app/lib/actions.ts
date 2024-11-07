import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate( // called in the login form CredentialsSignIn
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData); // from NextAuth export in auth.ts
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }