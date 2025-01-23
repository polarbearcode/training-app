'use client';
/** A week of training stats.
 * Used in training-weeks for the table
 */

import { DatabaseActivity, UserTrainingWeek } from "app/lib/definitions"
import { useEffect, useState } from "react";
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

    const [activitiesWithinDate, setActivitiesWithinDate] = useState<DatabaseActivity[]>([]);
    const [totalRuns, setTotalRuns]  = useState<number>(0);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [totalXtrain, setTotalXTrain] = useState<number>(0);
    const [totalHills, setTotalHills] = useState<number>(0);

    // Gets all the activities in the activityList that fall between beginDate and endDate
    function filterActivitesByDate() {

        const res: DatabaseActivity[] = []; // set activitiviesWithinDate to this after the loop

        for (let i = 0; i < activityList.length; i++) {
            const curActivity: DatabaseActivity = activityList[i];
    
            const curActivityDate: Date = new Date(curActivity.year, curActivity.month - 1, curActivity.day);
            
            if (curActivityDate >= beginDate && curActivityDate <= endDate) {
                activitiesWithinDate.push(curActivity);
            }
        };

        setActivitiesWithinDate(res);
    }

    // Create the summary stats for the activities that fall in the data range between beginDate and endDate
    function processStats() {

        let countTotalDistance = 0;
        let countTotalRuns = 0;
        let countHills = 0;
        let countXTrain = 0;


        for (let i = 0; i < activitiesWithinDate.length; i++) {

            const curActivity: DatabaseActivity = activitiesWithinDate[i]; 
    
            if (curActivity.activitytype === "Run") {
                countTotalRuns++;
                countTotalDistance += curActivity.distance;
    
                const runTags: string[] = analyzeRunType(curActivity.totalelevationgain, curActivity.distance, curActivity.averagespeed);
    
                if (runTags.includes("Hills")) {
                    countHills++;
                }
            }
    
            if (curActivity.activitytype === "Workout") {
                countXTrain++;
            }

        }

        setTotalDistance(countTotalDistance);
        setTotalRuns(countTotalRuns);
        setTotalXTrain(countXTrain);
        setTotalHills(countHills);

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

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            filterActivitesByDate();
            processStats();
        };

        return () => {ignore = false};


    }, [activityList, weeklyTraining])

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
                <table className="table-auto border border-slate-400 mx-auto">
                    <thead>
                        <tr>
                            <th className="border border-slate-300 p-2">Stat</th>
                            <th className="border border-slate-300 p-2">Weekly Total</th>
                            <th className="border border-slate-300 p-2">Planned</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300 p-2">Total Distance (miles)</td>
                            <td className="border border-slate-300 p-2">{convertMetersToMiles(totalDistance)}</td>
                            <td className="border border-slate-300 p-2">{getPlannedAmount(weekNum, "total_miles")}</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300 p-2">Total Runs</td>
                            <td className="border border-slate-300 p-2">{totalRuns}</td>
                            <td className="border border-slate-300 p-2">{getPlannedAmount(weekNum, "total_runs")}</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300 p-2">Total Easy Miles</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300 p-2">Total Aerobic Miles</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300 p-2">Total Marathon Pace Miles</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300 p-2">Total Hill Runs</td>
                        </tr>

                        <tr>
                            <td className="border border-slate-300 p-2">Total X-training Sessions</td>
                        </tr>

                    </tbody>

                </table>
        
            }

            
        </>
    )
}