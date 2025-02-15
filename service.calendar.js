/**
 * Calendar plugin for ARAS soft
 * Copyright (C) 2025 ARAS
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Author: Taras Kerest <kerest73@gmail.com>
 * Version: 1.0
 * Last modified: 2024-07-31
 */
"use strict";
class Cal {
  
  /**
   * The constructor for the calendar plugin.
   * @param {object} option - Configuration options for the calendar.
   * @param {string} option.block - The CSS selector for the block to render the calendar in. Defaults to ".calen".
   * @param {number} option.worktime - The default worktime in hours. Defaults to 8.
   * @param {string} option.mode - The type of shifts to use. Defaults to "short-long-mode".
   * @param {number} option.weekSequence - The sequence of the shift cycle. Defaults to 1.
   * @param {number} option.nightDaySequence - The sequence of the night-day cycle. Defaults to 1.
   * @param {number} option.dayAfterMoonNightSequence - The sequence of the day-aftermoon-night cycle. Defaults to 3.
   * @param {number} option.currPeriodWeek - The current week counter for the period. Defaults to 0.
   * @param {number} option.weekCounter - The week counter for the current period. Defaults to 0.
   * @param {number} option.firstShortLongWeekOfMonth - The first week of the month to start the cycle from. Defaults to 0 (long).
   * @param {number} option.firstDayNightWeekOfMonth - The first week of the month to start the night-day cycle from. Defaults to 1 (night).
   * @param {number} option.firstDayNightInterval - The first day of the week to start the cycle from. Defaults to 0 (first night).
   * @param {object} option.modes - An object containing the modes for the calendar. Defaults to an object with the keys "short-long-mode", "day-aftermoon-night", and "only-day".
   */
  constructor(option) {
    let set;
    this.weekCounter = 0; // Глобальный счетчик недели
    this.lastShift = {};
    this.lastWeekType = {};
    this.settings = set = $.extend({
      block: ".calen", // default block
      worktime: 8, // default worktime in hours
      mode: 'short-long-mode', // default working mode
      weekSequence: 1, // shedule sequence
      currPeriodWeek: 0, // week counter for current period
      worktime: 8, // default worktime in hours
      firstShortLongWeekOfMonth: 0, // Starting week of the year from which the cycle begins: 0 - long, 1 - short
      firstDayNightWeekOfMonth : 1, // Starting week of the year from which the night-day cycle begins
      firstDayNightInterval: 0, // Starting day of the week from which the night-day cycle begins
      modes: {
        'short-long-mode': {
          sequence: ['short', 'long'], // shedule sequence
          cycleLength: 2, // cycle length
          dayNightSequence: 1, // cycle length
          days: {
            short: [0, 1, 4, 5, 6], // monday, tuesday, friday, saturday, sunday
            long: [2, 3], // wednesday, thursday
          },
          types: ['day', 'night'], // shedule types
        },
        'day-aftermoon-night': {
          sequence: ['day', 'aftermoon', 'night'], // shedule sequence
          cycleLength: 1, // cycle length
          dayNightSequence: 1, // cycle length
          days: {
            day: [0, 1, 2, 3, 4], // monday, tuesday, wednesday, thursday, friday
            aftermoon: [0, 1, 2, 3, 4], // saturday, sunday
            night: [0, 1, 2, 3, 4], // No days for night shifts in this mode
          },
          types: ['day', 'aftermoon', 'night'], // shedule types
        },
        // Add more modes here
      }
    }, option);

    let d = new Date(); // Create a new Date object
    this.block = set.block; // The block to render the calendar in

    this.DaysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Days of week for display
    this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currMonth = d.getMonth(); // Current month
    this.currYear = d.getFullYear(); // Current year
    this.currDay = d.getDate(); // Current day
    this.currWeek = Math.ceil((((new Date(this.currYear, this.currMonth, 0).getTime() - new Date(this.currYear, 0, 1).getTime()) / 86400000) + new Date(this.currYear, 0, 1).getDay() + 1) / 7); // Current week
    this.minYear = d.getFullYear(); // Minimum year
    this.maxYear = d.getFullYear() + 2; // Maximum year
    this.sld = $("<div />", { class: "slider" }); // Create a new slider element
    this.shifts = []; // Add a new property to store the generated shifts
    this.schedule = []; // Add a new property to store the generated schedule
    this.currentWeekType = this.settings.firstShortLongWeekOfMonth; // Set the current week type to the first week of the month
    this.generateSchedule(); // Generate the schedule
  }

  /**
   * Generates the schedule for a given year. The schedule is an array of 12 subarrays, each containing the types of shifts for the corresponding month.
   * The method iterates over the days of the month and pushes the current week type to the schedule array. The week type is toggled after each iteration.
   * The method is called in the constructor to generate the schedule for the current year.
   */
  generateSchedule() {
    // Generate the schedule
    for (let i = 0; i < 12; i++) { // Loop through the months
      for (let day = 0; day < 30; day++) { // Loop through the days of the month
        this.schedule.push(this.getCurrentWeekType()); // Add the current week type to the schedule
        this.toggleWeekType(); // Switch the week type
      }
    }
    
  }

  /**
   * Switches the current week type between 0 (long week) and 1 (short week).
   * @function toggleWeekType
   * @memberof Cal
   */
  toggleWeekType() {
    // Switch the week type
    this.currentWeekType = this.currentWeekType === 0 ? 1 : 0;
  }

/**
 * Returns the type of the current week.
 * @returns {number} - The current week type (0 for long week, 1 for short week).
 */

  getCurrentWeekType() {
    // Return the current week type (0 for long week, 1 for short week)
    return this.currentWeekType;
  }
  
  /**
   * Returns the generated schedule as an array of 12 subarrays, each containing
   * the types of shifts for the corresponding month.
   * @returns {array} - The schedule for the current year.
   */
  getSchedule() {
    // Return the generated schedule
    return this.schedule;
  }

  /**
   * Initializes the calendar by creating the calendar table and appending it
   * to the element specified in the constructor, and then appending the slider
   * element. Then calls the update method to fill the calendar with the current
   * month data.
   */
  init() {

    // Initialize the calendar (create the calendar table and append it to the element)
    let $cd = $("<table />",{ border: 0, cellspacing: 0, cellpadding: 0, class: "w-days" }), html = '<tr class="days">';

    // Create the calendar table
    for (var i = 0; i < this.DaysOfWeek.length; i++) {
      html += '<td class="calendar-days">' + this.DaysOfWeek[i] + '</td>'; // Add the day of the week
    }

    html += '</tr>';

    $(this.block).append($cd); // Append the calendar table

    $cd.html(html); // Add the days of the week to the calendar

    $(this.block).append(this.sld); // Append the slider

    this.update(); // Fill the calendar with the current month

  }
  
  /**
   * Updates the calendar view with the current month and year.
   * 
   * The previous and next months are determined by the `slide()` method.
   * If the current month is January of the minimum year, the previous month slide is not shown.
   * If the current month is December of the maximum year, the next month slide is not shown.
   * Otherwise, the previous and next month slides are shown.
   * The current month slide is updated with the current month and year.
   */
  update() {
    const _slide = this.slide(); // Get the previous, current, and next month slides
    let prw = _slide[0], slider = this.sld, curr = _slide[1], nxt = _slide[2], output; // Get the previous, current, and next month slides

    output = prw + curr + nxt; // Create the HTML output

    slider.html(output); // Add the HTML output to the slider
    this.weekCounter = 0; // Reset the week counter
  }
  
  /**
   * Sets the current month and year of the calendar.
   * 
   * If the optional third parameter `p` is provided, it is a percentage value
   * (0-100) that indicates the position of the month in the calendar.
   * If `p` is 0, the previous month is shown, if `p` is 100, the next month is
   * shown, otherwise the current month is shown.
   * @param {number} m - The month to set (0-11).
   * @param {number} y - The year to set.
   * @param {number} [p] - The percentage of the month in the calendar (0-100).
   */
  setMonth(m, y, p) {
    if (p <= 0) { this.previousMonth(); }
    else if (p > 100) { this.nextMonth(); }
  }
  
  /**
   * Goes to the next month.
   * If the current month is December, the year is incremented and the month is set to January.
   */
  nextMonth() {
    this.currMonth = (this.currMonth + 1) % 12; // Increment the month
    if (this.currMonth === 0) this.currYear++; // If the month is January, increment the year
    this.update(); // Update the calendar
  }
  
  /**
   * Goes to the previous month.
   * If the current month is January, the year is decremented and the month is set to December.
   * Otherwise, the month is decremented.
   * The update() method is called to update the calendar.
   */
  previousMonth() {
    this.currMonth = (this.currMonth === 0) ? 11 : this.currMonth - 1; // Decrement the month
    if (this.currMonth === 11) this.currYear--; // If the month is December, decrement the year
    this.update(); // Update the calendar
  }

  /**
   * Returns the week number of the given date.
   * 
   * The week number is determined by the ISO 8601 standard, which is the first Thursday of the year.
   * The `getWeekNumber()` method takes a single parameter, a Date object.
   * The week number is calculated by subtracting the first Thursday of the year from the given date.
   * The result is then divided by the number of milliseconds in a week (7 days).
   * The result is then rounded up to the nearest whole number using `Math.ceil()`.
   * @param {Date} date - The date for which to calculate the week number.
   * @returns {number} The week number of the given date.
   */
  getWeekNumber(date){
    const firstThursday = new Date(date.getFullYear(), 0, 1); // 4 января — ключевая точка
    const firstWeekStart = firstThursday.getTime() - ((firstThursday.getDay() + 6) % 7) * 24 * 60 * 60 * 1000;
    return Math.ceil((date.getTime() - firstWeekStart) / (7 * 24 * 60 * 60 * 1000));
  }; 

  /**
  * Displays the calendar for a specified month and year.
  * 
  * Generates an HTML table representing the calendar, including working shifts
  * based on the current configuration mode. Each day is displayed in a table cell,
  * with additional classes added to indicate special days such as the current day,
  * shift days, and whether a week is a night or day week.
  *
  * Shift types and week types are determined using the shiftScheduler and the
  * current mode settings. The table includes cells for days of the previous and
  * next months to maintain a consistent grid.
  *
  * @param {number} y - The year for which the calendar is to be displayed.
  * @param {number} m - The month for which the calendar is to be displayed (0-11).
  * @returns {string} - An HTML string representing the calendar table for the month.
  */
  showMonth(y, m) {
    var output = "", // HTML output
        i = 1, // Day counter (1-31)
        dow, // Day of the week
        current = new Date(), // Current date
        addclass = "today", // Class for the current day
        block = '<td class="%class%">%date%</td>', // HTML template for a day cell
        firstDayOfMonth = new Date(y, m, 7).getDay(), // Day of the week for the first day of the month
        lastDateOfMonth = new Date(y, m + 1, 0).getDate(), // Last day of the month
        lastDayOfLastMonth = (m == 0 ? new Date(y - 1, 12, 0).getDate() : new Date(y, m, 0).getDate()), // Last day of the previous month or current month
        currentWeekType; // Начинаем с последней смены
    
    const shiftsForMonth = this.shiftScheduler().getShiftsForMonth(y, m, this.lastWeekCounter); // Get shifts for the month
    this.lastWeekCounter = shiftsForMonth.week; // Сохраняем последнюю неделю
    
    const modeConfig = this.settings.modes[this.settings.mode]; // Get the mode configuration
    const availableShifts = modeConfig.sequence; // Get the available shifts for the current mode
    
    // Generate the calendar table
    output = '<table border="0" cellspacing="0" cellpadding="0" class="w-calendar">';
    output += '<thead><tr></tr></thead>';
    
      let prevMonth = m === 0 ? 11 : m - 1;
      let prevYear = m === 0 ? y - 1 : y;
      let currentKey = `${y}-${m}`; // Current key
      let prevKey = `${prevYear}-${prevMonth}`; // Previous key
      let typeWeekIndex; // Shift index

      if(this.lastWeekType[prevKey] !== undefined) typeWeekIndex = this.lastWeekType[prevKey];
      else typeWeekIndex = 0;

    do {
      // Get the day of the week
      dow = new Date(y, m, i).getDay();

      // Get the week type
      //weekType = this.getWeekType(weekCounter + (dow === 1 ? 1 : 0));

      if (dow === 1 || i === 1) {
        if (dow === 1){
           typeWeekIndex++; // Increment week number at the start of Monday
        }
        currentWeekType = this.getWeekType(typeWeekIndex); // Set the current week type
        output += '<tr>';
        if (i === 1) {
          // If the day is the first day of the month
          let k = lastDayOfLastMonth - firstDayOfMonth + 1;
          // Add the remaining days of the previous month
          for (let j = 0; j < firstDayOfMonth; j++, k++) {
            output += `<td class="not-current">${k}</td>`; // Add the day to the output
          }
        }
      }
  
      // Add the day to the output with appropriate classes
      addclass = (i === this.currDay && current.getMonth() === m && current.getFullYear() === y) ? "today" : "normal";
      
      // Check if the day is a shift day
      if (shiftsForMonth.day.includes(i)) addclass += " shift";
  
      // Check if the week is a night week
      if (shiftsForMonth.day.includes(i)) addclass += ` ${currentWeekType}-week`;
  
      // Add the day to the output
      output += block.replaceAll("%date%", i).replace("%class%", addclass);
  
      // Check if the day is the last day of the month
      if (dow == 0) output += '</tr>'; // End of the week
      else if (i == lastDateOfMonth) { // If the day is the last day of the month
        var k = 1; // Increment day counter
        // Add the remaining days of the week
        for (dow; dow < 7; dow++) {
          output += '<td class="not-current">' + k + '</td>';
          k++;
        }
      }
  
      i++;
    } while (i <= lastDateOfMonth); // Loop until the end of the month

    this.lastWeekType[currentKey] = typeWeekIndex; // Save the week counter
    //this.lastWeekType = currentWeekType; // Save the current week type
    output += '</table>';
    return output; // Return the HTML output
  }
  
  getLastWeekNumber(y, m) {
    let lastDate = new Date(y, m + 1, 0).getDate();
    let weeks = 0;
  
    for (let i = 1; i <= lastDate; i++) {
      let dow = new Date(y, m, i).getDay();
      if (dow === 1) {
        weeks++;
      }
    }
  
    return weeks;
  }

  /**
   * Generates the HTML structure for the previous, current, and next month slides.
   * 
   * This method creates three HTML div elements representing the previous, current,
   * and next calendar month slides. Each slide is populated with the corresponding
   * month's data using `showMonth()` method.
   * 
   * The `prw()` helper function calculates the correct month and year for the slide
   * based on the provided status (`prew`, `current`, `next`).
   * 
   * @returns {Array} An array containing the HTML strings for the previous, current,
   * and next slides.
   */
  slide() {
    const _this = this,
          cM = this.currMonth,
          cY = this.currYear,
          template = '<div data-month="%date%" data-year="%year%" class="page %slide%-slide">%data%</div>';
    let prevWeek = _this.lastWeekCounter; // Запоминаем последнюю неделю
    function getSlide(status) {
      let y = cY, m = cM;

      switch (status) {
        case "prew":
          if (cM === 0) {
            y = cY - 1;
            m = 11;
          } else {
            m = cM - 1;
          }
          break;
        case "next":
          if (cM === 11) {
            y = cY + 1;
            m = 0;
          } else {
            m = cM + 1;
          }
          break;
        case "current":
          break;
        default:
          throw new Error(`Invalid status: ${status}`);
      }

      return { data: _this.showMonth(y, m), date: m, year: y };
    }

    let gSlidePrew = getSlide("prew"),
        gSlideCurrent = getSlide("current"),
        gSlideNext = getSlide("next"); 

    return [
      template.replace("%slide%", "prew").replace("%data%", gSlidePrew.data).replace("%date%", gSlidePrew.date).replace("%year%", gSlidePrew.year),
      template.replace("%slide%", "curr").replace("%data%", gSlideCurrent.data).replace("%date%", gSlideCurrent.date).replace("%year%", gSlideCurrent.year),
      template.replace("%slide%", "next").replace("%data%", gSlideNext.data).replace("%date%", gSlideNext.date).replace("%year%", gSlideNext.year)
    ];
  }

  /**
   * Returns the week type for the given week number.
   * 
   * Week type is determined by the mode configuration, which includes the cycle length,
   * day-night sequence and the types of shifts in the cycle.
   * The week type is computed by dividing the week number by the cycle length and
   * taking the remainder as the index of the type in the types array.
   * @param {number} weekNumber - The week number for which the week type is to be determined.
   * @returns {string} The week type.
   */
  getWeekType(weekNumber) {
    const modeConfig = this.settings.modes[this.settings.mode]; // Current mode configuration
    const cycleLength = modeConfig.dayNightSequence * modeConfig.cycleLength; // Cycle length
    const weekTypes = modeConfig.types; // Types of shifts
    const weekCycleIndex = Math.floor(weekNumber / cycleLength) % weekTypes.length; // Week type
    return weekTypes[weekCycleIndex]; // Return the week type [day, night, ...]
  }


  /**
   * Computes the total number of weeks in a month.
   * 
   * This method calculates the total number of weeks in a month.
   * The first week of the month is determined by the first day of the month.
   * The last week of the month is determined by the last day of the month.
   * @param {number} year - The year of the month.
   * @param {number} month - The month (0-11).
   * @returns {number} The total number of weeks in the month.
   */
  WeekCountsOfMonth(year, month) {
    year = new Date().getFullYear() || year;

    // create Date objects for the start of the year and the start of the month
    const startOfYear = new Date(year, 0, 1); // Start of the year
    const startOfMonth = new Date(year, month - 1, 1); // Start of the month

    // Calculate the difference between the start of the month and the start of the year
    const diffTime = startOfMonth - startOfYear;

    // Calculate the number of weeks
    const weeks = diffTime / (1000 * 60 * 60 * 24 * 7);

    // Round the result to the nearest integer
    return Math.floor(weeks);
}

/**
 * Calculates the number of months between two dates.
 * 
 * This method computes the total number of months between the `firstDate` and `lastDate`.
 * If the result is less than or equal to zero, it returns zero.
 * 
 * @param {Date} firstDate - The starting date.
 * @param {Date} lastDate - The ending date.
 * @returns {number} The total number of months between the two dates.
 */


  MonthCount(firstDate, lastDate) {
    let numbersOfMonths; // count of months

    // Calculate the number of months
    numbersOfMonths = (lastDate.getFullYear() - firstDate.getFullYear()) * 12;
    numbersOfMonths -= firstDate.getMonth();
    numbersOfMonths += lastDate.getMonth();

    // If the result is less than or equal to zero, it returns zero
    return numbersOfMonths <= 0 ? 0 : numbersOfMonths;
  }

  
  
  /**
   * Generates a schedule of shifts for a given month and year.
   * 
   * This method computes the working days and corresponding week number
   * based on the current mode's shift sequence. It determines which days
   * of the month are working days and assigns them to the appropriate
   * shift type (e.g., day, night) according to the specified shift cycle.
   * 
   * It maintains the continuity of shift cycles across months by storing
   * and using the last shift index from the previous month.
   * 
   * @returns {object} An object containing:
   *  - `getShiftsForMonth`: A function that calculates and returns an object
   *    with the working days (`day`) and the week number (`week`) for the 
   *    specified month.
   */

  shiftScheduler() {
    const settings = this.settings;
    const currentMode = settings.modes[settings.mode];

    const getShiftsForMonth = (year, month, prevWeekCounter) => {
      const shifts = { day: [], week: 0 }, // Shifts for the month
            firstDayOfMonth = new Date(year, month, 1).getDay(), // Day of the week
            lastDateOfMonth = new Date(year, month + 1, 0).getDate(), // Last day of the month
            prevMonth = month === 0 ? 11 : month - 1, // Previous month
            prevYear = month === 0 ? year - 1 : year, // Previous year
            currentKey = `${year}-${month}`, // Current key
            prevKey = `${prevYear}-${prevMonth}`; // Previous key
  
      let shiftIndex; // Shift index
      
      // Check if the last shift for the previous month exists
      if (this.lastShift[prevKey] !== undefined) shiftIndex = this.lastShift[prevKey];
      else shiftIndex = 0;
  
      // Check if the last week type for the previous month exists
      let weekCounter = Math.floor(shiftIndex / currentMode.sequence.length),
          lastShiftType = currentMode.sequence[shiftIndex % currentMode.sequence.length];
  
      // Loop through the days of the month
      for (let i = 0; i < lastDateOfMonth; i++) {
          const dayOfWeek = (firstDayOfMonth + i - 1 + 7) % 7; // Day of the week
  
          // Check if the day is a working day
          const shiftType = currentMode.sequence[shiftIndex % currentMode.sequence.length];
  
          if (currentMode.days[shiftType] && currentMode.days[shiftType].includes(dayOfWeek)) {
              shifts.day.push(i + 1); // Add the day to the array
              shifts.week = shiftIndex || 0; // Add the week to the object
          }

          // Check if the day is the last day of the week
          if (dayOfWeek === 6) {
              shiftIndex++;
              weekCounter = Math.floor(shiftIndex / currentMode.sequence.length); // Update the week counter
          }
          
          // Check if the day is the last day of the month
          lastShiftType = shiftType;
      }
  
      // Update the last shift index
      this.lastShift[currentKey] = shiftIndex % currentMode.sequence.length;
      return shifts; // Return the shifts for the month
  };
  
  

  
  
  
  
    return {
      getShiftsForMonth,
    };
  }
  
}



function getId(id) {
  return document.getElementById(id);
}
