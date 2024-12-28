'use server'
/**
 * Contains functions to get Strava activites and upload them to a database.
 */

import { redirect } from "next/navigation";
import strava from "strava-v3";
import { DatabaseActivity, StravaActivity } from "./definitions";
import { db, VercelPoolClient } from "@vercel/postgres";
import { auth } from "auth";
import { processDate } from "./utils";

/** Redirects user to Strava's authorize page (not the exchange token request) */
export async function getStravaUserCodeRedirect() {

    redirect("http://www.strava.com/oauth/authorize?client_id="+ process.env.AUTH_STRAVA_ID + 
          "&response_type=code&redirect_uri=" + process.env.STRAVA_AUTHORIZE_REDIRECT_URI + "&approval_prompt=force&scope=activity:read");
   
  }
  
/**
 * Get all Strava activities from the user and save it to a database
 * @param access_token {string} access token received after authorization from exchaning user code
 * @param athlete_id  {string} athelte id from Strava response after authorization
 * @return {Promise<Record<string, string>>} success or error message
 */
export async function getStravaActivities(access_token: string, athlete_id: string): Promise<Record<string, string>> {
let processError: Record<string, string> = {};
try {
    const payload = await strava.athlete.listActivities({access_token: access_token, id: athlete_id});
    processError = await saveActivities(payload);
    return {message: "Retrieved list of activities and saved it to database"};
} catch (error) {
    console.log(error);
    return processError;
}

}

/**
 * Save the activities from a list of activities to the database
 * @param payload    {Array}    list of Strava activities returned by listActivities
 * @return {Promise<Record<string, string>>} success or error message containing activities not uploaded
 */
async function saveActivities(payload: Array<StravaActivity>): Promise<Record<string, string>> {
    const client = await db.connect();

    const unableToUpload : string[] = []; // make this a stack?

    for (let i = 0; i < payload.length; i++) {
        const curActivity = payload[i];

        try {
            
            uploadActivityToDB(curActivity, client);

        } catch (error) {
            // Note acitivites that couldn't be uploaded
            unableToUpload.push(curActivity.id);
            continue;
        }
        
    }

    if (unableToUpload.length == 0) {
        return {message: "All acitivites uploaded"};
    } else {
        return {message: "Unable to upload activities" + unableToUpload};
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
  