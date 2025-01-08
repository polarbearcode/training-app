import { processDate, numberDateToString, createWeekDateIntervals } from "app/lib/utils";


test('ProcessedDate Returns year, month, day', () => {
    const {year, month, day} = processDate("'2024-12-20T23:50:56Z'");
    const dateObj = {year, month, day};
    dateObj.year = year;
    dateObj.month =  month;
    dateObj.day = day;
    expect(dateObj.year).toBe(2024);
    expect(dateObj.month).toBe(12);
    expect(dateObj.day).toBe(20);
});


test("Converting date to string", () => {
    const convertedString = numberDateToString(2024, 12, 20);
    expect(convertedString).toBe("December 20, 2024");
});

test("Create 1 week intervals", () => {
    const b1 = new Date("12/1/2024");
    const e1 = new Date("12/7/2024");

    expect(createWeekDateIntervals(b1, 1)).toEqual([[b1, e1]]);
});

test("Create 6 week intervals", () => {
    const b1 = new Date("12/1/2024");
    const e1 = new Date("12/7/2024");

    const b2 = new Date("12/8/2024");
    const e2 = new Date("12/14/2024");

    const b3 = new Date("12/15/2024");
    const e3 = new Date("12/21/2024");

    const b4 = new Date("12/22/2024");
    const e4 = new Date("12/28/2024");

    const b5 = new Date("12/29/2024");
    const e5 = new Date("1/4/2025");

    const b6 = new Date("1/5/2025");
    const e6 = new Date("1/11/2025");

    expect(createWeekDateIntervals(b1, 6)).toEqual([[b1, e1], [b2, e2], [b3, e3], [b4, e4], [b5, e5], [b6, e6]]);
})
