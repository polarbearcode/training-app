'use client'
/** Page to display user activities */
import WorkoutCard from "app/components/workout-card";
import { getActivitesFromDB } from "app/lib/actions";
import { DatabaseActivity } from "app/lib/definitions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WorkOuts() {

    const {data: session, status} = useSession();
    const [activityList, setActivityList]= useState<DatabaseActivity[]>([]);

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
    }, [status]);

    if (status === 'unauthenticated') {
        return <div>Loading</div>
    }

    return (
        <>
            <div className="flex">
                {activityList.map((activity, i) => {
                    return <WorkoutCard 
                        distance = {activity.distance}
                        elevation = {activity.totalelevationgain}
                        averageSpeed = {activity.averagespeed}
                        year = {activity.year}
                        month = {activity.month}
                        day = {activity.day}
                        key = {i}
                    />
                })}   
            </div>
        </>
        
    ) 
}