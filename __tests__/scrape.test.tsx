import { scrapeBostonTrainingPlan } from "app/lib/training-plans/scrape-plans";


test("Scrape 4 training plans", async() => {
    const levelOne = {
        "WEEK 1": {
            "MONDAY": "Rest",
            "TUESDAY": "6 mile Easy",
            "WEDNESDAY": "Cross training",
            "THURSDAY": "7 mile Aerobic",
            "FRIDAY": "Cross Training",
            "SATURDAY": "6 mile Easy",
            "SUNDAY": "7 mile Aerobic"
        },

        "WEEK 2": {
            "MONDAY": "Rest",
            "TUESDAY": "7 mile Aerobic", 
            "WEDNESDAY": "Cross Training",
            "THURSDAY": "7 mile Aerobic",
            "FRIDAY": "Cross Training",
            "SATURDAY": "6 mile Easy",
            "SUNDAY": "7 mile Aerobic"
        },

        "WEEK 3": {
            "MONDAY": "Rest",
            "TUESDAY" : "Speed",
            "WEDNESDAY": "Cross Training",
            "THURSDAY": "5 mile Easy",
            "FRIDAY": "Cross Training",
            "SATURDAY": "5 mile easy",
            "SUNDAY": "10 mile Aerobic"
        },

       
    }

    const scrapedPlan = await scrapeBostonTrainingPlan();

    expect(scrapedPlan).toBe(levelOne);
})


/**
 * Create weekly dictionary {"MONDAY": "Rest", "TUESDAY": "5 mile Aerobic", ....}
 * using the provided list of workout types 
 * @param workouts {string[]} a length 7 array of strings
 * @returns a dictionary
 */
function createWeeklyPlan(workouts: string[]) : Record<string, string> {
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const workoutWeek : Record<string, string> = {};
    for (let i = 0; i < workouts.length; i++) {
        const curDay = days[i];
        workoutWeek[curDay] = workouts[i];
    }

    return workoutWeek;
}

test ("Weekly plan created correctly", () => {
  
    const workouts = ["Rest", "6 mile Easy", "Cross Training", "7 mile Aerobic", "Cross Training", "6 mile Easy", "7 mile Aerobic"];

    const expected = {
        "MONDAY": "Rest",
        "TUESDAY": "6 mile Easy",
        "WEDNESDAY": "Cross Training",
        "THURSDAY": "7 mile Aerobic",
        "FRIDAY": "Cross Training",
        "SATURDAY": "6 mile Easy",
        "SUNDAY": "7 mile Aerobic"
    };

    const actual = createWeeklyPlan(workouts);

    expect(actual).toEqual(expected);
})