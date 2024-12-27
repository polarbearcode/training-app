'use client'
import CategoryDropdown from "app/components/category-dropdown";
/** Page to display user activities */
import WorkoutCard from "app/components/workout-card";
import { getActivitesFromDB } from "app/lib/actions";
import { DatabaseActivity } from "app/lib/definitions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WorkOuts() {

    const {data: session, status} = useSession();
    const [activityList, setActivityList]= useState<DatabaseActivity[]>([]); // Activity list pulled from database
    const [viewCategory, setViewCategory] = useState("All"); // default filter to all

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

    if (status === 'unauthenticated') {
        return <div>Loading</div>
    }

    return (
        <>
            <div id="filter">
                {/** Consider making a check box list instead*/}
                <CategoryDropdown optionsList={["All", "Run", "Soccer"]} setterFunction={setViewCategory} ></CategoryDropdown>
            </div>
            <div className="grid grid-cols-3 gap-x-10 gap-y-10 mb-4">
                {activityList.map((activity, i) => {
                    if (viewCategory === "All" || activity.activitytype === viewCategory) {
                        return <WorkoutCard 
                            distance = {activity.distance}
                            elevation = {activity.totalelevationgain}
                            averageSpeed = {activity.averagespeed}
                            year = {activity.year}
                            month = {activity.month}
                            day = {activity.day}
                            key = {i}
                        />
                    }
                })}   
            </div>
        </>
        
    ) 
}