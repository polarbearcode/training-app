/** Display activities as cards */
'use client'
import CategoryDropdown from "app/components/category-dropdown";
/** Page to display user activities */
import WorkoutCard from "app/components/workout-card";
import { getActivitesFromDB } from "app/lib/strava-activities";
import { DatabaseActivity } from "app/lib/definitions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function WorkOutDisplay({activityList} : {activityList: DatabaseActivity[]}) {

   
    const [viewCategory, setViewCategory] = useState("All"); // default filter to all


    return (
        <>
            <div id="filter" className="mb-6">
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