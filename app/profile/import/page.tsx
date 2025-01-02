/** Import Strava workouts page */
import { getStravaUserCodeRedirect } from "app/lib/actions/strava-activities";



export default async function Page() {
    return (
        <>
        <form
            action = {async() => {
                "use server"
                await getStravaUserCodeRedirect();
            }}
        >
            <button type="submit">Import Activites</button>
        </form>
     
        
        </>
        
    )
}