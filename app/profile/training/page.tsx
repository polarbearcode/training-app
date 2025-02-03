
import WeeklyTrainingTable from "app/components/training-weeks";
import WorkOutDisplay from "app/components/workout-display";
import { DatabaseActivity } from "app/lib/definitions";
import { getActivitesFromDB } from "app/lib/actions/strava-activities";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { getUserMarathons, getUserProfile } from "app/lib/actions/actions";
import { auth } from "auth";
import TrainingTabs from "app/components/training-tabs";

/** Page for workout display and training per week. Two different tabs */

export default async function page() {

    const session = await auth();


    const activityList: DatabaseActivity[] = await getActivitesFromDB(session?.user?.email!);

    activityList.sort((activityA, acvtivityB) => (acvtivityB.year * 50 + acvtivityB.month + acvtivityB.day) - (activityA.year * 50 + activityA.month + activityA.day));
    const userTrainingStats = await getUserProfile(session?.user?.email!);
    const userTrainingStartDate: Date = userTrainingStats.training_start_date;
    const userGoalPace: number = userTrainingStats.pace_minutes + (userTrainingStats.pace_seconds / 60);
    const userMarathons: string[] = await getUserMarathons(session?.user?.email!);



    return (
        <TrainingTabs 
            email={session?.user?.email!} 
            activityList={activityList} 
            userTrainingStartDate={userTrainingStartDate} 
            userMarathons={userMarathons}
            goalPace={userGoalPace}
        />
            
        
    )
}