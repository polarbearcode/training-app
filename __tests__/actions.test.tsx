import { getActivitesFromDB, getStravaActivities } from "app/lib/actions/strava-activities";

test("GetActivities pulls activities by email", async() =>  {
    const activityList = await getActivitesFromDB("user1@example.com");
    expect(activityList.length).toBe(1);
});

test("Gets error with wrong athlete id", async () => {
    const accessToken = "change me" //update each test run
    const athleteID = "123456" //random id
    const messages = await getStravaActivities(accessToken, athleteID, new Date().getTime());
    expect(messages.message).not.toBeNull();
})