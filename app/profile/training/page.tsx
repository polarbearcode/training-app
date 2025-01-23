
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
    const userTrainingStartDate: Date = (await getUserProfile(session?.user?.email!)).training_start_date;
    const userMarathons: string[] = await getUserMarathons(session?.user?.email!);



    return (
        <TrainingTabs email={session?.user?.email!} activityList={activityList} userTrainingStartDate={userTrainingStartDate} userMarathons={userMarathons}></TrainingTabs>
        
    )
}