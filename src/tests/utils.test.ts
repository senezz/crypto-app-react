import { percentDifference, capitalize } from "../utils";

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
