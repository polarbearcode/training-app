import { analyzeRunPercentages, analyzeRunType } from "app/lib/ai/run-analysis"
import { DatabaseActivity } from "app/lib/definitions"

test("Get run tags", () => {
    expect(analyzeRunType(150, 7999, 2)).toEqual(["Hills", "Easy"]);
})

test("Get run percentages", () => {

    const dummyLaps = {'Lap 1': {"distance": 1609.34, "average_speed": 2.82}, //9
    'Lap 2': {"distance": 1609.34, "average_speed": 2.99}, 'Lap 3': {"distance": 1609.34, "average_speed": 3.16,},
    'Lap 4': {"distance": 1609.34, "average_speed": 3.36,}, 'Lap 5': {"distance": 1609.34, "average_speed": 3.58,},
    'Lap 6': {distance: 1609.34, "average_speed": 3.84}, 'Lap 7': {distance: 1609.34, "average_speed": 2.98},
    'Lap 8': {distance: 1609.34, "average_speed": 3.15}, 'Lap 9': {distance: 1609.34, "average_speed": 3.35},
    'Lap 10': {distance: 1609.34, "average_speed": 3.57}}


    const activity1: DatabaseActivity = {activityid: '1', athleteid: '1', activitytype: "Run", year: 2025, month: 1, day: 2, distance: 16093.4, 
        totalelevationgain: 0, averagespeed: 0, averagecadence: 0, maxspeed: 0, averageheartrate: 0, 
        email: 'dummy@example.com', laps: JSON.parse(JSON.stringify(dummyLaps))};
    
    const activity2: DatabaseActivity = {activityid: '1', athleteid: '1', activitytype: "Run", year: 2025, month: 1, day: 2, distance: 16093.4, 
        totalelevationgain: 0, averagespeed: 0, averagecadence: 0, maxspeed: 0, averageheartrate: 0, 
        email: 'dummy@example.com', laps: JSON.parse(JSON.stringify(dummyLaps))};

    const activity3: DatabaseActivity = {activityid: '1', athleteid: '1', activitytype: "Workout", year: 2025, month: 1, day: 2, distance: 16093.4, 
        totalelevationgain: 0, averagespeed: 0, averagecadence: 0, maxspeed: 0, averageheartrate: 0, 
        email: 'dummy@example.com', laps: JSON.parse(JSON.stringify(dummyLaps))};

    const expectedPercentages = {easy: 0.2, aerobic: 0.2, mp: 0.2, hm: 0.2, '5K': 0.1, '10K': 0.1};
    const actualPercentages = analyzeRunPercentages([activity1, activity2, activity3], 8.5);

    Object.entries(expectedPercentages).forEach(([key, value]) => {
        expect(Math.round(actualPercentages[key as keyof typeof actualPercentages] * 100) / 100).toBe(expectedPercentages[key as keyof typeof expectedPercentages]);
    })

})