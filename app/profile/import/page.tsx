/** Import Strava workouts page */
import { getStravaUserCodeRedirect } from "app/lib/actions";



export default async function Page() {
    return (
        <>
        <form
            action = {async() => {
                "use server"
                await getStravaUserCodeRedirect();
            }}
        >
            <button type="submit">Signin with Strava</button>
        </form>
     
        
        </>
        
    )
}