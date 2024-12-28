'use client'

import WeeklyTrainingTable from "app/components/training-weeks";
import WorkOutDisplay from "app/components/workout-display";
import { DatabaseActivity } from "app/lib/definitions";
import { getActivitesFromDB } from "app/lib/strava-activities";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/** Page for workout display and training per week. Two different tabs */

export default function page() {

    const {data:session, status} = useSession();
    const [currentTab, setCurrentTab] = useState("Workouts"); // use to change between workout list and weekly tab
    const [activityList, setActivityList]= useState<DatabaseActivity[]>([]); // Activity list pulled from database

    /** Runs the effect once and then when email changes */
    useEffect(() => {
        let ignore = false;
        console.log(status);
        getActivitesFromDB(session?.user?.email!).then(result => {
            if (!ignore) {
                console.log(result);
                setActivityList(result);
            }
        });

        return () => {ignore = true;}; //figure out if I need to return anything here
    }, [status]); // figure out a way to make only one fetch of data

    return (
        <>
            <div id="selection-tab" className="grid grid-cols-2 mb-10">
                <button onClick={() => setCurrentTab("Workouts")} className={`${currentTab === "Workouts" ? 'bg-orange-300' : ''}`}>
                    Workouts
                </button>
                <button onClick={() => setCurrentTab("Training")} className={`${currentTab === "Training" ? 'bg-orange-300' : ''}`}>
                    Weekly Training
                </button>
            </div>

            {currentTab === "Workouts" && <WorkOutDisplay activityList={activityList}></WorkOutDisplay>}
            {currentTab === "Training" && <WeeklyTrainingTable activityList={activityList}></WeeklyTrainingTable>}

        
        
        </>
        
    )
}