import { analyzeRunPercentages, analyzeRunType } from "app/lib/ai/run-analysis"
import { DatabaseActivity } from "app/lib/definitions"

test("Get run tags", () => {
    expect(analyzeRunType(150, 7999, 2)).toEqual(["Hills", "Easy"]);
})

test("Get run percentages", () => {

    const dummyLaps = {'Lap 1': {"distance": 1609.34, "average_speed": 5}, //9
    'Lap 2': {"distance": 1609.34, "average_speed": 4}, 'Lap 3': {"distance": 1609.34, "average_speed": 4.1,},
    'Lap 4': {"distance": 1609.34, "average_speed": 5.5,}, 'Lap 5': {"distance": 1609.34, "average_speed": 4.5,},
    'Lap 6': {distance: 1609.34, "average_speed": 3.5}, 'Lap 7': {distance: 1609.34, "average_speed": 3.5},
    'Lap 8': {distance: 1609.34, "average_speed": 3}, 'Lap 9': {distance: 1609.34, "average_speed": 3},
    'Lap 10': {distance: 1609.34, "average_speed": 2.5}}


    const activity1: DatabaseActivity = {activityid: '1', athleteid: '1', activitytype: "Run", year: 2025, month: 1, day: 2, distance: 16093.4, 
        totalelevationgain: 0, averagespeed: 0, averagecadence: 0, maxspeed: 0, averageheartrate: 0, 
        email: 'dummy@example.com', laps: JSON.parse(JSON.stringify(dummyLaps))};
    
    const activity2: DatabaseActivity = {activityid: '1', athleteid: '1', activitytype: "Run", year: 2025, month: 1, day: 2, distance: 16093.4, 
        totalelevationgain: 0, averagespeed: 0, averagecadence: 0, maxspeed: 0, averageheartrate: 0, 
        email: 'dummy@example.com', laps: JSON.parse(JSON.stringify(dummyLaps))};

    const activity3: DatabaseActivity = {activityid: '1', athleteid: '1', activitytype: "Workout", year: 2025, month: 1, day: 2, distance: 16093.4, 
        totalelevationgain: 0, averagespeed: 0, averagecadence: 0, maxspeed: 0, averageheartrate: 0, 
        email: 'dummy@example.com', laps: JSON.parse(JSON.stringify(dummyLaps))};

    const expectedPercentages = {easy: 0.1, aerobic: 0.4, mp: 0.2, hm: 0.1, '5K': 0.1, '10K': 0.1};

    expect(analyzeRunPercentages([activity1, activity2, activity3], 4)).toEqual(expectedPercentages);
})