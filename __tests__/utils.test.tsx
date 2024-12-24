import { processDate } from "app/lib/utils";


test('ProcessedDate Returns year, month, day', () => {
    const {year, month, day} = processDate("'2024-12-20T23:50:56Z'");
    const dateObj = {year, month, day};
    dateObj.year = year;
    dateObj.month =  month;
    dateObj.day = day;
    expect(dateObj.year).toBe(2024);
    expect(dateObj.month).toBe(12);
    expect(dateObj.day).toBe(20);
})
