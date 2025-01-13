'use client'

/** Display for individual workouts (display in boxes) 
 * Similar to https://v1.tailwindcss.com/components/cards
 * Used in workout-display component
*/

import { convertFloatToMinutesSeconds, convertMetersToMiles, numberDateToString } from "app/lib/utils";
import { analyzeRunType } from "app/lib/ai/run-analysis";

export default function WorkoutCardWrapper({
    distance, 
    elevation,
    averageSpeed,
    year, 
    month, 
    day,
    activityType
}  : 
    
    {
        distance: number,
        elevation: number,
        averageSpeed: number
        year: number,
        month: number,
        day: number,
        activityType: string
    }) {

    
    const runTags = analyzeRunType(elevation, distance, averageSpeed);


    return (
        <>
            <div className={`max-w-sm rounded overflow-hidden shadow-lg border-4 p-20`}>
                <p>Distance: {convertMetersToMiles(distance)} miles</p>
                <p>Elevation: {elevation} meters</p>
                {activityType === "Run" && <p>Average Speed: {convertFloatToMinutesSeconds(26.8224 / averageSpeed)}</p>}
                <p>Date: {numberDateToString(year, month, day)}</p>
                <div id="tags" className="relative top-10">
                    {activityType === "Run" && runTags.map((tag, key) => {
                        return <p key={key} className="text-xs">{tag}</p>
                    })}
                </div>
            </div>
        </>
    )
}

export function WorkoutCard() {
    return (
        <>
            <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
                <p>Card</p>
            </div>
        </>
    )
}