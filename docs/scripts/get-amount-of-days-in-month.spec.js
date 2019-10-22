import getAmountOfDaysInMonth from "./get-amount-of-days-in-month";

describe("getAmountOfDaysInMonth", () => {
  it("works for each month in a regular year", () => {
    expect(getAmountOfDaysInMonth(2019, 1)).toBe(31);
    expect(getAmountOfDaysInMonth(2019, 2)).toBe(28);
    expect(getAmountOfDaysInMonth(2019, 3)).toBe(31);
    expect(getAmountOfDaysInMonth(2019, 4)).toBe(30);
    expect(getAmountOfDaysInMonth(2019, 5)).toBe(31);
    expect(getAmountOfDaysInMonth(2019, 6)).toBe(30);
    expect(getAmountOfDaysInMonth(2019, 7)).toBe(31);
    expect(getAmountOfDaysInMonth(2019, 8)).toBe(31);
    expect(getAmountOfDaysInMonth(2019, 9)).toBe(30);
    expect(getAmountOfDaysInMonth(2019, 10)).toBe(31);
    expect(getAmountOfDaysInMonth(2019, 11)).toBe(30);
    expect(getAmountOfDaysInMonth(2019, 12)).toBe(31);
  });
  it("works for each month in a leap year", () => {
    expect(getAmountOfDaysInMonth(2020, 1)).toBe(31);
    expect(getAmountOfDaysInMonth(2020, 2)).toBe(29);
    expect(getAmountOfDaysInMonth(2020, 3)).toBe(31);
    expect(getAmountOfDaysInMonth(2020, 4)).toBe(30);
    expect(getAmountOfDaysInMonth(2020, 5)).toBe(31);
    expect(getAmountOfDaysInMonth(2020, 6)).toBe(30);
    expect(getAmountOfDaysInMonth(2020, 7)).toBe(31);
    expect(getAmountOfDaysInMonth(2020, 8)).toBe(31);
    expect(getAmountOfDaysInMonth(2020, 9)).toBe(30);
    expect(getAmountOfDaysInMonth(2020, 10)).toBe(31);
    expect(getAmountOfDaysInMonth(2020, 11)).toBe(30);
    expect(getAmountOfDaysInMonth(2020, 12)).toBe(31);
  });
});
