
import WeeklyTrainingTable from "app/components/training-weeks";
import WorkOutDisplay from "app/components/workout-display";
import { DatabaseActivity } from "app/lib/definitions";
import { getActivitesFromDB } from "app/lib/actions/strava-activities";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { getUserProfile } from "app/lib/actions/actions";
import { auth } from "auth";
import TrainingTabs from "app/components/training-tabs";

/** Page for workout display and training per week. Two different tabs */

export default async function page() {

    const session = await auth();


    //const [currentTab, setCurrentTab] = useState("Workouts"); // use to change between workout list and weekly tab // move to a new component
    //const [activityList, setActivityList]= useState<DatabaseActivity[]>([]); // Activity list pulled from database // get the data here then pass down as prop to the 2 components
    //const [userTrainingStartDate, setUserTrainingStartDate] = useState(new Date()); // same idea

    const activityList: DatabaseActivity[] = await getActivitesFromDB(session?.user?.email!);
    let userTrainingStartDate: Date = (await getUserProfile(session?.user?.email!)).training_start_date

    /** Runs the effect once and then when email changes 
    useEffect(() => {
        let ignore = false;
        getActivitesFromDB(session?.user?.email!).then(result => {
            if (!ignore) {
                result.sort(function(a, b) {
                    return parseInt(b.activityid) - parseInt(a.activityid);
                });

                setActivityList(result);
            }

            getUserProfile(session?.user?.email!).then(result => {
                if (!ignore) {
                    setUserTrainingStartDate(result.training_start_date);
                }
            })
        });

        return () => {ignore = true;}; //figure out if I need to return anything here
    }, [status]); // figure out a way to make only one fetch of data */

    return (
        <TrainingTabs email={session?.user?.email!} activityList={activityList} userTrainingStartDate={userTrainingStartDate}></TrainingTabs>
        
    )
}