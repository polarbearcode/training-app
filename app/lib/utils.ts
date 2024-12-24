/** Various utility functions */


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