/** Scrape training plans*/

import axios from "axios";
import * as cheerio from 'cheerio';

/**
 * Scrape the 4 levels of training plans on 
 * https://www.baa.org/races/boston-marathon/boston-marathon-training
 */

const dayRegex = /^\s*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)\n\s+(.+)$/gm;
const weekRegex = /^\s*(WEEK\s*\d+)\n.*$/gm;
const weekRegex2 = /^\s*(WEEK\s*\d+)\n.*$/gm;



export async function scrapeBostonTrainingPlan() : Promise<Record<string, Record<string, string>>> {

    const levelOneURL = "https://www.baa.org/races/boston-marathon/train/levelone"

    const { data } = await axios.get(levelOneURL);
    const $ = cheerio.load(data); // load the HTML document for parsing/selecting/etc

    const $table = $('table > tbody > tr'); // gets the table element

    const result : Record<string, Record<string, string>> = {};

    let currentWeek = "";


    let weekly : Record<string, string> =  {};

    for (const element of $table.toArray()) {
        const elementText = $(element).text();


        if (currentWeek === "") {
            const weekMatch = elementText.matchAll(weekRegex);

            

            for (const match of weekMatch) {
                currentWeek = match[1];
            }

            weekly = {};

        } else {
  
            const dayMatch = elementText.matchAll(dayRegex);

            for (const match of dayMatch) {

 
                
                const day : string  = match[1]
                weekly[day] = match[2];

                if (day === "SUNDAY") {
                    result[currentWeek] = weekly;
                    currentWeek = "";
                }
            }
        }
        
    }

    
    //console.log($table); 

    return result;


}