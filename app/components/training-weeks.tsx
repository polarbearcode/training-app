import { DatabaseActivity } from "app/lib/definitions";
import { createWeekDateIntervals } from "app/lib/utils";
import WeekTrainingStats from "./weekly-training-stats";

/** Table of weekly training 
 * Used in the training/page.tsx page
*/
export default function WeeklyTrainingTable({activityList, userTrainingStartDate} : {
    activityList: DatabaseActivity[];
    userTrainingStartDate: Date;
}) {

    const weeklyIntervals = createWeekDateIntervals(userTrainingStartDate, 16);

    return (
        <>
            {weeklyIntervals.map((interval, i) => {
                return <div key={i}>
                        <h1>Week {i + 1}</h1>
                        <WeekTrainingStats 
                            activityList={activityList} 
                            beginDate={interval[0]} 
                            endDate={interval[1]} 
                            >
                        </WeekTrainingStats>
                    </div>
            })}
        </>
        
    )
}