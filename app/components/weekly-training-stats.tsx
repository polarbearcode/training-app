'use client';
/** A week of training stats.
 * Used in training-weeks for the table
 */

import { DatabaseActivity, UserTrainingWeek } from "app/lib/definitions"
import { useState } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/16/solid";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { analyzeRunType } from "app/lib/ai/run-analysis";
import { convertMetersToMiles } from "app/lib/utils";

export default function WeekTrainingStats({activityList, beginDate, endDate, weekNum, weeklyTraining} : {
    activityList: DatabaseActivity[];
    beginDate: Date;
    endDate: Date;
    weekNum: number;
    weeklyTraining: Record<number, UserTrainingWeek>;
}) {

   
    // for toggling showing stats

    const [hide, setHide] = useState(true);

    // get the activities that fall in the date range
    const activitiesWithinDate: DatabaseActivity[] = [];

    for (let i = 0; i < activityList.length; i++) {
        const curActivity: DatabaseActivity = activityList[i];

        const curActivityDate: Date = new Date(curActivity.year, curActivity.month - 1, curActivity.day);
        
        if (curActivityDate >= beginDate && curActivityDate <= endDate) {
            activitiesWithinDate.push(curActivity);
        }
    };

    // process stats
    let totalRuns = 0;
    let totalDistance = 0;
    let totalStrengthTraining  = 0;
    let typeOfRunCount: Record<string, number> = {"Long Run": 0, "Hills": 0, "Easy": 0};

    for (let i = 0; i < activitiesWithinDate.length; i++) {

        const curActivity: DatabaseActivity = activitiesWithinDate[i]; 
        totalDistance += curActivity.distance;

        if (curActivity.activitytype === "Run") {
            totalRuns++;

            const runTags: string[] = analyzeRunType(curActivity.totalelevationgain, curActivity.distance, curActivity.averagespeed);

            for (let j = 0; j < runTags.length; j++) {
                typeOfRunCount[runTags[j]] = typeOfRunCount[runTags[j]] + 1;
            }
        }

        if (curActivity.activitytype === "Workout") {
            totalStrengthTraining++;
        }


    }

    function toggleHide() {
        setHide(!hide);
    }

    /**
     * Get the planned amount for a specific aspect of training for a week.
     * Example: week 1 total 5k miles planned: getPlannedAmount(1, "total_5k_miles")
     * @param week {number} the week number 
     * @param attr {string} which aspect of training to get the planned amount for
     * @returns {number} the planned quantity
     */
    function getPlannedAmount(week: number, attr: string): number {

    
        // week has to be >= 0
        if (week <= 0) {
            throw Error("week number invalid");
        }

        let val: UserTrainingWeek = weeklyTraining[week]; // undefined if week is beyond training weeks like 17 for 16 week plan

        console.log(val);

        if (val) {
            const returnVal = val[attr as keyof typeof val];

            if (typeof returnVal === "number" && returnVal != null) {
                return returnVal
            }
        }

        return 0;
    }

    if (Object.keys(weeklyTraining).length === 0) {
        return <p>Loading</p>
    }





    return (
        <>
        <div className="grid grid-cols-2 p-4">
            <h1>Week {weekNum}: </h1>
            <button onClick={toggleHide} className="border-solid border-2 bg-green-50 p-2 h-10">
                {hide? "Show" : "Hide"}
            </button>
        </div>
    
        {!hide && 
                <ul>
                    <li className="text-center">
                        Total Distance: {convertMetersToMiles(totalDistance)} miles
                        Planned Distance: {getPlannedAmount(weekNum, "total_miles")} miles
                    </li>
                    <li className="text-center">
                        Total Runs: {totalRuns}
                        Planned Runs: {getPlannedAmount(weekNum, "total_runs")}
                    </li>
                    <li className="text-center">Total Long Runs: {typeOfRunCount["Long Run"]}</li>
                    <li className="text-center">Total Hill Runs: {typeOfRunCount["Hills"]}</li>
                    <li className="text-center">Total Easy Runs: {typeOfRunCount["Easy"]} 
                        Plan: {weeklyTraining && weeklyTraining[weekNum - 1] && weeklyTraining[weekNum - 1].total_easy_miles}</li>
                </ul>
            }

            
        </>
    )
}