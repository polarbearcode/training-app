'use server';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { db } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt  from 'bcryptjs';
import { redirect } from 'next/navigation';
import {default as strava, Strava} from 'strava-v3';



/** Validation for registration form */
const UserFormSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})

/** State for login and signup forms */
export type UserState = {
    errors?: {
        name?: string[]
        email?: string[];
        password?: string[];
    }, 

    message?: string | null 
}

export async function authenticate( // called in the login form CredentialsSignInComp
    prevState: string | undefined,
    formData: FormData,
  ) {
    let errorOccurred = false;
    try {
    
        /** Sign in using the data from the form */
      await signIn('credentials', formData); // signIn function from NextAuth export in auth.ts
    } catch (error) {
      if (error instanceof AuthError) {
        errorOccurred = true;
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    } finally {
      if (!errorOccurred) {
        redirect("/profile"); /* Only redirect if there is no error */
      }
    }
  }
 
  /**
   * Register a user and insert into training_user db
   * @param prevState prev state of the form
   * @param formData  FormData containing name, email, etc.
   */
export async function registerUser(
    prevState: UserState,
    formData: FormData
){
  

    const validatedFields = UserFormSchema.safeParse({
        name: formData.get('name'),
        email : formData.get('email'),
        password: formData.get('password')
    });


    if (validatedFields.success) {
        const name = validatedFields.data?.name
        const email = validatedFields.data?.email;
        const password = validatedFields.data?.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const client = await db.connect() // connect to database
            await client.sql`
            INSERT INTO traininguser (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword})
            `
        return {}; // need to return something for useActionState
        } catch (error) {
          return {message: 'User could not be created. Email duplicated.'}; // if there are any sql errors
        }

    } else { // if there are validation errors
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missig fields'
        }
    }
}

/** Redirects user to authorize page */
export async function getStravaUserCodeRedirect() {

  redirect("http://www.strava.com/oauth/authorize?client_id="+ process.env.REACT_APP_STRAVA_CLIENT + 
        "&response_type=code&redirect_uri=" + process.env.REACT_APP_STRAVA_AUTHORIZE_REDIRECT_URI + "&approval_prompt=force&scope=activity:read");
 
}

/**
 * Get all Strava activities from the user and save it to a database??
 * @param access_token {string} access token received after authorization from exchaning user code
 * @param athlete_id  {string} athelte id from Strava response after authorization
 */
export async function getStravaActivities(access_token: string, athlete_id: string) {
  try {
    const payload = await strava.athlete.listActivities({access_token: access_token, id: athlete_id});
    return {message: "Retrieved list of activities"};
  } catch (error) {
    return {error: "Could not retrive activities"};
  }

}

/**
 * Save the runs from a list of activities to the database
 * @param payload {any} List of Strava activities returned by listActivities
 */
async function saveRuns(payload: Object[]) {
  const client = await db.connect();

  for (let i = 0; i < payload.length; i++) {

  }

}
