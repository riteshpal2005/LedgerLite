import { parseDateTime } from "../src/core/services/dataService";

describe("dataService parseDateTime", () => {
  const targetDate = "2026-07-01";

  it("should correctly parse separate date and time strings", () => {
    const times = ["11:49 PM", "11:41 PM", "11:11 PM", "10:41 PM"];
    const expectedHours = [23, 23, 23, 22];
    const expectedMinutes = [49, 41, 11, 41];

    times.forEach((time, index) => {
      const timestamp = parseDateTime(targetDate, time);
      const dateObj = new Date(timestamp);

      expect(dateObj.getFullYear()).toBe(2026);
      expect(dateObj.getMonth()).toBe(6);
      expect(dateObj.getDate()).toBe(1);
      expect(dateObj.getHours()).toBe(expectedHours[index]);
      expect(dateObj.getMinutes()).toBe(expectedMinutes[index]);
    });
  });

  it("should correctly parse combined date-time strings", () => {
    const combinedStrings = [
      "2026-07-01 23:49:00",
      "2026-07-01 23:41:00",
      "2026-07-01 23:11:00",
      "2026-07-01 22:41:00",
    ];
    const expectedHours = [23, 23, 23, 22];
    const expectedMinutes = [49, 41, 11, 41];

    combinedStrings.forEach((str, index) => {
      const timestamp = parseDateTime(str, undefined);
      const dateObj = new Date(timestamp);

      expect(dateObj.getFullYear()).toBe(2026);
      expect(dateObj.getMonth()).toBe(6);
      expect(dateObj.getDate()).toBe(1);
      expect(dateObj.getHours()).toBe(expectedHours[index]);
      expect(dateObj.getMinutes()).toBe(expectedMinutes[index]);
    });
  });

  it("should preserve correct chronological sorting order", () => {
    const times = ["11:49 PM", "11:41 PM", "11:11 PM", "10:41 PM"];
    const timestamps = times.map((t) => parseDateTime(targetDate, t));

    for (let i = 0; i < timestamps.length - 1; i++) {
      expect(timestamps[i]).toBeGreaterThan(timestamps[i + 1]);
    }
  });

  it("should parse Excel numeric serial values for Date and Time", () => {
    const excelSerialDate = 46202.9923611111; // 2026-06-29 23:49:00 UTC
    const timestamp = parseDateTime(excelSerialDate, undefined);
    const dateObj = new Date(timestamp);

    expect(dateObj.getFullYear()).toBe(2026);
    expect(dateObj.getMonth()).toBe(5); // June
    expect(dateObj.getDate()).toBe(29);
    expect(dateObj.getHours()).toBe(23);
    expect(dateObj.getMinutes()).toBe(49);
  });

  it("should handle locale-aware day/month parsing and unambiguous date orders", () => {
    const DMYDate = parseDateTime("15/07/2026", "11:49 PM");
    const DMYObj = new Date(DMYDate);
    expect(DMYObj.getFullYear()).toBe(2026);
    expect(DMYObj.getMonth()).toBe(6); // July
    expect(DMYObj.getDate()).toBe(15);

    const MDYDate = parseDateTime("07/15/2026", "11:49 PM");
    const MDYObj = new Date(MDYDate);
    expect(MDYObj.getFullYear()).toBe(2026);
    expect(MDYObj.getMonth()).toBe(6); // July
    expect(MDYObj.getDate()).toBe(15);
  });
});
