/** A week of training stats.
 * Used in training-weeks for the table
 */

import { DatabaseActivity } from "app/lib/definitions"

export default function WeekTrainingStats({activityList, beginDate, endDate, weekNum} : {
    activityList: DatabaseActivity[];
    beginDate: Date;
    endDate: Date;
    weekNum: number
}) {

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
    let totalDistance = 0;

    for (let i = 0; i < activitiesWithinDate.length; i++) {
        totalDistance += activitiesWithinDate[i].distance;
    }




    return <p>Week {weekNum}: {totalDistance}</p>
}