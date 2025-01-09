'use client';
/** A week of training stats.
 * Used in training-weeks for the table
 */

import { DatabaseActivity } from "app/lib/definitions"
import { useState } from "react";
import { ArrowDownCircleIcon } from "@heroicons/react/16/solid";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { analyzeRunType } from "app/lib/ai/run-analysis";

export default function WeekTrainingStats({activityList, beginDate, endDate, weekNum} : {
    activityList: DatabaseActivity[];
    beginDate: Date;
    endDate: Date;
    weekNum: number
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
                    <li className="text-center">Total Distance: {totalDistance}</li>
                    <li className="text-center">Total Runs: {totalRuns}</li>
                    <li className="text-center">Total Long Runs: {typeOfRunCount["Long Run"]}</li>
                    <li className="text-center">Total Hill Runs: {typeOfRunCount["Hills"]}</li>
                    <li className="text-center">Total Easy Runs: {typeOfRunCount["Easy"]}</li>
                </ul>
            }

            
        </>
    )
}