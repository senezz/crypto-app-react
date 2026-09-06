import { percentDifference, capitalize, findNearestChartPoint } from "../utils";

test("all lower case", () => {
  expect(capitalize("hello")).toBe("Hello");
});

test("all upper case", () => {
  expect(capitalize("HELLO")).toBe("HELLO");
});

test("valid first capitalized letter", () => {
  expect(capitalize("Hello")).toBe("Hello");
});

test("empty string", () => {
  expect(capitalize("")).toBe("");
});

describe("percentDifference", () => {
  test("returns correct percent for doubled price", () => {
    expect(percentDifference(35, 65)).toBe(60);
  });

  test("arguments position does not matter", () => {
    expect(percentDifference(100, 200)).toBe(percentDifference(200, 100));
  });

  test("returns 0 when both values are equal", () => {
    expect(percentDifference(50, 50)).toBe(0);
  });
});

describe("findNearestChartPoint", () => {
  const points: [number, number][] = [
    [1000, 10],
    [2000, 12],
    [3000, 15],
    [4000, 11],
  ];

  test("returns -1 for an empty chart", () => {
    expect(findNearestChartPoint(new Date(2000 * 1000), [])).toBe(-1);
  });

  test("returns exact match index", () => {
    expect(findNearestChartPoint(new Date(3000 * 1000), points)).toBe(2);
  });

  test("rounds to the closer neighboring point", () => {
    expect(findNearestChartPoint(new Date(2400 * 1000), points)).toBe(1);
    expect(findNearestChartPoint(new Date(2900 * 1000), points)).toBe(2);
  });

  test("clamps to the first point when date is before the range", () => {
    expect(findNearestChartPoint(new Date(0), points)).toBe(0);
  });

  test("clamps to the last point when date is after the range", () => {
    expect(findNearestChartPoint(new Date(9000 * 1000), points)).toBe(3);
  });
});
