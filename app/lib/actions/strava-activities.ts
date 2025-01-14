'use server'
/**
 * Contains functions to get Strava activites and upload them to a database.
 */

import { redirect } from "next/navigation";
import strava from "strava-v3";
import { DatabaseActivity, StravaActivity } from "../definitions";
import { db, VercelPoolClient } from "@vercel/postgres";
import { auth } from "auth";
import { processDate } from "../utils";

const client = await db.connect();

/** Redirects user to Strava's authorize page (not the exchange token request) */
export async function getStravaUserCodeRedirect() {

    redirect("http://www.strava.com/oauth/authorize?client_id="+ process.env.AUTH_STRAVA_ID + 
          "&response_type=code&redirect_uri=" + process.env.STRAVA_AUTHORIZE_REDIRECT_URI + "&approval_prompt=force&scope=activity:read");
   
  }
  
/**
 * Get all Strava activities from the user and save it to a database.
 * Tracks date of the latest pulled activity if all activities successfully
 * uploaded to the database otherwise returns most recent un-uploaded activity to be used for next data pull.
 * @param access_token {string} access token received after authorization from exchaning user code
 * @param athlete_id  {string} athelte id from Strava response after authorization
 * @param dataPullDate {number|undefined} the date to pull Strava activities from in milliseconds
 * @return {Promise<{updateDataPullDate: number, message: string}>} date to put in after field for next data pull 
 * and success or error message
 */
export async function getStravaActivities(access_token: string, athlete_id: string, 
    dataPullDate: number): Promise<{updateDataPullDate: number, message: string}> {

    let process: {updateDataPullDate: number, message: string} = {updateDataPullDate: new Date().getTime(), message: ""};

    let pullDataFrom: number = new Date("2024-10-01").getTime() / 1000; // getTime returns in milliseconds. Strava needs seconds.

    // if a data pull date is provided when function is called
    if (dataPullDate) {
        pullDataFrom = dataPullDate / 1000;
    }

    console.log(pullDataFrom);

    try {
        const payload = await strava.athlete.listActivities({access_token: access_token, id: athlete_id, 
            per_page:100, after: Math.round(pullDataFrom)});
        
        process = await saveActivities(payload);
        return {updateDataPullDate: process.updateDataPullDate, message: "Retrieved list of activities and saved it to database"};
    } catch (error) {
        console.log(error);
        return {updateDataPullDate: process.updateDataPullDate, message: `Uploaded activities up to ${process.updateDataPullDate.toString()}`};
    }

}

/**
 * Save the activities from a list of activities to the database and 
 * track date of most recent activity if no errors uploading to the database
 * or the earliest activity that could not be uploaded. 
 * @param payload    {Array}    list of Strava activities returned by listActivities
 * @return {udpateDataPullDate: number, message: string} success or error message containing activities not uploaded
 */
async function saveActivities(payload: Array<StravaActivity>): Promise<{updateDataPullDate: number, message: string}> {
   
    const unableToUpload : string[] = []; // make this a stack?

    let updateDataPullDate: Date= new Date(); // used for comparison

    for (let i = 0; i < payload.length; i++) {
        const curActivity = payload[i];

        try {
            
            uploadActivityToDB(curActivity, client);

        } catch (error) {
            // Note acitivites that couldn't be uploaded
            unableToUpload.push(curActivity.id);

            const curActivityDate = new Date(curActivity.start_date);

            // update if activity is earlier
            if (curActivityDate < updateDataPullDate) {
                updateDataPullDate = curActivityDate;
            }

            continue;
        }
        
    }

    // no error just use today's date. 
    if (unableToUpload.length == 0) {
        return {updateDataPullDate: updateDataPullDate.getTime(), message: "All acitivites uploaded"};
    } else {
        return {updateDataPullDate: updateDataPullDate.getTime(), message: "Unable to upload activities" + unableToUpload};
    }
}

/**
 * Helper function to upload activities to the Activity database
 * @param activity {StravaActivity}         activity received from the Strava API call
 * @param client   {VercelPoolClient}       connection to Vercel Postgres database
 * @returns        {Promise<Record<string, string>>} returns sucess message or error message
 */
async function uploadActivityToDB(activity: StravaActivity, client: VercelPoolClient): Promise<Record<string, string>>{

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
    return {message: "Activity uploaded"}
    } catch (error) {
        console.log(error);
        return {error: "Error inserting new activity:" + activityID + "into table"};
    }

}

/**
 * Get all the saved activities for a user based on their email
 * @param email {string} The user's email in the current session
 * @return {Promise<DatabaseActivity[]>} Activities from the database as a list of objects. 
 */
export async function getActivitesFromDB(email: string): Promise<DatabaseActivity[]> {
    try {
      
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

/**
 * Update the date of the most recent Strava activity pulled for a user 
 * @param updateDataPullDate {number} the date of the most recent activity saved to the database or today's if 
 * no data for the user. Units in milliseconds. 
 * @param email {string} the email of the user to uniquely identify them. 
 * @returns {error?:string} an error string if there is an error, otherwise an empty dictionary. 
 */
export async function updateUserDataPullDateStrava(updateDataPullDate: number, email: string) : Promise<{error?: string}> {
    // connect to vercel database

   
    try {
         client.sql`
            INSERT INTO userProfile (email, strava_data_date)
            VALUES (${email}, ${updateDataPullDate.toString()})
            ON CONFLICT (email) DO UPDATE 
            SET strava_data_date=${updateDataPullDate.toString()};
        `;

        return {};

    } catch(error) {
        console.log(error);
        return {error: `Could not update data pull date for user ${email}`}; 
    }
}

/**
 * Update the data pulled date for the user in the database. 
 * @param email {string} the user's email in the database
 * @param dataPullDate {number} date in epoch time
 * @returns {Promise<error?: string>} An error message if there is an error or an empty {}.
 */
async function updateUserStravaDataPullDate(email: string, dataPullDate: number) : Promise<{error?:string}>  {
    try {

        const checkIfEmailExists = await client.sql`
            SELECT email FROM UserProfile
            WHERE email=${email};
        `;

        if (checkIfEmailExists.rows) {
            client.sql`
                UPDATE UserProfile 
                SET strava_data_date=${dataPullDate}
                WHERE email=${email};
            `;

        } else {
            return {error: `User with email: ${email} not in database`};
        }

        return {};
    } catch (error) {
        return {error: `Could not update user's data pull date for email: ${email}`}
    }
}
  