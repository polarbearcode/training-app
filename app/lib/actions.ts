'use server';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { db, VercelPoolClient } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt  from 'bcryptjs';
import { redirect } from 'next/navigation';
import {default as strava} from 'strava-v3';
import { processDate } from './utils';
import { auth } from '../../auth';
import { DatabaseActivity, StravaActivity } from './definitions';



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
          console.log(error);
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

  redirect("http://www.strava.com/oauth/authorize?client_id="+ process.env.AUTH_STRAVA_ID + 
        "&response_type=code&redirect_uri=" + process.env.STRAVA_AUTHORIZE_REDIRECT_URI + "&approval_prompt=force&scope=activity:read");
 
}

/**
 * Get all Strava activities from the user and save it to a database??
 * @param access_token {string} access token received after authorization from exchaning user code
 * @param athlete_id  {string} athelte id from Strava response after authorization
 */
export async function getStravaActivities(access_token: string, athlete_id: string) {
  try {
    const payload = await strava.athlete.listActivities({access_token: access_token, id: athlete_id});
    console.log(payload[0]);
    saveRuns(payload);
    return {message: "Retrieved list of activities"};
  } catch (error) {
    console.log(error)
    return {error: "Could not retrive activities"};
  }

}

/**
 * Save the runs from a list of activities to the database
 * @param payload    {Array}    list of Strava activities returned by listActivities
 */
async function saveRuns(payload: Array<StravaActivity>) {
  const client = await db.connect();

  for (let i = 0; i < payload.length; i++) {
    const curActivity = payload[i];

    if (curActivity.type == "Run") {
      uploadActivityToDB(curActivity, client);
    }
  }

}

async function uploadActivityToDB(activity: StravaActivity, client: VercelPoolClient) {

  /** Get user email */
  const session = await auth();
  const email = session?.user?.email;
  const athleteID = activity.athlete.id;
  const activityID = activity.id;
  const activityType = activity.type;
  const {year, month, day} = processDate(activity.start_date);
  const distance = activity.distance;
  const totalElevationGain = activity.total_elevation_gain;
  const averageSpeed = activity.average_speed;
  const maxSpeed = activity.max_speed;
  const averageCadence = activity.average_cadence;
  const averageHeartrate = activity.average_heartrate;
  try {
    await client.sql`
    INSERT INTO activity (activityID, athleteID, activityType, year, month, day, distance, 
        totalElevationGain, averageSpeed, maxSpeed, averageCadence, averageHeartrate, email)
    VALUES(${activityID}, ${athleteID}, ${activityType}, ${year}, ${month}, ${day}, ${distance}, 
            ${totalElevationGain}, ${averageSpeed}, ${maxSpeed}, ${averageCadence}, ${averageHeartrate}, ${email})
    ON CONFLICT DO NOTHING; 
  `
  } catch (error) {
    console.log(error);
    return {error: "Error inserting new activity into table"};
  }
  
}

/**
 * Get all the saved activities for a user based on their email
 * @param email {string} The user's email in the current session
 */
export async function getActivitesFromDB(email: string): Promise<DatabaseActivity[]> {
  try {
    const client = await db.connect();
    const activities = await client.sql<DatabaseActivity>`
      SELECT * FROM activity 
      WHERE email=${email};
    `;

   console.log(email); 

    return activities.rows;


  } catch (error) {
    console.log(error);
    return [];
  }
}
 
  



