'use client'

import { DatabaseActivity, UserTrainingWeek } from "app/lib/definitions";
import { createWeekDateIntervals } from "app/lib/utils";
import WeekTrainingStats from "./weekly-training-stats";
import { useEffect, useState } from "react";
import { getUserMarathons, getUserTrainingPlan } from "app/lib/actions/actions";

/** Table of weekly training 
 * Used in the training-tabs component
*/
export default function WeeklyTrainingTable({activityList, userTrainingStartDate, email, userMarathons, goalPace} : {
    activityList: DatabaseActivity[];
    userTrainingStartDate: Date;
    email: string;
    userMarathons: string[];
    goalPace: number;
}) {

    const [currentMarathon, setCurrentMarathon] = useState<string>('');
    const [userTrainingPlan, setUserTrainingPlan] = useState<Record<number, UserTrainingWeek>>({});
    const [userMarathonOptions, setUserMarathonOptions] = useState<string[]>(userMarathons);

    useEffect(() => {
        let ignore = false;

        if (!ignore) {
            
            setCurrentMarathon(userMarathonOptions[0]);
    
            if (currentMarathon != '') {
                getUserTrainingPlan(email, currentMarathon).then(result => {
            
                    console.log(currentMarathon);
                    setUserTrainingPlan(result);
                    
                });
    
            }
        }

        return () => {ignore = false};
        

    }, [currentMarathon])

    const weeklyIntervals = createWeekDateIntervals(userTrainingStartDate, 16);


    return (
        <>
            <div id="marathon-selector">
                <select>
                    {userMarathonOptions.map((marathonName, i) => {
                        return <option key = {i}>{marathonName}</option>
                    })}

                </select>
            </div>
            {weeklyIntervals.map((interval, i) => {
                return <div key={i}>
                        <WeekTrainingStats 
                            activityList={activityList} 
                            beginDate={interval[0]} 
                            endDate={interval[1]} 
                            weekNum={i + 1}
                            weeklyTraining={userTrainingPlan}
                            goalPace={goalPace}
                            />
                    </div>
            })}
        </>
        
    )
}