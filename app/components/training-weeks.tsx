import { DatabaseActivity } from "app/lib/definitions";
import { createWeekDateIntervals } from "app/lib/utils";
import WeekTrainingStats from "./weekly-training-stats";

/** Table of weekly training */
export default function WeeklyTrainingTable({activityList, userTrainingStartDate} : {
    activityList: DatabaseActivity[];
    userTrainingStartDate: Date;
}) {

    const weeklyIntervals = createWeekDateIntervals(userTrainingStartDate, 16);

    return (
        <>
            {weeklyIntervals.map((interval, i) => {
                return <WeekTrainingStats 
                    activityList={activityList} 
                    beginDate={interval[0]} 
                    endDate={interval[1]} 
                    key={i}
                    weekNum={i + 1}
                    >
                    
                </WeekTrainingStats>
            })}
        </>
        
    )
}