import { getActivitesFromDB } from "app/lib/actions";

test("GetActivities pulls activities by email", async() =>  {
    const activityList = await getActivitesFromDB("user1@example.com");
    expect(activityList.length).toBe(1);
})