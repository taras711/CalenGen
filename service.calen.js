/*Create a JQuery function for the distribution/organization of the schedule of working shifts.
Create in the function three modes of switching to choose from in the settings::
 The first mode is "short-long-mode" - in this mode, the types of shifts change in a cycle
 "short" is a week mode in which working shifts have a length of 5 working shifts (Monday, Tuesday, Friday, Saturday, Sunday) and
 "long" is a week mode in which working shifts have a length of 2 working shifts (Wednesday, Thursday).
 Cycles of weeks (short, long) of this mode change depending on the weekSequence setting. For example: weekSequence = 2 - the cycle will change every 2 weeks (long-long, short-short).
 In this mode, there is also a "night-day" cycle, in which shifts change to night and day shifts. The nightDaySequence setting is responsible for the number of night and day weeks in the cycle.
 The user must be able to adjust working shifts so that they coincide with his working schedule / harmonicogram.
 The second mode "day-aftermoon-night" - in this mode, the types of shifts change in the cycle
 "day" is a daily (Monday-Friday) week mode in which daily work shifts
 "aftermoon" - this is a daily (Monday-Friday) mode of the week in which shifts are made after noon
 "night" - this is a daily (Monday-Friday) mode of a week in which night working shifts occur
 Weekends are not taken into account in these modes.
 Setting dayAfterMoonNightSequence determines the number of day, afternoon and night weeks in the cycle.
 The user must be able to adjust working shifts so that they coincide with his working schedule / harmonicogram.
 The third mode "night-day" - in this mode, the types of shifts change in the cycle
 "night" - this is a daily (Monday-Friday) mode of a week in which night working shifts occur
 "day" is a daily (Monday-Friday) week mode in which daily work shifts
 Weekends are not taken into account in these modes.
 The nightDaySequence setting determines the number of night and day weeks in the cycle.
 The user must have the opportunity to adjust his working shifts so that they coincide with his working schedule/ harmonogram.
 The fourth "only-day" mode - in this mode, the shifts do not take into account weekends and have a length of 7 working shifts (Monday-Friday), there are no changes in the cycle.

 Create user settings of working time worktime in which it will be responsible for the length of the working shift.
 Create getters and setters.
 */

 class Calen{

    constructor(db) {
        this.jQuery = null;
        this.database = db;
        this.plans = this.PlanList();
        this.events = this.EventsList();
        
    }

    getMonthDifference(firstDate, lastDate) {
        const startYear = firstDate.getFullYear();
        const endYear = lastDate.getFullYear();
        const startMonth = firstDate.getMonth();
        const endMonth = lastDate.getMonth();

        const totalMonths = (endYear - startYear) * 12;
        const monthsDifference = totalMonths + (endMonth - startMonth);

        return monthsDifference < 0 ? 0 : monthsDifference;
    }

    getNumberDaysOfMonth(month, year) {
        year = year || new Date().getUTCFullYear();
        const isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));

        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    isTodayOrTomorrow(dateString, year) {
        const [month, day] = dateString.split('.').map(Number);
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        return {
            today: month === today.getUTCMonth() + 1 && day === today.getUTCDate() && year === today.getUTCFullYear(),
            tomorrow: month === tomorrow.getUTCMonth() + 1 && day === tomorrow.getUTCDate() && year === tomorrow.getUTCFullYear(),
        };
    }

    /**
     * 
     * @param {number} status - current status of DayNightSwitch
     * @param {object} dateBlock - jQuery object of date block
     * @param {number} interval - interval of switch
     * @param {number} type - type of switch
     * @returns {object} result of switch
     */
    DayNightSwitch(status, dateBlock, interval, type) {
        const result = {};

        switch (interval) {
            case 4:
                result = status === 2 || status === 3 ? this.DayNightDefine(0) : this.DayNightDefine(type ? type : 1);
                break;
            case 2:
                result = status === 0 ? this.DayNightDefine(0) : this.DayNightDefine(type ? type : 1);
                break;
            case 3:
                result = status === 0 ? this.DayNightDefine(0) : status === 1 ? this.DayNightDefine(2) : this.DayNightDefine(type ? type : 1);
                break;
            case 0:
                result = this.DayNightDefine(status ? status : 0);
                break;
        }

        return result;
    }

    /**
     * Define day/night type
     * @param {number} status - status of switch
     * @returns {object} object with day/night type and icon
     */
    DayNightDefine(status) {
        const outputArr = {
            active: false,
            icon: "",
            type: ""
        };

        switch (status) {
            case 0:
                outputArr.icon = "sun"; // icon  - fa-sun
                outputArr.type = "day"; // attr - data-type
                break;
            case 1:
                outputArr.icon = "moon"; // icon  - fa-moon
                outputArr.type = "night"; // attr - data-type
                break;
            case 2:
                outputArr.icon = "clock"; // icon  - fa-clock
                outputArr.type = "afternoon"; // attr - data-type
                break;
        }

        return outputArr;
    }

    getDayOfWeek(date) {

        return new Date(date).getDay();
    }

    async mode_single(settings, year, month, day) {
        // Add logic for this method by example "mode_continuous": mode single (1 shift) - day
    }

    async mode_twoshift(settings, year, month, date) {
        // Add logic for this method by example "mode_continuous": mode twoshift (2 shift) - day, afternoon
    }

    async mode_treeshift(settings, year, month, date) {
        // Add logic for this method by example "mode_continuous": mode treeshift (3 shift) - day, afternoon, day
    }

    async mode_continuous(settings, year, month, date) {
        let output = "";
        let mLength = this.MonthCount(new Date(d.getFullYear(), -1, this.NumberDaysOfMonth(0)), new Date(year, month, this.NumberDaysOfMonth(month)));
        let monthCount = 0;
        let index = 0;
        let firstWorkDay = settings.firstWorkWeekOfYear;
        let blockDateD;
        let setYear;
        let outputArr = {}
        let intervalWeek = 3;
        let dayNightWorks = 0;
        let isDayNightWorks = settings.dayNightWorks;
        let week = settings.firstDayNightOfYear;
        let blockDateN;
        
        for (let getMonth = 0; getMonth < mLength; getMonth++) {

            if (monthCount >= 12) monthCount = 0;
            if (getMonth > 11) {
                setYear = year;
            } else {
                setYear = d.getFullYear();
            }

            for (let getDay = 1; getDay < this.NumberDaysOfMonth(monthCount) + 1; getDay++) {
                //let getPlan = this.GetPlan(setYear, monthCount, getDay);
                if (isDayNightWorks === true) {
                    dayNightWorks = week % settings.dayNightInterval;
                }
                let getWorkDays = new Date(setYear, monthCount, getDay).getDay();

                if (index == 0) {
                    index = 1
                };

                if (index == 1) {
                    
                    if (firstWorkDay == "long") {
                        if (
                            getWorkDays == 1 ||
                            getWorkDays == 2 ||
                            getWorkDays == 0 ||
                            getWorkDays == 5 ||
                            getWorkDays == 6
                        ) {
                            output = [monthCount + 1, getDay, setYear]

                        }
                    }

                    if (firstWorkDay == "short" && firstWorkDay !== "long") {

                        if (getWorkDays == 3 || getWorkDays == 4) {

                            output = [monthCount + 1, getDay, setYear]
                        }
                    }

                }

                if (getWorkDays == 0) {
                    week += 1;
                    if (firstWorkDay == "long") {
                        firstWorkDay = "short";
                    } else if (firstWorkDay == "short") {
                        firstWorkDay = "long";
                    }
                }

            }
            //alert(week)
            monthCount++;

            if (getMonth === mLength - 1) {
                // completed
            }

        }
        return output;
    }

    async CaledInit(year, month, date, afterBuild = function(){}) {
        let settings = {
            mode: "mode_continuous",
            firstWorkWeekOfYear: "long",
            firstDayNightOfYear: 0,
            dayNightInterval: 3,
            dayNightWorks: false
        }
        await this[settings.mode](settings, year, month, date);
        if(typeof afterBuild == "function") afterBuild();
    }

}