/** Functions to analyze run activities */

import { DatabaseActivity } from "../definitions";
import { convertMinutesToMetersPerSec } from "../utils";

/**
 * Generate tags for runs based on run stats
 * @param elevation {number} elevation gain from the run in meters
 * @param distance {number} the distance ran in meters
 * @param speed  {number} the average speed of the run in meters/second
 * @returns {string[]} a list of tags 
 */
export function analyzeRunType(elevation: number, distance: number, speed: number) : string[] {

    const tags = [];

    if (elevation >= 150) {
        tags.push("Hills");
    }

    if (distance > 8000) {
        tags.push("Long Run");
    }

    const speedInMinPerMile = helperSpeedToMinPerMile(speed);
    tags.push(helperCategorizeSpeed(speedInMinPerMile));

    return tags;
}


/**
 * Determine run effort based on speed between categories of:
 * easy, aerobic, 10K, HM, MP (can add others later)
 * Hard code the categories for now (need to personalize later)
 * @param speed {number} in minutes per mile
 * @returns one of the run categories
 */
function helperCategorizeSpeed(speed : number) : string {
    if (speed < 6.25) {
        return "10K";
    } else if (speed < 6.5) {
        return "HM";
    } else if (speed < 6.7) {
        return "MP";
    } else if (speed < 8) {
        return "Aerobic";
    } else {
        return "Easy";
    }
}

/**
 * Helper function to conver speed in meters per second to minutes per mile
 * @param speed {number} in meters per second
 * @returns equivalent speed in minute per mile pace
 */
function helperSpeedToMinPerMile(speed : number) : number {
    return 26.8224 / speed ;
}

/**
 * Go through a list of activites and breakdown percentages of runs
 * at different paces. Ignores non run activities
 * @param activityList {DatabaseActivity[]} list of activities
 * @param goalPace {number} the user's goal pace min/mile in seconds. Used to calculate the pace of each category
 * @returns {Record<string, number>} percentages for each category
 */
export function analyzeRunPercentages(activityList: DatabaseActivity[], goalPace: number): {
    easy: number, 
    aerobic: number, 
    hm: number, 
    mp: number,
    '5K': number,
    '10K': number
} {
    
    let easyTotal: number = 0;
    let aerobicTotal: number = 0;
    let hmTotal: number = 0;
    let mpTotal: number = 0;
    let fiveKTotal: number = 0;
    let tenKTotal: number = 0;

    let totalMiles: number = 0;

    

    let easyPace: number = goalPace + 1;
    let aerobicPace: number = goalPace + 0.5;

    let hmPace: number = goalPace - 0.5;
    let tenKPace: number = hmPace - 0.5;
    let fiveKPace: number = tenKPace - 0.5;

    easyPace = convertMinutesToMetersPerSec(easyPace);
    aerobicPace = convertMinutesToMetersPerSec(aerobicPace);
    hmPace = convertMinutesToMetersPerSec(hmPace);
    tenKPace = convertMinutesToMetersPerSec(tenKPace);
    fiveKPace = convertMinutesToMetersPerSec(fiveKPace);
    const mp = convertMinutesToMetersPerSec(goalPace);

    //console.log(easyPace, aerobicPace, hmPace, tenKPace, fiveKPace, mp);



    // calculate the distances per pace and get total distance of all runs
    for (let i = 0; i < activityList.length; i++) {
        const curActivity: DatabaseActivity = activityList[i];

        // Skip if not a run
        if (curActivity.activitytype != 'Run') {
            continue;
        }

        totalMiles += curActivity.distance;

        const activityLaps: Record<string, Record<string, number>> = JSON.parse(JSON.stringify(curActivity.laps));
       

        // calculate which pace distance per lap falls (each mile)
        for (const key in activityLaps) {
            const speed: number = activityLaps[key].average_speed;
            const addDistance: number = activityLaps[key].distance; 

      
            
            switch(true) {
                case speed >= fiveKPace:
                    fiveKTotal += addDistance
                    break;
                case speed >= tenKPace:
                    tenKTotal += addDistance
                    break;
                case speed >= hmPace:
                    hmTotal += addDistance
                    break;
                case speed >= mp:
                    mpTotal += addDistance;
                    break;
                case speed >= aerobicPace:
                    aerobicTotal += addDistance;
                    break;
                default:
                  
                    easyTotal += addDistance;
            };
        };
        
    };


    return {easy: easyTotal / totalMiles, aerobic: aerobicTotal / totalMiles, mp: mpTotal / totalMiles, hm: hmTotal / totalMiles,
         '5K': fiveKTotal/ totalMiles, '10K': tenKTotal / totalMiles
    }



}