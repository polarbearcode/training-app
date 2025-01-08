/** Handles the api/profile/callback route
 * GET function is automatically called once the .../api/profile/callback route is called
 * use this as redirect uri in the redirect function in app/lib/strava-activities
 */
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { getStravaActivities, updateUserDataPullDateStrava } from 'app/lib/actions/strava-activities';
import { auth } from "../../../../auth"
import { getUserProfile } from 'app/lib/actions/actions';
import { UserProfileDataBase } from 'app/lib/definitions';


export async function GET(req: NextRequest) {  
 
  const session = await auth();

  const user: UserProfileDataBase = await getUserProfile(session?.user?.email!);

  const dataPullDate: number|undefined = user.strava_data_pull_date;

  // Figure out next auth, could implement check if token is not expired to save a request


  if (req.url) {
    // Get the user's code to exchange for authorization code
    const {searchParams}  = new URL(req.url); 

    const code = searchParams.get("code");

    // No code in response from Strava (maybe user hit cancel). Add handling.
    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });  
    }

    // Variables needed to make exchange POST request
    const clientId:string = process.env.AUTH_STRAVA_ID!;
    const clientSecret:string =  process.env.AUTH_STRAVA_SECRET!;
    const redirectUri = 'http://localhost:8000/profile/import';
    const baseURL:string = process.env.BASE_URL!;

    try {
    
      const response = await axios.post('https://www.strava.com/oauth/token', null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        },
      });

    
      const access_token = response.data.access_token; // user access token
      const athlete_id = response.data.athlete.id;
    
      // Get and upload activities to database
      const processActivities =  await getStravaActivities(access_token, athlete_id, dataPullDate);

      const updateDataPullDate = await updateUserDataPullDateStrava(processActivities.updateDataPullDate, session?.user?.email!);

/**      if (processActivities.error) {
        return NextResponse.json({ error: 'Unable to get activities or unable to put them to database' }, { status: 500 });
      } */


      

      if (response.statusText != 'OK') {
        return NextResponse.json({ error: 'Failed to exchange code for access token' }, { status: 500 });
      }      


      return NextResponse.redirect(baseURL, {status:307});

    


      //return NextResponse.json({ message: 'Exchange success' }, { status: 302 });

    } catch (error) {
      console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
  } else {
    return NextResponse.json({error: "Redirect URL not valid"}, {status: 400});
  } 
}
