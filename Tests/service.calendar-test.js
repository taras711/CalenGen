const assert = require("assert");
const { describe, it } = require("mocha");

// Import the Cal class
const Cal = require("../service.calendar.js");

describe("Cal", function () {
  let calendar;

  beforeEach(() => {
    calendar = new Cal();
  });

  it("should initialize with default settings", function () {
    assert.strictEqual(calendar.settings.block, ".calen");
    assert.strictEqual(calendar.settings.worktime, 8);
  });

  it("should toggle week type", function () {
    const initialWeekType = calendar.getCurrentWeekType();
    calendar.toggleWeekType();
    assert.notStrictEqual(calendar.getCurrentWeekType(), initialWeekType);
  });

  it("should generate a 12-month schedule", function () {
    assert.strictEqual(calendar.schedule.length, 12 * 30);
  });

  it("should return correct week type", function () {
    assert.ok([0, 1].includes(calendar.getCurrentWeekType()));
  });

  it("should generate valid shift schedule", function () {
    const shiftScheduler = calendar.shiftScheduler();
    const shifts = shiftScheduler(2025, 1);
    assert.ok(Array.isArray(shifts.day));
    assert.strictEqual(typeof shifts.week, "number");
  });

  it("should maintain shift continuity across months", function () {
    const shiftScheduler = calendar.shiftScheduler();
    const janShifts = shiftScheduler(2025, 0);
    const febShifts = shiftScheduler(2025, 1);
    assert.strictEqual(calendar.lastShift["2025-1"], janShifts.week % calendar.settings.modes[calendar.settings.mode].sequence.length);
  });
});
