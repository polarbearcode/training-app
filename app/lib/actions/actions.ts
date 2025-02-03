'use server';
import { signIn } from '../../../auth';
import { AuthError } from 'next-auth';
import { db, VercelPoolClient } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt  from 'bcryptjs';
import { redirect } from 'next/navigation';
import {default as strava} from 'strava-v3';
import { processDate } from '../utils';
import { auth } from '../../../auth';
import { DatabaseActivity, StravaActivity, UserProfileDataBase, UserTrainingWeek} from '../definitions';

const client = await db.connect();



/** 
 * Only use if using credentials
 * Validation for registration form */
const UserFormSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})

/** 
 * Only use if using credentials
 * State for login and signup forms */
export type UserState = {
    errors?: {
        name?: string[]
        email?: string[];
        password?: string[];
    }, 

    message?: string | null 
}


/**
 * Only use if using Credentials
 */
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
   * Only use if using Credentials
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
          console.log(error);
          return {message: 'User could not be created. Email duplicated.'}; // if there are any sql errors
        }

    } else { // if there are validation errors
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields'
        }
    }
}


/**
 * Get user profile from the database based on email identifier. 
 * @param email {string} user's email
 * @returns {Promise<UserProfile>} represents user profile 
 */
export async function getUserProfile(email: string) : Promise<UserProfileDataBase> {

  const defaultReturn = {email: email, pace_minutes: 0, pace_seconds: 0, 
    training_start_date: new Date(), strava_data_pull_date: new Date("2024-10-01").getTime()};
   
  
  try {
    const profile = await client.sql<UserProfileDataBase>`
      SELECT * FROM userprofile
      WHERE email=${email};
    `;

    // if email is in database
    if (profile.rows.length > 0) {
      return profile.rows[0];
    } else {
      return defaultReturn;
    }
    
  } catch (error) {
    console.log(error);
    return defaultReturn;
  }
}

/**
 * Get the user's training plan by week from the database
 * @param email {string} the user's email to unqiuely identify them in the database
 * @param marathon {string} the name of the marathon for the training plan
 * @returns {Promise<Record<number, UserTrainingWeek>>} training plans broken out by week
 */
export async function getUserTrainingPlan(email: string, marathon: string) : Promise<Record<number, UserTrainingWeek>>  {
  const data = await client.sql<UserTrainingWeek>`
    SELECT * FROM usertraining
    WHERE email=${email} AND marathon=${marathon};
  `;

  const res: Record<number, UserTrainingWeek> = {}; // don't have to create a new object sans the week property

  for (let i = 0; i < data.rows.length; i++) {
    const curRow: UserTrainingWeek = data.rows[i];

    res[curRow.week] = curRow;
  }

  

  return res;

}

/**
 * Get a list of marathons the user has in the UserTraining table in the database
 * @param email  {string} the user's email
 * @returns  {Promise<string[]>} list of user marathons
 */
export async function getUserMarathons(email: string): Promise<string[]> {
  const data = await client.sql`
    SELECT DISTINCT marathon FROM usertraining
    WHERE email=${email};
  `;

  const marathonList = [];

  for (let i = 0; i < data.rows.length; i++) {
    marathonList.push(data.rows[i].marathon);
  };

  return marathonList;
}



 
  



