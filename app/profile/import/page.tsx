/** Import Strava workouts page */

import Strava from "next-auth/providers/strava"
import { signIn } from "../../../auth";
import { getStravaActivities } from "app/lib/actions";


export default function Page() {
    return (
        <>
        <form
            action = {async() => {
                "use server"
                await getStravaActivities();
            }}
        >
            <button type="submit">Signin with Strava</button>
        </form>

     
  

        
        </>
        
    )
}