/** Various utility functions */

import { queryObjects } from "v8";

const MONTHS: Record<string, string> = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}

Object.freeze(MONTHS);


/**
 * Format date object like '2024-12-20T23:50:56Z' into 
 * three items: year, month, day to be destrcutred.
 * @param dateString {string} The date string returned by Strava activity
 */
export function processDate(dateString: string): {year: number, month: number, day:number} {

    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/g;

    let matchYear: number = 0;
    let matchMonth: number = 0;
    let matchDay: number = 0;

    for (const match of dateString.matchAll(dateRegex)) {
    
        matchYear = parseInt(match[1]);
        matchMonth = parseInt(match[2]);
        matchDay = parseInt(match[3]);
        
    }

    return {year: matchYear, month: matchMonth, day: matchDay};

}

/**
 * Convert YYYY-MM-DD to a readable string format
 * @param year {number} 4 digit number
 * @param month {number} 2 digit number
 * @param day   {number} 2 digit number
 */
export function numberDateToString(year: number, month: number, day: number): string {
    const monthString = MONTHS[month.toString()];
    return monthString + " " + day.toString() + ", " + year.toString();

}

/**
 * Converts a number of minutes and seconds into a float rounded to 2 decimal places. 
 * 8 minutes and 30 seconds would be 8.5.
 * @param minutes {number} number of minutes. Must be >= 0.
 * @param seconds {number} must be  >= 0 and less than 60
 * @returns {number} a float value. Error if invalid arguments. 
 */
export function minutesSecondsToFloat(minutes : number, seconds: number) : number {
    if (seconds < 0 || seconds >= 60 || minutes < 0) {
        throw new Error("invalid arguments");
    }

    return Math.round((minutes + seconds / 60) * 100) / 100;
}

/**
 * Create a list of NUMINTERVALS weekly intervals starting with the provided beginning date. 
 * @param beginDate {Date} the start date
 * @param numIntervals {number} the number of intervals to create
 * @returns {Array[<Date, Date>]} a length 16 array of date intervals each pair is beginning and end of that interval.
 */
export function createWeekDateIntervals(beginDate: Date, numIntervals: number) : Array<[Date, Date]> {
    const intervals: Array<[Date, Date]> = [];
    for (let i = 0; i < numIntervals; i++ ) {
        intervals.push([beginDate, new Date(beginDate.getTime() + (86400000 * 6))]);
        beginDate = new Date(beginDate.getTime() + (86400000 * 7));
    }
    return intervals;
}