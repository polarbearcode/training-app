'use client'

import { useState } from "react";
import WorkOutDisplay from "./workout-display";
import WeeklyTrainingTable from "./training-weeks";
import { DatabaseActivity } from "app/lib/definitions";

/** Used in the training/page.tsx */

export default function TrainingTabs({email, activityList, userTrainingStartDate, userMarathons} : {
    email: string;
    activityList: DatabaseActivity[];
    userTrainingStartDate: Date;
    userMarathons: string[]
}) {
    
    const [currentTab, setCurrentTab] = useState("Workouts");

    return (
        <>
            <div id="selection-tab" className="grid grid-cols-2 mb-10">
                <button onClick={() => setCurrentTab("Workouts")} className={`${currentTab === "Workouts" ? 'bg-orange-300' : ''}`}>
                    Workouts
                </button>
                <button onClick={() => setCurrentTab("Training")} className={`${currentTab === "Training" ? 'bg-orange-300' : ''}`}>
                     Weekly Training
                </button>
            </div>
            {currentTab === "Workouts" && <WorkOutDisplay activityList={activityList}></WorkOutDisplay>}
            {currentTab === "Training" && <WeeklyTrainingTable activityList={activityList} 
                userTrainingStartDate={userTrainingStartDate}
                email={email}
                userMarathons={userMarathons}
            />
            }
        
        </>
    )
}