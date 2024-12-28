'use client'

/** Display for individual workouts (display in boxes) 
 * Similar to https://v1.tailwindcss.com/components/cards
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
    day}: 
    
    {
        distance: number,
        elevation: number,
        averageSpeed: number
        year: number,
        month: number,
        day: number
    }) {

    const [runType, setRunType] = useState('');
    const runAnalysisType = analyzeRunType(elevation, distance);


    return (
        <>
            <div className={`max-w-sm rounded overflow-hidden shadow-lg border-4 p-3" ${runAnalysisType === "Hill" ? 'border-orange-300' : '' } ${runAnalysisType === "Long"? 'border-green-300': ''}`}>
                <p>Distance: {distance}</p>
                <p>Elevation: {elevation}</p>
                <p>Average Speed: {averageSpeed}</p>
                <p>Date: {numberDateToString(year, month, day)}</p>
                <div>
                    <CategoryDropdown optionsList={["Long Run", "Tempo", "Speed"]} setterFunction = {setRunType}></CategoryDropdown>
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