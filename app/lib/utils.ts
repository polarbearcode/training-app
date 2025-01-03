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