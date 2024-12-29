'use client'

/** Display for individual workouts (display in boxes) 
 * Similar to https://v1.tailwindcss.com/components/cards
 * Used in workout-display component
*/

import { numberDateToString } from "app/lib/utils"
import CategoryDropdown from "./category-dropdown"
import { useState } from "react"
import { analyzeRunType } from "app/lib/ai/run-analysis"

export default function WorkoutCardWrapper({
    distance, 
    elevation,
    averageSpeed,
    year, 
    month, 
    day,
    type
}  : 
    
    {
        distance: number,
        elevation: number,
        averageSpeed: number
        year: number,
        month: number,
        day: number,
        type: string
    }) {

    const [runType, setRunType] = useState('');
    const runTags = analyzeRunType(elevation, distance, averageSpeed);


    return (
        <>
            <div className={`max-w-sm rounded overflow-hidden shadow-lg border-4 p-20`}>
                <p>Distance: {distance}</p>
                <p>Elevation: {elevation}</p>
                <p>Average Speed: {averageSpeed}</p>
                <p>Date: {numberDateToString(year, month, day)}</p>
                <div>
                    <CategoryDropdown optionsList={["Long Run", "Tempo", "Speed"]} setterFunction = {setRunType}></CategoryDropdown>
                </div>
                <div id="tags" className="relative top-10">
                    {type === "Run" && runTags.map((tag, key) => {
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