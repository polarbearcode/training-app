/** Display for individual workouts (display in boxes) */

import { getActivitesFromDB } from "app/lib/actions"

export default function WorkoutCardWrapper({
    distance, 
    elevation,
    averageSpeed,
    year, 
    month, 
    day}: 
    
    {
        distance: number,
        elevation: number,
        averageSpeed: number
        year: number,
        month: number,
        day: number
    }) {
  

    return (
        <>
            <div className="roundded0xl bg-gray-50 p-2 shaow-sm">
                <p>Distance: {distance}</p>
                <p>Elevation: {elevation}</p>
                <p>Average Speed: {averageSpeed}</p>
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