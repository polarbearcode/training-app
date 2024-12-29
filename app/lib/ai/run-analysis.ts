/** Functions to analyze run activities */

import { DatabaseActivity } from "../definitions";

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