/** Handles the api/profile/callback route
 * GET function is automatically called
 */
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { getStravaActivities } from 'app/lib/actions';


export async function GET(req: NextRequest) {  

  
 
  //const session = await auth();

  // Figure out next auth, could implement check if token is not expired to save a request


  if (req.url) {
    const {searchParams}  = new URL(req.url); 

    const code = searchParams.get("code");


    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });  
    }

    
    const clientId:string = process.env.STRAVA_CLIENT!;
    const clientSecret:string =  process.env.STRAVA_SECRET!;
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
    

      const processActivities =  await getStravaActivities(access_token, athlete_id);

      if (processActivities.error) {
        return NextResponse.json({ error: 'Failed to exchange code for access token' }, { status: 500 });
      }


      

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
