'use client';
/** A week of training stats.
 * Used in training-weeks for the table
 */

import { DatabaseActivity } from "app/lib/definitions"
import { useState } from "react";

export default function WeekTrainingStats({activityList, beginDate, endDate} : {
    activityList: DatabaseActivity[];
    beginDate: Date;
    endDate: Date;
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

    for (let i = 0; i < activitiesWithinDate.length; i++) {

        const curActivity: DatabaseActivity = activitiesWithinDate[i]; 
        totalDistance += curActivity.distance;

        if (curActivity.activitytype === "Run") {
            totalRuns++;
        }
    }

    function toggleHide() {
        setHide(!hide);
    }




    return (
        <>
            <button onClick={toggleHide}>Hide</button>
            {!hide && 
                <ul>
                    <li>{totalDistance}</li>
                    <li>{totalRuns}</li>
                </ul>
            }
        </>
    )
}