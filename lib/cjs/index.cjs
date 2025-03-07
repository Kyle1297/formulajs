'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bessel = require('bessel');
var jStat = require('jstat');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var bessel__default = /*#__PURE__*/_interopDefaultLegacy(bessel);
var jStat__default = /*#__PURE__*/_interopDefaultLegacy(jStat);

const nil = new Error('#NULL!');
const div0 = new Error('#DIV/0!');
const value = new Error('#VALUE!');
const ref = new Error('#REF!');
const name = new Error('#NAME?');
const num = new Error('#NUM!');
const na = new Error('#N/A');
const error = new Error('#ERROR!');
const data = new Error('#GETTING_DATA');
const calc = new Error('#CALC!');

function flattenShallow(array) {
  if (!array || !array.reduce) {
    return [array]
  }

  return array.reduce((a, b) => {
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);

    if (aIsArray && bIsArray) {
      return a.concat(b)
    }

    if (aIsArray) {
      a.push(b);

      return a
    }

    if (bIsArray) {
      return [a].concat(b)
    }

    return [a, b]
  })
}

function isFlat(array) {
  if (!array) {
    return false
  }

  for (let i = 0; i < array.length; ++i) {
    if (Array.isArray(array[i])) {
      return false
    }
  }

  return true
}

function flatten() {
  let result;

  if (arguments.length === 1) {
    const argument = arguments[0];
    result = isArrayLike(argument) ? argsToArray.apply(null, arguments) : [argument];
  } else {
    result = Array.from(arguments);
  }

  while (!isFlat(result)) {
    result = flattenShallow(result);
  }

  return result
}

function isArrayLike(a) {
  return a != null && typeof a.length === 'number' && typeof a !== 'string'
}

function argsToArray(args) {
  const result = [];

  arrayEach(args, (value) => {
    result.push(value);
  });

  return result
}

function numbers() {
  const possibleNumbers = flatten.apply(null, arguments);

  return possibleNumbers.filter((el) => typeof el === 'number')
}

function cleanFloat(number) {
  const power = 1e14;

  return Math.round(number * power) / power
}

function parseBool(bool) {
  if (typeof bool === 'boolean') {
    return bool
  }

  if (bool instanceof Error) {
    return bool
  }

  if (typeof bool === 'number') {
    return bool !== 0
  }

  if (typeof bool === 'string') {
    const up = bool.toUpperCase();

    if (up === 'TRUE') {
      return true
    }

    if (up === 'FALSE') {
      return false
    }
  }

  if (bool instanceof Date && !isNaN(bool)) {
    return true
  }

  return value
}

function parseNumber(string) {
  if (string instanceof Error) {
    return string
  }

  if (string === undefined || string === null || string === '') {
    return 0
  }

  if (typeof string === 'boolean') {
    string = +string;
  }

  if (!isNaN(string)) {
    return parseFloat(string)
  }

  return value
}

function parseString(string) {
  if (string instanceof Error) {
    return string
  }

  if (string === undefined || string === null) {
    return ''
  }

  return string.toString()
}

function parseNumberArray(arr) {
  let len;

  if (!arr || (len = arr.length) === 0) {
    return value
  }

  let parsed;

  while (len--) {
    if (arr[len] instanceof Error) {
      return arr[len]
    }

    parsed = parseNumber(arr[len]);

    if (parsed instanceof Error) {
      return parsed
    }

    arr[len] = parsed;
  }

  return arr
}

function serialNumberToDate(serial) {
  if (serial < 60) {
    serial += 1;
  }

  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;

  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;

  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  let days = date_info.getUTCDate();
  let month = date_info.getUTCMonth();

  if (serial >= 60 && serial < 61) {
    days = 29;
    month = 1;
  }

  return new Date(date_info.getUTCFullYear(), month, days, hours, minutes, seconds)
}

function parseDate(date) {
  if (!isNaN(date)) {
    if (date instanceof Date) {
      return new Date(date)
    }

    const d = parseFloat(date);

    if (d < 0 || d >= 2958466) {
      return num
    }

    return serialNumberToDate(d)
  }

  if (typeof date === 'string') {
    date = /(\d{4})-(\d\d?)-(\d\d?)$/.test(date) ? new Date(date + 'T00:00:00.000') : new Date(date);

    if (!isNaN(date)) {
      return date
    }
  }

  return value
}

function parseDateArray(arr) {
  let len = arr.length;
  let parsed;

  while (len--) {
    parsed = parseDate(arr[len]);

    if (parsed === value) {
      return parsed
    }

    arr[len] = parsed;
  }

  return arr
}

function anyError() {
  for (let n = 0; n < arguments.length; n++) {
    if (arguments[n] instanceof Error) {
      return arguments[n]
    }
  }

  return undefined
}

function isDefined(arg) {
  return arg !== undefined && arg !== null
}

function anyIsError() {
  let n = arguments.length;

  while (n--) {
    if (arguments[n] instanceof Error) {
      return true
    }
  }

  return false
}

function anyIsString() {
  let n = arguments.length;

  while (n--) {
    if (typeof arguments[n] === 'string') {
      return true
    }
  }

  return false
}

function arrayValuesToNumbers(arr) {
  let n = arr.length;
  let el;

  while (n--) {
    el = arr[n];

    if (typeof el === 'number') {
      continue
    }

    if (el === true) {
      arr[n] = 1;
      continue
    }

    if (el === false) {
      arr[n] = 0;
      continue
    }

    if (typeof el === 'string') {
      const number = parseNumber(el);

      arr[n] = number instanceof Error ? 0 : number;
    }
  }

  return arr
}

function rest(array, idx) {
  idx = idx || 1;

  if (!array || typeof array.slice !== 'function') {
    return array
  }

  return array.slice(idx)
}

function initial(array, idx) {
  idx = idx || 1;

  if (!array || typeof array.slice !== 'function') {
    return array
  }

  return array.slice(0, array.length - idx)
}

function arrayEach(array, iteratee) {
  let index = -1;
  const length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break
    }
  }

  return array
}

function transpose(matrix) {
  if (!matrix) {
    return value
  }

  return matrix[0].map((col, i) => matrix.map((row) => row[i]))
}

// E.g. addEmptyValuesToArray([[1]], 2, 2) => [[1, ""], ["", ""]]
function addEmptyValuesToArray(array, requiredLength, requiredHeight) {
  if (!array || !requiredLength || !requiredHeight) {
    return array
  }

  if (requiredLength < 0 || requiredHeight < 0) {
    return array
  }

  // array must be a square matrix
  if (!Array.isArray(array) || !array.length) return array
  for (let i = 0; i < array.length; i++) {
    if (!(array[i] instanceof Array)) return array
  }

  // add empty values to columns
  for (let i = 0; i < array.length; i++) {
    if (array[i].length < requiredLength) {
      for (let j = array[i].length; j < requiredLength; j++) {
        array[i].push('');
      }
    }
  }

  // add empty values to rows
  if (array.length < requiredHeight) {
    for (let i = array.length; i < requiredHeight; i++) {
      array.push([]);
      for (let j = 0; j < requiredLength; j++) {
        array[i].push('');
      }
    }
  }

  return array
}

const d1900 = new Date(Date.UTC(1900, 0, 1));
const WEEK_STARTS = [
  undefined,
  0,
  1,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  1,
  2,
  3,
  4,
  5,
  6,
  0
];
const WEEK_TYPES = [
  [],
  [1, 2, 3, 4, 5, 6, 7],
  [7, 1, 2, 3, 4, 5, 6],
  [6, 0, 1, 2, 3, 4, 5],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [7, 1, 2, 3, 4, 5, 6],
  [6, 7, 1, 2, 3, 4, 5],
  [5, 6, 7, 1, 2, 3, 4],
  [4, 5, 6, 7, 1, 2, 3],
  [3, 4, 5, 6, 7, 1, 2],
  [2, 3, 4, 5, 6, 7, 1],
  [1, 2, 3, 4, 5, 6, 7]
];
const WEEKEND_TYPES = [
  [],
  [6, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  undefined,
  undefined,
  undefined,
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6]
];

/**
 * Returns the serial number of a particular date.
 *
 * Category: Date and time
 *
 * @param {*} year Year
 * @param {*} month Month
 * @param {*} day Day
 * @returns
 */
function DATE(year, month, day) {
  let result;

  year = parseNumber(year);
  month = parseNumber(month);
  day = parseNumber(day);

  if (anyIsError(year, month, day)) {
    result = value;
  } else {
    result = new Date(year, month - 1, day);

    if (result.getFullYear() < 0) {
      result = num;
    }
  }

  return result
}

/**
 * Calculates the number of days, months, or years between two dates. This function is useful in formulas where you need to calculate an age.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the first, or starting date of a given period.
 * @param {*} end_date A date that represents the last, or ending, date of the period.
 * @param {*} unit The type of information that you want returned, where:
 - "Y": The number of complete years in the period.
 - "M": The number of complete months in the period.
 - "D": The number of days in the period.
 - "MD": The difference between the days in start_date and end_date. The months and years of the dates are ignored.
 - "YM": The difference between the months in start_date and end_date. The days and years of the dates are ignored
 - "YD": The difference between the days of start_date and end_date. The years of the dates are ignored.
 * @returns
 */
function DATEDIF(start_date, end_date, unit) {
  unit = unit.toUpperCase();
  start_date = parseDate(start_date);
  end_date = parseDate(end_date);

  const start_date_year = start_date.getFullYear();
  const start_date_month = start_date.getMonth();
  const start_date_day = start_date.getDate();
  const end_date_year = end_date.getFullYear();
  const end_date_month = end_date.getMonth();
  const end_date_day = end_date.getDate();

  let result;

  switch (unit) {
    case 'Y':
      result = Math.floor(YEARFRAC(start_date, end_date));
      break
    case 'D':
      result = DAYS(end_date, start_date);
      break
    case 'M':
      result = end_date_month - start_date_month + 12 * (end_date_year - start_date_year);

      if (end_date_day < start_date_day) {
        result--;
      }

      break
    case 'MD':
      if (start_date_day <= end_date_day) {
        result = end_date_day - start_date_day;
      } else {
        if (end_date_month === 0) {
          start_date.setFullYear(end_date_year - 1);
          start_date.setMonth(12);
        } else {
          start_date.setFullYear(end_date_year);
          start_date.setMonth(end_date_month - 1);
        }

        result = DAYS(end_date, start_date);
      }

      break
    case 'YM':
      result = end_date_month - start_date_month + 12 * (end_date_year - start_date_year);

      if (end_date_day < start_date_day) {
        result--;
      }

      result = result % 12;
      break
    case 'YD':
      if (end_date_month > start_date_month || (end_date_month === start_date_month && end_date_day < start_date_day)) {
        start_date.setFullYear(end_date_year);
      } else {
        start_date.setFullYear(end_date_year - 1);
      }

      result = DAYS(end_date, start_date);
      break
  }

  return result
}

/**
 * Converts a date in the form of text to a serial number.
 *
 * Category: Date and time
 *
 * @param {*} date_text Text that represents a date in an Excel date format, or a reference to a value that contains text that represents a date in an Excel date format.
 * @returns
 */
function DATEVALUE(date_text) {
  if (typeof date_text !== 'string') {
    return value
  }

  const date = Date.parse(date_text);

  if (isNaN(date)) {
    return value
  }

  return new Date(date_text)
}

/**
 * Converts a serial number to a day of the month.
 *
 * Category: Date and time
 *
 * @param {*} serial_number The date of the day you are trying to find.
 * @returns
 */
function DAY(serial_number) {
  const date = parseDate(serial_number);

  if (date instanceof Error) {
    return date
  }

  return date.getDate()
}

function startOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);

  return newDate
}

/**
 * Returns the number of days between two dates.
 *
 * Category: Date and time
 *
 * @param {*} end_date Start_date and End_date are the two dates between which you want to know the number of days.
 * @param {*} start_date Start_date and End_date are the two dates between which you want to know the number of days.
 * @returns
 */
function DAYS(end_date, start_date) {
  end_date = parseDate(end_date);
  start_date = parseDate(start_date);

  if (end_date instanceof Error) {
    return end_date
  }

  if (start_date instanceof Error) {
    return start_date
  }

  return serial(startOfDay(end_date)) - serial(startOfDay(start_date))
}

/**
 * Calculates the number of days between two dates based on a 360-day year.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the start date. If start_date occurs after end_date, the DAYS360 function returns a negative number.
 * @param {*} end_date A date that represents the end date.
 * @param {*} method Optional. A logical value that specifies whether to use the U.S. or European method in the calculation.
 * @returns
 */
function DAYS360(start_date, end_date, method) {
  method = parseBool(method || 'false');
  start_date = parseDate(start_date);
  end_date = parseDate(end_date);

  if (start_date instanceof Error) {
    return start_date
  }

  if (end_date instanceof Error) {
    return end_date
  }

  if (method instanceof Error) {
    return method
  }

  const sm = start_date.getMonth();
  let em = end_date.getMonth();
  let sd, ed;

  if (method) {
    sd = start_date.getDate() === 31 ? 30 : start_date.getDate();
    ed = end_date.getDate() === 31 ? 30 : end_date.getDate();
  } else {
    const smd = new Date(start_date.getFullYear(), sm + 1, 0).getDate();
    const emd = new Date(end_date.getFullYear(), em + 1, 0).getDate();
    sd = start_date.getDate() === smd ? 30 : start_date.getDate();

    if (end_date.getDate() === emd) {
      if (sd < 30) {
        em++;
        ed = 1;
      } else {
        ed = 30;
      }
    } else {
      ed = end_date.getDate();
    }
  }

  return 360 * (end_date.getFullYear() - start_date.getFullYear()) + 30 * (em - sm) + (ed - sd)
}

/**
 * Returns the serial number of the date that is the indicated number of months before or after the start date.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the start date.
 * @param {*} months The number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.
 * @returns
 */
function EDATE(start_date, months) {
  start_date = parseDate(start_date);

  if (start_date instanceof Error) {
    return start_date
  }

  if (isNaN(months)) {
    return value
  }

  months = parseInt(months, 10);
  start_date.setMonth(start_date.getMonth() + months);

  return start_date
}

/**
 * Returns the serial number of the last day of the month before or after a specified number of months.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the starting date.
 * @param {*} months The number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.
 * @returns
 */
function EOMONTH(start_date, months) {
  start_date = parseDate(start_date);

  if (start_date instanceof Error) {
    return start_date
  }

  if (isNaN(months)) {
    return value
  }

  months = parseInt(months, 10);

  return new Date(start_date.getFullYear(), start_date.getMonth() + months + 1, 0)
}

/**
 * Converts a serial number to an hour.
 *
 * Category: Date and time
 *
 * @param {*} serial_number The time that contains the hour you want to find. Times may be entered as text strings within quotation marks (for example, "6:45 PM"), as decimal numbers (for example, 0.78125, which represents 6:45 PM), or as results of other formulas or functions (for example, TIMEVALUE("6:45 PM")).
 * @returns
 */
function HOUR(serial_number) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  return serial_number.getHours()
}

/**
 * Formula.js only
 *
 * @param {*} second
 * @returns
 */
function INTERVAL(second) {
  if (typeof second !== 'number' && typeof second !== 'string') {
    return value
  } else {
    second = parseInt(second, 10);
  }

  let year = Math.floor(second / 946080000);
  second = second % 946080000;
  let month = Math.floor(second / 2592000);
  second = second % 2592000;
  let day = Math.floor(second / 86400);
  second = second % 86400;

  let hour = Math.floor(second / 3600);
  second = second % 3600;
  let min = Math.floor(second / 60);
  second = second % 60;
  let sec = second;

  year = year > 0 ? year + 'Y' : '';
  month = month > 0 ? month + 'M' : '';
  day = day > 0 ? day + 'D' : '';
  hour = hour > 0 ? hour + 'H' : '';
  min = min > 0 ? min + 'M' : '';
  sec = sec > 0 ? sec + 'S' : '';

  return 'P' + year + month + day + 'T' + hour + min + sec
}

/**
 * Returns the number of the ISO week number of the year for a given date.
 *
 * Category: Date and time
 *
 * @param {*} date Date is the date-time code used by Excel for date and time calculation.
 * @returns
 */
function ISOWEEKNUM(date) {
  date = parseDate(date);

  if (date instanceof Error) {
    return date
  }

  date = startOfDay(date);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);

  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
}

/**
 * Converts a serial number to a minute.
 *
 * Category: Date and time
 *
 * @param {*} serial_number The time that contains the minute you want to find. Times may be entered as text strings within quotation marks (for example, "6:45 PM"), as decimal numbers (for example, 0.78125, which represents 6:45 PM), or as results of other formulas or functions (for example, TIMEVALUE("6:45 PM")).
 * @returns
 */
function MINUTE(serial_number) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  return serial_number.getMinutes()
}

/**
 * Converts a serial number to a month.
 *
 * Category: Date and time
 *
 * @param {*} serial_number The date of the month you are trying to find.
 * @returns
 */
function MONTH(serial_number) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  return serial_number.getMonth() + 1
}

/**
 * Returns the number of whole workdays between two dates.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the start date.
 * @param {*} end_date A date that represents the end date.
 * @param {*} holidays Optional. An optional range of one or more dates to exclude from the working calendar, such as state and federal holidays and floating holidays. The list can be either a range of values that contains the dates or an array constant of the serial numbers that represent the dates.
 * @returns
 */
function NETWORKDAYS(start_date, end_date, holidays) {
  return NETWORKDAYS.INTL(start_date, end_date, 1, holidays)
}

/**
 * Returns the number of whole workdays between two dates using parameters to indicate which and how many days are weekend days.
 *
 * Category: Date and time
 *
 * @param {*} start_date The date for from which the difference is to be computed. The start_date can be earlier than, the same as, or later than the end_date.
 * @param {*} end_date The date for to which the difference is to be computed.
 * @param {*} weekend Optional. Indicates the days of the week that are weekend days and are not included in the number of whole working days between start_date and end_date. Weekend is a weekend number or string that specifies when weekends occur. Weekend number values indicate the following weekend days:
 * @param {*} holidays Optional. An optional set of one or more dates that are to be excluded from the working day calendar. holidays shall be a range of values that contain the dates, or an array constant of the serial values that represent those dates. The ordering of dates or serial values in holidays can be arbitrary.
 * @returns
 */
NETWORKDAYS.INTL = (start_date, end_date, weekend, holidays) => {
  start_date = parseDate(start_date);

  if (start_date instanceof Error) {
    return start_date
  }

  end_date = parseDate(end_date);

  if (end_date instanceof Error) {
    return end_date
  }

  let isMask = false;
  const maskDays = [];
  const maskIndex = [1, 2, 3, 4, 5, 6, 0];
  const maskRegex = new RegExp('^[0|1]{7}$');

  if (weekend === undefined) {
    weekend = WEEKEND_TYPES[1];
  } else if (typeof weekend === 'string' && maskRegex.test(weekend)) {
    isMask = true;
    weekend = weekend.split('');

    for (let i = 0; i < weekend.length; i++) {
      if (weekend[i] === '1') {
        maskDays.push(maskIndex[i]);
      }
    }
  } else {
    weekend = WEEKEND_TYPES[weekend];
  }

  if (!(weekend instanceof Array)) {
    return value
  }

  if (holidays === undefined) {
    holidays = [];
  } else if (!(holidays instanceof Array)) {
    holidays = [holidays];
  }

  for (let i = 0; i < holidays.length; i++) {
    const h = parseDate(holidays[i]);

    if (h instanceof Error) {
      return h
    }

    holidays[i] = h;
  }

  const days = Math.round((end_date - start_date) / (1000 * 60 * 60 * 24)) + 1;
  let total = days;
  const day = start_date;

  for (let i = 0; i < days; i++) {
    const d = new Date().getTimezoneOffset() > 0 ? day.getUTCDay() : day.getDay();
    let dec = isMask ? maskDays.includes(d) : d === weekend[0] || d === weekend[1];

    for (let j = 0; j < holidays.length; j++) {
      const holiday = holidays[j];

      if (
        holiday.getDate() === day.getDate() &&
        holiday.getMonth() === day.getMonth() &&
        holiday.getFullYear() === day.getFullYear()
      ) {
        dec = true;
        break
      }
    }

    if (dec) {
      total--;
    }

    day.setDate(day.getDate() + 1);
  }

  return total
};

/**
 * Returns the serial number of the current date and time.
 *
 * Category: Date and time
 *
 * @returns
 */
function NOW() {
  return new Date()
}

/**
 * Converts a serial number to a second.
 *
 * Category: Date and time
 *
 * @param {*} serial_number The time that contains the seconds you want to find. Times may be entered as text strings within quotation marks (for example, "6:45 PM"), as decimal numbers (for example, 0.78125, which represents 6:45 PM), or as results of other formulas or functions (for example, TIMEVALUE("6:45 PM")).
 * @returns
 */
function SECOND(serial_number) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  return serial_number.getSeconds()
}

/**
 * Returns the serial number of a particular time.
 *
 * Category: Date and time
 *
 * @param {*} hour A number from 0 (zero) to 32767 representing the hour. Any value greater than 23 will be divided by 24 and the remainder will be treated as the hour value. For example, TIME(27,0,0) = TIME(3,0,0) = .125 or 3:00 AM.
 * @param {*} minute A number from 0 to 32767 representing the minute. Any value greater than 59 will be converted to hours and minutes. For example, TIME(0,750,0) = TIME(12,30,0) = .520833 or 12:30 PM.
 * @param {*} second A number from 0 to 32767 representing the second. Any value greater than 59 will be converted to hours, minutes, and seconds. For example, TIME(0,0,2000) = TIME(0,33,22) = .023148 or 12:33:20 AM
 * @returns
 */
function TIME(hour, minute, second) {
  hour = parseNumber(hour);
  minute = parseNumber(minute);
  second = parseNumber(second);

  if (anyIsError(hour, minute, second)) {
    return value
  }

  if (hour < 0 || minute < 0 || second < 0) {
    return num
  }

  return (3600 * hour + 60 * minute + second) / 86400
}

/**
 * Converts a time in the form of text to a serial number.
 *
 * Category: Date and time
 *
 * @param {*} time_text A text string that represents a time in any one of the Microsoft Excel time formats; for example, "6:45 PM" and "18:45" text strings within quotation marks that represent time.
 * @returns
 */
function TIMEVALUE(time_text) {
  time_text = parseDate(time_text);

  if (time_text instanceof Error) {
    return time_text
  }

  return (3600 * time_text.getHours() + 60 * time_text.getMinutes() + time_text.getSeconds()) / 86400
}

/**
 * Returns the serial number of today's date.
 *
 * Category: Date and time
 *
 * @returns
 */
function TODAY() {
  return startOfDay(new Date())
}

/**
 * Converts a serial number to a day of the week.
 *
 * Category: Date and time
 *
 * @param {*} serial_number A sequential number that represents the date of the day you are trying to find.
 * @param {*} return_type Optional. A number that determines the type of return value.
 * @returns
 */
function WEEKDAY(serial_number, return_type) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  if (return_type === undefined) {
    return_type = 1;
  }

  const day = serial_number.getDay();

  return WEEK_TYPES[return_type][day]
}

/**
 * Converts a serial number to a number representing where the week falls numerically with a year.
 *
 * Category: Date and time
 *
 * @param {*} serial_number A date within the week.
 * @param {*} return_type Optional. A number that determines on which day the week begins. The default is 1.
 * @returns
 */
function WEEKNUM(serial_number, return_type) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  if (return_type === undefined) {
    return_type = 1;
  }

  if (return_type === 21) {
    return ISOWEEKNUM(serial_number)
  }

  const week_start = WEEK_STARTS[return_type];
  let jan = new Date(serial_number.getFullYear(), 0, 1);
  const inc = jan.getDay() < week_start ? 1 : 0;
  jan -= Math.abs(jan.getDay() - week_start) * 24 * 60 * 60 * 1000;

  return Math.floor((serial_number - jan) / (1000 * 60 * 60 * 24) / 7 + 1) + inc
}

/**
 * Returns the serial number of the date before or after a specified number of workdays.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the start date.
 * @param {*} days The number of nonweekend and nonholiday days before or after start_date. A positive value for days yields a future date; a negative value yields a past date.
 * @param {*} holidays Optional. An optional list of one or more dates to exclude from the working calendar, such as state and federal holidays and floating holidays. The list can be either a range of values that contain the dates or an array constant of the serial numbers that represent the dates.
 * @returns
 */
function WORKDAY(start_date, days, holidays) {
  return WORKDAY.INTL(start_date, days, 1, holidays)
}

/**
 * Returns the serial number of the date before or after a specified number of workdays using parameters to indicate which and how many days are weekend days.
 *
 * Category: Date and time
 *
 * @param {*} start_date The start date, truncated to integer.
 * @param {*} days The number of workdays before or after the start_date. A positive value yields a future date; a negative value yields a past date; a zero value yields the start_date. Day-offset is truncated to an integer.
 * @param {*} weekend Optional. Indicates the days of the week that are weekend days and are not considered working days. Weekend is a weekend number or string that specifies when weekends occur. Weekend number values indicate the following weekend days:
 * @param {*} holidays Optional. An optional set of one or more dates that are to be excluded from the working day calendar. Holidays shall be a range of values that contain the dates, or an array constant of the serial values that represent those dates. The ordering of dates or serial values in holidays can be arbitrary.
 * @returns
 */
WORKDAY.INTL = (start_date, days, weekend, holidays) => {
  start_date = parseDate(start_date);

  if (start_date instanceof Error) {
    return start_date
  }

  days = parseNumber(days);

  if (days instanceof Error) {
    return days
  }

  if (days < 0) {
    return num
  }

  if (weekend === undefined) {
    weekend = WEEKEND_TYPES[1];
  } else {
    weekend = WEEKEND_TYPES[weekend];
  }

  if (!(weekend instanceof Array)) {
    return value
  }

  if (holidays === undefined) {
    holidays = [];
  } else if (!(holidays instanceof Array)) {
    holidays = [holidays];
  }

  for (let i = 0; i < holidays.length; i++) {
    const h = parseDate(holidays[i]);

    if (h instanceof Error) {
      return h
    }

    holidays[i] = h;
  }

  let d = 0;

  while (d < days) {
    start_date.setDate(start_date.getDate() + 1);
    const day = start_date.getDay();

    if (day === weekend[0] || day === weekend[1]) {
      continue
    }

    for (let j = 0; j < holidays.length; j++) {
      const holiday = holidays[j];

      if (
        holiday.getDate() === start_date.getDate() &&
        holiday.getMonth() === start_date.getMonth() &&
        holiday.getFullYear() === start_date.getFullYear()
      ) {
        d--;
        break
      }
    }

    d++;
  }

  return start_date
};

/**
 * Converts a serial number to a year.
 *
 * Category: Date and time
 *
 * @param {*} serial_number The date of the year you want to find.
 * @returns
 */
function YEAR(serial_number) {
  serial_number = parseDate(serial_number);

  if (serial_number instanceof Error) {
    return serial_number
  }

  return serial_number.getFullYear()
}

function isLeapYear(year) {
  return new Date(year, 1, 29).getMonth() === 1
}

// TODO : Use DAYS ?
function daysBetween(start_date, end_date) {
  return Math.ceil((end_date - start_date) / 1000 / 60 / 60 / 24)
}

/**
 * Returns the year fraction representing the number of whole days between start_date and end_date.
 *
 * Category: Date and time
 *
 * @param {*} start_date A date that represents the start date.
 * @param {*} end_date A date that represents the end date.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function YEARFRAC(start_date, end_date, basis) {
  start_date = parseDate(start_date);

  if (start_date instanceof Error) {
    return start_date
  }

  end_date = parseDate(end_date);

  if (end_date instanceof Error) {
    return end_date
  }

  basis = basis || 0;
  let sd = start_date.getDate();
  const sm = start_date.getMonth() + 1;
  const sy = start_date.getFullYear();
  let ed = end_date.getDate();
  const em = end_date.getMonth() + 1;
  const ey = end_date.getFullYear();

  switch (basis) {
    case 0:
      // US (NASD) 30/360
      if (sd === 31 && ed === 31) {
        sd = 30;
        ed = 30;
      } else if (sd === 31) {
        sd = 30;
      } else if (sd === 30 && ed === 31) {
        ed = 30;
      }

      return (ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360
    case 1: {
      // Actual/actual
      const feb29Between = (date1, date2) => {
        const year1 = date1.getFullYear();
        const mar1year1 = new Date(year1, 2, 1);

        if (isLeapYear(year1) && date1 < mar1year1 && date2 >= mar1year1) {
          return true
        }

        const year2 = date2.getFullYear();
        const mar1year2 = new Date(year2, 2, 1);

        return isLeapYear(year2) && date2 >= mar1year2 && date1 < mar1year2
      };

      let ylength = 365;

      if (sy === ey || (sy + 1 === ey && (sm > em || (sm === em && sd >= ed)))) {
        if ((sy === ey && isLeapYear(sy)) || feb29Between(start_date, end_date) || (em === 1 && ed === 29)) {
          ylength = 366;
        }

        return daysBetween(start_date, end_date) / ylength
      }

      const years = ey - sy + 1;
      const days = (new Date(ey + 1, 0, 1) - new Date(sy, 0, 1)) / 1000 / 60 / 60 / 24;
      const average = days / years;

      return daysBetween(start_date, end_date) / average
    }

    case 2:
      // Actual/360

      return daysBetween(start_date, end_date) / 360
    case 3:
      // Actual/365

      return daysBetween(start_date, end_date) / 365
    case 4:
      // European 30/360

      return (ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360
  }
}

function serial(date) {
  const addOn = date > -2203891200000 ? 2 : 1;

  return Math.ceil((date - d1900) / 86400000) + addOn
}

const defaultOperator = '=';
const validSymbols = ['>', '>=', '<', '<=', '=', '<>'];
const _TOKEN_TYPE_OPERATOR = 'operator';
const _TOKEN_TYPE_LITERAL = 'literal';
const SUPPORTED_TOKENS = [_TOKEN_TYPE_OPERATOR, _TOKEN_TYPE_LITERAL];

const TOKEN_TYPE_OPERATOR = _TOKEN_TYPE_OPERATOR;
const TOKEN_TYPE_LITERAL = _TOKEN_TYPE_LITERAL;

/**
 * Create token which describe passed symbol/value.
 *
 * @param {String} value Value/Symbol to describe.
 * @param {String} type Type of the token 'operator' or 'literal'.
 * @return {Object}
 */
function createToken(value, type) {
  if (SUPPORTED_TOKENS.indexOf(type) === -1) {
    throw new Error('Unsupported token type: ' + type)
  }

  return {
    value: value,
    type: type
  }
}

/**
 * Tries to cast numeric values to their type passed as a string.
 *
 * @param {*} value
 * @return {*}
 */
function castValueToCorrectType(value) {
  if (typeof value !== 'string') {
    return value
  }

  if (/^\d+(\.\d+)?$/.test(value)) {
    value = value.indexOf('.') === -1 ? parseInt(value, 10) : parseFloat(value);
  }

  return value
}

/**
 * Generate stream of tokens from passed expression.
 *
 * @param {String} expression
 * @return {String[]}
 */
function tokenizeExpression(expression) {
  const expressionLength = expression.length;
  const tokens = [];
  let cursorIndex = 0;
  let processedValue = '';
  let processedSymbol = '';

  while (cursorIndex < expressionLength) {
    const char = expression.charAt(cursorIndex);

    switch (char) {
      case '>':
      case '<':
      case '=':
        processedSymbol = processedSymbol + char;

        if (processedValue.length > 0) {
          tokens.push(processedValue);
          processedValue = '';
        }

        break
      default:
        if (processedSymbol.length > 0) {
          tokens.push(processedSymbol);
          processedSymbol = '';
        }

        processedValue = processedValue + char;
        break
    }

    cursorIndex++;
  }

  if (processedValue.length > 0) {
    tokens.push(processedValue);
  }

  if (processedSymbol.length > 0) {
    tokens.push(processedSymbol);
  }

  return tokens
}

/**
 * Analyze and convert tokens to an object which describes their meaning.
 *
 * @param {String[]} tokens
 * @return {Object[]}
 */
function analyzeTokens(tokens) {
  let literalValue = '';
  const analyzedTokens = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (i === 0 && validSymbols.indexOf(token) >= 0) {
      analyzedTokens.push(createToken(token, TOKEN_TYPE_OPERATOR));
    } else {
      literalValue += token;
    }
  }

  if (literalValue.length > 0) {
    analyzedTokens.push(createToken(castValueToCorrectType(literalValue), TOKEN_TYPE_LITERAL));
  }

  if (analyzedTokens.length > 0 && analyzedTokens[0].type !== TOKEN_TYPE_OPERATOR) {
    analyzedTokens.unshift(createToken(defaultOperator, TOKEN_TYPE_OPERATOR));
  }

  return analyzedTokens
}

/**
 * Compute/Evaluate an expression passed as an array of tokens.
 *
 * @param {Object[]} tokens
 * @return {Boolean}
 */
function computeExpression(tokens) {
  const values = [];
  let operator;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case TOKEN_TYPE_OPERATOR:
        operator = token.value;
        break
      case TOKEN_TYPE_LITERAL:
        values.push(token.value);
        break
    }
  }

  return evaluate(values, operator)
}

/**
 * Evaluate values based on passed math operator.
 *
 * @param {*} values
 * @param {String} operator
 * @return {Boolean}
 */
function evaluate(values, operator) {
  let result = false;

  switch (operator) {
    case '>':
      result = values[0] > values[1];
      break
    case '>=':
      result = values[0] >= values[1];
      break
    case '<':
      result = values[0] < values[1];
      break
    case '<=':
      result = values[0] <= values[1];
      break
    case '=':
      result = values[0] == values[1];
      break
    case '<>':
      result = values[0] != values[1];
      break
  }

  return result
}

function parse(expression) {
  return analyzeTokens(tokenizeExpression(expression))
}

const compute = computeExpression;

// TODO
/**
 * -- Not implemented --
 *
 * Returns information about the formatting, location, or contents of a value.
 *
 * Category: Information
 *
 * @returns
 */
function CELL() {
  throw new Error('CELL is not implemented')
}

const ERROR = {};

ERROR.TYPE = (error_val) => {
  switch (error_val) {
    case nil:
      return 1
    case div0:
      return 2
    case value:
      return 3
    case ref:
      return 4
    case name:
      return 5
    case num:
      return 6
    case na:
      return 7
    case data:
      return 8
  }

  return na
};

// TODO
/**
 * -- Not implemented --
 *
 * Returns information about the current operating environment.
 *
 * Category: Information
 *
 * @returns
 */
function INFO() {
  throw new Error('INFO is not implemented')
}

/**
 * Returns TRUE if the value is blank.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISBLANK(value) {
  return value === null
}

/**
 * Formula.js only
 *
 * @param {*} number
 * @returns
 */
function ISBINARY(number) {
  return /^[01]{1,10}$/.test(number)
}

/**
 * Returns TRUE if the value is any error value except #N/A.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISERR(value$1) {
  return (
    [value, ref, div0, num, name, nil].indexOf(value$1) >= 0 ||
    (typeof value$1 === 'number' && (isNaN(value$1) || !isFinite(value$1)))
  )
}

/**
 * Returns TRUE if the value is any error value.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISERROR(value$1) {
  return (
    ISERR(value$1) ||
    value$1 === na ||
    value$1?.message === value.message ||
    value$1?.message === calc.message
  )
}

/**
 * Returns TRUE if the number is even.
 *
 * Category: Information
 *
 * @param {*} number The value to test. If number is not an integer, it is truncated.
 * @returns
 */
function ISEVEN(number) {
  return !(Math.floor(Math.abs(number)) & 1)
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns TRUE if there is a reference to a value that contains a formula.
 *
 * Category: Information
 *
 * @param {*} reference Reference is a reference to the value you want to test. Reference can be a value reference, a formula, or a name that refers to a value.
 * @returns
 */
function ISFORMULA() {
  throw new Error('ISFORMULA is not implemented')
}

/**
 * Returns TRUE if the value is a logical value.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISLOGICAL(value) {
  return value === true || value === false
}

/**
 * Returns TRUE if the value is the #N/A error value.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISNA(value) {
  return value === na
}

/**
 * Returns TRUE if the value is not text.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISNONTEXT(value) {
  return typeof value !== 'string'
}

/**
 * Returns TRUE if the value is a number.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISNUMBER(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Returns TRUE if the number is odd.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISODD(value) {
  return !!(Math.floor(Math.abs(value)) & 1)
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns TRUE if the value is a reference.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISREF() {
  throw new Error('ISREF is not implemented')
}

/**
 * Returns TRUE if the value is text.
 *
 * Category: Information
 *
 * @param {*} value The value that you want tested. The value argument can be a blank (empty value), error, logical value, text, number, or reference value, or a name referring to any of these.
 * @returns
 */
function ISTEXT(value) {
  return typeof value === 'string'
}

/**
 * Returns a value converted to a number.
 *
 * Category: Information
 *
 * @param {*} value The value you want converted. N converts values listed in the following table.
 * @returns
 */
function N(value) {
  if (ISNUMBER(value)) {
    return value
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (value === true) {
    return 1
  }

  if (value === false) {
    return 0
  }

  if (ISERROR(value)) {
    return value
  }

  return 0
}

/**
 * Returns the error value #N/A.
 *
 * Category: Information
 *
 * @returns
 */
function NA() {
  return na
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the sheet number of the referenced sheet.
 *
 * Category: Information
 *
 * @param {*} value Optional. Value is the name of a sheet or a reference for which you want the sheet number. If value is omitted, SHEET returns the number of the sheet that contains the function.
 * @returns
 */
function SHEET() {
  throw new Error('SHEET is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the number of sheets in a reference.
 *
 * Category: Information
 *
 * @param {*} reference Optional. Reference is a reference for which you want to know the number of sheets it contains. If Reference is omitted, SHEETS returns the number of sheets in the workbook that contains the function.
 * @returns
 */
function SHEETS() {
  throw new Error('SHEETS is not implemented')
}

/**
 * Returns a number indicating the data type of a value.
 *
 * Category: Information
 *
 * @param {*} value Can be any Microsoft Excel value, such as a number, text, logical value, and so on.
 * @returns
 */
function TYPE(value) {
  if (ISNUMBER(value)) {
    return 1
  }

  if (ISTEXT(value)) {
    return 2
  }

  if (ISLOGICAL(value)) {
    return 4
  }

  if (ISERROR(value)) {
    return 16
  }

  if (Array.isArray(value)) {
    return 64
  }
}

/**
 * Chooses a value from a list of values.
 *
 * Category: Lookup and reference
 *
 * @param {*} index_num Specifies which value argument is selected. Index_num must be a number between 1 and 254, or a formula or reference to a value containing a number between 1 and 254. If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on. If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value. If index_num is a fraction, it is truncated to the lowest integer before being used.
 - If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on.
 - If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value.
 - If index_num is a fraction, it is truncated to the lowest integer before being used.
 * @param {*} args value1, value2, ... Value 1 is required, subsequent values are optional. 1 to 254 value arguments from which CHOOSE selects a value or an action to perform based on index_num. The arguments can be numbers, value references, defined names, formulas, functions, or text.
 * @returns
 */
function CHOOSE() {
  if (arguments.length < 2) {
    return na
  }

  const index = arguments[0];

  if (index < 1 || index > 254) {
    return value
  }

  if (arguments.length < index + 1) {
    return value
  }

  return arguments[index]
}

/**
 * Returns the column number of a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} reference the value or range of values for which you want to return the column number.
 * @param {*} index
 * @returns
 */
function COLUMN(reference, index) {
  if (arguments.length !== 2) {
    return na
  }

  if (index < 0) {
    return num
  }

  if (!(reference instanceof Array) || typeof index !== 'number') {
    return value
  }

  if (reference.length === 0) {
    return undefined
  }

  return jStat__default["default"].col(reference, index)
}

/**
 * Returns the number of columns in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or array formula, or a reference to a range of values for which you want the number of columns.
 * @returns
 */
function COLUMNS(array) {
  if (arguments.length !== 1) {
    return na
  }

  if (!(array instanceof Array)) {
    return value
  }

  if (array.length === 0) {
    return 0
  }

  return jStat__default["default"].cols(array)
}

/**
 * Looks in the top row of an array and returns the value of the indicated value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} row_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
function HLOOKUP(lookup_value, table_array, row_index_num, range_lookup) {
  return VLOOKUP(lookup_value, transpose(table_array), row_index_num, range_lookup)
}

/**
 * Uses an index to choose a value from a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array A range of values or an array constant.
 - If array contains only one row or column, the corresponding row_num or column_num argument is optional.
 - If array has more than one row and more than one column, and only row_num or column_num is used, INDEX returns an array of the entire row or column in array.
 * @param {*} row_num Required, unless column_num is present. Selects the row in array from which to return a value. If row_num is omitted, column_num is required.
 * @param {*} column_num Optional. Selects the column in array from which to return a value. If column_num is omitted, row_num is required.
 * @returns
 */
function INDEX(array, row_num, column_num) {
  const someError = anyError(array, row_num, column_num);

  if (someError) {
    return someError
  }

  if (!Array.isArray(array)) {
    return value
  }

  const isOneDimensionRange = array.length > 0 && !Array.isArray(array[0]);

  if (isOneDimensionRange && !column_num) {
    column_num = row_num;
    row_num = 1;
  } else {
    column_num = column_num || 1;
    row_num = row_num || 1;
  }

  if (column_num < 0 || row_num < 0) {
    return value
  }

  if (isOneDimensionRange && row_num === 1 && column_num <= array.length) {
    return array[column_num - 1]
  } else if (row_num <= array.length && column_num <= array[row_num - 1].length) {
    return array[row_num - 1][column_num - 1]
  }

  return ref
}

/**
 * Looks up values in a vector or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value A value that LOOKUP searches for in an array. The lookup_value argument can be a number, text, a logical value, or a name or reference that refers to a value.
 - If LOOKUP can't find the value of lookup_value, it uses the largest value in the array that is less than or equal to lookup_value.
 - If the value of lookup_value is smaller than the smallest value in the first row or column (depending on the array dimensions), LOOKUP returns the #N/A error value.
 * @param {*} array A range of values that contains text, numbers, or logical values that you want to compare with lookup_value. The array form of LOOKUP is very similar to the HLOOKUP and VLOOKUP functions. The difference is that HLOOKUP searches for the value of lookup_value in the first row, VLOOKUP searches in the first column, and LOOKUP searches according to the dimensions of array.
* @param {*} result_array Optional. A range that contains only one row or column. The result_array argument must be the same size as lookup_value. It has to be the same size.
 * @returns
 */
function LOOKUP(lookup_value, array, result_array) {
  array = flatten(array);
  result_array = result_array ? flatten(result_array) : array;

  const isNumberLookup = typeof lookup_value === 'number';
  let result = na;

  for (let i = 0; i < array.length; i++) {
    if (array[i] === lookup_value) {
      return result_array[i]
    } else if (
      (isNumberLookup && array[i] <= lookup_value) ||
      (typeof array[i] === 'string' && array[i].localeCompare(lookup_value) < 0)
    ) {
      result = result_array[i];
    } else if (isNumberLookup && array[i] > lookup_value) {
      return result
    }
  }

  return result
}

/**
 * Looks up values in a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value that you want to match in lookup_array. For example, when you look up someone's number in a telephone book, you are using the person's name as the lookup value, but the telephone number is the value you want.The lookup_value argument can be a value (number, text, or logical value) or a value reference to a number, text, or logical value.
 * @param {*} lookup_array The range of values being searched.
 * @param {*} match_type Optional. The number -1, 0, or 1. The match_type argument specifies how Excel matches lookup_value with values in lookup_array. The default value for this argument is 1.
 * @returns
 */
function MATCH(lookup_value, lookup_array, match_type) {
  if (!lookup_value && !lookup_array) {
    return na
  }

  if (arguments.length === 2) {
    match_type = 1;
  }

  lookup_array = flatten(lookup_array);

  if (!(lookup_array instanceof Array)) {
    return na
  }

  if (match_type !== -1 && match_type !== 0 && match_type !== 1) {
    return na
  }

  let index;
  let indexValue;

  for (let idx = 0; idx < lookup_array.length; idx++) {
    if (match_type === 1) {
      if (lookup_array[idx] === lookup_value) {
        return idx + 1
      } else if (lookup_array[idx] < lookup_value) {
        if (!indexValue) {
          index = idx + 1;
          indexValue = lookup_array[idx];
        } else if (lookup_array[idx] > indexValue) {
          index = idx + 1;
          indexValue = lookup_array[idx];
        }
      }
    } else if (match_type === 0) {
      if (typeof lookup_value === 'string' && typeof lookup_array[idx] === 'string') {
        const lookupValueStr = lookup_value.toLowerCase().replace(/\?/g, '.').replace(/\*/g, '.*').replace(/~/g, '\\');
        const regex = new RegExp('^' + lookupValueStr + '$');

        if (regex.test(lookup_array[idx].toLowerCase()) || lookup_array[idx] === lookup_value) {
          return idx + 1
        }
      } else {
        if (lookup_array[idx] === lookup_value) {
          return idx + 1
        }
      }
    } else if (match_type === -1) {
      if (lookup_array[idx] === lookup_value) {
        return idx + 1
      } else if (lookup_array[idx] > lookup_value) {
        if (!indexValue) {
          index = idx + 1;
          indexValue = lookup_array[idx];
        } else if (lookup_array[idx] < indexValue) {
          index = idx + 1;
          indexValue = lookup_array[idx];
        }
      }
    }
  }

  return index || na
}

/**
 * Returns the number of rows in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array, an array formula, or a reference to a range of values for which you want the number of rows.
 * @returns
 */
function ROWS(array) {
  if (arguments.length !== 1) {
    return na
  }

  if (!(array instanceof Array)) {
    return value
  }

  if (array.length === 0) {
    return 0
  }

  return jStat__default["default"].rows(array)
}

/**
 * Returns the transpose of an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or range of values on a worksheet that you want to transpose. The transpose of an array is created by using the first row of the array as the first column of the new array, the second row of the array as the second column of the new array, and so on. If you're not sure of how to enter an array formula, see Create an array formula.
 * @returns
 */
function TRANSPOSE(array) {
  if (!array) {
    return na
  }

  return jStat__default["default"].transpose(array)
}

/**
 * Returns a list of unique values in a list or range.
 *
 * Category: Lookup and reference
 *
 * @returns
 */
function UNIQUE() {
  const result = [];

  for (let i = 0; i < arguments.length; ++i) {
    let hasElement = false;
    const element = arguments[i];

    // Check if we've already seen this element.

    for (let j = 0; j < result.length; ++j) {
      hasElement = result[j] === element;

      if (hasElement) {
        break
      }
    }

    // If we did not find it, add it to the result.
    if (!hasElement) {
      result.push(element);
    }
  }

  return result
}

/**
 * Looks in the first column of an array and moves across the row to return the value of a value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} col_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
function VLOOKUP(lookup_value, table_array, col_index_num, range_lookup) {
  if (!table_array || !col_index_num) {
    return na
  }

  range_lookup = !(range_lookup === 0 || range_lookup === false);
  let result = na;
  const isNumberLookup = typeof lookup_value === 'number';
  let exactMatchOnly = false;

  for (let i = 0; i < table_array.length; i++) {
    const row = table_array[i];

    if (row[0] === lookup_value) {
      result = col_index_num < row.length + 1 ? row[col_index_num - 1] : ref;
      break
    } else if (
      !exactMatchOnly &&
      ((isNumberLookup && range_lookup && row[0] <= lookup_value) ||
        (range_lookup && typeof row[0] === 'string' && row[0].localeCompare(lookup_value) < 0))
    ) {
      result = col_index_num < row.length + 1 ? row[col_index_num - 1] : ref;
    }

    if (isNumberLookup && row[0] > lookup_value) {
      exactMatchOnly = true;
    }
  }

  return result
}

/**
 * Returns a sorted array of the elements in an array. The returned array is the same shape as the provided array argument.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The range, or array to sort.
 * @param {*} sort_index Optional. A number indicating the row or column to sort by. Default is 1.
 * @param {*} sort_order Optional. A number indicating the sort order. 1 for ascending, -1 for descending. Default is 1.
 * @param {*} by_col Optional. A logical value indicating the desired sort direction. FALSE to sort by row. TRUE to sort by column. Default is FALSE.
 * @returns
 */
function SORT(array, sort_index, sort_order, by_col) {
  // array
  if (!array) {
    return na
  }

  if (!(array instanceof Array)) {
    return na
  }

  if (array.length === 0) {
    return na
  }

  for (let i = 0; i < array.length; i++) {
    if (!(array[i] instanceof Array)) {
      return na
    }

    if (array[i].length === 0) {
      return na
    }

    if (array[i].length !== array[0].length) {
      return na
    }
  }

  const arrayWidth = array[0].length;
  const arrayHeight = array.length;

  // by_col
  if (by_col == null) {
    by_col = 'FALSE';
  }

  const byCol = parseBool(by_col);
  if (typeof byCol !== 'boolean') {
    return addEmptyValuesToArray([[value]], arrayWidth, arrayHeight)
  }

  // sort_index
  if (sort_index == null) {
    sort_index = 1;
  }

  if (typeof sort_index !== 'number') {
    return addEmptyValuesToArray([[value]], arrayWidth, arrayHeight)
  }

  if (sort_index < 1) {
    return addEmptyValuesToArray([[value]], arrayWidth, arrayHeight)
  }

  if (byCol && sort_index > arrayHeight) {
    return addEmptyValuesToArray([[value]], arrayWidth, arrayHeight)
  }

  if (!byCol && sort_index > arrayWidth) {
    return addEmptyValuesToArray([[value]], arrayWidth, arrayHeight)
  }

  // sort_order
  if (sort_order == null) {
    sort_order = 1;
  }

  if (sort_order !== 1 && sort_order !== -1) {
    return addEmptyValuesToArray([[value]], arrayWidth, arrayHeight)
  }

  // sort
  let result = [];
  if (byCol) {
    let columns = [];
    for (let i = 0; i < arrayWidth; i++) {
      const column = [];
      for (let j = 0; j < arrayHeight; j++) {
        column.push(array[j][i]);
      }
      columns.push(column);
    }

    const sortedColumns = columns.sort((a, b) => {
      const aVal = a[sort_index - 1]?.toString() ?? '';
      const bVal = b[sort_index - 1]?.toString() ?? '';

      // NOTE: Excel sorts all values as strings, e.g. 1 => "1"
      if (aVal < bVal) {
        return -1 * sort_order
      }

      if (aVal > bVal) {
        return 1 * sort_order
      }

      return 0
    });

    for (let i = 0; i < arrayHeight; i++) {
      const row = [];
      for (let j = 0; j < arrayWidth; j++) {
        row.push(sortedColumns[j][i]);
      }

      result.push(row);
    }
  } else {
    result = array.sort((a, b) => {
      const aVal = a[sort_index - 1]?.toString() ?? '';
      const bVal = b[sort_index - 1]?.toString() ?? '';

      // NOTE: Excel sorts all values as strings, e.g. 1 => "1"
      if (aVal < bVal) {
        return -1 * sort_order
      }

      if (aVal > bVal) {
        return 1 * sort_order
      }

      return 0
    });
  }

  // replace empty strings with zeros
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      if (result[i][j] === '') {
        result[i][j] = 0;
      }
    }
  }

  return result
}

/**
 * Filters an array based on a Boolean (True/False) array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array The array, or range to filter. E.g. [[1,2,3],[4,5,6]]
 * @param {*} include A boolean array whose height or width is the same as the array. E.g. [[true, false, true]] OR [[true],[false]]
 * @param {*} if_empty Optional. The value to return if all values in the included array are empty (filter returns nothing). E.g. "No results"
 * @returns
 */
function FILTER(array, include, if_empty) {
  // correct types
  if (!array || !include) {
    return na
  }

  if (!(array instanceof Array)) {
    return na
  }

  if (!(include instanceof Array)) {
    return na
  }

  // array lengths must be greater than 0 and symmetrical
  if (array.length === 0) {
    return na
  }

  if (include.length === 0) {
    return na
  }

  for (let i = 0; i < array.length; i++) {
    if (!(array[i] instanceof Array)) {
      return na
    }

    if (array[i].length === 0) {
      return na
    }

    if (array[i].length !== array[0].length) {
      return na
    }
  }

  for (let i = 0; i < include.length; i++) {
    if (!(include[i] instanceof Array)) {
      return na
    }

    if (include[i].length === 0) {
      return na
    }

    if (include[i].length !== include[0].length) {
      return na
    }
  }

  const arrayWidth = array[0].length;
  const arrayHeight = array.length;
  const includeWidth = include[0].length;
  const includeHeight = include.length;

  // include array must have same width or height as array (and generally not both)
  if (arrayWidth !== includeWidth && arrayHeight !== includeHeight) {
    return na
  }

  if (
    arrayHeight > 1 &&
    arrayWidth > 1 &&
    ((arrayWidth === includeWidth && includeHeight !== 1) || (arrayHeight === includeHeight && includeWidth !== 1))
  ) {
    return na
  }

  if (
    arrayHeight > 1 &&
    arrayWidth === 1 &&
    (includeWidth !== 1 || (includeHeight !== 1 && includeHeight !== arrayHeight))
  ) {
    return na
  }

  // filter
  const result = [];
  for (let i = 0; i < arrayHeight; i++) {
    const row = [];
    for (let j = 0; j < arrayWidth; j++) {
      const value = include[i]?.[j] ?? include[0]?.[j] ?? include[i]?.[0];
      const bool = parseBool(value);
      if (bool === true) row.push(array[i][j]);
      else if (bool instanceof Error) return addEmptyValuesToArray([[bool]], arrayWidth, arrayHeight)
    }
    if (row.length > 0) result.push(row);
  }

  if (result.length === 0) {
    if (if_empty != null) {
      return addEmptyValuesToArray([[if_empty]], arrayWidth, arrayHeight)
    }

    return addEmptyValuesToArray([[calc]], arrayWidth, arrayHeight)
  }

  return addEmptyValuesToArray(result, arrayWidth, arrayHeight)
}

const xMatchSearch = ({
  lookup_value,
  lookup_array,
  match_mode,
  matchedIndex,
  matchedIndexValue,
  idx,
  isBinarySearchAscending = undefined,
  binarySearchHigh = undefined,
  binarySearchLow = undefined
}) => {
  const isBinarySearch = isBinarySearchAscending != null && binarySearchHigh != null && binarySearchLow != null;

  //  exact match or next largest item
  if (match_mode === 1) {
    if (lookup_array[idx] === lookup_value) {
      return {
        newMatchedIndex: idx + 1,
        isExactMatch: true,
        newMatchedIndexValue: matchedIndexValue,
        binarySearchHigh,
        binarySearchLow
      }
    } else if (lookup_array[idx] > lookup_value) {
      if (!matchedIndexValue) {
        matchedIndex = idx + 1;
        matchedIndexValue = lookup_array[idx];
      } else if (lookup_array[idx] < matchedIndexValue) {
        matchedIndex = idx + 1;
        matchedIndexValue = lookup_array[idx];
      }

      if (isBinarySearch) {
        if (isBinarySearchAscending) binarySearchHigh = idx - 1;
        else binarySearchLow = idx + 1;
      }
    } else if (isBinarySearch) {
      if (isBinarySearchAscending) binarySearchLow = idx + 1;
      else binarySearchHigh = idx - 1;
    }
  }
  // exact match
  else if (match_mode === 0) {
    if (lookup_array[idx] === lookup_value) {
      return {
        newMatchedIndex: idx + 1,
        isExactMatch: true,
        newMatchedIndexValue: matchedIndexValue,
        binarySearchHigh,
        binarySearchLow
      }
    } else if (isBinarySearch) {
      if (lookup_array[idx] > lookup_value) {
        if (isBinarySearchAscending) binarySearchHigh = idx - 1;
        else binarySearchLow = idx + 1;
      } else {
        if (isBinarySearchAscending) binarySearchLow = idx + 1;
        else binarySearchHigh = idx - 1;
      }
    }
  }
  // exact match or next smallest item
  else if (match_mode === -1) {
    if (lookup_array[idx] === lookup_value) {
      return {
        newMatchedIndex: idx + 1,
        isExactMatch: true,
        newMatchedIndexValue: matchedIndexValue,
        binarySearchHigh,
        binarySearchLow
      }
    } else if (lookup_array[idx] < lookup_value) {
      if (!matchedIndexValue) {
        matchedIndex = idx + 1;
        matchedIndexValue = lookup_array[idx];
      } else if (lookup_array[idx] > matchedIndexValue) {
        matchedIndex = idx + 1;
        matchedIndexValue = lookup_array[idx];
      }

      if (isBinarySearch) {
        if (isBinarySearchAscending) binarySearchLow = idx + 1;
        else binarySearchHigh = idx - 1;
      }
    } else if (isBinarySearch) {
      if (isBinarySearchAscending) binarySearchHigh = idx - 1;
      else binarySearchLow = idx + 1;
    }
  }
  // a wildcard match where '?', "~", and "*" have special meaning
  else if (match_mode === 2) {
    if (typeof lookup_value === 'string') {
      const lookupValueStr = lookup_value.toLowerCase().replace(/\?/g, '.').replace(/\*/g, '.*').replace(/~/g, '\\');
      const regex = new RegExp('^' + lookupValueStr + '$');

      if (regex.test(lookup_array[idx].toLowerCase()) || lookup_array[idx] === lookup_value) {
        return {
          newMatchedIndex: idx + 1,
          isExactMatch: true,
          newMatchedIndexValue: matchedIndexValue,
          binarySearchHigh,
          binarySearchLow
        }
      }
    } else {
      if (lookup_array[idx] === lookup_value) {
        return {
          newMatchedIndex: idx + 1,
          isExactMatch: true,
          newMatchedIndexValue: matchedIndexValue,
          binarySearchHigh,
          binarySearchLow
        }
      }
    }

    if (isBinarySearch) {
      if (lookup_array[idx] > lookup_value) {
        if (isBinarySearchAscending) binarySearchHigh = idx - 1;
        else binarySearchLow = idx + 1;
      } else {
        if (isBinarySearchAscending) binarySearchLow = idx + 1;
        else binarySearchHigh = idx - 1;
      }
    }
  }

  return {
    newMatchedIndex: matchedIndex,
    isExactMatch: false,
    newMatchedIndexValue: matchedIndexValue,
    binarySearchHigh,
    binarySearchLow
  }
};

/**
 * Looks up values in a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value that you want to match in lookup_array. For example, when you look up someone's number in a telephone book, you are using the person's name as the lookup value, but the telephone number is the value you want.The lookup_value argument can be a value (number, text, or logical value) or a value reference to a number, text, or logical value.
 * @param {*} lookup_array The range of values being searched.
 * @param {*} match_mode Optional. The number -1, 0, 1 or 2. The match_mode argument specifies how Excel matches lookup_value with values in lookup_array. The default value for this argument is 0.
 * @param {*} search_mode Optional. The number -2, -1, 1 or 2. The search_mode argument specifies how Excel searches for lookup_value in lookup_array. The default value for this argument is 1.
 * @returns
 */
function XMATCH(lookup_value, lookup_array, match_mode, search_mode) {
  if (!lookup_value && !lookup_array) {
    return na
  }

  if (arguments.length === 2) {
    match_mode = 0;
    search_mode = 1;
  }

  if (arguments.length === 3) {
    search_mode = 1;
  }

  if (!(lookup_array instanceof Array)) {
    return na
  }

  lookup_array = flatten(lookup_array);

  if (match_mode !== -1 && match_mode !== 0 && match_mode !== 1 && match_mode !== 2) {
    return na
  }

  if (search_mode !== -2 && search_mode !== -1 && search_mode !== 1 && search_mode !== 2) {
    return na
  }

  let matchedIndex;
  let matchedIndexValue;

  // first to last
  if (search_mode === 1) {
    for (let idx = 0; idx < lookup_array.length; idx++) {
      const { newMatchedIndex, newMatchedIndexValue, isExactMatch } = xMatchSearch({
        lookup_value,
        lookup_array,
        match_mode,
        matchedIndex,
        matchedIndexValue,
        idx
      });

      matchedIndex = newMatchedIndex;
      matchedIndexValue = newMatchedIndexValue;

      if (isExactMatch || (idx === lookup_array.length - 1 && matchedIndex)) {
        return matchedIndex
      }
    }
  }
  // last to first
  else if (search_mode === -1) {
    for (let idx = lookup_array.length - 1; idx >= 0; idx--) {
      const { newMatchedIndex, newMatchedIndexValue, isExactMatch } = xMatchSearch({
        lookup_value,
        lookup_array,
        match_mode,
        matchedIndex,
        matchedIndexValue,
        idx
      });

      matchedIndex = newMatchedIndex;
      matchedIndexValue = newMatchedIndexValue;

      if (isExactMatch || (idx === 0 && matchedIndex)) return matchedIndex
    }
  }
  // binary search where the lookup_array is sorted in ascending order
  else if (search_mode === 2) {
    let low = 0;
    let high = lookup_array.length - 1;
    let mid;

    while (low <= high) {
      mid = Math.floor((low + high) / 2);

      const { newMatchedIndex, newMatchedIndexValue, isExactMatch, binarySearchHigh, binarySearchLow } = xMatchSearch({
        lookup_value,
        lookup_array,
        match_mode,
        matchedIndex,
        matchedIndexValue,
        idx: mid,
        isBinarySearchAscending: true,
        binarySearchLow: low,
        binarySearchHigh: high
      });

      matchedIndex = newMatchedIndex;
      matchedIndexValue = newMatchedIndexValue;
      low = binarySearchLow;
      high = binarySearchHigh;

      if (isExactMatch) return matchedIndex
    }
  }
  // binary search where the lookup_array is sorted in descending order
  else if (search_mode === -2) {
    let low = 0;
    let high = lookup_array.length - 1;
    let mid;

    while (low <= high) {
      mid = Math.floor((low + high) / 2);

      const { newMatchedIndex, newMatchedIndexValue, isExactMatch, binarySearchHigh, binarySearchLow } = xMatchSearch({
        lookup_value,
        lookup_array,
        match_mode,
        matchedIndex,
        matchedIndexValue,
        idx: mid,
        isBinarySearchAscending: false,
        binarySearchLow: low,
        binarySearchHigh: high
      });

      matchedIndex = newMatchedIndex;
      matchedIndexValue = newMatchedIndexValue;
      low = binarySearchLow;
      high = binarySearchHigh;

      if (isExactMatch) return matchedIndex
    }
  }

  return matchedIndex || na
}

const SQRT2PI = 2.5066282746310002;

/**
 * Returns the average of the absolute deviations of data points from their mean.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want the average of the absolute deviations. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function AVEDEV() {
  const flatArguments = flatten(arguments);
  const flatArgumentsDefined = flatArguments.filter(isDefined);

  if (flatArgumentsDefined.length === 0) {
    return num
  }

  const range = parseNumberArray(flatArgumentsDefined);

  if (range instanceof Error) {
    return range
  }

  return jStat__default["default"].sum(jStat__default["default"](range).subtract(jStat__default["default"].mean(range)).abs()[0]) / range.length
}

/**
 * Returns the average of its arguments.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ...Numbers, value references or ranges for which you want the average.
 * @returns
 */
function AVERAGE() {
  const flatArguments = flatten(arguments);
  const flatArgumentsDefined = flatArguments.filter(isDefined);

  if (flatArgumentsDefined.length === 0) {
    return div0
  }

  const someError = anyError.apply(undefined, flatArgumentsDefined);

  if (someError) {
    return someError
  }

  const range = numbers(flatArgumentsDefined);
  const n = range.length;
  let sum = 0;
  let count = 0;
  let result;

  for (let i = 0; i < n; i++) {
    sum += range[i];
    count += 1;
  }

  result = sum / count;

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the average of its arguments, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 255 values, ranges of values, or values for which you want the average.
 * @returns
 */
function AVERAGEA() {
  const flatArguments = flatten(arguments);
  const flatArgumentsDefined = flatArguments.filter(isDefined);

  if (flatArgumentsDefined.length === 0) {
    return div0
  }

  const someError = anyError.apply(undefined, flatArgumentsDefined);

  if (someError) {
    return someError
  }

  const range = flatArgumentsDefined;
  const n = range.length;
  let sum = 0;
  let count = 0;
  let result;

  for (let i = 0; i < n; i++) {
    const el = range[i];

    if (typeof el === 'number') {
      sum += el;
    }

    if (el === true) {
      sum++;
    }

    if (el !== null) {
      count++;
    }
  }

  result = sum / count;

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the average (arithmetic mean) of all the values in a range that meet a given criteria.
 *
 * Category: Statistical
 *
 * @param {*} range One or more values to average, including numbers or names, arrays, or references that contain numbers.
 * @param {*} criteria The criteria in the form of a number, expression, value reference, or text that defines which values are averaged.
 * @param {*} average_range Optional. The actual set of values to average. If omitted, range is used.
 * @returns
 */
function AVERAGEIF(range, criteria, average_range) {
  if (arguments.length <= 1) {
    return na
  }

  average_range = average_range || range;
  const flatAverageRange = flatten(average_range);
  const flatAverageRangeDefined = flatAverageRange.filter(isDefined);
  average_range = parseNumberArray(flatAverageRangeDefined);

  range = flatten(range);

  if (average_range instanceof Error) {
    return average_range
  }

  let average_count = 0;
  let result = 0;
  const isWildcard = criteria === void 0 || criteria === '*';
  const tokenizedCriteria = isWildcard ? null : parse(criteria + '');

  for (let i = 0; i < range.length; i++) {
    const value = range[i];

    if (isWildcard) {
      result += average_range[i];
      average_count++;
    } else {
      const tokens = [createToken(value, TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);

      if (compute(tokens)) {
        result += average_range[i];
        average_count++;
      }
    }
  }

  return result / average_count
}

/**
 * Returns the average (arithmetic mean) of all values that meet multiple criteria.
 *
 * Category: Statistical
 *
 * @param {*} args One or more values to average, including numbers or names, arrays, or references that contain numbers.
 * @returns
 */
function AVERAGEIFS() {
  // Does not work with multi dimensional ranges yet!
  // http://office.microsoft.com/en-001/excel-help/averageifs-function-HA010047493.aspx
  const args = argsToArray(arguments);
  const criteriaLength = (args.length - 1) / 2;
  const range = flatten(args[0]);
  let count = 0;
  let result = 0;

  for (let i = 0; i < range.length; i++) {
    let isMeetCondition = false;

    for (let j = 0; j < criteriaLength; j++) {
      const value = args[2 * j + 1][i];
      const criteria = args[2 * j + 2];
      const isWildcard = criteria === void 0 || criteria === '*';
      let computedResult = false;

      if (isWildcard) {
        computedResult = true;
      } else {
        const tokenizedCriteria = parse(criteria + '');
        const tokens = [createToken(value, TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);

        computedResult = compute(tokens);
      }

      // Criterias are calculated as AND so any `false` breakes the loop as unmeet condition
      if (!computedResult) {
        isMeetCondition = false;
        break
      }

      isMeetCondition = true;
    }

    if (isMeetCondition) {
      result += range[i];
      count++;
    }
  }

  const average = result / count;

  return isNaN(average) ? 0 : average
}

const BETA = {};

/**
 * Returns the beta cumulative distribution function.
 *
 * Category: Statistical
 *
 * @param {*} x The value between A and B at which to evaluate the function
 * @param {*} alpha A parameter of the distribution.
 * @param {*} beta A parameter of the distribution.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, BETA.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @param {*} a Optional. A lower bound to the interval of x.
 * @param {*} b Optional. An upper bound to the interval of x.
 * @returns
 */
BETA.DIST = function (x, alpha, beta, cumulative, a, b) {
  if (arguments.length < 4) {
    return value
  }

  a = a === undefined ? 0 : a;
  b = b === undefined ? 1 : b;

  x = parseNumber(x);
  alpha = parseNumber(alpha);
  beta = parseNumber(beta);
  a = parseNumber(a);
  b = parseNumber(b);

  if (anyIsError(x, alpha, beta, a, b)) {
    return value
  }

  x = (x - a) / (b - a);

  return cumulative ? jStat__default["default"].beta.cdf(x, alpha, beta) : jStat__default["default"].beta.pdf(x, alpha, beta)
};

/**
 * Returns the inverse of the cumulative distribution function for a specified beta distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability associated with the beta distribution.
 * @param {*} alpha A parameter of the distribution.
 * @param {*} beta A parameter the distribution.
 * @param {*} a Optional. A lower bound to the interval of x.
 * @param {*} b Optional. An upper bound to the interval of x.
 * @returns
 */
BETA.INV = (probability, alpha, beta, a, b) => {
  a = a === undefined ? 0 : a;
  b = b === undefined ? 1 : b;
  probability = parseNumber(probability);
  alpha = parseNumber(alpha);
  beta = parseNumber(beta);
  a = parseNumber(a);
  b = parseNumber(b);

  if (anyIsError(probability, alpha, beta, a, b)) {
    return value
  }

  return jStat__default["default"].beta.inv(probability, alpha, beta) * (b - a) + a
};

const BINOM = {};

/**
 * Returns the individual term binomial distribution probability.
 *
 * Category: Statistical
 *
 * @param {*} number_s The number of successes in trials.
 * @param {*} trials The number of independent trials.
 * @param {*} probability_s The probability of success on each trial.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, then BINOM.DIST returns the cumulative distribution function, which is the probability that there are at most number_s successes; if FALSE, it returns the probability mass function, which is the probability that there are number_s successes.
 * @returns
 */
BINOM.DIST = (number_s, trials, probability_s, cumulative) => {
  number_s = parseNumber(number_s);
  trials = parseNumber(trials);
  probability_s = parseNumber(probability_s);
  cumulative = parseNumber(cumulative);

  if (anyIsError(number_s, trials, probability_s, cumulative)) {
    return value
  }

  return cumulative
    ? jStat__default["default"].binomial.cdf(number_s, trials, probability_s)
    : jStat__default["default"].binomial.pdf(number_s, trials, probability_s)
};

/**
 * Returns the probability of a trial result using a binomial distribution.
 *
 * Category: Statistical
 *
 * @param {*} trials The number of independent trials. Must be greater than or equal to 0.
 * @param {*} probability_s The probability of success in each trial. Must be greater than or equal to 0 and less than or equal to 1.
 * @param {*} number_s The number of successes in trials. Must be greater than or equal to 0 and less than or equal to Trials.
 * @param {*} number_s2 Optional. If provided, returns the probability that the number of successful trials will fall between Number_s and number_s2. Must be greater than or equal to Number_s and less than or equal to Trials.
 * @returns
 */
BINOM.DIST.RANGE = (trials, probability_s, number_s, number_s2) => {
  number_s2 = number_s2 === undefined ? number_s : number_s2;

  trials = parseNumber(trials);
  probability_s = parseNumber(probability_s);
  number_s = parseNumber(number_s);
  number_s2 = parseNumber(number_s2);

  if (anyIsError(trials, probability_s, number_s, number_s2)) {
    return value
  }

  let result = 0;

  for (let i = number_s; i <= number_s2; i++) {
    result += COMBIN(trials, i) * Math.pow(probability_s, i) * Math.pow(1 - probability_s, trials - i);
  }

  return result
};

/**
 * Returns the smallest value for which the cumulative binomial distribution is less than or equal to a criterion value.
 *
 * Category: Statistical
 *
 * @param {*} trials The number of Bernoulli trials.
 * @param {*} probability_s The probability of a success on each trial.
 * @param {*} alpha The criterion value.
 * @returns
 */
BINOM.INV = (trials, probability_s, alpha) => {
  trials = parseNumber(trials);
  probability_s = parseNumber(probability_s);
  alpha = parseNumber(alpha);

  if (anyIsError(trials, probability_s, alpha)) {
    return value
  }

  let x = 0;

  while (x <= trials) {
    if (jStat__default["default"].binomial.cdf(x, trials, probability_s) >= alpha) {
      return x
    }

    x++;
  }
};

const CHISQ = {};

/**
 * Returns the cumulative beta probability density function.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which you want to evaluate the distribution.
 * @param {*} deg_freedom The number of degrees of freedom.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, CHISQ.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
CHISQ.DIST = (x, deg_freedom, cumulative) => {
  x = parseNumber(x);
  deg_freedom = parseNumber(deg_freedom);

  if (anyIsError(x, deg_freedom)) {
    return value
  }

  return cumulative ? jStat__default["default"].chisquare.cdf(x, deg_freedom) : jStat__default["default"].chisquare.pdf(x, deg_freedom)
};

/**
 * Returns the one-tailed probability of the chi-squared distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which you want to evaluate the distribution.
 * @param {*} deg_freedom The number of degrees of freedom.
 * @returns
 */
CHISQ.DIST.RT = (x, deg_freedom) => {
  if (!x | !deg_freedom) {
    return na
  }

  if (x < 1 || deg_freedom > Math.pow(10, 10)) {
    return num
  }

  if (typeof x !== 'number' || typeof deg_freedom !== 'number') {
    return value
  }

  return 1 - jStat__default["default"].chisquare.cdf(x, deg_freedom)
};

/**
 * Returns the cumulative beta probability density function.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability associated with the chi-squared distribution.
 * @param {*} deg_freedom The number of degrees of freedom.
 * @returns
 */
CHISQ.INV = (probability, deg_freedom) => {
  probability = parseNumber(probability);
  deg_freedom = parseNumber(deg_freedom);

  if (anyIsError(probability, deg_freedom)) {
    return value
  }

  return jStat__default["default"].chisquare.inv(probability, deg_freedom)
};

/**
 * Returns the inverse of the one-tailed probability of the chi-squared distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability associated with the chi-squared distribution.
 * @param {*} deg_freedom The number of degrees of freedom.
 * @returns
 */
CHISQ.INV.RT = (probability, deg_freedom) => {
  if (!probability | !deg_freedom) {
    return na
  }

  if (probability < 0 || probability > 1 || deg_freedom < 1 || deg_freedom > Math.pow(10, 10)) {
    return num
  }

  if (typeof probability !== 'number' || typeof deg_freedom !== 'number') {
    return value
  }

  return jStat__default["default"].chisquare.inv(1.0 - probability, deg_freedom)
};

/**
 * Returns the test for independence.
 *
 * Category: Statistical
 *
 * @param {*} actual_range The range of data that contains observations to test against expected values.
 * @param {*} expected_range The range of data that contains the ratio of the product of row totals and column totals to the grand total.
 * @returns
 */
CHISQ.TEST = function (actual_range, expected_range) {
  if (arguments.length !== 2) {
    return na
  }

  if (!(actual_range instanceof Array) || !(expected_range instanceof Array)) {
    return value
  }

  if (actual_range.length !== expected_range.length) {
    return value
  }

  if (actual_range[0] && expected_range[0] && actual_range[0].length !== expected_range[0].length) {
    return value
  }

  const row = actual_range.length;
  let tmp, i, j;

  // Convert single-dimension array into two-dimension array

  for (i = 0; i < row; i++) {
    if (!(actual_range[i] instanceof Array)) {
      tmp = actual_range[i];
      actual_range[i] = [];
      actual_range[i].push(tmp);
    }

    if (!(expected_range[i] instanceof Array)) {
      tmp = expected_range[i];
      expected_range[i] = [];
      expected_range[i].push(tmp);
    }
  }

  const col = actual_range[0].length;
  const dof = col === 1 ? row - 1 : (row - 1) * (col - 1);
  let xsqr = 0;
  const Pi = Math.PI;

  for (i = 0; i < row; i++) {
    for (j = 0; j < col; j++) {
      xsqr += Math.pow(actual_range[i][j] - expected_range[i][j], 2) / expected_range[i][j];
    }
  }

  // Get independency by X square and its degree of freedom
  function ChiSq(xsqr, dof) {
    let p = Math.exp(-0.5 * xsqr);

    if (dof % 2 === 1) {
      p = p * Math.sqrt((2 * xsqr) / Pi);
    }

    let k = dof;

    while (k >= 2) {
      p = (p * xsqr) / k;
      k = k - 2;
    }

    let t = p;
    let a = dof;

    while (t > 0.0000000001 * p) {
      a = a + 2;
      t = (t * xsqr) / a;
      p = p + t;
    }

    return 1 - p
  }

  return Math.round(ChiSq(xsqr, dof) * 1000000) / 1000000
};

const CONFIDENCE = {};

/**
 * Returns the confidence interval for a population mean.
 *
 * Category: Statistical
 *
 * @param {*} alpha The significance level used to compute the confidence level. The confidence level equals 100*(1 - alpha)%, or in other words, an alpha of 0.05 indicates a 95 percent confidence level.
 * @param {*} standard_dev The population standard deviation for the data range and is assumed to be known.
 * @param {*} size The sample size.
 * @returns
 */
CONFIDENCE.NORM = (alpha, standard_dev, size) => {
  alpha = parseNumber(alpha);
  standard_dev = parseNumber(standard_dev);
  size = parseNumber(size);

  if (anyIsError(alpha, standard_dev, size)) {
    return value
  }

  return jStat__default["default"].normalci(1, alpha, standard_dev, size)[1] - 1
};

/**
 * Returns the confidence interval for a population mean, using a Student's t distribution.
 *
 * Category: Statistical
 *
 * @param {*} alpha The significance level used to compute the confidence level. The confidence level equals 100*(1 - alpha)%, or in other words, an alpha of 0.05 indicates a 95 percent confidence level.
 * @param {*} standard_dev The population standard deviation for the data range and is assumed to be known.
 * @param {*} size The sample size.
 * @returns
 */
CONFIDENCE.T = (alpha, standard_dev, size) => {
  alpha = parseNumber(alpha);
  standard_dev = parseNumber(standard_dev);
  size = parseNumber(size);

  if (anyIsError(alpha, standard_dev, size)) {
    return value
  }

  return jStat__default["default"].tci(1, alpha, standard_dev, size)[1] - 1
};

/**
 * Returns the correlation coefficient between two data sets.
 *
 * Category: Statistical
 *
 * @param {*} array1 A range of value values.
 * @param {*} array2 A second range of value values.
 * @returns
 */
function CORREL(array1, array2) {
  array1 = parseNumberArray(flatten(array1));
  array2 = parseNumberArray(flatten(array2));

  if (anyIsError(array1, array2)) {
    return value
  }

  return jStat__default["default"].corrcoeff(array1, array2)
}

/**
 * Counts how many numbers are in the list of arguments.
 *
 * Category: Statistical
 *
 * @param {*} args Cell reference, or range within which you want to count numbers.count numbers.
 * @returns
 */
function COUNT() {
  const flatArguments = flatten(arguments);

  return numbers(flatArguments).length
}

/**
 * Counts how many values are in the list of arguments.
 *
 * Category: Statistical
 *
 * @param {*} args Arguments representing the values that you want to count.
 * @returns
 */
function COUNTA() {
  const flatArguments = flatten(arguments);

  return flatArguments.length - COUNTBLANK(flatArguments)
}

/**
 * Formula.js only
 *
 * @param {*} range
 * @param {*} value
 * @returns
 */
function COUNTIN(range, value) {
  let result = 0;

  range = flatten(range);

  for (let i = 0; i < range.length; i++) {
    if (range[i] === value) {
      result++;
    }
  }

  return result
}

/**
 * Counts the number of blank values within a range.
 *
 * Category: Statistical
 *
 * @param {*} args The range from which you want to count the blank values.
 * @returns
 */
function COUNTBLANK() {
  const range = flatten(arguments);
  let blanks = 0;
  let element;

  for (let i = 0; i < range.length; i++) {
    element = range[i];

    if (element === undefined || element === null || element === '') {
      blanks++;
    }
  }

  return blanks
}

/**
 * Counts the number of values within a range that meet the given criteria.
 *
 * Category: Statistical
 *
 * @returns
 */
function COUNTIF(range, criteria) {
  range = flatten(range);

  const isWildcard = criteria === void 0 || criteria === '*';

  if (isWildcard) {
    return range.length
  }

  let matches = 0;
  const tokenizedCriteria = parse(criteria + '');

  for (let i = 0; i < range.length; i++) {
    const value = range[i];
    const tokens = [createToken(value, TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);

    if (compute(tokens)) {
      matches++;
    }
  }

  return matches
}

/**
 * Counts the number of values within a range that meet multiple criteria.
 *
 * Category: Statistical
 *
 * @param {*} args Range in which to evaluate the associated criteria.
 * @returns
 */
function COUNTIFS() {
  const args = argsToArray(arguments);
  const results = new Array(flatten(args[0]).length);

  for (let i = 0; i < results.length; i++) {
    results[i] = true;
  }

  for (let i = 0; i < args.length; i += 2) {
    const range = flatten(args[i]);
    const criteria = args[i + 1];
    const isWildcard = criteria === void 0 || criteria === '*';

    if (!isWildcard) {
      const tokenizedCriteria = parse(criteria + '');

      for (let j = 0; j < range.length; j++) {
        const value = range[j];
        const tokens = [createToken(value, TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);

        results[j] = results[j] && compute(tokens);
      }
    }
  }

  let result = 0;

  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      result++;
    }
  }

  return result
}

/**
 * Formula.js only
 *
 * @returns
 */
function COUNTUNIQUE() {
  return UNIQUE.apply(null, flatten(arguments)).length
}

const COVARIANCE = {};

/**
 * Returns covariance, the average of the products of paired deviations.
 *
 * Category: Statistical
 *
 * @param {*} array1 The first value range of integers.
 * @param {*} array2 The second value range of integers.
 * @returns
 */
COVARIANCE.P = (array1, array2) => {
  array1 = parseNumberArray(flatten(array1));
  array2 = parseNumberArray(flatten(array2));

  if (anyIsError(array1, array2)) {
    return value
  }

  const mean1 = jStat__default["default"].mean(array1);
  const mean2 = jStat__default["default"].mean(array2);
  let result = 0;
  const n = array1.length;

  for (let i = 0; i < n; i++) {
    result += (array1[i] - mean1) * (array2[i] - mean2);
  }

  return result / n
};

/**
 * Returns the sample covariance, the average of the products deviations for each data point pair in two data sets.
 *
 * Category: Statistical
 *
 * @param {*} array1 The first value range of integers.
 * @param {*} array2 The second value range of integers.
 * @returns
 */
COVARIANCE.S = (array1, array2) => {
  array1 = parseNumberArray(flatten(array1));
  array2 = parseNumberArray(flatten(array2));

  if (anyIsError(array1, array2)) {
    return value
  }

  return jStat__default["default"].covariance(array1, array2)
};

/**
 * Returns the sum of squares of deviations.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want to calculate the sum of squared deviations. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function DEVSQ() {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const mean = jStat__default["default"].mean(range);
  let result = 0;

  for (let i = 0; i < range.length; i++) {
    result += Math.pow(range[i] - mean, 2);
  }

  return result
}

const EXPON = {};

/**
 * Returns the exponential distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value of the function.
 * @param {*} lambda The parameter value.
 * @param {*} cumulative A logical value that indicates which form of the exponential function to provide. If cumulative is TRUE, EXPON.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
EXPON.DIST = (x, lambda, cumulative) => {
  x = parseNumber(x);
  lambda = parseNumber(lambda);

  if (anyIsError(x, lambda)) {
    return value
  }

  return cumulative ? jStat__default["default"].exponential.cdf(x, lambda) : jStat__default["default"].exponential.pdf(x, lambda)
};

const F = {};

/**
 * Returns the F probability distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} deg_freedom1 The numerator degrees of freedom.
 * @param {*} deg_freedom2 The denominator degrees of freedom.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, F.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
F.DIST = (x, deg_freedom1, deg_freedom2, cumulative) => {
  x = parseNumber(x);
  deg_freedom1 = parseNumber(deg_freedom1);
  deg_freedom2 = parseNumber(deg_freedom2);

  if (anyIsError(x, deg_freedom1, deg_freedom2)) {
    return value
  }

  return cumulative
    ? jStat__default["default"].centralF.cdf(x, deg_freedom1, deg_freedom2)
    : jStat__default["default"].centralF.pdf(x, deg_freedom1, deg_freedom2)
};

/**
 * Returns the F probability distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} deg_freedom1 The numerator degrees of freedom.
 * @param {*} deg_freedom2 The denominator degrees of freedom.
 * @returns
 */
F.DIST.RT = function (x, deg_freedom1, deg_freedom2) {
  if (arguments.length !== 3) {
    return na
  }

  if (x < 0 || deg_freedom1 < 1 || deg_freedom2 < 1) {
    return num
  }

  if (typeof x !== 'number' || typeof deg_freedom1 !== 'number' || typeof deg_freedom2 !== 'number') {
    return value
  }

  return 1 - jStat__default["default"].centralF.cdf(x, deg_freedom1, deg_freedom2)
};

/**
 * Returns the inverse of the F probability distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability associated with the F cumulative distribution.
 * @param {*} deg_freedom1 The numerator degrees of freedom.
 * @param {*} deg_freedom2 The denominator degrees of freedom.
 * @returns
 */
F.INV = (probability, deg_freedom1, deg_freedom2) => {
  probability = parseNumber(probability);
  deg_freedom1 = parseNumber(deg_freedom1);
  deg_freedom2 = parseNumber(deg_freedom2);

  if (anyIsError(probability, deg_freedom1, deg_freedom2)) {
    return value
  }

  if (probability <= 0.0 || probability > 1.0) {
    return num
  }

  return jStat__default["default"].centralF.inv(probability, deg_freedom1, deg_freedom2)
};

/**
 * Returns the inverse of the F probability distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability associated with the F cumulative distribution.
 * @param {*} deg_freedom1 The numerator degrees of freedom.
 * @param {*} deg_freedom2 The denominator degrees of freedom.
 * @returns
 */
F.INV.RT = function (probability, deg_freedom1, deg_freedom2) {
  if (arguments.length !== 3) {
    return na
  }

  if (
    probability < 0 ||
    probability > 1 ||
    deg_freedom1 < 1 ||
    deg_freedom1 > Math.pow(10, 10) ||
    deg_freedom2 < 1 ||
    deg_freedom2 > Math.pow(10, 10)
  ) {
    return num
  }

  if (typeof probability !== 'number' || typeof deg_freedom1 !== 'number' || typeof deg_freedom2 !== 'number') {
    return value
  }

  return jStat__default["default"].centralF.inv(1.0 - probability, deg_freedom1, deg_freedom2)
};

/**
 * Returns the result of an F-test.
 *
 * Category: Statistical
 *
 * @param {*} array1 The first array or range of data.
 * @param {*} array2 The second array or range of data.
 * @returns
 */
F.TEST = (array1, array2) => {
  if (!array1 || !array2) {
    return na
  }

  if (!(array1 instanceof Array) || !(array2 instanceof Array)) {
    return na
  }

  if (array1.length < 2 || array2.length < 2) {
    return div0
  }

  const sumOfSquares = (values, x1) => {
    let sum = 0;

    for (let i = 0; i < values.length; i++) {
      sum += Math.pow(values[i] - x1, 2);
    }

    return sum
  };

  const x1 = SUM(array1) / array1.length;
  const x2 = SUM(array2) / array2.length;
  const sum1 = sumOfSquares(array1, x1) / (array1.length - 1);
  const sum2 = sumOfSquares(array2, x2) / (array2.length - 1);

  return sum1 / sum2
};

/**
 * Returns the Fisher transformation.
 *
 * Category: Statistical
 *
 * @param {*} x A numeric value for which you want the transformation.
 * @returns
 */
function FISHER(x) {
  x = parseNumber(x);

  if (x instanceof Error) {
    return x
  }

  return Math.log((1 + x) / (1 - x)) / 2
}

/**
 * Returns the inverse of the Fisher transformation.
 *
 * Category: Statistical
 *
 * @param {*} y The value for which you want to perform the inverse of the transformation.
 * @returns
 */
function FISHERINV(y) {
  y = parseNumber(y);

  if (y instanceof Error) {
    return y
  }

  const e2y = Math.exp(2 * y);

  return (e2y - 1) / (e2y + 1)
}

/**
 * Returns a value along a linear trend.
 *
 * Category: Statistical
 *
 * @param {*} x The data point for which you want to predict a value.
 * @param {*} known_ys The dependent array or range of data.
 * @param {*} known_xs The independent array or range of data.
 * @returns
 */
function FORECAST(x, known_ys, known_xs) {
  x = parseNumber(x);
  known_ys = parseNumberArray(flatten(known_ys));
  known_xs = parseNumberArray(flatten(known_xs));

  if (anyIsError(x, known_ys, known_xs)) {
    return value
  }

  const xmean = jStat__default["default"].mean(known_xs);
  const ymean = jStat__default["default"].mean(known_ys);
  const n = known_xs.length;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (known_xs[i] - xmean) * (known_ys[i] - ymean);
    den += Math.pow(known_xs[i] - xmean, 2);
  }

  const b = num / den;
  const a = ymean - b * xmean;

  return a + b * x
}

/**
 * Returns a frequency distribution as a vertical array.
 *
 * Category: Statistical
 *
 * @param {*} data_array An array of or reference to a set of values for which you want to count frequencies. If data_array contains no values, FREQUENCY returns an array of zeros.
 * @param {*} bins_array An array of or reference to intervals into which you want to group the values in data_array. If bins_array contains no values, FREQUENCY returns the number of elements in data_array.
 * @returns
 */
function FREQUENCY(data_array, bins_array) {
  data_array = parseNumberArray(flatten(data_array));
  bins_array = parseNumberArray(flatten(bins_array));

  if (anyIsError(data_array, bins_array)) {
    return value
  }

  const n = data_array.length;
  const b = bins_array.length;
  const r = [];

  for (let i = 0; i <= b; i++) {
    r[i] = 0;

    for (let j = 0; j < n; j++) {
      if (i === 0) {
        if (data_array[j] <= bins_array[0]) {
          r[0] += 1;
        }
      } else if (i < b) {
        if (data_array[j] > bins_array[i - 1] && data_array[j] <= bins_array[i]) {
          r[i] += 1;
        }
      } else if (i === b) {
        if (data_array[j] > bins_array[b - 1]) {
          r[b] += 1;
        }
      }
    }
  }

  return r
}

/**
 * Returns the Gamma function value.
 *
 * Category: Statistical
 *
 * @param {*} number Returns a number.
 * @returns
 */
function GAMMA(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return num
  }

  if (parseInt(number, 10) === number && number < 0) {
    return num
  }

  return jStat__default["default"].gammafn(number)
}

/**
 * Returns the gamma distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which you want to evaluate the distribution.
 * @param {*} alpha A parameter to the distribution.
 * @param {*} beta A parameter to the distribution. If beta = 1, GAMMA.DIST returns the standard gamma distribution.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, GAMMA.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
GAMMA.DIST = function (value$1, alpha, beta, cumulative) {
  if (arguments.length !== 4) {
    return na
  }

  if (value$1 < 0 || alpha <= 0 || beta <= 0) {
    return value
  }

  if (typeof value$1 !== 'number' || typeof alpha !== 'number' || typeof beta !== 'number') {
    return value
  }

  return cumulative ? jStat__default["default"].gamma.cdf(value$1, alpha, beta, true) : jStat__default["default"].gamma.pdf(value$1, alpha, beta, false)
};

/**
 * Returns the inverse of the gamma cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability The probability associated with the gamma distribution.
 * @param {*} alpha A parameter to the distribution.
 * @param {*} beta A parameter to the distribution. If beta = 1, GAMMA.INV returns the standard gamma distribution.
 * @returns
 */
GAMMA.INV = function (probability, alpha, beta) {
  if (arguments.length !== 3) {
    return na
  }

  if (probability < 0 || probability > 1 || alpha <= 0 || beta <= 0) {
    return num
  }

  if (typeof probability !== 'number' || typeof alpha !== 'number' || typeof beta !== 'number') {
    return value
  }

  return jStat__default["default"].gamma.inv(probability, alpha, beta)
};

/**
 * Returns the natural logarithm of the gamma function, Γ(x).
 *
 * Category: Statistical
 *
 * @param {*} x The value for which you want to calculate GAMMALN.
 * @returns
 */
function GAMMALN(x) {
  x = parseNumber(x);

  if (x instanceof Error) {
    return x
  }

  return jStat__default["default"].gammaln(x)
}

/**
 * Returns the natural logarithm of the gamma function, Γ(x).
 *
 * Category: Statistical
 *
 * @param {*} x The value for which you want to calculate GAMMALN.PRECISE.
 * @returns
 */
GAMMALN.PRECISE = function (x) {
  if (arguments.length !== 1) {
    return na
  }

  if (x <= 0) {
    return num
  }

  if (typeof x !== 'number') {
    return value
  }

  return jStat__default["default"].gammaln(x)
};

/**
 * Returns 0.5 less than the standard normal cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} z Returns a number.
 * @returns
 */
function GAUSS(z) {
  z = parseNumber(z);

  if (z instanceof Error) {
    return z
  }

  return jStat__default["default"].normal.cdf(z, 0, 1) - 0.5
}

/**
 * Returns the geometric mean.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want to calculate the mean. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function GEOMEAN() {
  const args = parseNumberArray(flatten(arguments));

  if (args instanceof Error) {
    return args
  }

  return jStat__default["default"].geomean(args)
}

/**
 * Returns values along an exponential trend.
 *
 * Category: Statistical
 *
 * @param {*} known_y The set of y-values you already know in the relationship y = b*m^x.
 - If the array known_y's is in a single column, then each column of known_x's is interpreted as a separate variable.
 - If the array known_y's is in a single row, then each row of known_x's is interpreted as a separate variable.
 - If any of the numbers in known_y's is 0 or negative, GROWTH returns the #NUM! error value.
 * @param {*} known_x Optional. An optional set of x-values that you may already know in the relationship y = b*m^x.
 - The array known_x's can include one or more sets of variables. If only one variable is used, known_y's and known_x's can be ranges of any shape, as long as they have equal dimensions. If more than one variable is used, known_y's must be a vector (that is, a range with a height of one row or a width of one column).
 - If known_x's is omitted, it is assumed to be the array {1,2,3,...} that is the same size as known_y's.
 * @param {*} new_x Optional. Are new x-values for which you want GROWTH to return corresponding y-values.
 - new_x's must include a column (or row) for each independent variable, just as known_x's does. So, if known_y's is in a single column, known_x's and new_x's must have the same number of columns. If known_y's is in a single row, known_x's and new_x's must have the same number of rows.
 - If new_x's is omitted, it is assumed to be the same as known_x's.
 - If both known_x's and new_x's are omitted, they are assumed to be the array {1,2,3,...} that is the same size as known_y's.
 * @param {*} use_const Optional. A logical value specifying whether to force the constant b to equal 1. If const is TRUE or omitted, b is calculated normally. If const is FALSE, b is set equal to 1 and the m-values are adjusted so that y = m^x.
 - If const is TRUE or omitted, b is calculated normally.
 - If const is FALSE, b is set equal to 1 and the m-values are adjusted so that y = m^x.
 * @returns
 */
function GROWTH(known_y, known_x, new_x, use_const) {
  // Credits: Ilmari Karonen (http://stackoverflow.com/questions/14161990/how-to-implement-growth-function-in-javascript)
  known_y = parseNumberArray(known_y);

  if (known_y instanceof Error) {
    return known_y
  }

  // Default values for optional parameters:
  let i;

  if (known_x === undefined) {
    known_x = [];

    for (i = 1; i <= known_y.length; i++) {
      known_x.push(i);
    }
  }

  if (new_x === undefined) {
    new_x = [];

    for (i = 1; i <= known_y.length; i++) {
      new_x.push(i);
    }
  }

  known_x = parseNumberArray(known_x);
  new_x = parseNumberArray(new_x);

  if (anyIsError(known_x, new_x)) {
    return value
  }

  if (use_const === undefined) {
    use_const = true;
  }

  // Calculate sums over the data:
  const n = known_y.length;
  let avg_x = 0;
  let avg_y = 0;
  let avg_xy = 0;
  let avg_xx = 0;

  for (i = 0; i < n; i++) {
    const x = known_x[i];
    const y = Math.log(known_y[i]);
    avg_x += x;
    avg_y += y;
    avg_xy += x * y;
    avg_xx += x * x;
  }

  avg_x /= n;
  avg_y /= n;
  avg_xy /= n;
  avg_xx /= n;

  // Compute linear regression coefficients:
  let beta;
  let alpha;

  if (use_const) {
    beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
    alpha = avg_y - beta * avg_x;
  } else {
    beta = avg_xy / avg_xx;
    alpha = 0;
  }

  // Compute and return result array:
  const new_y = [];

  for (i = 0; i < new_x.length; i++) {
    new_y.push(Math.exp(alpha + beta * new_x[i]));
  }

  return new_y
}

/**
 * Returns the harmonic mean.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want to calculate the mean. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function HARMEAN() {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const n = range.length;
  let den = 0;

  for (let i = 0; i < n; i++) {
    den += 1 / range[i];
  }

  return n / den
}

const HYPGEOM = {};

/**
 * Returns the hypergeometric distribution.
 *
 * Category: Statistical
 *
 * @param {*} sample_s The number of successes in the sample.
 * @param {*} number_sample The size of the sample.
 * @param {*} population_s The number of successes in the population.
 * @param {*} number_pop The population size.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, then HYPGEOM.DIST returns the cumulative distribution function; if FALSE, it returns the probability mass function.
 * @returns
 */
HYPGEOM.DIST = (sample_s, number_sample, population_s, number_pop, cumulative) => {
  sample_s = parseNumber(sample_s);
  number_sample = parseNumber(number_sample);
  population_s = parseNumber(population_s);
  number_pop = parseNumber(number_pop);

  if (anyIsError(sample_s, number_sample, population_s, number_pop)) {
    return value
  }

  function pdf(x, n, M, N) {
    return (COMBIN(M, x) * COMBIN(N - M, n - x)) / COMBIN(N, n)
  }

  function cdf(x, n, M, N) {
    let result = 0;

    for (let i = 0; i <= x; i++) {
      result += pdf(i, n, M, N);
    }

    return result
  }

  return cumulative
    ? cdf(sample_s, number_sample, population_s, number_pop)
    : pdf(sample_s, number_sample, population_s, number_pop)
};

/**
 * Returns the intercept of the linear regression line.
 *
 * Category: Statistical
 *
 * @param {*} known_y The dependent set of observations or data.
 * @param {*} known_x The independent set of observations or data.
 * @returns
 */
function INTERCEPT(known_y, known_x) {
  known_y = parseNumberArray(known_y);
  known_x = parseNumberArray(known_x);

  if (anyIsError(known_y, known_x)) {
    return value
  }

  if (known_y.length !== known_x.length) {
    return na
  }

  return FORECAST(0, known_y, known_x)
}

/**
 * Returns the kurtosis of a data set.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want to calculate kurtosis. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function KURT() {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const mean = jStat__default["default"].mean(range);
  const n = range.length;
  let sigma = 0;

  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 4);
  }

  sigma = sigma / Math.pow(jStat__default["default"].stdev(range, true), 4);

  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sigma - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3))
}

/**
 * Returns the k-th largest value in a data set.
 *
 * Category: Statistical
 *
 * @param {*} array The array or range of data for which you want to determine the k-th largest value.
 * @param {*} k The position (from the largest) in the array or value range of data to return.
 * @returns
 */
function LARGE(array, k) {
  array = parseNumberArray(flatten(array));
  k = parseNumber(k);

  if (anyIsError(array, k)) {
    return array
  }

  if (k < 0 || array.length < k) {
    return value
  }

  return array.sort((a, b) => b - a)[k - 1]
}

/**
 * Returns the parameters of a linear trend.
 *
 * Category: Statistical
 *
 * @param {*} known_y The set of y-values that you already know in the relationship y = mx + b.
 - If the range of known_y's is in a single column, each column of known_x's is interpreted as a separate variable.
 - If the range of known_y's is contained in a single row, each row of known_x's is interpreted as a separate variable.
 * @param {*} known_x Optional. A set of x-values that you may already know in the relationship y = mx + b.
 - The range of known_x's can include one or more sets of variables. If only one variable is used, known_y's and known_x's can be ranges of any shape, as long as they have equal dimensions. If more than one variable is used, known_y's must be a vector (that is, a range with a height of one row or a width of one column).
 - If known_x's is omitted, it is assumed to be the array {1,2,3,...} that is the same size as known_y's.
 * @returns
 */
function LINEST(known_y, known_x) {
  known_y = parseNumberArray(flatten(known_y));
  known_x = parseNumberArray(flatten(known_x));

  if (anyIsError(known_y, known_x)) {
    return value
  }

  const ymean = jStat__default["default"].mean(known_y);
  const xmean = jStat__default["default"].mean(known_x);
  const n = known_x.length;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (known_x[i] - xmean) * (known_y[i] - ymean);
    den += Math.pow(known_x[i] - xmean, 2);
  }

  const m = num / den;
  const b = ymean - m * xmean;

  return [m, b]
}

// According to Microsoft:
// http://office.microsoft.com/en-us/starter-help/logest-function-HP010342665.aspx
// LOGEST returns are based on the following linear model:
// ln y = x1 ln m1 + ... + xn ln mn + ln b
/**
 * Returns the parameters of an exponential trend.
 *
 * Category: Statistical
 *
 * @param {*} known_y The set of y-values you already know in the relationship y = b*m^x.
 - If the array known_y's is in a single column, then each column of known_x's is interpreted as a separate variable.
 - If the array known_y's is in a single row, then each row of known_x's is interpreted as a separate variable.
 * @param {*} known_x Optional. An optional set of x-values that you may already know in the relationship y = b*m^x.
 - The array known_x's can include one or more sets of variables. If only one variable is used, known_y's and known_x's can be ranges of any shape, as long as they have equal dimensions. If more than one variable is used, known_y's must be a range of values with a height of one row or a width of one column (which is also known as a vector).
 - If known_x's is omitted, it is assumed to be the array {1,2,3,...} that is the same size as known_y's.
 * @returns
 */
function LOGEST(known_y, known_x) {
  known_y = parseNumberArray(flatten(known_y));
  known_x = parseNumberArray(flatten(known_x));

  if (anyIsError(known_y, known_x)) {
    return value
  }

  if (known_y.length !== known_x.length) {
    return value
  }

  for (let i = 0; i < known_y.length; i++) {
    known_y[i] = Math.log(known_y[i]);
  }

  const result = LINEST(known_y, known_x);
  result[0] = Math.round(Math.exp(result[0]) * 1000000) / 1000000;
  result[1] = Math.round(Math.exp(result[1]) * 1000000) / 1000000;

  return result
}

const LOGNORM = {};

/**
 * Returns the cumulative lognormal distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} mean The mean of ln(x).
 * @param {*} standard_dev The standard deviation of ln(x).
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, LOGNORM.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
LOGNORM.DIST = (x, mean, standard_dev, cumulative) => {
  x = parseNumber(x);
  mean = parseNumber(mean);
  standard_dev = parseNumber(standard_dev);

  if (anyIsError(x, mean, standard_dev)) {
    return value
  }

  return cumulative ? jStat__default["default"].lognormal.cdf(x, mean, standard_dev) : jStat__default["default"].lognormal.pdf(x, mean, standard_dev)
};

/**
 * Returns the inverse of the lognormal cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability associated with the lognormal distribution.
 * @param {*} mean The mean of ln(x).
 * @param {*} standard_dev The standard deviation of ln(x).
 * @returns
 */
LOGNORM.INV = (probability, mean, standard_dev) => {
  probability = parseNumber(probability);
  mean = parseNumber(mean);
  standard_dev = parseNumber(standard_dev);

  if (anyIsError(probability, mean, standard_dev)) {
    return value
  }

  return jStat__default["default"].lognormal.inv(probability, mean, standard_dev)
};

/**
 * Returns the maximum value in a list of arguments.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 numbers for which you want to find the maximum value.
 * @returns
 */
function MAX() {
  const flatArguments = flatten(arguments);
  const someError = anyError.apply(undefined, flatArguments);

  if (someError) {
    return someError
  }

  const range = numbers(flatArguments);

  return range.length === 0 ? 0 : Math.max.apply(Math, range)
}

/**
 * Returns the maximum value in a list of arguments, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2,... Number arguments 2 to 255 for which you want to find the largest value.
 * @returns
 */
function MAXA() {
  const flatArguments = flatten(arguments);
  const someError = anyError.apply(undefined, flatArguments);

  if (someError) {
    return someError
  }

  let range = arrayValuesToNumbers(flatArguments);
  range = range.map((value) => (value === undefined || value === null ? 0 : value));

  return range.length === 0 ? 0 : Math.max.apply(Math, range)
}

/**
 * Returns the median of the given numbers.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 numbers for which you want the median.
 * @returns
 */
function MEDIAN() {
  const flatArguments = flatten(arguments);
  const someError = anyError.apply(undefined, flatArguments);

  if (someError) {
    return someError
  }

  const range = arrayValuesToNumbers(flatArguments);
  let result = jStat__default["default"].median(range);

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the minimum value in a list of arguments.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is optional, subsequent numbers are optional. 1 to 255 numbers for which you want to find the minimum value.
 * @returns
 */
function MIN() {
  const flatArguments = flatten(arguments);
  const someError = anyError.apply(undefined, flatArguments);

  if (someError) {
    return someError
  }

  const range = numbers(flatArguments);

  return range.length === 0 ? 0 : Math.min.apply(Math, range)
}

/**
 * Returns the smallest value in a list of arguments, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 255 values for which you want to find the smallest value.
 * @returns
 */
function MINA() {
  const flatArguments = flatten(arguments);
  const someError = anyError.apply(undefined, flatArguments);

  if (someError) {
    return someError
  }

  let range = arrayValuesToNumbers(flatArguments);
  range = range.map((value) => (value === undefined || value === null ? 0 : value));

  return range.length === 0 ? 0 : Math.min.apply(Math, range)
}

const MODE = {};

/**
 * Returns a vertical array of the most frequently occurring, or repetitive values in an array or range of data.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number arguments 2 to 254 for which you want to calculate the mode. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
MODE.MULT = function () {
  // Credits: Roönaän
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const n = range.length;
  const count = {};
  let maxItems = [];
  let max = 0;
  let currentItem;

  for (let i = 0; i < n; i++) {
    currentItem = range[i];
    count[currentItem] = count[currentItem] ? count[currentItem] + 1 : 1;

    if (count[currentItem] > max) {
      max = count[currentItem];
      maxItems = [];
    }

    if (count[currentItem] === max) {
      maxItems[maxItems.length] = currentItem;
    }
  }

  return maxItems
};

/**
 * Returns the most common value in a data set.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Arguments 2 to 254 for which you want to calculate the mode. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
MODE.SNGL = function () {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  return MODE.MULT(range).sort((a, b) => a - b)[0]
};

const NEGBINOM = {};

/**
 * Returns the negative binomial distribution.
 *
 * Category: Statistical
 *
 * @param {*} number_f The number of failures.
 * @param {*} number_s The threshold number of successes.
 * @param {*} probability_s The probability of a success.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, NEGBINOM.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
NEGBINOM.DIST = (number_f, number_s, probability_s, cumulative) => {
  number_f = parseNumber(number_f);
  number_s = parseNumber(number_s);
  probability_s = parseNumber(probability_s);

  if (anyIsError(number_f, number_s, probability_s)) {
    return value
  }

  return cumulative
    ? jStat__default["default"].negbin.cdf(number_f, number_s, probability_s)
    : jStat__default["default"].negbin.pdf(number_f, number_s, probability_s)
};

const NORM = {};

/**
 * Returns the normal cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value for which you want the distribution.
 * @param {*} mean The arithmetic mean of the distribution.
 * @param {*} standard_dev The standard deviation of the distribution.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, NORM.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
NORM.DIST = (x, mean, standard_dev, cumulative) => {
  x = parseNumber(x);
  mean = parseNumber(mean);
  standard_dev = parseNumber(standard_dev);

  if (anyIsError(x, mean, standard_dev)) {
    return value
  }

  if (standard_dev <= 0) {
    return num
  }

  // Return normal distribution computed by jStat [http://jstat.org]
  return cumulative ? jStat__default["default"].normal.cdf(x, mean, standard_dev) : jStat__default["default"].normal.pdf(x, mean, standard_dev)
};

/**
 * Returns the inverse of the normal cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability corresponding to the normal distribution.
 * @param {*} mean The arithmetic mean of the distribution.
 * @param {*} standard_dev The standard deviation of the distribution.
 * @returns
 */
NORM.INV = (probability, mean, standard_dev) => {
  probability = parseNumber(probability);
  mean = parseNumber(mean);
  standard_dev = parseNumber(standard_dev);

  if (anyIsError(probability, mean, standard_dev)) {
    return value
  }

  return jStat__default["default"].normal.inv(probability, mean, standard_dev)
};

NORM.S = {};

/**
 * Returns the standard normal cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} z The value for which you want the distribution.
 * @param {*} cumulative Cumulative is a logical value that determines the form of the function. If cumulative is TRUE, NORMS.DIST returns the cumulative distribution function; if FALSE, it returns the probability mass function.
 * @returns
 */
NORM.S.DIST = (z, cumulative) => {
  z = parseNumber(z);

  if (z instanceof Error) {
    return value
  }

  return cumulative ? jStat__default["default"].normal.cdf(z, 0, 1) : jStat__default["default"].normal.pdf(z, 0, 1)
};

/**
 * Returns the inverse of the standard normal cumulative distribution.
 *
 * Category: Statistical
 *
 * @param {*} probability A probability corresponding to the normal distribution.
 * @returns
 */
NORM.S.INV = (probability) => {
  probability = parseNumber(probability);

  if (probability instanceof Error) {
    return value
  }

  return jStat__default["default"].normal.inv(probability, 0, 1)
};

/**
 * Returns the Pearson product moment correlation coefficient.
 *
 * Category: Statistical
 *
 * @param {*} array1 A set of independent values.
 * @param {*} array2 A set of dependent values.
 * @returns
 */
function PEARSON(array1, array2) {
  array2 = parseNumberArray(flatten(array2));
  array1 = parseNumberArray(flatten(array1));

  if (anyIsError(array2, array1)) {
    return value
  }

  const xmean = jStat__default["default"].mean(array1);
  const ymean = jStat__default["default"].mean(array2);
  const n = array1.length;
  let num = 0;
  let den1 = 0;
  let den2 = 0;

  for (let i = 0; i < n; i++) {
    num += (array1[i] - xmean) * (array2[i] - ymean);
    den1 += Math.pow(array1[i] - xmean, 2);
    den2 += Math.pow(array2[i] - ymean, 2);
  }

  return num / Math.sqrt(den1 * den2)
}

const PERCENTILE = {};

/**
 * Returns the k-th percentile of values in a range, where k is in the range 0..1, exclusive.
 *
 * Category: Statistical
 *
 * @returns
 */
PERCENTILE.EXC = (array, k) => {
  array = parseNumberArray(flatten(array));
  k = parseNumber(k);

  if (anyIsError(array, k)) {
    return value
  }

  array = array.sort((a, b) => a - b);
  const n = array.length;

  if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
    return num
  }

  const l = k * (n + 1) - 1;
  const fl = Math.floor(l);

  return cleanFloat(l === fl ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]))
};

/**
 * Returns the k-th percentile of values in a range.
 *
 * Category: Statistical
 *
 * @param {*} array The array or range of data that defines relative standing.
 * @param {*} k The percentile value in the range 0..1, inclusive.
 * @returns
 */
PERCENTILE.INC = (array, k) => {
  array = parseNumberArray(flatten(array));
  k = parseNumber(k);

  if (anyIsError(array, k)) {
    return value
  }

  array = array.sort((a, b) => a - b);
  const n = array.length;
  const l = k * (n - 1);
  const fl = Math.floor(l);

  return cleanFloat(l === fl ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]))
};

const PERCENTRANK = {};

/**
 * Returns the rank of a value in a data set as a percentage (0..1, exclusive) of the data set.
 *
 * Category: Statistical
 *
 * @param {*} array The array or range of data with numeric values that defines relative standing
 * @param {*} x The value for which you want to know the rank.
 * @param {*} significance Optional. A value that identifies the number of significant digits for the returned percentage value. If omitted, PERCENTRANK.EXC uses three digits (0.xxx).
 * @returns
 */
PERCENTRANK.EXC = (array, x, significance) => {
  significance = significance === undefined ? 3 : significance;
  array = parseNumberArray(flatten(array));
  x = parseNumber(x);
  significance = parseNumber(significance);

  if (anyIsError(array, x, significance)) {
    return value
  }

  array = array.sort((a, b) => a - b);
  const uniques = UNIQUE.apply(null, array);
  const n = array.length;
  const m = uniques.length;
  const power = Math.pow(10, significance);
  let result = 0;
  let match = false;
  let i = 0;

  while (!match && i < m) {
    if (x === uniques[i]) {
      result = (array.indexOf(uniques[i]) + 1) / (n + 1);
      match = true;
    } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
      result = (array.indexOf(uniques[i]) + 1 + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n + 1);
      match = true;
    }

    i++;
  }

  return Math.floor(result * power) / power
};

/**
 * Returns the percentage rank of a value in a data set.
 *
 * Category: Statistical
 *
 * @param {*} array The array or range of data with numeric values that defines relative standing.
 * @param {*} x The value for which you want to know the rank.
 * @param {*} significance Optional. A value that identifies the number of significant digits for the returned percentage value. If omitted, PERCENTRANK.INC uses three digits (0.xxx).
 * @returns
 */
PERCENTRANK.INC = (array, x, significance) => {
  significance = significance === undefined ? 3 : significance;
  array = parseNumberArray(flatten(array));
  x = parseNumber(x);
  significance = parseNumber(significance);

  if (anyIsError(array, x, significance)) {
    return value
  }

  array = array.sort((a, b) => a - b);
  const uniques = UNIQUE.apply(null, array);
  const n = array.length;
  const m = uniques.length;
  const power = Math.pow(10, significance);
  let result = 0;
  let match = false;
  let i = 0;

  while (!match && i < m) {
    if (x === uniques[i]) {
      result = array.indexOf(uniques[i]) / (n - 1);
      match = true;
    } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
      result = (array.indexOf(uniques[i]) + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n - 1);
      match = true;
    }

    i++;
  }

  return Math.floor(result * power) / power
};

/**
 * Returns the number of permutations for a given number of objects.
 *
 * Category: Statistical
 *
 * @param {*} number An integer that describes the number of objects.
 * @param {*} number_chosen An integer that describes the number of objects in each permutation.
 * @returns
 */
function PERMUT(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);

  if (anyIsError(number, number_chosen)) {
    return value
  }

  return FACT(number) / FACT(number - number_chosen)
}

/**
 * Returns the number of permutations for a given number of objects (with repetitions) that can be selected from the total objects.
 *
 * Category: Statistical
 *
 * @param {*} number An integer that describes the total number of objects.
 * @param {*} number_chosen An integer that describes the number of objects in each permutation.
 * @returns
 */
function PERMUTATIONA(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);

  if (anyIsError(number, number_chosen)) {
    return value
  }

  return Math.pow(number, number_chosen)
}

/**
 * Returns the value of the density function for a standard normal distribution.
 *
 * Category: Statistical
 *
 * @param {*} x X is the number for which you want the density of the standard normal distribution.
 * @returns
 */
function PHI(x) {
  x = parseNumber(x);

  if (x instanceof Error) {
    return value
  }

  return Math.exp(-0.5 * x * x) / SQRT2PI
}

const POISSON = {};

/**
 * Returns the Poisson distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The number of events.
 * @param {*} mean The expected numeric value.
 * @param {*} cumulative A logical value that determines the form of the probability distribution returned. If cumulative is TRUE, POISSON.DIST returns the cumulative Poisson probability that the number of random events occurring will be between zero and x inclusive; if FALSE, it returns the Poisson probability mass function that the number of events occurring will be exactly x.
 * @returns
 */
POISSON.DIST = (x, mean, cumulative) => {
  x = parseNumber(x);
  mean = parseNumber(mean);

  if (anyIsError(x, mean)) {
    return value
  }

  return cumulative ? jStat__default["default"].poisson.cdf(x, mean) : jStat__default["default"].poisson.pdf(x, mean)
};

/**
 * Returns the probability that values in a range are between two limits.
 *
 * Category: Statistical
 *
 * @param {*} x_range The range of numeric values of x with which there are associated probabilities.
 * @param {*} prob_range A set of probabilities associated with values in x_range.
 * @param {*} lower_limit Optional. The lower bound on the value for which you want a probability.
 * @param {*} upper_limit Optional. The optional upper bound on the value for which you want a probability.
 * @returns
 */
function PROB(x_range, prob_range, lower_limit, upper_limit) {
  if (lower_limit === undefined) {
    return 0
  }

  upper_limit = upper_limit === undefined ? lower_limit : upper_limit;

  x_range = parseNumberArray(flatten(x_range));
  prob_range = parseNumberArray(flatten(prob_range));
  lower_limit = parseNumber(lower_limit);
  upper_limit = parseNumber(upper_limit);

  if (anyIsError(x_range, prob_range, lower_limit, upper_limit)) {
    return value
  }

  if (lower_limit === upper_limit) {
    return x_range.indexOf(lower_limit) >= 0 ? prob_range[x_range.indexOf(lower_limit)] : 0
  }

  const sorted = x_range.sort((a, b) => a - b);
  const n = sorted.length;
  let result = 0;

  for (let i = 0; i < n; i++) {
    if (sorted[i] >= lower_limit && sorted[i] <= upper_limit) {
      result += prob_range[x_range.indexOf(sorted[i])];
    }
  }

  return result
}

const QUARTILE = {};

/**
 * Returns the quartile of the data set, based on percentile values from 0..1, exclusive.
 *
 * Category: Statistical
 *
 * @param {*} array The array or value range of numeric values for which you want the quartile value.
 * @param {*} quart Indicates which value to return.
 * @returns
 */
QUARTILE.EXC = (range, quart) => {
  range = parseNumberArray(flatten(range));
  quart = parseNumber(quart);

  if (anyIsError(range, quart)) {
    return value
  }

  switch (quart) {
    case 1:
      return PERCENTILE.EXC(range, 0.25)
    case 2:
      return PERCENTILE.EXC(range, 0.5)
    case 3:
      return PERCENTILE.EXC(range, 0.75)
    default:
      return num
  }
};

/**
 * Returns the quartile of a data set.
 *
 * Category: Statistical
 *
 * @param {*} array The array or value range of numeric values for which you want the quartile value.
 * @param {*} quart Indicates which value to return.
 * @returns
 */
QUARTILE.INC = (range, quart) => {
  range = parseNumberArray(flatten(range));
  quart = parseNumber(quart);

  if (anyIsError(range, quart)) {
    return value
  }

  switch (quart) {
    case 1:
      return PERCENTILE.INC(range, 0.25)
    case 2:
      return PERCENTILE.INC(range, 0.5)
    case 3:
      return PERCENTILE.INC(range, 0.75)
    default:
      return num
  }
};

const RANK = {};

/**
 * Returns the rank of a number in a list of numbers.
 *
 * Category: Statistical
 *
 * @param {*} number The number whose rank you want to find.
 * @param {*} ref An array of, or a reference to, a list of numbers. Nonnumeric values in Ref are ignored.
 * @param {*} order Optional. A number specifying how to rank number.
 * @returns
 */
RANK.AVG = (number, ref, order) => {
  number = parseNumber(number);
  ref = parseNumberArray(flatten(ref));

  if (anyIsError(number, ref)) {
    return value
  }

  ref = flatten(ref);
  order = order || false;
  const sort = order ? (a, b) => a - b : (a, b) => b - a;
  ref = ref.sort(sort);

  const length = ref.length;
  let count = 0;

  for (let i = 0; i < length; i++) {
    if (ref[i] === number) {
      count++;
    }
  }

  return count > 1 ? (2 * ref.indexOf(number) + count + 1) / 2 : ref.indexOf(number) + 1
};

/**
 * Returns the rank of a number in a list of numbers.
 *
 * Category: Statistical
 *
 * @param {*} number The number whose rank you want to find.
 * @param {*} ref An array of, or a reference to, a list of numbers. Non-numeric values in Ref are ignored.
 * @param {*} order Optional. A number specifying how to rank number.
 * @returns
 */
RANK.EQ = (number, ref, order) => {
  number = parseNumber(number);
  ref = parseNumberArray(flatten(ref));

  if (anyIsError(number, ref)) {
    return value
  }

  order = order || false;
  const sort = order ? (a, b) => a - b : (a, b) => b - a;
  ref = ref.sort(sort);

  return ref.indexOf(number) + 1
};

/**
 * Returns the row number of a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} reference the value or range of values for which you want the row number.
 * @param {*} index
 * @returns
 */
function ROW(reference, index) {
  if (arguments.length !== 2) {
    return na
  }

  if (index < 0) {
    return num
  }

  if (!(reference instanceof Array) || typeof index !== 'number') {
    return value
  }

  if (reference.length === 0) {
    return undefined
  }

  return jStat__default["default"].row(reference, index)
}

/**
 * Returns the square of the Pearson product moment correlation coefficient.
 *
 * Category: Statistical
 *
 * @param {*} known_y An array or range of data points.
 * @param {*} known_x An array or range of data points.
 * @returns
 */
function RSQ(known_y, known_x) {
  // no need to flatten here, PEARSON will take care of that
  known_y = parseNumberArray(flatten(known_y));
  known_x = parseNumberArray(flatten(known_x));

  if (anyIsError(known_y, known_x)) {
    return value
  }

  return Math.pow(PEARSON(known_y, known_x), 2)
}

/**
 * Returns the skewness of a distribution.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want to calculate skewness. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function SKEW() {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const mean = jStat__default["default"].mean(range);
  const n = range.length;
  let sigma = 0;

  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 3);
  }

  return (n * sigma) / ((n - 1) * (n - 2) * Math.pow(jStat__default["default"].stdev(range, true), 3))
}

/**
 * Returns the skewness of a distribution based on a population.
 *
 * Category: Statistical
 *
 * @returns
 */
SKEW.P = function () {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const mean = jStat__default["default"].mean(range);
  const n = range.length;
  let m2 = 0;
  let m3 = 0;

  for (let i = 0; i < n; i++) {
    m3 += Math.pow(range[i] - mean, 3);
    m2 += Math.pow(range[i] - mean, 2);
  }

  m3 = m3 / n;
  m2 = m2 / n;

  return m3 / Math.pow(m2, 3 / 2)
};

/**
 * Returns the slope of the linear regression line.
 *
 * Category: Statistical
 *
 * @param {*} known_y An array or value range of numeric dependent data points.
 * @param {*} known_x The set of independent data points.
 * @returns
 */
function SLOPE(known_y, known_x) {
  known_y = parseNumberArray(flatten(known_y));
  known_x = parseNumberArray(flatten(known_x));

  if (anyIsError(known_y, known_x)) {
    return value
  }

  const xmean = jStat__default["default"].mean(known_x);
  const ymean = jStat__default["default"].mean(known_y);
  const n = known_x.length;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (known_x[i] - xmean) * (known_y[i] - ymean);
    den += Math.pow(known_x[i] - xmean, 2);
  }

  return num / den
}

/**
 * Returns the k-th smallest value in a data set.
 *
 * Category: Statistical
 *
 * @param {*} array An array or range of numerical data for which you want to determine the k-th smallest value.
 * @param {*} k The position (from the smallest) in the array or range of data to return.
 * @returns
 */
function SMALL(array, k) {
  array = parseNumberArray(flatten(array));
  k = parseNumber(k);

  if (anyIsError(array, k)) {
    return array
  }

  return array.sort((a, b) => a - b)[k - 1]
}

/**
 * Returns a normalized value.
 *
 * Category: Statistical
 *
 * @param {*} x The value you want to normalize.
 * @param {*} mean The arithmetic mean of the distribution.
 * @param {*} standard_dev The standard deviation of the distribution.
 * @returns
 */
function STANDARDIZE(x, mean, standard_dev) {
  x = parseNumber(x);
  mean = parseNumber(mean);
  standard_dev = parseNumber(standard_dev);

  if (anyIsError(x, mean, standard_dev)) {
    return value
  }

  return (x - mean) / standard_dev
}

const STDEV = {};

/**
 * Calculates standard deviation based on the entire population.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number arguments 2 to 254 corresponding to a population. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
STDEV.P = function () {
  const v = VAR.P.apply(this, arguments);
  let result = Math.sqrt(v);

  if (isNaN(result)) {
    result = num;
  }

  return result
};

/**
 * Estimates standard deviation based on a sample.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number arguments 2 to 254 corresponding to a sample of a population. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
STDEV.S = function () {
  const v = VAR.S.apply(this, arguments);
  const result = Math.sqrt(v);

  return result
};

/**
 * Estimates standard deviation based on a sample, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 255 values corresponding to a sample of a population. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function STDEVA() {
  const v = VARA.apply(this, arguments);
  const result = Math.sqrt(v);

  return result
}

/**
 * Calculates standard deviation based on the entire population, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 255 values corresponding to a population. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function STDEVPA() {
  const v = VARPA.apply(this, arguments);
  let result = Math.sqrt(v);

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the standard error of the predicted y-value for each x in the regression.
 *
 * Category: Statistical
 *
 * @param {*} known_y An array or range of dependent data points.
 * @param {*} known_x An array or range of independent data points.
 * @returns
 */
function STEYX(known_y, known_x) {
  known_y = parseNumberArray(flatten(known_y));
  known_x = parseNumberArray(flatten(known_x));

  if (anyIsError(known_y, known_x)) {
    return value
  }

  const xmean = jStat__default["default"].mean(known_x);
  const ymean = jStat__default["default"].mean(known_y);
  const n = known_x.length;
  let lft = 0;
  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    lft += Math.pow(known_y[i] - ymean, 2);
    num += (known_x[i] - xmean) * (known_y[i] - ymean);
    den += Math.pow(known_x[i] - xmean, 2);
  }

  return Math.sqrt((lft - (num * num) / den) / (n - 2))
}

const T$1 = {};

/**
 * Returns the Percentage Points (probability) for the Student t-distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The numeric value at which to evaluate the distribution
 * @param {*} deg_freedom An integer indicating the number of degrees of freedom.
 * @param {*} cumulative A logical value that determines the form of the function. If cumulative is TRUE, T.DIST returns the cumulative distribution function; if FALSE, it returns the probability density function.
 * @returns
 */
T$1.DIST = (x, deg_freedom, cumulative) => {
  if (cumulative !== 1 && cumulative !== 2) {
    return num
  }

  return cumulative === 1 ? T$1.DIST.RT(x, deg_freedom) : T$1.DIST['2T'](x, deg_freedom)
};

/**
 * Returns the Percentage Points (probability) for the Student t-distribution
 *
 * Category: Statistical
 *
 * @param {*} x The numeric value at which to evaluate the distribution.
 * @param {*} deg_freedom An integer indicating the number of degrees of freedom.
 * @returns
 */
T$1.DIST['2T'] = function (x, deg_freedom) {
  if (arguments.length !== 2) {
    return na
  }

  if (x < 0 || deg_freedom < 1) {
    return num
  }

  if (typeof x !== 'number' || typeof deg_freedom !== 'number') {
    return value
  }

  return (1 - jStat__default["default"].studentt.cdf(x, deg_freedom)) * 2
};

/**
 * Returns the Student's t-distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The numeric value at which to evaluate the distribution.
 * @param {*} deg_freedom An integer indicating the number of degrees of freedom.
 * @returns
 */
T$1.DIST.RT = function (x, deg_freedom) {
  if (arguments.length !== 2) {
    return na
  }

  if (x < 0 || deg_freedom < 1) {
    return num
  }

  if (typeof x !== 'number' || typeof deg_freedom !== 'number') {
    return value
  }

  return 1 - jStat__default["default"].studentt.cdf(x, deg_freedom)
};

/**
 * Returns the t-value of the Student's t-distribution as a function of the probability and the degrees of freedom.
 *
 * Category: Statistical
 *
 * @param {*} probability The probability associated with the Student's t-distribution.
 * @param {*} deg_freedom The number of degrees of freedom with which to characterize the distribution.
 * @returns
 */
T$1.INV = (probability, deg_freedom) => {
  probability = parseNumber(probability);
  deg_freedom = parseNumber(deg_freedom);

  if (anyIsError(probability, deg_freedom)) {
    return value
  }

  return jStat__default["default"].studentt.inv(probability, deg_freedom)
};

/**
 * Returns the inverse of the Student's t-distribution
 *
 * Category: Statistical
 *
 * @param {*} probability The probability associated with the Student's t-distribution.
 * @param {*} deg_freedom The number of degrees of freedom with which to characterize the distribution.
 * @returns
 */
T$1.INV['2T'] = (probability, deg_freedom) => {
  probability = parseNumber(probability);
  deg_freedom = parseNumber(deg_freedom);

  if (probability <= 0 || probability > 1 || deg_freedom < 1) {
    return num
  }

  if (anyIsError(probability, deg_freedom)) {
    return value
  }

  return Math.abs(jStat__default["default"].studentt.inv(probability / 2, deg_freedom))
};

// The algorithm can be found here:
// http://www.chem.uoa.gr/applets/AppletTtest/Appl_Ttest2.html
/**
 * Returns the probability associated with a Student's t-test.
 *
 * Category: Statistical
 *
 * @param {*} array1 The first data set.
 * @param {*} array2 The second data set.
 * @returns
 */
T$1.TEST = (array1, array2) => {
  array1 = parseNumberArray(flatten(array1));
  array2 = parseNumberArray(flatten(array2));

  if (anyIsError(array1, array2)) {
    return value
  }

  const mean_x = jStat__default["default"].mean(array1);
  const mean_y = jStat__default["default"].mean(array2);
  let s_x = 0;
  let s_y = 0;
  let i;

  for (i = 0; i < array1.length; i++) {
    s_x += Math.pow(array1[i] - mean_x, 2);
  }

  for (i = 0; i < array2.length; i++) {
    s_y += Math.pow(array2[i] - mean_y, 2);
  }

  s_x = s_x / (array1.length - 1);
  s_y = s_y / (array2.length - 1);

  const t = Math.abs(mean_x - mean_y) / Math.sqrt(s_x / array1.length + s_y / array2.length);

  return T$1.DIST['2T'](t, array1.length + array2.length - 2)
};

/**
 * Returns values along a linear trend.
 *
 * Category: Statistical
 *
 * @param {*} known_ys The set of y-values you already know in the relationship y = mx + b
 * @param {*} known_xs An optional set of x-values that you may already know in the relationship y = mx + b
 * @param {*} new_xs Optional. New x-values for which you want TREND to return corresponding y-values.
 * @returns
 */
function TREND(known_ys, known_xs, new_xs) {
  known_ys = parseNumberArray(flatten(known_ys));
  known_xs = parseNumberArray(flatten(known_xs));
  new_xs = parseNumberArray(flatten(new_xs));

  if (anyIsError(known_ys, known_xs, new_xs)) {
    return value
  }

  const linest = LINEST(known_ys, known_xs);
  const m = linest[0];
  const b = linest[1];
  const result = [];

  new_xs.forEach((x) => {
    result.push(m * x + b);
  });

  return result
}

/**
 * Returns the mean of the interior of a data set.
 *
 * Category: Statistical
 *
 * @param {*} array The array or range of values to trim and average.
 * @param {*} percent The fractional number of data points to exclude from the calculation. For example, if percent = 0.2, 4 points are trimmed from a data set of 20 points (20 x 0.2): 2 from the top and 2 from the bottom of the set.
 * @returns
 */
function TRIMMEAN(range, percent) {
  range = parseNumberArray(flatten(range));
  percent = parseNumber(percent);

  if (anyIsError(range, percent)) {
    return value
  }

  const trim = FLOOR(range.length * percent, 2) / 2;

  return jStat__default["default"].mean(
    initial(
      rest(
        range.sort((a, b) => a - b),
        trim
      ),
      trim
    )
  )
}

const VAR = {};

/**
 * Calculates variance based on the entire population.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number arguments 2 to 254 corresponding to a population.
 * @returns
 */
VAR.P = function () {
  const range = numbers(flatten(arguments));
  const n = range.length;
  let sigma = 0;
  const mean = AVERAGE(range);
  let result;

  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 2);
  }

  result = sigma / n;

  if (isNaN(result)) {
    result = num;
  }

  return result
};

/**
 * Estimates variance based on a sample.
 *
 * Category: Statistical
 *
 * @param {*} args number1, number2, ... Number arguments 2 to 254 corresponding to a sample of a population.
 * @returns
 */
VAR.S = function () {
  const range = numbers(flatten(arguments));
  const n = range.length;
  let sigma = 0;
  const mean = AVERAGE(range);

  for (let i = 0; i < n; i++) {
    sigma += Math.pow(range[i] - mean, 2);
  }

  return sigma / (n - 1)
};

/**
 * Estimates variance based on a sample, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 255 value arguments corresponding to a sample of a population.
 * @returns
 */
function VARA() {
  const range = flatten(arguments);
  const n = range.length;
  let sigma = 0;
  let count = 0;
  const mean = AVERAGEA(range);

  for (let i = 0; i < n; i++) {
    const el = range[i];

    if (typeof el === 'number') {
      sigma += Math.pow(el - mean, 2);
    } else if (el === true) {
      sigma += Math.pow(1 - mean, 2);
    } else {
      sigma += Math.pow(0 - mean, 2);
    }

    if (el !== null) {
      count++;
    }
  }

  return sigma / (count - 1)
}

/**
 * Calculates variance based on the entire population, including numbers, text, and logical values.
 *
 * Category: Statistical
 *
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 255 value arguments corresponding to a population.
 * @returns
 */
function VARPA() {
  const range = flatten(arguments);
  const n = range.length;
  let sigma = 0;
  let count = 0;
  const mean = AVERAGEA(range);
  let result;

  for (let i = 0; i < n; i++) {
    const el = range[i];

    if (typeof el === 'number') {
      sigma += Math.pow(el - mean, 2);
    } else if (el === true) {
      sigma += Math.pow(1 - mean, 2);
    } else {
      sigma += Math.pow(0 - mean, 2);
    }

    if (el !== null) {
      count++;
    }
  }

  result = sigma / count;

  if (isNaN(result)) {
    result = num;
  }

  return result
}

const WEIBULL = {};

/**
 * Returns the Weibull distribution.
 *
 * Category: Statistical
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} alpha A parameter to the distribution.
 * @param {*} beta A parameter to the distribution.
 * @param {*} cumulative Determines the form of the function.
 * @returns
 */
WEIBULL.DIST = (x, alpha, beta, cumulative) => {
  x = parseNumber(x);
  alpha = parseNumber(alpha);
  beta = parseNumber(beta);

  if (anyIsError(x, alpha, beta)) {
    return value
  }

  return cumulative
    ? 1 - Math.exp(-Math.pow(x / beta, alpha))
    : (Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha) / Math.pow(beta, alpha)
};

const Z = {};

/**
 * Returns the one-tailed probability-value of a z-test.
 *
 * Category: Statistical
 *
 * @param {*} array The array or range of data against which to test x.
 * @param {*} x The value to test.
 * @param {*} sigma Optional. The population (known) standard deviation. If omitted, the sample standard deviation is used.
 * @returns
 */
Z.TEST = (array, x, sigma) => {
  array = parseNumberArray(flatten(array));
  x = parseNumber(x);

  if (anyIsError(array, x)) {
    return value
  }

  sigma = sigma || STDEV.S(array);
  const n = array.length;

  return 1 - NORM.S.DIST((AVERAGE(array) - x) / (sigma / Math.sqrt(n)), true)
};

/**
 * Returns the absolute value of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The real number of which you want the absolute value.
 * @returns
 */
function ABS(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  const result = Math.abs(number);

  return result
}

/**
 * Returns the arccosine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The cosine of the angle you want and must be from -1 to 1.
 * @returns
 */
function ACOS(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  let result = Math.acos(number);

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the inverse hyperbolic cosine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number equal to or greater than 1.
 * @returns
 */
function ACOSH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  let result = Math.log(number + Math.sqrt(number * number - 1));

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the arccotangent of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Number is the cotangent of the angle you want. This must be a real number.
 * @returns
 */
function ACOT(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  const result = Math.atan(1 / number);

  return result
}

/**
 * Returns the hyperbolic arccotangent of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The absolute value of Number must be greater than 1.
 * @returns
 */
function ACOTH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  let result = 0.5 * Math.log((number + 1) / (number - 1));

  if (isNaN(result)) {
    result = num;
  }

  return result
}

// TODO: use options
/**
 * Returns an aggregate in a list or database.
 *
 * Category: Math and trigonometry
 *
 * @param {*} function_num A number 1 to 19 that specifies which function to use.
 * @param {*} options A numerical value that determines which values to ignore in the evaluation range for the function. Note: The function will not ignore hidden rows, nested subtotals or nested aggregates if the array argument includes a calculation, for example: =AGGREGATE(14,3,A1:A100*(A1:A100>0),1)
 * @param {*} ref1 The first numeric argument for functions that take multiple numeric arguments for which you want the aggregate value.
 * @param {*} ref2 Optional. Numeric arguments 2 to 253 for which you want the aggregate value. For functions that take an array, ref1 is an array, an array formula, or a reference to a range of values for which you want the aggregate value. Ref2 is a second argument that is required for certain functions.
 * @returns
 */
function AGGREGATE(function_num, options, ref1, ref2) {
  function_num = parseNumber(function_num);
  options = parseNumber(function_num);

  if (anyIsError(function_num, options)) {
    return value
  }

  switch (function_num) {
    case 1:
      return AVERAGE(ref1)
    case 2:
      return COUNT(ref1)
    case 3:
      return COUNTA(ref1)
    case 4:
      return MAX(ref1)
    case 5:
      return MIN(ref1)
    case 6:
      return PRODUCT(ref1)
    case 7:
      return STDEV.S(ref1)
    case 8:
      return STDEV.P(ref1)
    case 9:
      return SUM(ref1)
    case 10:
      return VAR.S(ref1)
    case 11:
      return VAR.P(ref1)
    case 12:
      return MEDIAN(ref1)
    case 13:
      return MODE.SNGL(ref1)
    case 14:
      return LARGE(ref1, ref2)
    case 15:
      return SMALL(ref1, ref2)
    case 16:
      return PERCENTILE.INC(ref1, ref2)
    case 17:
      return QUARTILE.INC(ref1, ref2)
    case 18:
      return PERCENTILE.EXC(ref1, ref2)
    case 19:
      return QUARTILE.EXC(ref1, ref2)
  }
}

/**
 * Converts a Roman number to Arabic, as a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} text A string enclosed in quotation marks, an empty string (""), or a reference to a value containing text.
 * @returns
 */
function ARABIC(text) {
  if (text === undefined || text === null) {
    return 0
  }

  if (text instanceof Error) {
    return text
  }

  // Credits: Rafa? Kukawski
  if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
    return value
  }

  let r = 0;
  text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, (i) => {
    r += {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    }[i];
  });

  return r
}

/**
 * Returns the arcsine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The sine of the angle you want and must be from -1 to 1.
 * @returns
 */
function ASIN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  let result = Math.asin(number);

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Returns the inverse hyperbolic sine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number.
 * @returns
 */
function ASINH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.log(number + Math.sqrt(number * number + 1))
}

/**
 * Returns the arctangent of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The tangent of the angle you want.
 * @returns
 */
function ATAN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.atan(number)
}

/**
 * Returns the arctangent from x- and y-coordinates.
 *
 * Category: Math and trigonometry
 *
 * @param {*} x_num The x-coordinate of the point.
 * @param {*} y_num The y-coordinate of the point.
 * @returns
 */
function ATAN2(x_num, y_num) {
  x_num = parseNumber(x_num);
  y_num = parseNumber(y_num);
  const anyError$1 = anyError(x_num, y_num);

  if (anyError$1) {
    return anyError$1
  }

  return Math.atan2(x_num, y_num)
}

/**
 * Returns the inverse hyperbolic tangent of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number between 1 and -1.
 * @returns
 */
function ATANH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  let result = Math.log((1 + number) / (1 - number)) / 2;

  if (isNaN(result)) {
    result = num;
  }

  return result
}

/**
 * Converts a number into a text representation with the given radix (base).
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number that you want to convert. Must be an integer greater than or equal to 0 and less than 2^53.
 * @param {*} radix The base radix that you want to convert the number into. Must be an integer greater than or equal to 2 and less than or equal to 36.
 * @param {*} min_length Optional. The minimum length of the returned string. Must be an integer greater than or equal to 0.
 * @returns
 */
function BASE$1(number, radix, min_length) {
  number = parseNumber(number);
  radix = parseNumber(radix);
  min_length = parseNumber(min_length);
  const anyError$1 = anyError(number, radix, min_length);

  if (anyError$1) {
    return anyError$1
  }

  if (radix === 0) {
    return num
  }

  const result = number.toString(radix);

  return new Array(Math.max(min_length + 1 - result.length, 0)).join('0') + result
}

/**
 * Rounds a number to the nearest integer or to the nearest multiple of significance.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The value you want to round.
 * @param {*} significance The multiple to which you want to round.
 * @param {*} mode Optional. For negative numbers, controls whether Number is rounded toward or away from zero.
 * @returns
 */
function CEILING(number, significance, mode) {
  number = parseNumber(number);
  significance = parseNumber(significance);
  mode = parseNumber(mode);
  const anyError$1 = anyError(number, significance, mode);

  if (anyError$1) {
    return anyError$1
  }

  if (significance === 0) {
    return 0
  }

  significance = Math.abs(significance);
  const precision = -Math.floor(Math.log(significance) / Math.log(10));

  if (number >= 0) {
    return ROUND(Math.ceil(number / significance) * significance, precision)
  } else {
    if (mode === 0) {
      return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision)
    } else {
      return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision)
    }
  }
}

CEILING.MATH = CEILING;

CEILING.PRECISE = CEILING;

/**
 * Returns the number of combinations for a given number of objects.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number of items.
 * @param {*} number_chosen The number of items in each combination.
 * @returns
 */
function COMBIN(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);
  const anyError$1 = anyError(number, number_chosen);

  if (anyError$1) {
    return anyError$1
  }

  if (number < number_chosen) {
    return num
  }

  return FACT(number) / (FACT(number_chosen) * FACT(number - number_chosen))
}

/**
 * Returns the number of combinations with repetitions for a given number of items.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Must be greater than or equal to 0, and greater than or equal to Number_chosen. Non-integer values are truncated.
 * @param {*} number_chosen Must be greater than or equal to 0. Non-integer values are truncated.
 * @returns
 */
function COMBINA(number, number_chosen) {
  number = parseNumber(number);
  number_chosen = parseNumber(number_chosen);
  const anyError$1 = anyError(number, number_chosen);

  if (anyError$1) {
    return anyError$1
  }

  if (number < number_chosen) {
    return num
  }

  return number === 0 && number_chosen === 0 ? 1 : COMBIN(number + number_chosen - 1, number - 1)
}

/**
 * Returns the cosine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The angle in radians for which you want the cosine.
 * @returns
 */
function COS(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.cos(number)
}

/**
 * Returns the hyperbolic cosine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number for which you want to find the hyperbolic cosine.
 * @returns
 */
function COSH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return (Math.exp(number) + Math.exp(-number)) / 2
}

/**
 * Returns the hyperbolic cosine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The angle in radians for which you want the cotangent.
 * @returns
 */
function COT(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return div0
  }

  return 1 / Math.tan(number)
}

/**
 * Returns the cotangent of an angle.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number
 * @returns
 */
function COTH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return div0
  }

  const e2 = Math.exp(2 * number);

  return (e2 + 1) / (e2 - 1)
}

/**
 * Returns the cosecant of an angle.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number
 * @returns
 */
function CSC(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return div0
  }

  return 1 / Math.sin(number)
}

/**
 * Returns the hyperbolic cosecant of an angle.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number
 * @returns
 */
function CSCH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return div0
  }

  return 2 / (Math.exp(number) - Math.exp(-number))
}

/**
 * Converts a text representation of a number in a given base into a decimal number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} text
 * @param {*} radix Radix must be an integer.
 * @returns
 */
function DECIMAL(text, radix) {
  if (arguments.length < 1) {
    return value
  }

  text = parseNumber(text);
  radix = parseNumber(radix);
  const anyError$1 = anyError(text, radix);

  if (anyError$1) {
    return anyError$1
  }

  if (radix === 0) {
    return num
  }

  return parseInt(text, radix)
}

/**
 * Converts radians to degrees.
 *
 * Category: Math and trigonometry
 *
 * @param {*} angle The angle in radians that you want to convert.
 * @returns
 */
function DEGREES(angle) {
  angle = parseNumber(angle);

  if (angle instanceof Error) {
    return angle
  }

  return (angle * 180) / Math.PI
}

/**
 * Rounds a number up to the nearest even integer.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The value to round.
 * @returns
 */
function EVEN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return CEILING(number, -2, -1)
}

/**
 * Returns e raised to the power of a given number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The exponent applied to the base e.
 * @returns
 */
function EXP(number) {
  if (arguments.length < 1) {
    return na
  }

  if (arguments.length > 1) {
    return error
  }

  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  number = Math.exp(number);

  return number
}

const MEMOIZED_FACT = [];
/**
 * Returns the factorial of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The nonnegative number for which you want the factorial. If number is not an integer, it is truncated.
 * @returns
 */
function FACT(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  const n = Math.floor(number);

  if (n === 0 || n === 1) {
    return 1
  } else if (MEMOIZED_FACT[n] > 0) {
    return MEMOIZED_FACT[n]
  } else {
    MEMOIZED_FACT[n] = FACT(n - 1) * n;

    return MEMOIZED_FACT[n]
  }
}

/**
 * Returns the double factorial of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The value for which to return the double factorial. If number is not an integer, it is truncated.
 * @returns
 */
function FACTDOUBLE(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  const n = Math.floor(number);

  return n <= 0 ? 1 : n * FACTDOUBLE(n - 2)
}

/**
 * Rounds a number down, toward zero.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The numeric value you want to round.
 * @param {*} significance The multiple to which you want to round.
 * @returns
 */
function FLOOR(number, significance) {
  number = parseNumber(number);
  significance = parseNumber(significance);
  const anyError$1 = anyError(number, significance);

  if (anyError$1) {
    return anyError$1
  }

  if (significance === 0) {
    return 0
  }

  if (!(number >= 0 && significance > 0) && !(number <= 0 && significance < 0)) {
    return num
  }

  significance = Math.abs(significance);
  const precision = -Math.floor(Math.log(significance) / Math.log(10));

  return number >= 0
    ? ROUND(Math.floor(number / significance) * significance, precision)
    : -ROUND(Math.ceil(Math.abs(number) / significance), precision)
}

// TODO: Verify

/**
 * Rounds a number down, to the nearest integer or to the nearest multiple of significance.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number to be rounded down.
 * @param {*} significance Optional. The multiple to which you want to round.
 * @param {*} mode Optional. The direction (toward or away from 0) to round negative numbers.
 * @returns
 */
FLOOR.MATH = (number, significance, mode) => {
  if (significance instanceof Error) {
    return significance
  }

  significance = significance === undefined ? 0 : significance;

  number = parseNumber(number);
  significance = parseNumber(significance);
  mode = parseNumber(mode);
  const anyError$1 = anyError(number, significance, mode);

  if (anyError$1) {
    return anyError$1
  }

  if (significance === 0) {
    return 0
  }

  significance = significance ? Math.abs(significance) : 1;
  const precision = -Math.floor(Math.log(significance) / Math.log(10));

  if (number >= 0) {
    return ROUND(Math.floor(number / significance) * significance, precision)
  } else if (mode === 0 || mode === undefined) {
    return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision)
  }

  return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision)
};

// Deprecated

/**
 * Rounds a number the nearest integer or to the nearest multiple of significance. Regardless of the sign of the number, the number is rounded up.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The value to be rounded.
 * @param {*} significance Optional. The multiple to which number is to be rounded. If significance is omitted, its default value is 1.
 * @returns
 */
FLOOR.PRECISE = FLOOR['MATH'];

// adapted http://rosettacode.org/wiki/Greatest_common_divisor#JavaScript
/**
 * Returns the greatest common divisor.
 *
 * Category: Math and trigonometry
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 values. If any value is not an integer, it is truncated.
 * @returns
 */
function GCD() {
  const range = parseNumberArray(flatten(arguments));

  if (range instanceof Error) {
    return range
  }

  const n = range.length;
  const r0 = range[0];
  let x = r0 < 0 ? -r0 : r0;

  for (let i = 1; i < n; i++) {
    const ri = range[i];
    let y = ri < 0 ? -ri : ri;

    while (x && y) {
      if (x > y) {
        x %= y;
      } else {
        y %= x;
      }
    }

    x += y;
  }

  return x
}

/**
 * Rounds a number down to the nearest integer.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The real number you want to round down to an integer.
 * @returns
 */
function INT(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.floor(number)
}

// TODO: verify
const ISO = {
  CEILING: CEILING
};

/**
 * Returns the least common multiple.
 *
 * Category: Math and trigonometry
 *
 * @param {*} args number1, number2,... Number1 is required, subsequent numbers are optional. 1 to 255 values for which you want the least common multiple. If value is not an integer, it is truncated.
 * @returns
 */
function LCM() {
  // Credits: Jonas Raoni Soares Silva
  const o = parseNumberArray(flatten(arguments));

  if (o instanceof Error) {
    return o
  }

  for (var i, j, n, d, r = 1; (n = o.pop()) !== undefined; ) {
    if (n === 0) {
      return 0
    }

    while (n > 1) {
      if (n % 2) {
        for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2) {
          // empty
        }

        d = i <= j ? i : n;
      } else {
        d = 2;
      }

      for (n /= d, r *= d, i = o.length; i; o[--i] % d === 0 && (o[i] /= d) === 1 && o.splice(i, 1)) {
        // empty
      }
    }
  }

  return r
}

/**
 * Returns the natural logarithm of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The positive real number for which you want the natural logarithm.
 * @returns
 */
function LN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return num
  }

  return Math.log(number)
}

/**
 * Formula.js only
 *
 * @returns
 */
function LN10$1() {
  return Math.log(10)
}

/**
 * Formula.js only
 *
 * @returns
 */
function LN2() {
  return Math.log(2)
}

/**
 * Formula.js only
 *
 * @returns
 */
function LOG10E() {
  return Math.LOG10E
}

/**
 * Formula.js only
 *
 * @returns
 */
function LOG2E() {
  return Math.LOG2E
}

/**
 * Returns the logarithm of a number to a specified base.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The positive real number for which you want the logarithm.
 * @param {*} base Optional. The base of the logarithm. If base is omitted, it is assumed to be 10.
 * @returns
 */
function LOG(number, base) {
  number = parseNumber(number);
  base = parseNumber(base);
  const anyError$1 = anyError(number, base);

  if (anyError$1) {
    return anyError$1
  }

  if (number === 0 || base === 0) {
    return num
  }

  return Math.log(number) / Math.log(base)
}

/**
 * Returns the base-10 logarithm of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The positive real number for which you want the base-10 logarithm.
 * @returns
 */
function LOG10(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number === 0) {
    return num
  }

  return Math.log(number) / Math.log(10)
}

/**
 * Returns the remainder from division.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number for which you want to find the remainder.
 * @param {*} divisor The number by which you want to divide number.
 * @returns
 */
function MOD(number, divisor) {
  number = parseNumber(number);
  divisor = parseNumber(divisor);
  const anyError$1 = anyError(number, divisor);

  if (anyError$1) {
    return anyError$1
  }

  if (divisor === 0) {
    return div0
  }

  let modulus = Math.abs(number % divisor);
  modulus = number < 0 ? divisor - modulus : modulus;

  return divisor > 0 ? modulus : -modulus
}

/**
 * Returns a number rounded to the desired multiple.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The value to round.
 * @param {*} multiple The multiple to which you want to round number.
 * @returns
 */
function MROUND(number, multiple) {
  number = parseNumber(number);
  multiple = parseNumber(multiple);
  const anyError$1 = anyError(number, multiple);

  if (anyError$1) {
    return anyError$1
  }

  if (number * multiple === 0) {
    return 0
  }

  if (number * multiple < 0) {
    return num
  }

  return Math.round(number / multiple) * multiple
}

/**
 * Returns the multinomial of a set of numbers.
 *
 * Category: Math and trigonometry
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 values for which you want the multinomial.
 * @returns
 */
function MULTINOMIAL() {
  const args = parseNumberArray(flatten(arguments));

  if (args instanceof Error) {
    return args
  }

  let sum = 0;
  let divisor = 1;

  for (let i = 0; i < args.length; i++) {
    sum += args[i];
    divisor *= FACT(args[i]);
  }

  return FACT(sum) / divisor
}

/**
 * Rounds a number up to the nearest odd integer.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number: The value to round.
 * @returns
 */
function ODD(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  let temp = Math.ceil(Math.abs(number));
  temp = temp & 1 ? temp : temp + 1;

  return number >= 0 ? temp : -temp
}

/**
 * Returns the value of pi.
 *
 * Category: Math and trigonometry
 *
 * @returns
 */
function PI$1() {
  return Math.PI
}

/**
 * Formula.js only
 *
 * @returns
 */
function E() {
  return Math.E
}

/**
 * Returns the result of a number raised to a power.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The base number. It can be any real number.
 * @param {*} power The exponent to which the base number is raised.
 * @returns
 */
function POWER(number, power) {
  number = parseNumber(number);
  power = parseNumber(power);
  const anyError$1 = anyError(number, power);

  if (anyError$1) {
    return anyError$1
  }

  if (number === 0 && power === 0) {
    return num
  }

  const result = Math.pow(number, power);

  if (isNaN(result)) {
    return num
  }

  return result
}

/**
 * Multiplies its arguments.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number1 The first number or range that you want to multiply.
 * @param {*} args number2, ... Optional. Additional numbers or ranges that you want to multiply, up to a maximum of 255 arguments.
 * @returns
 */
function PRODUCT() {
  const flatArguments = flatten(arguments);
  const flatArgumentsDefined = flatArguments.filter((arg) => arg !== undefined && arg !== null);

  if (flatArgumentsDefined.length === 0) {
    return 0
  }

  const args = parseNumberArray(flatArgumentsDefined);

  if (args instanceof Error) {
    return args
  }

  let result = 1;

  for (let i = 0; i < args.length; i++) {
    result *= args[i];
  }

  return result
}

/**
 * Returns the integer portion of a division.
 *
 * Category: Math and trigonometry
 *
 * @param {*} numerator The dividend.
 * @param {*} denominator The divisor.
 * @returns
 */
function QUOTIENT(numerator, denominator) {
  numerator = parseNumber(numerator);
  denominator = parseNumber(denominator);
  const anyError$1 = anyError(numerator, denominator);

  if (anyError$1) {
    return anyError$1
  }

  return parseInt(numerator / denominator, 10)
}

/**
 * Converts degrees to radians.
 *
 * Category: Math and trigonometry
 *
 * @param {*} angle An angle in degrees that you want to convert.
 * @returns
 */
function RADIANS(angle) {
  angle = parseNumber(angle);

  if (angle instanceof Error) {
    return angle
  }

  return (angle * Math.PI) / 180
}

/**
 * Returns a random number between 0 and 1.
 *
 * Category: Math and trigonometry
 *
 * @returns
 */
function RAND() {
  return Math.random()
}

/**
 * Returns a random number between the numbers you specify.
 *
 * Category: Math and trigonometry
 *
 * @param {*} bottom The smallest integer RANDBETWEEN will return.
 * @param {*} top The largest integer RANDBETWEEN will return.
 * @returns
 */
function RANDBETWEEN(bottom, top) {
  bottom = parseNumber(bottom);
  top = parseNumber(top);
  const anyError$1 = anyError(bottom, top);

  if (anyError$1) {
    return anyError$1
  }
  // Creative Commons Attribution 3.0 License
  // Copyright (c) 2012 eqcode

  return bottom + Math.ceil((top - bottom + 1) * Math.random()) - 1
}

// TODO
/**
 * Converts an arabic numeral to roman, as text.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The Arabic numeral you want converted.
 * @returns
 */
function ROMAN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  // The MIT License
  // Copyright (c) 2008 Steven Levithan
  const digits = String(number).split('');
  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX'
  ];
  let roman = '';
  let i = 3;

  while (i--) {
    roman = (key[+digits.pop() + i * 10] || '') + roman;
  }

  return new Array(+digits.join('') + 1).join('M') + roman
}

/**
 * Rounds a number to a specified number of digits.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number that you want to round.
 * @param {*} num_digits The number of digits to which you want to round the number argument.
 * @returns
 */
function ROUND(number, num_digits) {
  number = parseNumber(number);
  num_digits = parseNumber(num_digits);
  const anyError$1 = anyError(number, num_digits);

  if (anyError$1) {
    return anyError$1
  }

  return Number(Math.round(Number(number + 'e' + num_digits)) + 'e' + num_digits * -1)
}

/**
 * Rounds a number down, toward zero.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number that you want rounded down.
 * @param {*} num_digits The number of digits to which you want to round number.
 * @returns
 */
function ROUNDDOWN(number, num_digits) {
  number = parseNumber(number);
  num_digits = parseNumber(num_digits);
  const anyError$1 = anyError(number, num_digits);

  if (anyError$1) {
    return anyError$1
  }

  const sign = number > 0 ? 1 : -1;

  return (sign * Math.floor(Math.abs(number) * Math.pow(10, num_digits))) / Math.pow(10, num_digits)
}

/**
 * Rounds a number up, away from zero.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number that you want rounded up.
 * @param {*} num_digits The number of digits to which you want to round number.
 * @returns
 */
function ROUNDUP(number, num_digits) {
  number = parseNumber(number);
  num_digits = parseNumber(num_digits);
  const anyError$1 = anyError(number, num_digits);

  if (anyError$1) {
    return anyError$1
  }

  const sign = number > 0 ? 1 : -1;

  return (sign * Math.ceil(Math.abs(number) * Math.pow(10, num_digits))) / Math.pow(10, num_digits)
}

/**
 * Returns the secant of an angle.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The angle in radians for which you want the secant.
 * @returns
 */
function SEC(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return 1 / Math.cos(number)
}

/**
 * Returns the hyperbolic secant of an angle.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The angle in radians for which you want the hyperbolic secant.
 * @returns
 */
function SECH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return 2 / (Math.exp(number) + Math.exp(-number))
}

/**
 * Returns the sum of a power series based on the formula.
 *
 * Category: Math and trigonometry
 *
 * @param {*} x The input value to the power series.
 * @param {*} n The initial power to which you want to raise x.
 * @param {*} m The step by which to increase n for each term in the series.
 * @param {*} coefficients A set of coefficients by which each successive power of x is multiplied. The number of values in coefficients determines the number of terms in the power series. For example, if there are three values in coefficients, then there will be three terms in the power series.
 * @returns
 */
function SERIESSUM(x, n, m, coefficients) {
  x = parseNumber(x);
  n = parseNumber(n);
  m = parseNumber(m);
  coefficients = parseNumberArray(coefficients);

  if (anyIsError(x, n, m, coefficients)) {
    return value
  }

  let result = coefficients[0] * Math.pow(x, n);

  for (let i = 1; i < coefficients.length; i++) {
    result += coefficients[i] * Math.pow(x, n + i * m);
  }

  return result
}

/**
 * Returns the sign of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number.
 * @returns
 */
function SIGN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number < 0) {
    return -1
  } else if (number === 0) {
    return 0
  } else {
    return 1
  }
}

/**
 * Returns the sine of the given angle.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The angle in radians for which you want the sine.
 * @returns
 */
function SIN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.sin(number)
}

/**
 * Returns the hyperbolic sine of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number.
 * @returns
 */
function SINH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return (Math.exp(number) - Math.exp(-number)) / 2
}

/**
 * Returns a positive square root.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number for which you want the square root.
 * @returns
 */
function SQRT(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  if (number < 0) {
    return num
  }

  return Math.sqrt(number)
}

/**
 * Returns the square root of (number * pi).
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number by which pi is multiplied.
 * @returns
 */
function SQRTPI(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.sqrt(number * Math.PI)
}

/**
 * Formula.js only
 *
 * @returns
 */
function SQRT1_2() {
  return 1 / Math.sqrt(2)
}

/**
 * Formula.js only
 *
 * @returns
 */
function SQRT2() {
  return Math.sqrt(2)
}

/**
 * Returns a subtotal in a list or database.
 *
 * Category: Math and trigonometry
 *
 * @param {*} function_num The number 1-11 or 101-111 that specifies the function to use for the subtotal. 1-11 includes manually-hidden rows, while 101-111 excludes them; filtered-out values are always excluded.
 * @param {*} ref1 The first named range or reference for which you want the subtotal.
 * @returns
 */
function SUBTOTAL(function_num, ref1) {
  function_num = parseNumber(function_num);

  if (function_num instanceof Error) {
    return function_num
  }

  switch (function_num) {
    case 1:
      return AVERAGE(ref1)
    case 2:
      return COUNT(ref1)
    case 3:
      return COUNTA(ref1)
    case 4:
      return MAX(ref1)
    case 5:
      return MIN(ref1)
    case 6:
      return PRODUCT(ref1)
    case 7:
      return STDEV.S(ref1)
    case 8:
      return STDEV.P(ref1)
    case 9:
      return SUM(ref1)
    case 10:
      return VAR.S(ref1)
    case 11:
      return VAR.P(ref1)
    // no hidden values for us
    case 101:
      return AVERAGE(ref1)
    case 102:
      return COUNT(ref1)
    case 103:
      return COUNTA(ref1)
    case 104:
      return MAX(ref1)
    case 105:
      return MIN(ref1)
    case 106:
      return PRODUCT(ref1)
    case 107:
      return STDEV.S(ref1)
    case 108:
      return STDEV.P(ref1)
    case 109:
      return SUM(ref1)
    case 110:
      return VAR.S(ref1)
    case 111:
      return VAR.P(ref1)
  }
}

/**
 * Formula.js only
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function ADD(num1, num2) {
  if (arguments.length !== 2) {
    return na
  }

  num1 = parseNumber(num1);
  num2 = parseNumber(num2);
  const anyError$1 = anyError(num1, num2);

  if (anyError$1) {
    return anyError$1
  }

  return num1 + num2
}

/**
 * Formula.js only
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function MINUS(num1, num2) {
  if (arguments.length !== 2) {
    return na
  }

  num1 = parseNumber(num1);
  num2 = parseNumber(num2);
  const anyError$1 = anyError(num1, num2);

  if (anyError$1) {
    return anyError$1
  }

  return num1 - num2
}

/**
 * Formula.js only
 *
 * @param {*} dividend
 * @param {*} divisor
 * @returns
 */
function DIVIDE(dividend, divisor) {
  if (arguments.length !== 2) {
    return na
  }

  dividend = parseNumber(dividend);
  divisor = parseNumber(divisor);
  const anyError$1 = anyError(dividend, divisor);

  if (anyError$1) {
    return anyError$1
  }

  if (divisor === 0) {
    return div0
  }

  return dividend / divisor
}

/**
 * Formula.js only
 *
 * @param {*} factor1
 * @param {*} factor2
 * @returns
 */
function MULTIPLY(factor1, factor2) {
  if (arguments.length !== 2) {
    return na
  }

  factor1 = parseNumber(factor1);
  factor2 = parseNumber(factor2);
  const anyError$1 = anyError(factor1, factor2);

  if (anyError$1) {
    return anyError$1
  }

  return factor1 * factor2
}

/**
 * Formula.js only
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function GT(num1, num2) {
  if (arguments.length !== 2) {
    return na
  }

  if (num1 instanceof Error) {
    return num1
  }

  if (num2 instanceof Error) {
    return num2
  }

  if (anyIsString(num1, num2)) {
    num1 = parseString(num1);
    num2 = parseString(num2);
  } else {
    num1 = parseNumber(num1);
    num2 = parseNumber(num2);
  }

  const anyError$1 = anyError(num1, num2);

  if (anyError$1) {
    return anyError$1
  }

  return num1 > num2
}

/**
 * Formula.js only
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function GTE(num1, num2) {
  if (arguments.length !== 2) {
    return na
  }

  if (anyIsString(num1, num2)) {
    num1 = parseString(num1);
    num2 = parseString(num2);
  } else {
    num1 = parseNumber(num1);
    num2 = parseNumber(num2);
  }

  const anyError$1 = anyError(num1, num2);

  if (anyError$1) {
    return anyError$1
  }

  return num1 >= num2
}

/**
 * Formula.js only
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function LT(num1, num2) {
  if (arguments.length !== 2) {
    return na
  }

  if (anyIsString(num1, num2)) {
    num1 = parseString(num1);
    num2 = parseString(num2);
  } else {
    num1 = parseNumber(num1);
    num2 = parseNumber(num2);
  }

  const anyError$1 = anyError(num1, num2);

  if (anyError$1) {
    return anyError$1
  }

  return num1 < num2
}

/**
 * Formula.js only
 *
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function LTE(num1, num2) {
  if (arguments.length !== 2) {
    return na
  }

  if (anyIsString(num1, num2)) {
    num1 = parseString(num1);
    num2 = parseString(num2);
  } else {
    num1 = parseNumber(num1);
    num2 = parseNumber(num2);
  }

  const anyError$1 = anyError(num1, num2);

  if (anyError$1) {
    return anyError$1
  }

  return num1 <= num2
}

/**
 * Formula.js only
 *
 * @param {*} value1
 * @param {*} value2
 * @returns
 */
function EQ(value1, value2) {
  if (arguments.length !== 2) {
    return na
  }

  if (value1 instanceof Error) {
    return value1
  }

  if (value2 instanceof Error) {
    return value2
  }

  if (value1 === null) {
    value1 = undefined;
  }

  if (value2 === null) {
    value2 = undefined;
  }

  return value1 === value2
}

/**
 * Formula.js only
 *
 * @param {*} value1
 * @param {*} value2
 * @returns
 */
function NE(value1, value2) {
  if (arguments.length !== 2) {
    return na
  }

  if (value1 instanceof Error) {
    return value1
  }

  if (value2 instanceof Error) {
    return value2
  }

  if (value1 === null) {
    value1 = undefined;
  }

  if (value2 === null) {
    value2 = undefined;
  }

  return value1 !== value2
}

/**
 * Formula.js only
 *
 * @param {*} base
 * @param {*} exponent
 * @returns
 */
function POW(base, exponent) {
  if (arguments.length !== 2) {
    return na
  }

  return POWER(base, exponent)
}

/**
 * Adds its arguments.
 *
 * Category: Math and trigonometry
 *
 * @returns
 */
function SUM() {
  let result = 0;

  arrayEach(argsToArray(arguments), (value) => {
    if (result instanceof Error) {
      return false
    } else if (value instanceof Error) {
      result = value;
    } else if (typeof value === 'number') {
      result += value;
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value);

      !isNaN(parsed) && (result += parsed);
    } else if (Array.isArray(value)) {
      const inner_result = SUM.apply(null, value);

      if (inner_result instanceof Error) {
        result = inner_result;
      } else {
        result += inner_result;
      }
    }
  });

  return result
}

/**
 * Adds the values specified by a given criteria.
 *
 * Category: Math and trigonometry
 *
 * @param {*} range The range of values that you want evaluated by criteria. Cells in each range must be numbers or names, arrays, or references that contain numbers. Blank and text values are ignored.
 * @param {*} criteria The criteria in the form of a number, expression, a value reference, text, or a function that defines which values will be added.
 * @param {*} sum_range Optional. The actual values to add, if you want to add values other than those specified in the range argument. If the sum_range argument is omitted, Excel adds the values that are specified in the range argument (the same values to which the criteria is applied). Sum_range should be the same size and shape as range. If it isn't, performance may suffer, and the formula will sum a range of values that starts with the first value in sum_range but has the same dimensions as range.
 * @returns
 */
function SUMIF(range, criteria, sum_range) {
  range = flatten(range);

  sum_range = sum_range ? flatten(sum_range) : range;

  if (range instanceof Error) {
    return range
  }

  if (criteria === undefined || criteria === null || criteria instanceof Error) {
    return 0
  }

  let result = 0;
  const isWildcard = criteria === '*';
  const tokenizedCriteria = isWildcard ? null : parse(criteria + '');

  for (let i = 0; i < range.length; i++) {
    const value = range[i];
    const sumValue = sum_range[i];

    if (isWildcard) {
      result += value;
    } else {
      const tokens = [createToken(value, TOKEN_TYPE_LITERAL)].concat(tokenizedCriteria);

      result += compute(tokens) ? sumValue : 0;
    }
  }

  return result
}

/**
 * Adds the values in a range that meet multiple criteria.
 *
 * Category: Math and trigonometry
 *
 * @returns
 */
function SUMIFS() {
  const args = argsToArray(arguments);
  const range = parseNumberArray(flatten(args.shift()));

  if (range instanceof Error) {
    return range
  }

  const criterias = args;
  const criteriaLength = criterias.length / 2;

  for (let i = 0; i < criteriaLength; i++) {
    criterias[i * 2] = flatten(criterias[i * 2]);
  }

  let result = 0;

  for (let i = 0; i < range.length; i++) {
    let isMeetCondition = false;

    for (let j = 0; j < criteriaLength; j++) {
      const valueToTest = criterias[j * 2][i];
      const criteria = criterias[j * 2 + 1];
      const isWildcard = criteria === void 0 || criteria === '*';
      let computedResult = false;

      if (isWildcard) {
        computedResult = true;
      } else {
        const tokenizedCriteria = parse(criteria + '');
        const tokens = [createToken(valueToTest, TOKEN_TYPE_LITERAL)].concat(
          tokenizedCriteria
        );

        computedResult = compute(tokens);
      }

      // Criterias are calculated as AND so any `false` breakes the loop as unmeet condition
      if (!computedResult) {
        isMeetCondition = false;
        break
      }

      isMeetCondition = true;
    }

    if (isMeetCondition) {
      result += range[i];
    }
  }

  return result
}

/**
 * Returns the sum of the products of corresponding array components.
 *
 * Category: Math and trigonometry
 *
 * @returns
 */
function SUMPRODUCT() {
  if (!arguments || arguments.length === 0) {
    return value
  }

  const arrays = arguments.length + 1;
  let result = 0;
  let product;
  let k;
  let _i;
  let _ij;

  for (let i = 0; i < arguments[0].length; i++) {
    if (!(arguments[0][i] instanceof Array)) {
      product = 1;

      for (k = 1; k < arrays; k++) {
        const _i_arg = arguments[k - 1][i];

        if (_i_arg instanceof Error) {
          return _i_arg
        }

        _i = parseNumber(_i_arg);

        if (_i instanceof Error) {
          return _i
        }

        product *= _i;
      }

      result += product;
    } else {
      for (let j = 0; j < arguments[0][i].length; j++) {
        product = 1;

        for (k = 1; k < arrays; k++) {
          const _ij_arg = arguments[k - 1][i][j];

          if (_ij_arg instanceof Error) {
            return _ij_arg
          }

          _ij = parseNumber(_ij_arg);

          if (_ij instanceof Error) {
            return _ij
          }

          product *= _ij;
        }

        result += product;
      }
    }
  }

  return result
}

/**
 * Returns the sum of the squares of the arguments.
 *
 * Category: Math and trigonometry
 *
 * @param {*} args number1, number2, ... Number1 is required, subsequent numbers are optional. 1 to 255 arguments for which you want the sum of the squares. You can also use a single array or a reference to an array instead of arguments separated by commas.
 * @returns
 */
function SUMSQ() {
  const numbers = parseNumberArray(flatten(arguments));

  if (numbers instanceof Error) {
    return numbers
  }

  let result = 0;
  const length = numbers.length;

  for (let i = 0; i < length; i++) {
    result += ISNUMBER(numbers[i]) ? numbers[i] * numbers[i] : 0;
  }

  return result
}

/**
 * Returns the sum of the difference of squares of corresponding values in two arrays.
 *
 * Category: Math and trigonometry
 *
 * @param {*} array_x The first array or range of values.
 * @param {*} array_y The second array or range of values.
 * @returns
 */
function SUMX2MY2(array_x, array_y) {
  array_x = parseNumberArray(flatten(array_x));
  array_y = parseNumberArray(flatten(array_y));

  if (anyIsError(array_x, array_y)) {
    return value
  }

  let result = 0;

  for (let i = 0; i < array_x.length; i++) {
    result += array_x[i] * array_x[i] - array_y[i] * array_y[i];
  }

  return result
}

/**
 * Returns the sum of the sum of squares of corresponding values in two arrays.
 *
 * Category: Math and trigonometry
 *
 * @param {*} array_x The first array or range of values.
 * @param {*} array_y The second array or range of values.
 * @returns
 */
function SUMX2PY2(array_x, array_y) {
  array_x = parseNumberArray(flatten(array_x));
  array_y = parseNumberArray(flatten(array_y));

  if (anyIsError(array_x, array_y)) {
    return value
  }

  let result = 0;
  array_x = parseNumberArray(flatten(array_x));
  array_y = parseNumberArray(flatten(array_y));

  for (let i = 0; i < array_x.length; i++) {
    result += array_x[i] * array_x[i] + array_y[i] * array_y[i];
  }

  return result
}

/**
 * Returns the sum of squares of differences of corresponding values in two arrays.
 *
 * Category: Math and trigonometry
 *
 * @param {*} array_x The first array or range of values.
 * @param {*} array_y The second array or range of values.
 * @returns
 */
function SUMXMY2(array_x, array_y) {
  array_x = parseNumberArray(flatten(array_x));
  array_y = parseNumberArray(flatten(array_y));

  if (anyIsError(array_x, array_y)) {
    return value
  }

  let result = 0;
  array_x = flatten(array_x);
  array_y = flatten(array_y);

  for (let i = 0; i < array_x.length; i++) {
    result += Math.pow(array_x[i] - array_y[i], 2);
  }

  return result
}

/**
 * Returns the tangent of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The angle in radians for which you want the tangent.
 * @returns
 */
function TAN(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  return Math.tan(number)
}

/**
 * Returns the hyperbolic tangent of a number.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number Any real number.
 * @returns
 */
function TANH(number) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  const e2 = Math.exp(2 * number);

  return (e2 - 1) / (e2 + 1)
}

/**
 * Truncates a number to an integer.
 *
 * Category: Math and trigonometry
 *
 * @param {*} number The number you want to truncate.
 * @param {*} num_digits Optional. A number specifying the precision of the truncation. The default value for num_digits is 0 (zero).
 * @returns
 */
function TRUNC(number, num_digits) {
  number = parseNumber(number);
  num_digits = parseNumber(num_digits);
  const anyError$1 = anyError(number, num_digits);

  if (anyError$1) {
    return anyError$1
  }

  const sign = number > 0 ? 1 : -1;

  return (sign * Math.floor(Math.abs(number) * Math.pow(10, num_digits))) / Math.pow(10, num_digits)
}

/*!
 *  decimal.js v10.4.3
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */


// -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //


  // The maximum exponent magnitude.
  // The limit on the value of `toExpNeg`, `toExpPos`, `minE` and `maxE`.
var EXP_LIMIT = 9e15,                      // 0 to 9e15

  // The limit on the value of `precision`, and on the value of the first argument to
  // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
  MAX_DIGITS = 1e9,                        // 0 to 1e9

  // Base conversion alphabet.
  NUMERALS = '0123456789abcdef',

  // The natural logarithm of 10 (1025 digits).
  LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',

  // Pi (1025 digits).
  PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',


  // The initial configuration properties of the Decimal constructor.
  DEFAULTS = {

    // These values must be integers within the stated ranges (inclusive).
    // Most of these values can be changed at run-time using the `Decimal.config` method.

    // The maximum number of significant digits of the result of a calculation or base conversion.
    // E.g. `Decimal.config({ precision: 20 });`
    precision: 20,                         // 1 to MAX_DIGITS

    // The rounding mode used when rounding to `precision`.
    //
    // ROUND_UP         0 Away from zero.
    // ROUND_DOWN       1 Towards zero.
    // ROUND_CEIL       2 Towards +Infinity.
    // ROUND_FLOOR      3 Towards -Infinity.
    // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    //
    // E.g.
    // `Decimal.rounding = 4;`
    // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
    rounding: 4,                           // 0 to 8

    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP         0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
    // FLOOR      3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN  6 The IEEE 754 remainder function.
    // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
    //
    // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
    // division (9) are commonly used for the modulus operation. The other rounding modes can also
    // be used, but they may not give useful results.
    modulo: 1,                             // 0 to 9

    // The exponent value at and beneath which `toString` returns exponential notation.
    // JavaScript numbers: -7
    toExpNeg: -7,                          // 0 to -EXP_LIMIT

    // The exponent value at and above which `toString` returns exponential notation.
    // JavaScript numbers: 21
    toExpPos:  21,                         // 0 to EXP_LIMIT

    // The minimum exponent value, beneath which underflow to zero occurs.
    // JavaScript numbers: -324  (5e-324)
    minE: -EXP_LIMIT,                      // -1 to -EXP_LIMIT

    // The maximum exponent value, above which overflow to Infinity occurs.
    // JavaScript numbers: 308  (1.7976931348623157e+308)
    maxE: EXP_LIMIT,                       // 1 to EXP_LIMIT

    // Whether to use cryptographically-secure random number generation, if available.
    crypto: false                          // true/false
  },


// ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


  inexact, quadrant,
  external = true,

  decimalError = '[DecimalError] ',
  invalidArgument = decimalError + 'Invalid argument: ',
  precisionLimitExceeded = decimalError + 'Precision limit exceeded',
  cryptoUnavailable = decimalError + 'crypto unavailable',
  tag = '[object Decimal]',

  mathfloor = Math.floor,
  mathpow = Math.pow,

  isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
  isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
  isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
  isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

  BASE = 1e7,
  LOG_BASE = 7,
  MAX_SAFE_INTEGER = 9007199254740991,

  LN10_PRECISION = LN10.length - 1,
  PI_PRECISION = PI.length - 1,

  // Decimal.prototype object
  P = { toStringTag: tag };


// Decimal prototype methods


/*
 *  absoluteValue             abs
 *  ceil
 *  clampedTo                 clamp
 *  comparedTo                cmp
 *  cosine                    cos
 *  cubeRoot                  cbrt
 *  decimalPlaces             dp
 *  dividedBy                 div
 *  dividedToIntegerBy        divToInt
 *  equals                    eq
 *  floor
 *  greaterThan               gt
 *  greaterThanOrEqualTo      gte
 *  hyperbolicCosine          cosh
 *  hyperbolicSine            sinh
 *  hyperbolicTangent         tanh
 *  inverseCosine             acos
 *  inverseHyperbolicCosine   acosh
 *  inverseHyperbolicSine     asinh
 *  inverseHyperbolicTangent  atanh
 *  inverseSine               asin
 *  inverseTangent            atan
 *  isFinite
 *  isInteger                 isInt
 *  isNaN
 *  isNegative                isNeg
 *  isPositive                isPos
 *  isZero
 *  lessThan                  lt
 *  lessThanOrEqualTo         lte
 *  logarithm                 log
 *  [maximum]                 [max]
 *  [minimum]                 [min]
 *  minus                     sub
 *  modulo                    mod
 *  naturalExponential        exp
 *  naturalLogarithm          ln
 *  negated                   neg
 *  plus                      add
 *  precision                 sd
 *  round
 *  sine                      sin
 *  squareRoot                sqrt
 *  tangent                   tan
 *  times                     mul
 *  toBinary
 *  toDecimalPlaces           toDP
 *  toExponential
 *  toFixed
 *  toFraction
 *  toHexadecimal             toHex
 *  toNearest
 *  toNumber
 *  toOctal
 *  toPower                   pow
 *  toPrecision
 *  toSignificantDigits       toSD
 *  toString
 *  truncated                 trunc
 *  valueOf                   toJSON
 */


/*
 * Return a new Decimal whose value is the absolute value of this Decimal.
 *
 */
P.absoluteValue = P.abs = function () {
  var x = new this.constructor(this);
  if (x.s < 0) x.s = 1;
  return finalise(x);
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
 * direction of positive Infinity.
 *
 */
P.ceil = function () {
  return finalise(new this.constructor(this), this.e + 1, 2);
};


/*
 * Return a new Decimal whose value is the value of this Decimal clamped to the range
 * delineated by `min` and `max`.
 *
 * min {number|string|Decimal}
 * max {number|string|Decimal}
 *
 */
P.clampedTo = P.clamp = function (min, max) {
  var k,
    x = this,
    Ctor = x.constructor;
  min = new Ctor(min);
  max = new Ctor(max);
  if (!min.s || !max.s) return new Ctor(NaN);
  if (min.gt(max)) throw Error(invalidArgument + max);
  k = x.cmp(min);
  return k < 0 ? min : x.cmp(max) > 0 ? max : new Ctor(x);
};


/*
 * Return
 *   1    if the value of this Decimal is greater than the value of `y`,
 *  -1    if the value of this Decimal is less than the value of `y`,
 *   0    if they have the same value,
 *   NaN  if the value of either Decimal is NaN.
 *
 */
P.comparedTo = P.cmp = function (y) {
  var i, j, xdL, ydL,
    x = this,
    xd = x.d,
    yd = (y = new x.constructor(y)).d,
    xs = x.s,
    ys = y.s;

  // Either NaN or ±Infinity?
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }

  // Either zero?
  if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;

  // Signs differ?
  if (xs !== ys) return xs;

  // Compare exponents.
  if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;

  xdL = xd.length;
  ydL = yd.length;

  // Compare digit by digit.
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }

  // Compare lengths.
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};


/*
 * Return a new Decimal whose value is the cosine of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * cos(0)         = 1
 * cos(-0)        = 1
 * cos(Infinity)  = NaN
 * cos(-Infinity) = NaN
 * cos(NaN)       = NaN
 *
 */
P.cosine = P.cos = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.d) return new Ctor(NaN);

  // cos(0) = cos(-0) = 1
  if (!x.d[0]) return new Ctor(1);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;

  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};


/*
 *
 * Return a new Decimal whose value is the cube root of the value of this Decimal, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 *  cbrt(0)  =  0
 *  cbrt(-0) = -0
 *  cbrt(1)  =  1
 *  cbrt(-1) = -1
 *  cbrt(N)  =  N
 *  cbrt(-I) = -I
 *  cbrt(I)  =  I
 *
 * Math.cbrt(x) = (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))
 *
 */
P.cubeRoot = P.cbrt = function () {
  var e, m, n, r, rep, s, sd, t, t3, t3plusx,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  external = false;

  // Initial estimate.
  s = x.s * mathpow(x.s * x, 1 / 3);

   // Math.cbrt underflow/overflow?
   // Pass x to Math.pow as integer, then adjust the exponent of the result.
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;

    // Adjust n exponent so it is a multiple of 3 away from x exponent.
    if (s = (e - n.length + 1) % 3) n += (s == 1 || s == -2 ? '0' : '00');
    s = mathpow(n, 1 / 3);

    // Rarely, e may be one less than the result exponent value.
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));

    if (s == 1 / 0) {
      n = '5e' + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf('e') + 1) + e;
    }

    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }

  sd = (e = Ctor.precision) + 3;

  // Halley's method.
  // TODO? Compare Newton's method.
  for (;;) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);

    // TODO? Replace with for-loop and checkRoundingDigits.
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);

      // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or 4999
      // , i.e. approaching a rounding boundary, continue the iteration.
      if (n == '9999' || !rep && n == '4999') {

        // On the first iteration only, check to see if rounding up gives the exact result as the
        // nines may infinitely repeat.
        if (!rep) {
          finalise(t, e + 1, 0);

          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }

        sd += 4;
        rep = 1;
      } else {

        // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
        // If not, then there are further digits and m will be truthy.
        if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

          // Truncate to the first rounding digit.
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }

        break;
      }
    }
  }

  external = true;

  return finalise(r, e, Ctor.rounding, m);
};


/*
 * Return the number of decimal places of the value of this Decimal.
 *
 */
P.decimalPlaces = P.dp = function () {
  var w,
    d = this.d,
    n = NaN;

  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;

    // Subtract the number of trailing zeros of the last word.
    w = d[w];
    if (w) for (; w % 10 == 0; w /= 10) n--;
    if (n < 0) n = 0;
  }

  return n;
};


/*
 *  n / 0 = I
 *  n / N = N
 *  n / I = 0
 *  0 / n = 0
 *  0 / 0 = N
 *  0 / N = N
 *  0 / I = 0
 *  N / n = N
 *  N / 0 = N
 *  N / N = N
 *  N / I = N
 *  I / n = I
 *  I / 0 = I
 *  I / N = N
 *  I / I = N
 *
 * Return a new Decimal whose value is the value of this Decimal divided by `y`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 */
P.dividedBy = P.div = function (y) {
  return divide(this, new this.constructor(y));
};


/*
 * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
 * by the value of `y`, rounded to `precision` significant digits using rounding mode `rounding`.
 *
 */
P.dividedToIntegerBy = P.divToInt = function (y) {
  var x = this,
    Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};


/*
 * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
 *
 */
P.equals = P.eq = function (y) {
  return this.cmp(y) === 0;
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
 * direction of negative Infinity.
 *
 */
P.floor = function () {
  return finalise(new this.constructor(this), this.e + 1, 3);
};


/*
 * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
 * false.
 *
 */
P.greaterThan = P.gt = function (y) {
  return this.cmp(y) > 0;
};


/*
 * Return true if the value of this Decimal is greater than or equal to the value of `y`,
 * otherwise return false.
 *
 */
P.greaterThanOrEqualTo = P.gte = function (y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};


/*
 * Return a new Decimal whose value is the hyperbolic cosine of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [1, Infinity]
 *
 * cosh(x) = 1 + x^2/2! + x^4/4! + x^6/6! + ...
 *
 * cosh(0)         = 1
 * cosh(-0)        = 1
 * cosh(Infinity)  = Infinity
 * cosh(-Infinity) = Infinity
 * cosh(NaN)       = NaN
 *
 *  x        time taken (ms)   result
 * 1000      9                 9.8503555700852349694e+433
 * 10000     25                4.4034091128314607936e+4342
 * 100000    171               1.4033316802130615897e+43429
 * 1000000   3817              1.5166076984010437725e+434294
 * 10000000  abandoned after 2 minute wait
 *
 * TODO? Compare performance of cosh(x) = 0.5 * (exp(x) + exp(-x))
 *
 */
P.hyperbolicCosine = P.cosh = function () {
  var k, n, pr, rm, len,
    x = this,
    Ctor = x.constructor,
    one = new Ctor(1);

  if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero()) return one;

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;

  // Argument reduction: cos(4x) = 1 - 8cos^2(x) + 8cos^4(x) + 1
  // i.e. cos(x) = 1 - cos^2(x/4)(8 - 8cos^2(x/4))

  // Estimate the optimum number of times to use the argument reduction.
  // TODO? Estimation reused from cosine() and may not be optimal here.
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = '2.3283064365386962890625e-10';
  }

  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);

  // Reverse argument reduction
  var cosh2_x,
    i = k,
    d8 = new Ctor(8);
  for (; i--;) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }

  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};


/*
 * Return a new Decimal whose value is the hyperbolic sine of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * sinh(x) = x + x^3/3! + x^5/5! + x^7/7! + ...
 *
 * sinh(0)         = 0
 * sinh(-0)        = -0
 * sinh(Infinity)  = Infinity
 * sinh(-Infinity) = -Infinity
 * sinh(NaN)       = NaN
 *
 * x        time taken (ms)
 * 10       2 ms
 * 100      5 ms
 * 1000     14 ms
 * 10000    82 ms
 * 100000   886 ms            1.4033316802130615897e+43429
 * 200000   2613 ms
 * 300000   5407 ms
 * 400000   8824 ms
 * 500000   13026 ms          8.7080643612718084129e+217146
 * 1000000  48543 ms
 *
 * TODO? Compare performance of sinh(x) = 0.5 * (exp(x) - exp(-x))
 *
 */
P.hyperbolicSine = P.sinh = function () {
  var k, pr, rm, len,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite() || x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;

  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {

    // Alternative argument reduction: sinh(3x) = sinh(x)(3 + 4sinh^2(x))
    // i.e. sinh(x) = sinh(x/3)(3 + 4sinh^2(x/3))
    // 3 multiplications and 1 addition

    // Argument reduction: sinh(5x) = sinh(x)(5 + sinh^2(x)(20 + 16sinh^2(x)))
    // i.e. sinh(x) = sinh(x/5)(5 + sinh^2(x/5)(20 + 16sinh^2(x/5)))
    // 4 multiplications and 2 additions

    // Estimate the optimum number of times to use the argument reduction.
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;

    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true);

    // Reverse argument reduction
    var sinh2_x,
      d5 = new Ctor(5),
      d16 = new Ctor(16),
      d20 = new Ctor(20);
    for (; k--;) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(x, pr, rm, true);
};


/*
 * Return a new Decimal whose value is the hyperbolic tangent of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * tanh(x) = sinh(x) / cosh(x)
 *
 * tanh(0)         = 0
 * tanh(-0)        = -0
 * tanh(Infinity)  = 1
 * tanh(-Infinity) = -1
 * tanh(NaN)       = NaN
 *
 */
P.hyperbolicTangent = P.tanh = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(x.s);
  if (x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;

  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};


/*
 * Return a new Decimal whose value is the arccosine (inverse cosine) in radians of the value of
 * this Decimal.
 *
 * Domain: [-1, 1]
 * Range: [0, pi]
 *
 * acos(x) = pi/2 - asin(x)
 *
 * acos(0)       = pi/2
 * acos(-0)      = pi/2
 * acos(1)       = 0
 * acos(-1)      = pi
 * acos(1/2)     = pi/3
 * acos(-1/2)    = 2*pi/3
 * acos(|x| > 1) = NaN
 * acos(NaN)     = NaN
 *
 */
P.inverseCosine = P.acos = function () {
  var halfPi,
    x = this,
    Ctor = x.constructor,
    k = x.abs().cmp(1),
    pr = Ctor.precision,
    rm = Ctor.rounding;

  if (k !== -1) {
    return k === 0
      // |x| is 1
      ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0)
      // |x| > 1 or x is NaN
      : new Ctor(NaN);
  }

  if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);

  // TODO? Special case acos(0.5) = pi/3 and acos(-0.5) = 2*pi/3

  Ctor.precision = pr + 6;
  Ctor.rounding = 1;

  x = x.asin();
  halfPi = getPi(Ctor, pr + 4, rm).times(0.5);

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return halfPi.minus(x);
};


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic cosine in radians of the
 * value of this Decimal.
 *
 * Domain: [1, Infinity]
 * Range: [0, Infinity]
 *
 * acosh(x) = ln(x + sqrt(x^2 - 1))
 *
 * acosh(x < 1)     = NaN
 * acosh(NaN)       = NaN
 * acosh(Infinity)  = Infinity
 * acosh(-Infinity) = NaN
 * acosh(0)         = NaN
 * acosh(-0)        = NaN
 * acosh(1)         = 0
 * acosh(-1)        = NaN
 *
 */
P.inverseHyperbolicCosine = P.acosh = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;

  x = x.times(x).minus(1).sqrt().plus(x);

  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.ln();
};


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic sine in radians of the value
 * of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * asinh(x) = ln(x + sqrt(x^2 + 1))
 *
 * asinh(NaN)       = NaN
 * asinh(Infinity)  = Infinity
 * asinh(-Infinity) = -Infinity
 * asinh(0)         = 0
 * asinh(-0)        = -0
 *
 */
P.inverseHyperbolicSine = P.asinh = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite() || x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;

  x = x.times(x).plus(1).sqrt().plus(x);

  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.ln();
};


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic tangent in radians of the
 * value of this Decimal.
 *
 * Domain: [-1, 1]
 * Range: [-Infinity, Infinity]
 *
 * atanh(x) = 0.5 * ln((1 + x) / (1 - x))
 *
 * atanh(|x| > 1)   = NaN
 * atanh(NaN)       = NaN
 * atanh(Infinity)  = NaN
 * atanh(-Infinity) = NaN
 * atanh(0)         = 0
 * atanh(-0)        = -0
 * atanh(1)         = Infinity
 * atanh(-1)        = -Infinity
 *
 */
P.inverseHyperbolicTangent = P.atanh = function () {
  var pr, rm, wpr, xsd,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(NaN);
  if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();

  if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);

  Ctor.precision = wpr = xsd - x.e;

  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);

  Ctor.precision = pr + 4;
  Ctor.rounding = 1;

  x = x.ln();

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.times(0.5);
};


/*
 * Return a new Decimal whose value is the arcsine (inverse sine) in radians of the value of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi/2, pi/2]
 *
 * asin(x) = 2*atan(x/(1 + sqrt(1 - x^2)))
 *
 * asin(0)       = 0
 * asin(-0)      = -0
 * asin(1/2)     = pi/6
 * asin(-1/2)    = -pi/6
 * asin(1)       = pi/2
 * asin(-1)      = -pi/2
 * asin(|x| > 1) = NaN
 * asin(NaN)     = NaN
 *
 * TODO? Compare performance of Taylor series.
 *
 */
P.inverseSine = P.asin = function () {
  var halfPi, k,
    pr, rm,
    x = this,
    Ctor = x.constructor;

  if (x.isZero()) return new Ctor(x);

  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;

  if (k !== -1) {

    // |x| is 1
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }

    // |x| > 1 or x is NaN
    return new Ctor(NaN);
  }

  // TODO? Special case asin(1/2) = pi/6 and asin(-1/2) = -pi/6

  Ctor.precision = pr + 6;
  Ctor.rounding = 1;

  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.times(2);
};


/*
 * Return a new Decimal whose value is the arctangent (inverse tangent) in radians of the value
 * of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi/2, pi/2]
 *
 * atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
 *
 * atan(0)         = 0
 * atan(-0)        = -0
 * atan(1)         = pi/4
 * atan(-1)        = -pi/4
 * atan(Infinity)  = pi/2
 * atan(-Infinity) = -pi/2
 * atan(NaN)       = NaN
 *
 */
P.inverseTangent = P.atan = function () {
  var i, j, k, n, px, t, r, wpr, x2,
    x = this,
    Ctor = x.constructor,
    pr = Ctor.precision,
    rm = Ctor.rounding;

  if (!x.isFinite()) {
    if (!x.s) return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }

  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;

  // TODO? if (x >= 1 && pr <= PI_PRECISION) atan(x) = halfPi * x.s - atan(1 / x);

  // Argument reduction
  // Ensure |x| < 0.42
  // atan(x) = 2 * atan(x / (1 + sqrt(1 + x^2)))

  k = Math.min(28, wpr / LOG_BASE + 2 | 0);

  for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));

  external = false;

  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px = x;

  // atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
  for (; i !== -1;) {
    px = px.times(x2);
    t = r.minus(px.div(n += 2));

    px = px.times(x2);
    r = t.plus(px.div(n += 2));

    if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
  }

  if (k) r = r.times(2 << (k - 1));

  external = true;

  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};


/*
 * Return true if the value of this Decimal is a finite number, otherwise return false.
 *
 */
P.isFinite = function () {
  return !!this.d;
};


/*
 * Return true if the value of this Decimal is an integer, otherwise return false.
 *
 */
P.isInteger = P.isInt = function () {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};


/*
 * Return true if the value of this Decimal is NaN, otherwise return false.
 *
 */
P.isNaN = function () {
  return !this.s;
};


/*
 * Return true if the value of this Decimal is negative, otherwise return false.
 *
 */
P.isNegative = P.isNeg = function () {
  return this.s < 0;
};


/*
 * Return true if the value of this Decimal is positive, otherwise return false.
 *
 */
P.isPositive = P.isPos = function () {
  return this.s > 0;
};


/*
 * Return true if the value of this Decimal is 0 or -0, otherwise return false.
 *
 */
P.isZero = function () {
  return !!this.d && this.d[0] === 0;
};


/*
 * Return true if the value of this Decimal is less than `y`, otherwise return false.
 *
 */
P.lessThan = P.lt = function (y) {
  return this.cmp(y) < 0;
};


/*
 * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
 *
 */
P.lessThanOrEqualTo = P.lte = function (y) {
  return this.cmp(y) < 1;
};


/*
 * Return the logarithm of the value of this Decimal to the specified base, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * If no base is specified, return log[10](arg).
 *
 * log[base](arg) = ln(arg) / ln(base)
 *
 * The result will always be correctly rounded if the base of the log is 10, and 'almost always'
 * otherwise:
 *
 * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
 * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
 * between the result and the correctly rounded result will be one ulp (unit in the last place).
 *
 * log[-b](a)       = NaN
 * log[0](a)        = NaN
 * log[1](a)        = NaN
 * log[NaN](a)      = NaN
 * log[Infinity](a) = NaN
 * log[b](0)        = -Infinity
 * log[b](-0)       = -Infinity
 * log[b](-a)       = NaN
 * log[b](1)        = 0
 * log[b](Infinity) = Infinity
 * log[b](NaN)      = NaN
 *
 * [base] {number|string|Decimal} The base of the logarithm.
 *
 */
P.logarithm = P.log = function (base) {
  var isBase10, d, denominator, k, inf, num, sd, r,
    arg = this,
    Ctor = arg.constructor,
    pr = Ctor.precision,
    rm = Ctor.rounding,
    guard = 5;

  // Default base is 10.
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;

    // Return NaN if base is negative, or non-finite, or is 0 or 1.
    if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);

    isBase10 = base.eq(10);
  }

  d = arg.d;

  // Is arg negative, non-finite, 0 or 1?
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }

  // The result will have a non-terminating decimal expansion if base is 10 and arg is not an
  // integer power of 10.
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0;) k /= 10;
      inf = k !== 1;
    }
  }

  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);

  // The result will have 5 rounding digits.
  r = divide(num, denominator, sd, 1);

  // If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
  // calculate 10 further digits.
  //
  // If the result is known to have an infinite decimal expansion, repeat this until it is clear
  // that the result is above or below the boundary. Otherwise, if after calculating the 10
  // further digits, the last 14 are nines, round up and assume the result is exact.
  // Also assume the result is exact if the last 14 are zero.
  //
  // Example of a result that will be incorrectly rounded:
  // log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
  // The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7, but it
  // will be given as 2.6 as there are 15 zeros immediately after the requested decimal place, so
  // the exact result would be assumed to be 2.6, which rounded using ROUND_CEIL to 1 decimal
  // place is still 2.6.
  if (checkRoundingDigits(r.d, k = pr, rm)) {

    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);

      if (!inf) {

        // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }

        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }

  external = true;

  return finalise(r, pr, rm);
};


/*
 * Return a new Decimal whose value is the maximum of the arguments and the value of this Decimal.
 *
 * arguments {number|string|Decimal}
 *
P.max = function () {
  Array.prototype.push.call(arguments, this);
  return maxOrMin(this.constructor, arguments, 'lt');
};
 */


/*
 * Return a new Decimal whose value is the minimum of the arguments and the value of this Decimal.
 *
 * arguments {number|string|Decimal}
 *
P.min = function () {
  Array.prototype.push.call(arguments, this);
  return maxOrMin(this.constructor, arguments, 'gt');
};
 */


/*
 *  n - 0 = n
 *  n - N = N
 *  n - I = -I
 *  0 - n = -n
 *  0 - 0 = 0
 *  0 - N = N
 *  0 - I = -I
 *  N - n = N
 *  N - 0 = N
 *  N - N = N
 *  N - I = N
 *  I - n = I
 *  I - 0 = I
 *  I - N = N
 *  I - I = N
 *
 * Return a new Decimal whose value is the value of this Decimal minus `y`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */
P.minus = P.sub = function (y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd,
    x = this,
    Ctor = x.constructor;

  y = new Ctor(y);

  // If either is not finite...
  if (!x.d || !y.d) {

    // Return NaN if either is NaN.
    if (!x.s || !y.s) y = new Ctor(NaN);

    // Return y negated if x is finite and y is ±Infinity.
    else if (x.d) y.s = -y.s;

    // Return x if y is finite and x is ±Infinity.
    // Return x if both are ±Infinity with different signs.
    // Return NaN if both are ±Infinity with the same sign.
    else y = new Ctor(y.d || x.s !== y.s ? x : NaN);

    return y;
  }

  // If signs differ...
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }

  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;

  // If either is zero...
  if (!xd[0] || !yd[0]) {

    // Return y negated if x is zero and y is non-zero.
    if (yd[0]) y.s = -y.s;

    // Return x if y is zero and x is non-zero.
    else if (xd[0]) y = new Ctor(x);

    // Return zero if both are zero.
    // From IEEE 754 (2008) 6.3: 0 - 0 = -0 - -0 = -0 when rounding to -Infinity.
    else return new Ctor(rm === 3 ? -0 : 0);

    return external ? finalise(y, pr, rm) : y;
  }

  // x and y are finite, non-zero numbers with the same sign.

  // Calculate base 1e7 exponents.
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);

  xd = xd.slice();
  k = xe - e;

  // If base 1e7 exponents differ...
  if (k) {
    xLTy = k < 0;

    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }

    // Numbers with massively different exponents would result in a very high number of
    // zeros needing to be prepended, but this can be avoided while still ensuring correct
    // rounding by limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

    if (k > i) {
      k = i;
      d.length = 1;
    }

    // Prepend zeros to equalise exponents.
    d.reverse();
    for (i = k; i--;) d.push(0);
    d.reverse();

  // Base 1e7 exponents equal.
  } else {

    // Check digits to determine which is the bigger number.

    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy) len = i;

    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }

    k = 0;
  }

  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }

  len = xd.length;

  // Append zeros to `xd` if shorter.
  // Don't add zeros to `yd` if shorter as subtraction only needs to start at `yd` length.
  for (i = yd.length - len; i > 0; --i) xd[len++] = 0;

  // Subtract yd from xd.
  for (i = yd.length; i > k;) {

    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }

    xd[i] -= yd[i];
  }

  // Remove trailing zeros.
  for (; xd[--len] === 0;) xd.pop();

  // Remove leading zeros and adjust exponent accordingly.
  for (; xd[0] === 0; xd.shift()) --e;

  // Zero?
  if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);

  y.d = xd;
  y.e = getBase10Exponent(xd, e);

  return external ? finalise(y, pr, rm) : y;
};


/*
 *   n % 0 =  N
 *   n % N =  N
 *   n % I =  n
 *   0 % n =  0
 *  -0 % n = -0
 *   0 % 0 =  N
 *   0 % N =  N
 *   0 % I =  0
 *   N % n =  N
 *   N % 0 =  N
 *   N % N =  N
 *   N % I =  N
 *   I % n =  N
 *   I % 0 =  N
 *   I % N =  N
 *   I % I =  N
 *
 * Return a new Decimal whose value is the value of this Decimal modulo `y`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * The result depends on the modulo mode.
 *
 */
P.modulo = P.mod = function (y) {
  var q,
    x = this,
    Ctor = x.constructor;

  y = new Ctor(y);

  // Return NaN if x is ±Infinity or NaN, or y is NaN or ±0.
  if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);

  // Return x if y is ±Infinity or x is ±0.
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }

  // Prevent rounding of intermediate calculations.
  external = false;

  if (Ctor.modulo == 9) {

    // Euclidian division: q = sign(y) * floor(x / abs(y))
    // result = x - q * y    where  0 <= result < abs(y)
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }

  q = q.times(y);

  external = true;

  return x.minus(q);
};


/*
 * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
 * i.e. the base e raised to the power the value of this Decimal, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */
P.naturalExponential = P.exp = function () {
  return naturalExponential(this);
};


/*
 * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
 * rounded to `precision` significant digits using rounding mode `rounding`.
 *
 */
P.naturalLogarithm = P.ln = function () {
  return naturalLogarithm(this);
};


/*
 * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
 * -1.
 *
 */
P.negated = P.neg = function () {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};


/*
 *  n + 0 = n
 *  n + N = N
 *  n + I = I
 *  0 + n = n
 *  0 + 0 = 0
 *  0 + N = N
 *  0 + I = I
 *  N + n = N
 *  N + 0 = N
 *  N + N = N
 *  N + I = N
 *  I + n = I
 *  I + 0 = I
 *  I + N = N
 *  I + I = I
 *
 * Return a new Decimal whose value is the value of this Decimal plus `y`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */
P.plus = P.add = function (y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd,
    x = this,
    Ctor = x.constructor;

  y = new Ctor(y);

  // If either is not finite...
  if (!x.d || !y.d) {

    // Return NaN if either is NaN.
    if (!x.s || !y.s) y = new Ctor(NaN);

    // Return x if y is finite and x is ±Infinity.
    // Return x if both are ±Infinity with the same sign.
    // Return NaN if both are ±Infinity with different signs.
    // Return y if x is finite and y is ±Infinity.
    else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);

    return y;
  }

   // If signs differ...
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }

  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;

  // If either is zero...
  if (!xd[0] || !yd[0]) {

    // Return x if y is zero.
    // Return y if y is non-zero.
    if (!yd[0]) y = new Ctor(x);

    return external ? finalise(y, pr, rm) : y;
  }

  // x and y are finite, non-zero numbers with the same sign.

  // Calculate base 1e7 exponents.
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);

  xd = xd.slice();
  i = k - e;

  // If base 1e7 exponents differ...
  if (i) {

    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }

    // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;

    if (i > len) {
      i = len;
      d.length = 1;
    }

    // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
    d.reverse();
    for (; i--;) d.push(0);
    d.reverse();
  }

  len = xd.length;
  i = yd.length;

  // If yd is longer than xd, swap xd and yd so xd points to the longer array.
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }

  // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
  for (carry = 0; i;) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }

  if (carry) {
    xd.unshift(carry);
    ++e;
  }

  // Remove trailing zeros.
  // No need to check for zero, as +x + +y != 0 && -x + -y != 0
  for (len = xd.length; xd[--len] == 0;) xd.pop();

  y.d = xd;
  y.e = getBase10Exponent(xd, e);

  return external ? finalise(y, pr, rm) : y;
};


/*
 * Return the number of significant digits of the value of this Decimal.
 *
 * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
 *
 */
P.precision = P.sd = function (z) {
  var k,
    x = this;

  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k) k = x.e + 1;
  } else {
    k = NaN;
  }

  return k;
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
 * rounding mode `rounding`.
 *
 */
P.round = function () {
  var x = this,
    Ctor = x.constructor;

  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};


/*
 * Return a new Decimal whose value is the sine of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * sin(x) = x - x^3/3! + x^5/5! - ...
 *
 * sin(0)         = 0
 * sin(-0)        = -0
 * sin(Infinity)  = NaN
 * sin(-Infinity) = NaN
 * sin(NaN)       = NaN
 *
 */
P.sine = P.sin = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;

  x = sine(Ctor, toLessThanHalfPi(Ctor, x));

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};


/*
 * Return a new Decimal whose value is the square root of this Decimal, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 *  sqrt(-n) =  N
 *  sqrt(N)  =  N
 *  sqrt(-I) =  N
 *  sqrt(I)  =  I
 *  sqrt(0)  =  0
 *  sqrt(-0) = -0
 *
 */
P.squareRoot = P.sqrt = function () {
  var m, n, sd, r, rep, t,
    x = this,
    d = x.d,
    e = x.e,
    s = x.s,
    Ctor = x.constructor;

  // Negative/NaN/Infinity/zero?
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }

  external = false;

  // Initial estimate.
  s = Math.sqrt(+x);

  // Math.sqrt underflow/overflow?
  // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);

    if ((n.length + e) % 2 == 0) n += '0';
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

    if (s == 1 / 0) {
      n = '5e' + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf('e') + 1) + e;
    }

    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }

  sd = (e = Ctor.precision) + 3;

  // Newton-Raphson iteration.
  for (;;) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);

    // TODO? Replace with for-loop and checkRoundingDigits.
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);

      // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
      // 4999, i.e. approaching a rounding boundary, continue the iteration.
      if (n == '9999' || !rep && n == '4999') {

        // On the first iteration only, check to see if rounding up gives the exact result as the
        // nines may infinitely repeat.
        if (!rep) {
          finalise(t, e + 1, 0);

          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }

        sd += 4;
        rep = 1;
      } else {

        // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
        // If not, then there are further digits and m will be truthy.
        if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

          // Truncate to the first rounding digit.
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }

        break;
      }
    }
  }

  external = true;

  return finalise(r, e, Ctor.rounding, m);
};


/*
 * Return a new Decimal whose value is the tangent of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * tan(0)         = 0
 * tan(-0)        = -0
 * tan(Infinity)  = NaN
 * tan(-Infinity) = NaN
 * tan(NaN)       = NaN
 *
 */
P.tangent = P.tan = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;

  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};


/*
 *  n * 0 = 0
 *  n * N = N
 *  n * I = I
 *  0 * n = 0
 *  0 * 0 = 0
 *  0 * N = N
 *  0 * I = N
 *  N * n = N
 *  N * 0 = N
 *  N * N = N
 *  N * I = N
 *  I * n = I
 *  I * 0 = N
 *  I * N = N
 *  I * I = I
 *
 * Return a new Decimal whose value is this Decimal times `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 */
P.times = P.mul = function (y) {
  var carry, e, i, k, r, rL, t, xdL, ydL,
    x = this,
    Ctor = x.constructor,
    xd = x.d,
    yd = (y = new Ctor(y)).d;

  y.s *= x.s;

   // If either is NaN, ±Infinity or ±0...
  if (!xd || !xd[0] || !yd || !yd[0]) {

    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd

      // Return NaN if either is NaN.
      // Return NaN if x is ±0 and y is ±Infinity, or y is ±0 and x is ±Infinity.
      ? NaN

      // Return ±Infinity if either is ±Infinity.
      // Return ±0 if either is ±0.
      : !xd || !yd ? y.s / 0 : y.s * 0);
  }

  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;

  // Ensure xd points to the longer array.
  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }

  // Initialise the result array with zeros.
  r = [];
  rL = xdL + ydL;
  for (i = rL; i--;) r.push(0);

  // Multiply!
  for (i = ydL; --i >= 0;) {
    carry = 0;
    for (k = xdL + i; k > i;) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }

    r[k] = (r[k] + carry) % BASE | 0;
  }

  // Remove trailing zeros.
  for (; !r[--rL];) r.pop();

  if (carry) ++e;
  else r.shift();

  y.d = r;
  y.e = getBase10Exponent(r, e);

  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};


/*
 * Return a string representing the value of this Decimal in base 2, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toBinary = function (sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
 * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
 *
 * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toDecimalPlaces = P.toDP = function (dp, rm) {
  var x = this,
    Ctor = x.constructor;

  x = new Ctor(x);
  if (dp === void 0) return x;

  checkInt32(dp, 0, MAX_DIGITS);

  if (rm === void 0) rm = Ctor.rounding;
  else checkInt32(rm, 0, 8);

  return finalise(x, dp + x.e + 1, rm);
};


/*
 * Return a string representing the value of this Decimal in exponential notation rounded to
 * `dp` fixed decimal places using rounding mode `rounding`.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toExponential = function (dp, rm) {
  var str,
    x = this,
    Ctor = x.constructor;

  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return a string representing the value of this Decimal in normal (fixed-point) notation to
 * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
 * omitted.
 *
 * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 * (-0).toFixed(3) is '0.000'.
 * (-0.5).toFixed(0) is '-0'.
 *
 */
P.toFixed = function (dp, rm) {
  var str, y,
    x = this,
    Ctor = x.constructor;

  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }

  // To determine whether to add the minus sign look at the value before it was rounded,
  // i.e. look at `x` rather than `y`.
  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return an array representing the value of this Decimal as a simple fraction with an integer
 * numerator and an integer denominator.
 *
 * The denominator will be a positive non-zero value less than or equal to the specified maximum
 * denominator. If a maximum denominator is not specified, the denominator will be the lowest
 * value necessary to represent the number exactly.
 *
 * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
 *
 */
P.toFraction = function (maxD) {
  var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r,
    x = this,
    xd = x.d,
    Ctor = x.constructor;

  if (!xd) return new Ctor(x);

  n1 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);

  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);

  if (maxD == null) {

    // d is 10**e, the minimum max-denominator needed.
    maxD = e > 0 ? d : n1;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
    maxD = n.gt(d) ? (e > 0 ? d : n1) : n;
  }

  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;

  for (;;)  {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1) break;
    d0 = d1;
    d1 = d2;
    d2 = n1;
    n1 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }

  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n1));
  d0 = d0.plus(d2.times(d1));
  n0.s = n1.s = x.s;

  // Determine which fraction is closer to x, n0/d0 or n1/d1?
  r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1
      ? [n1, d1] : [n0, d0];

  Ctor.precision = pr;
  external = true;

  return r;
};


/*
 * Return a string representing the value of this Decimal in base 16, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toHexadecimal = P.toHex = function (sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};


/*
 * Returns a new Decimal whose value is the nearest multiple of `y` in the direction of rounding
 * mode `rm`, or `Decimal.rounding` if `rm` is omitted, to the value of this Decimal.
 *
 * The return value will always have the same sign as this Decimal, unless either this Decimal
 * or `y` is NaN, in which case the return value will be also be NaN.
 *
 * The return value is not affected by the value of `precision`.
 *
 * y {number|string|Decimal} The magnitude to round to a multiple of.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * 'toNearest() rounding mode not an integer: {rm}'
 * 'toNearest() rounding mode out of range: {rm}'
 *
 */
P.toNearest = function (y, rm) {
  var x = this,
    Ctor = x.constructor;

  x = new Ctor(x);

  if (y == null) {

    // If x is not finite, return x.
    if (!x.d) return x;

    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }

    // If x is not finite, return x if y is not NaN, else NaN.
    if (!x.d) return y.s ? x : y;

    // If y is not finite, return Infinity with the sign of x if y is Infinity, else NaN.
    if (!y.d) {
      if (y.s) y.s = x.s;
      return y;
    }
  }

  // If y is not zero, calculate the nearest multiple of y to x.
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);

  // If y is zero, return zero with the sign of x.
  } else {
    y.s = x.s;
    x = y;
  }

  return x;
};


/*
 * Return the value of this Decimal converted to a number primitive.
 * Zero keeps its sign.
 *
 */
P.toNumber = function () {
  return +this;
};


/*
 * Return a string representing the value of this Decimal in base 8, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toOctal = function (sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};


/*
 * Return a new Decimal whose value is the value of this Decimal raised to the power `y`, rounded
 * to `precision` significant digits using rounding mode `rounding`.
 *
 * ECMAScript compliant.
 *
 *   pow(x, NaN)                           = NaN
 *   pow(x, ±0)                            = 1

 *   pow(NaN, non-zero)                    = NaN
 *   pow(abs(x) > 1, +Infinity)            = +Infinity
 *   pow(abs(x) > 1, -Infinity)            = +0
 *   pow(abs(x) == 1, ±Infinity)           = NaN
 *   pow(abs(x) < 1, +Infinity)            = +0
 *   pow(abs(x) < 1, -Infinity)            = +Infinity
 *   pow(+Infinity, y > 0)                 = +Infinity
 *   pow(+Infinity, y < 0)                 = +0
 *   pow(-Infinity, odd integer > 0)       = -Infinity
 *   pow(-Infinity, even integer > 0)      = +Infinity
 *   pow(-Infinity, odd integer < 0)       = -0
 *   pow(-Infinity, even integer < 0)      = +0
 *   pow(+0, y > 0)                        = +0
 *   pow(+0, y < 0)                        = +Infinity
 *   pow(-0, odd integer > 0)              = -0
 *   pow(-0, even integer > 0)             = +0
 *   pow(-0, odd integer < 0)              = -Infinity
 *   pow(-0, even integer < 0)             = +Infinity
 *   pow(finite x < 0, finite non-integer) = NaN
 *
 * For non-integer or very large exponents pow(x, y) is calculated using
 *
 *   x^y = exp(y*ln(x))
 *
 * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
 * probability of an incorrectly rounded result
 * P([49]9{14} | [50]0{14}) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
 * i.e. 1 in 250,000,000,000,000
 *
 * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
 *
 * y {number|string|Decimal} The power to which to raise this Decimal.
 *
 */
P.toPower = P.pow = function (y) {
  var e, k, pr, r, rm, s,
    x = this,
    Ctor = x.constructor,
    yn = +(y = new Ctor(y));

  // Either ±Infinity, NaN or ±0?
  if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));

  x = new Ctor(x);

  if (x.eq(1)) return x;

  pr = Ctor.precision;
  rm = Ctor.rounding;

  if (y.eq(1)) return finalise(x, pr, rm);

  // y exponent
  e = mathfloor(y.e / LOG_BASE);

  // If y is a small integer use the 'exponentiation by squaring' algorithm.
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }

  s = x.s;

  // if x is negative
  if (s < 0) {

    // if y is not an integer
    if (e < y.d.length - 1) return new Ctor(NaN);

    // Result is positive if x is negative and the last digit of integer y is even.
    if ((y.d[e] & 1) == 0) s = 1;

    // if x.eq(-1)
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }

  // Estimate result exponent.
  // x^y = 10^e,  where e = y * log10(x)
  // log10(x) = log10(x_significand) + x_exponent
  // log10(x_significand) = ln(x_significand) / ln(10)
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k)
    ? mathfloor(yn * (Math.log('0.' + digitsToString(x.d)) / Math.LN10 + x.e + 1))
    : new Ctor(k + '').e;

  // Exponent estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e: -1.

  // Overflow/underflow?
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);

  external = false;
  Ctor.rounding = x.s = 1;

  // Estimate the extra guard digits needed to ensure five correct rounding digits from
  // naturalLogarithm(x). Example of failure without these extra digits (precision: 10):
  // new Decimal(2.32456).pow('2087987436534566.46411')
  // should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815
  k = Math.min(12, (e + '').length);

  // r = x^y = exp(y*ln(x))
  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);

  // r may be Infinity, e.g. (0.9999999999999999).pow(-1e+40)
  if (r.d) {

    // Truncate to the required precision plus five rounding digits.
    r = finalise(r, pr + 5, 1);

    // If the rounding digits are [49]9999 or [50]0000 increase the precision by 10 and recalculate
    // the result.
    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10;

      // Truncate to the increased precision plus five rounding digits.
      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);

      // Check for 14 nines from the 2nd rounding digit (the first rounding digit may be 4 or 9).
      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }

  r.s = s;
  external = true;
  Ctor.rounding = rm;

  return finalise(r, pr, rm);
};


/*
 * Return a string representing the value of this Decimal rounded to `sd` significant digits
 * using rounding mode `rounding`.
 *
 * Return exponential notation if `sd` is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toPrecision = function (sd, rm) {
  var str,
    x = this,
    Ctor = x.constructor;

  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
 * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
 * omitted.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * 'toSD() digits out of range: {sd}'
 * 'toSD() digits not an integer: {sd}'
 * 'toSD() rounding mode not an integer: {rm}'
 * 'toSD() rounding mode out of range: {rm}'
 *
 */
P.toSignificantDigits = P.toSD = function (sd, rm) {
  var x = this,
    Ctor = x.constructor;

  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  }

  return finalise(new Ctor(x), sd, rm);
};


/*
 * Return a string representing the value of this Decimal.
 *
 * Return exponential notation if this Decimal has a positive exponent equal to or greater than
 * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
 *
 */
P.toString = function () {
  var x = this,
    Ctor = x.constructor,
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
 *
 */
P.truncated = P.trunc = function () {
  return finalise(new this.constructor(this), this.e + 1, 1);
};


/*
 * Return a string representing the value of this Decimal.
 * Unlike `toString`, negative zero will include the minus sign.
 *
 */
P.valueOf = P.toJSON = function () {
  var x = this,
    Ctor = x.constructor,
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

  return x.isNeg() ? '-' + str : str;
};


// Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


/*
 *  digitsToString           P.cubeRoot, P.logarithm, P.squareRoot, P.toFraction, P.toPower,
 *                           finiteToString, naturalExponential, naturalLogarithm
 *  checkInt32               P.toDecimalPlaces, P.toExponential, P.toFixed, P.toNearest,
 *                           P.toPrecision, P.toSignificantDigits, toStringBinary, random
 *  checkRoundingDigits      P.logarithm, P.toPower, naturalExponential, naturalLogarithm
 *  convertBase              toStringBinary, parseOther
 *  cos                      P.cos
 *  divide                   P.atanh, P.cubeRoot, P.dividedBy, P.dividedToIntegerBy,
 *                           P.logarithm, P.modulo, P.squareRoot, P.tan, P.tanh, P.toFraction,
 *                           P.toNearest, toStringBinary, naturalExponential, naturalLogarithm,
 *                           taylorSeries, atan2, parseOther
 *  finalise                 P.absoluteValue, P.atan, P.atanh, P.ceil, P.cos, P.cosh,
 *                           P.cubeRoot, P.dividedToIntegerBy, P.floor, P.logarithm, P.minus,
 *                           P.modulo, P.negated, P.plus, P.round, P.sin, P.sinh, P.squareRoot,
 *                           P.tan, P.times, P.toDecimalPlaces, P.toExponential, P.toFixed,
 *                           P.toNearest, P.toPower, P.toPrecision, P.toSignificantDigits,
 *                           P.truncated, divide, getLn10, getPi, naturalExponential,
 *                           naturalLogarithm, ceil, floor, round, trunc
 *  finiteToString           P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf,
 *                           toStringBinary
 *  getBase10Exponent        P.minus, P.plus, P.times, parseOther
 *  getLn10                  P.logarithm, naturalLogarithm
 *  getPi                    P.acos, P.asin, P.atan, toLessThanHalfPi, atan2
 *  getPrecision             P.precision, P.toFraction
 *  getZeroString            digitsToString, finiteToString
 *  intPow                   P.toPower, parseOther
 *  isOdd                    toLessThanHalfPi
 *  maxOrMin                 max, min
 *  naturalExponential       P.naturalExponential, P.toPower
 *  naturalLogarithm         P.acosh, P.asinh, P.atanh, P.logarithm, P.naturalLogarithm,
 *                           P.toPower, naturalExponential
 *  nonFiniteToString        finiteToString, toStringBinary
 *  parseDecimal             Decimal
 *  parseOther               Decimal
 *  sin                      P.sin
 *  taylorSeries             P.cosh, P.sinh, cos, sin
 *  toLessThanHalfPi         P.cos, P.sin
 *  toStringBinary           P.toBinary, P.toHexadecimal, P.toOctal
 *  truncate                 intPow
 *
 *  Throws:                  P.logarithm, P.precision, P.toFraction, checkInt32, getLn10, getPi,
 *                           naturalLogarithm, config, parseOther, random, Decimal
 */


function digitsToString(d) {
  var i, k, ws,
    indexOfLastWord = d.length - 1,
    str = '',
    w = d[0];

  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
      str += ws;
    }

    w = d[i];
    ws = w + '';
    k = LOG_BASE - ws.length;
    if (k) str += getZeroString(k);
  } else if (w === 0) {
    return '0';
  }

  // Remove trailing zeros of last w.
  for (; w % 10 === 0;) w /= 10;

  return str + w;
}


function checkInt32(i, min, max) {
  if (i !== ~~i || i < min || i > max) {
    throw Error(invalidArgument + i);
  }
}


/*
 * Check 5 rounding digits if `repeating` is null, 4 otherwise.
 * `repeating == null` if caller is `log` or `pow`,
 * `repeating != null` if caller is `naturalLogarithm` or `naturalExponential`.
 */
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd;

  // Get the length of the first word of the array d.
  for (k = d[0]; k >= 10; k /= 10) --i;

  // Is the rounding digit in the first word of d?
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }

  // i is the index (0 - 6) of the rounding digit.
  // E.g. if within the word 3487563 the first rounding digit is 5,
  // then i = 4, k = 1000, rd = 3487563 % 1000 = 563
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;

  if (repeating == null) {
    if (i < 3) {
      if (i == 0) rd = rd / 100 | 0;
      else if (i == 1) rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) &&
        (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 ||
          (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0) rd = rd / 1000 | 0;
      else if (i == 1) rd = rd / 100 | 0;
      else if (i == 2) rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k ||
      (!repeating && rm > 3) && rd + 1 == k / 2) &&
        (d[di + 1] / k / 1000 | 0) == mathpow(10, i - 3) - 1;
    }
  }

  return r;
}


// Convert string of `baseIn` to an array of numbers of `baseOut`.
// Eg. convertBase('255', 10, 16) returns [15, 15].
// Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
function convertBase(str, baseIn, baseOut) {
  var j,
    arr = [0],
    arrL,
    i = 0,
    strL = str.length;

  for (; i < strL;) {
    for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0) arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }

  return arr.reverse();
}


/*
 * cos(x) = 1 - x^2/2! + x^4/4! - ...
 * |x| < pi/2
 *
 */
function cosine(Ctor, x) {
  var k, len, y;

  if (x.isZero()) return x;

  // Argument reduction: cos(4x) = 8*(cos^4(x) - cos^2(x)) + 1
  // i.e. cos(x) = 8*(cos^4(x/4) - cos^2(x/4)) + 1

  // Estimate the optimum number of times to use the argument reduction.
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = '2.3283064365386962890625e-10';
  }

  Ctor.precision += k;

  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));

  // Reverse argument reduction
  for (var i = k; i--;) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }

  Ctor.precision -= k;

  return x;
}


/*
 * Perform division in the specified base.
 */
var divide = (function () {

  // Assumes non-zero x and k, and hence non-zero result.
  function multiplyInteger(x, k, base) {
    var temp,
      carry = 0,
      i = x.length;

    for (x = x.slice(); i--;) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }

    if (carry) x.unshift(carry);

    return x;
  }

  function compare(a, b, aL, bL) {
    var i, r;

    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }

    return r;
  }

  function subtract(a, b, aL, base) {
    var i = 0;

    // Subtract b from a.
    for (; aL--;) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }

    // Remove leading zeros.
    for (; !a[0] && a.length > 1;) a.shift();
  }

  return function (x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0,
      yL, yz,
      Ctor = x.constructor,
      sign = x.s == y.s ? 1 : -1,
      xd = x.d,
      yd = y.d;

    // Either NaN, Infinity or 0?
    if (!xd || !xd[0] || !yd || !yd[0]) {

      return new Ctor(// Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN :

        // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
        xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
    }

    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }

    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign);
    qd = q.d = [];

    // Result exponent may be one less than e.
    // The digit array of a Decimal from toStringBinary may have trailing zeros.
    for (i = 0; yd[i] == (xd[i] || 0); i++);

    if (yd[i] > (xd[i] || 0)) e--;

    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }

    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {

      // Convert precision in number of base 10 digits to base 1e7 digits.
      sd = sd / logBase + 2 | 0;
      i = 0;

      // divisor < 1e7
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;

        // k is the carry.
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }

        more = k || i < xL;

      // divisor >= 1e7
      } else {

        // Normalise xd and yd so highest order digit of yd is >= base/2
        k = base / (yd[0] + 1) | 0;

        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }

        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL;) rem[remL++] = 0;

        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];

        if (yd[1] >= base / 2) ++yd0;

        do {
          k = 0;

          // Compare divisor and remainder.
          cmp = compare(yd, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {

            // Calculate trial digit, k.
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

            // k will be how many times the divisor goes into the current remainder.
            k = rem0 / yd0 | 0;

            //  Algorithm:
            //  1. product = divisor * trial digit (k)
            //  2. if product > remainder: product -= divisor, k--
            //  3. remainder -= product
            //  4. if product was < remainder at 2:
            //    5. compare new remainder and divisor
            //    6. If remainder > divisor: remainder -= divisor, k++

            if (k > 1) {
              if (k >= base) k = base - 1;

              // product = divisor * trial digit.
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              cmp = compare(prod, rem, prodL, remL);

              // product > remainder.
              if (cmp == 1) {
                k--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {

              // cmp is -1.
              // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
              // to avoid it. If k is 1 there is a need to compare yd and rem again below.
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }

            prodL = prod.length;
            if (prodL < remL) prod.unshift(0);

            // Subtract product from remainder.
            subtract(rem, prod, remL, base);

            // If product was < previous remainder.
            if (cmp == -1) {
              remL = rem.length;

              // Compare divisor and new remainder.
              cmp = compare(yd, rem, yL, remL);

              // If divisor < new remainder, subtract divisor from remainder.
              if (cmp < 1) {
                k++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yd, remL, base);
              }
            }

            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }    // if cmp === 1, k will be 0

          // Add the next digit, k, to the result array.
          qd[i++] = k;

          // Update the remainder.
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }

        } while ((xi++ < xL || rem[0] !== void 0) && sd--);

        more = rem[0] !== void 0;
      }

      // Leading zero?
      if (!qd[0]) qd.shift();
    }

    // logBase is 1 when divide is being used for base conversion.
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {

      // To calculate q.e, first get the number of digits of qd[0].
      for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
      q.e = i + e * logBase - 1;

      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }

    return q;
  };
})();


/*
 * Round `x` to `sd` significant digits using rounding mode `rm`.
 * Check for over/under-flow.
 */
 function finalise(x, sd, rm, isTruncated) {
  var digits, i, j, k, rd, roundUp, w, xd, xdi,
    Ctor = x.constructor;

  // Don't round if sd is null or undefined.
  out: if (sd != null) {
    xd = x.d;

    // Infinity/NaN.
    if (!xd) return x;

    // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
    // w: the word of xd containing rd, a base 1e7 number.
    // xdi: the index of w within xd.
    // digits: the number of digits of w.
    // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
    // they had leading zeros)
    // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

    // Get the length of the first word of the digits array xd.
    for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
    i = sd - digits;

    // Is the rounding digit in the first word of xd?
    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0];

      // Get the rounding digit at index j of w.
      rd = w / mathpow(10, digits - j - 1) % 10 | 0;
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;
      if (xdi >= k) {
        if (isTruncated) {

          // Needed by `naturalExponential`, `naturalLogarithm` and `squareRoot`.
          for (; k++ <= xdi;) xd.push(0);
          w = rd = 0;
          digits = 1;
          i %= LOG_BASE;
          j = i - LOG_BASE + 1;
        } else {
          break out;
        }
      } else {
        w = k = xd[xdi];

        // Get the number of digits of w.
        for (digits = 1; k >= 10; k /= 10) digits++;

        // Get the index of rd within w.
        i %= LOG_BASE;

        // Get the index of rd within w, adjusted for leading zeros.
        // The number of leading zeros of w is given by LOG_BASE - digits.
        j = i - LOG_BASE + digits;

        // Get the rounding digit at index j of w.
        rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
      }
    }

    // Are there any non-zero digits after the rounding digit?
    isTruncated = isTruncated || sd < 0 ||
      xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));

    // The expression `w % mathpow(10, digits - j - 1)` returns all the digits of w to the right
    // of the digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression
    // will give 714.

    roundUp = rm < 4
      ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
      : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 &&

        // Check whether the digit to the left of the rounding digit is odd.
        ((i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10) & 1 ||
          rm == (x.s < 0 ? 8 : 7));

    if (sd < 1 || !xd[0]) {
      xd.length = 0;
      if (roundUp) {

        // Convert sd to decimal places.
        sd -= x.e + 1;

        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = -sd || 0;
      } else {

        // Zero.
        xd[0] = x.e = 0;
      }

      return x;
    }

    // Remove excess digits.
    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i);

      // E.g. 56700 becomes 56000 if 7 is the rounding digit.
      // j > 0 means i > number of leading zeros of w.
      xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
    }

    if (roundUp) {
      for (;;) {

        // Is the digit to be rounded up in the first word of xd?
        if (xdi == 0) {

          // i will be the length of xd[0] before k is added.
          for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
          j = xd[0] += k;
          for (k = 1; j >= 10; j /= 10) k++;

          // if i != k the length has increased.
          if (i != k) {
            x.e++;
            if (xd[0] == BASE) xd[0] = 1;
          }

          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    }

    // Remove trailing zeros.
    for (i = xd.length; xd[--i] === 0;) xd.pop();
  }

  if (external) {

    // Overflow?
    if (x.e > Ctor.maxE) {

      // Infinity.
      x.d = null;
      x.e = NaN;

    // Underflow?
    } else if (x.e < Ctor.minE) {

      // Zero.
      x.e = 0;
      x.d = [0];
      // Ctor.underflow = true;
    } // else Ctor.underflow = false;
  }

  return x;
}


function finiteToString(x, isExp, sd) {
  if (!x.isFinite()) return nonFiniteToString(x);
  var k,
    e = x.e,
    str = digitsToString(x.d),
    len = str.length;

  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + '.' + str.slice(1);
    }

    str = str + (x.e < 0 ? 'e' : 'e+') + x.e;
  } else if (e < 0) {
    str = '0.' + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0) str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
  } else {
    if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len) str += '.';
      str += getZeroString(k);
    }
  }

  return str;
}


// Calculate the base 10 exponent from the base 1e7 exponent.
function getBase10Exponent(digits, e) {
  var w = digits[0];

  // Add the number of digits of the first word of the digits array.
  for ( e *= LOG_BASE; w >= 10; w /= 10) e++;
  return e;
}


function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {

    // Reset global state in case the exception is caught.
    external = true;
    if (pr) Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}


function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}


function getPrecision(digits) {
  var w = digits.length - 1,
    len = w * LOG_BASE + 1;

  w = digits[w];

  // If non-zero...
  if (w) {

    // Subtract the number of trailing zeros of the last word.
    for (; w % 10 == 0; w /= 10) len--;

    // Add the number of digits of the first word.
    for (w = digits[0]; w >= 10; w /= 10) len++;
  }

  return len;
}


function getZeroString(k) {
  var zs = '';
  for (; k--;) zs += '0';
  return zs;
}


/*
 * Return a new Decimal whose value is the value of Decimal `x` to the power `n`, where `n` is an
 * integer of type number.
 *
 * Implements 'exponentiation by squaring'. Called by `pow` and `parseOther`.
 *
 */
function intPow(Ctor, x, n, pr) {
  var isTruncated,
    r = new Ctor(1),

    // Max n of 9007199254740991 takes 53 loop iterations.
    // Maximum digits array length; leaves [28, 34] guard digits.
    k = Math.ceil(pr / LOG_BASE + 4);

  external = false;

  for (;;) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k)) isTruncated = true;
    }

    n = mathfloor(n / 2);
    if (n === 0) {

      // To ensure correct rounding when r.d is truncated, increment the last word if it is zero.
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0) ++r.d[n];
      break;
    }

    x = x.times(x);
    truncate(x.d, k);
  }

  external = true;

  return r;
}


function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}


/*
 * Handle `max` and `min`. `ltgt` is 'lt' or 'gt'.
 */
function maxOrMin(Ctor, args, ltgt) {
  var y,
    x = new Ctor(args[0]),
    i = 0;

  for (; ++i < args.length;) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    } else if (x[ltgt](y)) {
      x = y;
    }
  }

  return x;
}


/*
 * Return a new Decimal whose value is the natural exponential of `x` rounded to `sd` significant
 * digits.
 *
 * Taylor/Maclaurin series.
 *
 * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
 *
 * Argument reduction:
 *   Repeat x = x / 32, k += 5, until |x| < 0.1
 *   exp(x) = exp(x / 2^k)^(2^k)
 *
 * Previously, the argument was initially reduced by
 * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
 * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
 * found to be slower than just dividing repeatedly by 32 as above.
 *
 * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
 * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
 * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
 *
 *  exp(Infinity)  = Infinity
 *  exp(-Infinity) = 0
 *  exp(NaN)       = NaN
 *  exp(±0)        = 1
 *
 *  exp(x) is non-terminating for any finite, non-zero x.
 *
 *  The result will always be correctly rounded.
 *
 */
function naturalExponential(x, sd) {
  var denominator, guard, j, pow, sum, t, wpr,
    rep = 0,
    i = 0,
    k = 0,
    Ctor = x.constructor,
    rm = Ctor.rounding,
    pr = Ctor.precision;

  // 0/NaN/Infinity?
  if (!x.d || !x.d[0] || x.e > 17) {

    return new Ctor(x.d
      ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0
      : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }

  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }

  t = new Ctor(0.03125);

  // while abs(x) >= 0.1
  while (x.e > -2) {

    // x = x / 2^5
    x = x.times(t);
    k += 5;
  }

  // Use 2 * log10(2^k) + 5 (empirically derived) to estimate the increase in precision
  // necessary to ensure the first 4 rounding digits are correct.
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow = sum = new Ctor(1);
  Ctor.precision = wpr;

  for (;;) {
    pow = finalise(pow.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum.plus(divide(pow, denominator, wpr, 1));

    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      j = k;
      while (j--) sum = finalise(sum.times(sum), wpr, 1);

      // Check to see if the first 4 rounding digits are [49]999.
      // If so, repeat the summation with a higher precision, otherwise
      // e.g. with precision: 18, rounding: 1
      // exp(18.404272462595034083567793919843761) = 98372560.1229999999 (should be 98372560.123)
      // `wpr - guard` is the index of first rounding digit.
      if (sd == null) {

        if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }

    sum = t;
  }
}


/*
 * Return a new Decimal whose value is the natural logarithm of `x` rounded to `sd` significant
 * digits.
 *
 *  ln(-n)        = NaN
 *  ln(0)         = -Infinity
 *  ln(-0)        = -Infinity
 *  ln(1)         = 0
 *  ln(Infinity)  = Infinity
 *  ln(-Infinity) = NaN
 *  ln(NaN)       = NaN
 *
 *  ln(n) (n != 1) is non-terminating.
 *
 */
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2,
    n = 1,
    guard = 10,
    x = y,
    xd = x.d,
    Ctor = x.constructor,
    rm = Ctor.rounding,
    pr = Ctor.precision;

  // Is x negative or Infinity, NaN, 0 or 1?
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }

  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }

  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);

  if (Math.abs(e = x.e) < 1.5e15) {

    // Argument reduction.
    // The series converges faster the closer the argument is to 1, so using
    // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
    // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
    // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
    // later be divided by this number, then separate out the power of 10 using
    // ln(a*10^b) = ln(a) + b*ln(10).

    // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
    //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
    // max n is 6 (gives 0.7 - 1.3)
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }

    e = x.e;

    if (c0 > 1) {
      x = new Ctor('0.' + c);
      e++;
    } else {
      x = new Ctor(c0 + '.' + c.slice(1));
    }
  } else {

    // The argument reduction method above may result in overflow if the argument y is a massive
    // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
    // function using ln(x*10^e) = ln(x) + e*ln(10).
    t = getLn10(Ctor, wpr + 2, pr).times(e + '');
    x = naturalLogarithm(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;

    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }

  // x1 is x reduced to a value near 1.
  x1 = x;

  // Taylor series.
  // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
  // where x = (y - 1)/(y + 1)    (|x| < 1)
  sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;

  for (;;) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));

    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      sum = sum.times(2);

      // Reverse the argument reduction. Check that e is not 0 because, besides preventing an
      // unnecessary calculation, -0 + 0 = +0 and to ensure correct rounding -0 needs to stay -0.
      if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
      sum = divide(sum, new Ctor(n), wpr, 1);

      // Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
      // been repeated previously) and the first 4 rounding digits 9999?
      // If so, restart the summation with a higher precision, otherwise
      // e.g. with precision: 12, rounding: 1
      // ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.
      // `wpr - guard` is the index of first rounding digit.
      if (sd == null) {
        if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }

    sum = t;
    denominator += 2;
  }
}


// ±Infinity, NaN.
function nonFiniteToString(x) {
  // Unsigned.
  return String(x.s * x.s / 0);
}


/*
 * Parse the value of a new Decimal `x` from string `str`.
 */
function parseDecimal(x, str) {
  var e, i, len;

  // Decimal point?
  if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

  // Exponential form?
  if ((i = str.search(/e/i)) > 0) {

    // Determine exponent.
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {

    // Integer.
    e = str.length;
  }

  // Determine leading zeros.
  for (i = 0; str.charCodeAt(i) === 48; i++);

  // Determine trailing zeros.
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
  str = str.slice(i, len);

  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];

    // Transform base

    // e is the base 10 exponent.
    // i is where to slice str to get the first word of the digits array.
    i = (e + 1) % LOG_BASE;
    if (e < 0) i += LOG_BASE;

    if (i < len) {
      if (i) x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }

    for (; i--;) str += '0';
    x.d.push(+str);

    if (external) {

      // Overflow?
      if (x.e > x.constructor.maxE) {

        // Infinity.
        x.d = null;
        x.e = NaN;

      // Underflow?
      } else if (x.e < x.constructor.minE) {

        // Zero.
        x.e = 0;
        x.d = [0];
        // x.constructor.underflow = true;
      } // else x.constructor.underflow = false;
    }
  } else {

    // Zero.
    x.e = 0;
    x.d = [0];
  }

  return x;
}


/*
 * Parse the value of a new Decimal `x` from a string `str`, which is not a decimal value.
 */
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;

  if (str.indexOf('_') > -1) {
    str = str.replace(/(\d)_(?=\d)/g, '$1');
    if (isDecimal.test(str)) return parseDecimal(x, str);
  } else if (str === 'Infinity' || str === 'NaN') {
    if (!+str) x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }

  if (isHex.test(str))  {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str))  {
    base = 2;
  } else if (isOctal.test(str))  {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }

  // Is there a binary exponent part?
  i = str.search(/p/i);

  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }

  // Convert `str` as an integer then divide the result by `base` raised to a power such that the
  // fraction part will be restored.
  i = str.indexOf('.');
  isFloat = i >= 0;
  Ctor = x.constructor;

  if (isFloat) {
    str = str.replace('.', '');
    len = str.length;
    i = len - i;

    // log[10](16) = 1.2041... , log[10](88) = 1.9444....
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }

  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;

  // Remove trailing zeros.
  for (i = xe; xd[i] === 0; --i) xd.pop();
  if (i < 0) return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;

  // At what precision to perform the division to ensure exact conversion?
  // maxDecimalIntegerPartDigitCount = ceil(log[10](b) * otherBaseIntegerPartDigitCount)
  // log[10](2) = 0.30103, log[10](8) = 0.90309, log[10](16) = 1.20412
  // E.g. ceil(1.2 * 3) = 4, so up to 4 decimal digits are needed to represent 3 hex int digits.
  // maxDecimalFractionPartDigitCount = {Hex:4|Oct:3|Bin:1} * otherBaseFractionPartDigitCount
  // Therefore using 4 * the number of digits of str will always be enough.
  if (isFloat) x = divide(x, divisor, len * 4);

  // Multiply by the binary exponent part if present.
  if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;

  return x;
}


/*
 * sin(x) = x - x^3/3! + x^5/5! - ...
 * |x| < pi/2
 *
 */
function sine(Ctor, x) {
  var k,
    len = x.d.length;

  if (len < 3) {
    return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
  }

  // Argument reduction: sin(5x) = 16*sin^5(x) - 20*sin^3(x) + 5*sin(x)
  // i.e. sin(x) = 16*sin^5(x/5) - 20*sin^3(x/5) + 5*sin(x/5)
  // and  sin(x) = sin(x/5)(5 + sin^2(x/5)(16sin^2(x/5) - 20))

  // Estimate the optimum number of times to use the argument reduction.
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;

  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x);

  // Reverse argument reduction
  var sin2_x,
    d5 = new Ctor(5),
    d16 = new Ctor(16),
    d20 = new Ctor(20);
  for (; k--;) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }

  return x;
}


// Calculate Taylor series for `cos`, `cosh`, `sin` and `sinh`.
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2,
    pr = Ctor.precision,
    k = Math.ceil(pr / LOG_BASE);

  external = false;
  x2 = x.times(x);
  u = new Ctor(y);

  for (;;) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);

    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--;);
      if (j == -1) break;
    }

    j = u;
    u = y;
    y = t;
    t = j;
  }

  external = true;
  t.d.length = k + 1;

  return t;
}


// Exponent e must be positive and non-zero.
function tinyPow(b, e) {
  var n = b;
  while (--e) n *= b;
  return n;
}


// Return the absolute value of `x` reduced to less than or equal to half pi.
function toLessThanHalfPi(Ctor, x) {
  var t,
    isNeg = x.s < 0,
    pi = getPi(Ctor, Ctor.precision, 1),
    halfPi = pi.times(0.5);

  x = x.abs();

  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }

  t = x.divToInt(pi);

  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));

    // 0 <= x < pi
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? (isNeg ? 2 : 3) : (isNeg ? 4 : 1);
      return x;
    }

    quadrant = isOdd(t) ? (isNeg ? 1 : 4) : (isNeg ? 3 : 2);
  }

  return x.minus(pi).abs();
}


/*
 * Return the value of Decimal `x` as a string in base `baseOut`.
 *
 * If the optional `sd` argument is present include a binary exponent suffix.
 */
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y,
    Ctor = x.constructor,
    isExp = sd !== void 0;

  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }

  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf('.');

    // Use exponential notation according to `toExpPos` and `toExpNeg`? No, but if required:
    // maxBinaryExponent = floor((decimalExponent + 1) * log[2](10))
    // minBinaryExponent = floor(decimalExponent * log[2](10))
    // log[2](10) = 3.321928094887362347870319429489390175864

    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }

    // Convert the number as an integer then divide the result by its base raised to a power such
    // that the fraction part will be restored.

    // Non-integer.
    if (i >= 0) {
      str = str.replace('.', '');
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }

    xd = convertBase(str, 10, base);
    e = len = xd.length;

    // Remove trailing zeros.
    for (; xd[--len] == 0;) xd.pop();

    if (!xd[0]) {
      str = isExp ? '0p+0' : '0';
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }

      // The rounding digit, i.e. the digit after the digit that may be rounded up.
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;

      roundUp = rm < 4
        ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2))
        : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 ||
          rm === (x.s < 0 ? 8 : 7));

      xd.length = sd;

      if (roundUp) {

        // Rounding up may mean the previous digit has to be rounded up and so on.
        for (; ++xd[--sd] > base - 1;) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }

      // Determine trailing zeros.
      for (len = xd.length; !xd[len - 1]; --len);

      // E.g. [4, 11, 15] becomes 4bf.
      for (i = 0, str = ''; i < len; i++) str += NUMERALS.charAt(xd[i]);

      // Add binary exponent suffix?
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++) str += '0';
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len);

            // xd[0] will always be be 1
            for (i = 1, str = '1.'; i < len; i++) str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + '.' + str.slice(1);
          }
        }

        str =  str + (e < 0 ? 'p' : 'p+') + e;
      } else if (e < 0) {
        for (; ++e;) str = '0' + str;
        str = '0.' + str;
      } else {
        if (++e > len) for (e -= len; e-- ;) str += '0';
        else if (e < len) str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    str = (baseOut == 16 ? '0x' : baseOut == 2 ? '0b' : baseOut == 8 ? '0o' : '') + str;
  }

  return x.s < 0 ? '-' + str : str;
}


// Does not strip trailing zeros.
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}


// Decimal methods


/*
 *  abs
 *  acos
 *  acosh
 *  add
 *  asin
 *  asinh
 *  atan
 *  atanh
 *  atan2
 *  cbrt
 *  ceil
 *  clamp
 *  clone
 *  config
 *  cos
 *  cosh
 *  div
 *  exp
 *  floor
 *  hypot
 *  ln
 *  log
 *  log2
 *  log10
 *  max
 *  min
 *  mod
 *  mul
 *  pow
 *  random
 *  round
 *  set
 *  sign
 *  sin
 *  sinh
 *  sqrt
 *  sub
 *  sum
 *  tan
 *  tanh
 *  trunc
 */


/*
 * Return a new Decimal whose value is the absolute value of `x`.
 *
 * x {number|string|Decimal}
 *
 */
function abs(x) {
  return new this(x).abs();
}


/*
 * Return a new Decimal whose value is the arccosine in radians of `x`.
 *
 * x {number|string|Decimal}
 *
 */
function acos(x) {
  return new this(x).acos();
}


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic cosine of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function acosh(x) {
  return new this(x).acosh();
}


/*
 * Return a new Decimal whose value is the sum of `x` and `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function add(x, y) {
  return new this(x).plus(y);
}


/*
 * Return a new Decimal whose value is the arcsine in radians of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function asin(x) {
  return new this(x).asin();
}


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic sine of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function asinh(x) {
  return new this(x).asinh();
}


/*
 * Return a new Decimal whose value is the arctangent in radians of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function atan(x) {
  return new this(x).atan();
}


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic tangent of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function atanh(x) {
  return new this(x).atanh();
}


/*
 * Return a new Decimal whose value is the arctangent in radians of `y/x` in the range -pi to pi
 * (inclusive), rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi, pi]
 *
 * y {number|string|Decimal} The y-coordinate.
 * x {number|string|Decimal} The x-coordinate.
 *
 * atan2(±0, -0)               = ±pi
 * atan2(±0, +0)               = ±0
 * atan2(±0, -x)               = ±pi for x > 0
 * atan2(±0, x)                = ±0 for x > 0
 * atan2(-y, ±0)               = -pi/2 for y > 0
 * atan2(y, ±0)                = pi/2 for y > 0
 * atan2(±y, -Infinity)        = ±pi for finite y > 0
 * atan2(±y, +Infinity)        = ±0 for finite y > 0
 * atan2(±Infinity, x)         = ±pi/2 for finite x
 * atan2(±Infinity, -Infinity) = ±3*pi/4
 * atan2(±Infinity, +Infinity) = ±pi/4
 * atan2(NaN, x) = NaN
 * atan2(y, NaN) = NaN
 *
 */
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r,
    pr = this.precision,
    rm = this.rounding,
    wpr = pr + 4;

  // Either NaN
  if (!y.s || !x.s) {
    r = new this(NaN);

  // Both ±Infinity
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s;

  // x is ±Infinity or y is ±0
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s;

  // y is ±Infinity or x is ±0
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s;

  // Both non-zero and finite
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }

  return r;
}


/*
 * Return a new Decimal whose value is the cube root of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function cbrt(x) {
  return new this(x).cbrt();
}


/*
 * Return a new Decimal whose value is `x` rounded to an integer using `ROUND_CEIL`.
 *
 * x {number|string|Decimal}
 *
 */
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}


/*
 * Return a new Decimal whose value is `x` clamped to the range delineated by `min` and `max`.
 *
 * x {number|string|Decimal}
 * min {number|string|Decimal}
 * max {number|string|Decimal}
 *
 */
function clamp(x, min, max) {
  return new this(x).clamp(min, max);
}


/*
 * Configure global settings for a Decimal constructor.
 *
 * `obj` is an object with one or more of the following properties,
 *
 *   precision  {number}
 *   rounding   {number}
 *   toExpNeg   {number}
 *   toExpPos   {number}
 *   maxE       {number}
 *   minE       {number}
 *   modulo     {number}
 *   crypto     {boolean|number}
 *   defaults   {true}
 *
 * E.g. Decimal.config({ precision: 20, rounding: 4 })
 *
 */
function config(obj) {
  if (!obj || typeof obj !== 'object') throw Error(decimalError + 'Object expected');
  var i, p, v,
    useDefaults = obj.defaults === true,
    ps = [
      'precision', 1, MAX_DIGITS,
      'rounding', 0, 8,
      'toExpNeg', -EXP_LIMIT, 0,
      'toExpPos', 0, EXP_LIMIT,
      'maxE', 0, EXP_LIMIT,
      'minE', -EXP_LIMIT, 0,
      'modulo', 0, 9
    ];

  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
      else throw Error(invalidArgument + p + ': ' + v);
    }
  }

  if (p = 'crypto', useDefaults) this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != 'undefined' && crypto &&
          (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ': ' + v);
    }
  }

  return this;
}


/*
 * Return a new Decimal whose value is the cosine of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function cos(x) {
  return new this(x).cos();
}


/*
 * Return a new Decimal whose value is the hyperbolic cosine of `x`, rounded to precision
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function cosh(x) {
  return new this(x).cosh();
}


/*
 * Create and return a Decimal constructor with the same configuration properties as this Decimal
 * constructor.
 *
 */
function clone(obj) {
  var i, p, ps;

  /*
   * The Decimal constructor and exported function.
   * Return a new Decimal instance.
   *
   * v {number|string|Decimal} A numeric value.
   *
   */
  function Decimal(v) {
    var e, i, t,
      x = this;

    // Decimal called without new.
    if (!(x instanceof Decimal)) return new Decimal(v);

    // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
    // which points to Object.
    x.constructor = Decimal;

    // Duplicate.
    if (isDecimalInstance(v)) {
      x.s = v.s;

      if (external) {
        if (!v.d || v.e > Decimal.maxE) {

          // Infinity.
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal.minE) {

          // Zero.
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }

      return;
    }

    t = typeof v;

    if (t === 'number') {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }

      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }

      // Fast path for small integers.
      if (v === ~~v && v < 1e7) {
        for (e = 0, i = v; i >= 10; i /= 10) e++;

        if (external) {
          if (e > Decimal.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }

        return;

      // Infinity, NaN.
      } else if (v * 0 !== 0) {
        if (!v) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }

      return parseDecimal(x, v.toString());

    } else if (t !== 'string') {
      throw Error(invalidArgument + v);
    }

    // Minus sign?
    if ((i = v.charCodeAt(0)) === 45) {
      v = v.slice(1);
      x.s = -1;
    } else {
      // Plus sign?
      if (i === 43) v = v.slice(1);
      x.s = 1;
    }

    return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
  }

  Decimal.prototype = P;

  Decimal.ROUND_UP = 0;
  Decimal.ROUND_DOWN = 1;
  Decimal.ROUND_CEIL = 2;
  Decimal.ROUND_FLOOR = 3;
  Decimal.ROUND_HALF_UP = 4;
  Decimal.ROUND_HALF_DOWN = 5;
  Decimal.ROUND_HALF_EVEN = 6;
  Decimal.ROUND_HALF_CEIL = 7;
  Decimal.ROUND_HALF_FLOOR = 8;
  Decimal.EUCLID = 9;

  Decimal.config = Decimal.set = config;
  Decimal.clone = clone;
  Decimal.isDecimal = isDecimalInstance;

  Decimal.abs = abs;
  Decimal.acos = acos;
  Decimal.acosh = acosh;        // ES6
  Decimal.add = add;
  Decimal.asin = asin;
  Decimal.asinh = asinh;        // ES6
  Decimal.atan = atan;
  Decimal.atanh = atanh;        // ES6
  Decimal.atan2 = atan2;
  Decimal.cbrt = cbrt;          // ES6
  Decimal.ceil = ceil;
  Decimal.clamp = clamp;
  Decimal.cos = cos;
  Decimal.cosh = cosh;          // ES6
  Decimal.div = div;
  Decimal.exp = exp;
  Decimal.floor = floor;
  Decimal.hypot = hypot;        // ES6
  Decimal.ln = ln;
  Decimal.log = log;
  Decimal.log10 = log10;        // ES6
  Decimal.log2 = log2;          // ES6
  Decimal.max = max;
  Decimal.min = min;
  Decimal.mod = mod;
  Decimal.mul = mul;
  Decimal.pow = pow;
  Decimal.random = random;
  Decimal.round = round;
  Decimal.sign = sign;          // ES6
  Decimal.sin = sin;
  Decimal.sinh = sinh;          // ES6
  Decimal.sqrt = sqrt;
  Decimal.sub = sub;
  Decimal.sum = sum;
  Decimal.tan = tan;
  Decimal.tanh = tanh;          // ES6
  Decimal.trunc = trunc;        // ES6

  if (obj === void 0) obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
  }

  Decimal.config(obj);

  return Decimal;
}


/*
 * Return a new Decimal whose value is `x` divided by `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function div(x, y) {
  return new this(x).div(y);
}


/*
 * Return a new Decimal whose value is the natural exponential of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} The power to which to raise the base of the natural log.
 *
 */
function exp(x) {
  return new this(x).exp();
}


/*
 * Return a new Decimal whose value is `x` round to an integer using `ROUND_FLOOR`.
 *
 * x {number|string|Decimal}
 *
 */
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}


/*
 * Return a new Decimal whose value is the square root of the sum of the squares of the arguments,
 * rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * hypot(a, b, ...) = sqrt(a^2 + b^2 + ...)
 *
 * arguments {number|string|Decimal}
 *
 */
function hypot() {
  var i, n,
    t = new this(0);

  external = false;

  for (i = 0; i < arguments.length;) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }

  external = true;

  return t.sqrt();
}


/*
 * Return true if object is a Decimal instance (where Decimal is any Decimal constructor),
 * otherwise return false.
 *
 */
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}


/*
 * Return a new Decimal whose value is the natural logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function ln(x) {
  return new this(x).ln();
}


/*
 * Return a new Decimal whose value is the log of `x` to the base `y`, or to base 10 if no base
 * is specified, rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * log[y](x)
 *
 * x {number|string|Decimal} The argument of the logarithm.
 * y {number|string|Decimal} The base of the logarithm.
 *
 */
function log(x, y) {
  return new this(x).log(y);
}


/*
 * Return a new Decimal whose value is the base 2 logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function log2(x) {
  return new this(x).log(2);
}


/*
 * Return a new Decimal whose value is the base 10 logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function log10(x) {
  return new this(x).log(10);
}


/*
 * Return a new Decimal whose value is the maximum of the arguments.
 *
 * arguments {number|string|Decimal}
 *
 */
function max() {
  return maxOrMin(this, arguments, 'lt');
}


/*
 * Return a new Decimal whose value is the minimum of the arguments.
 *
 * arguments {number|string|Decimal}
 *
 */
function min() {
  return maxOrMin(this, arguments, 'gt');
}


/*
 * Return a new Decimal whose value is `x` modulo `y`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function mod(x, y) {
  return new this(x).mod(y);
}


/*
 * Return a new Decimal whose value is `x` multiplied by `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function mul(x, y) {
  return new this(x).mul(y);
}


/*
 * Return a new Decimal whose value is `x` raised to the power `y`, rounded to precision
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} The base.
 * y {number|string|Decimal} The exponent.
 *
 */
function pow(x, y) {
  return new this(x).pow(y);
}


/*
 * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and with
 * `sd`, or `Decimal.precision` if `sd` is omitted, significant digits (or less if trailing zeros
 * are produced).
 *
 * [sd] {number} Significant digits. Integer, 0 to MAX_DIGITS inclusive.
 *
 */
function random(sd) {
  var d, e, k, n,
    i = 0,
    r = new this(1),
    rd = [];

  if (sd === void 0) sd = this.precision;
  else checkInt32(sd, 1, MAX_DIGITS);

  k = Math.ceil(sd / LOG_BASE);

  if (!this.crypto) {
    for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;

  // Browsers supporting crypto.getRandomValues.
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));

    for (; i < k;) {
      n = d[i];

      // 0 <= n < 4294967296
      // Probability n >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).
      if (n >= 4.29e9) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {

        // 0 <= n <= 4289999999
        // 0 <= (n % 1e7) <= 9999999
        rd[i++] = n % 1e7;
      }
    }

  // Node.js supporting crypto.randomBytes.
  } else if (crypto.randomBytes) {

    // buffer
    d = crypto.randomBytes(k *= 4);

    for (; i < k;) {

      // 0 <= n < 2147483648
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 0x7f) << 24);

      // Probability n >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).
      if (n >= 2.14e9) {
        crypto.randomBytes(4).copy(d, i);
      } else {

        // 0 <= n <= 2139999999
        // 0 <= (n % 1e7) <= 9999999
        rd.push(n % 1e7);
        i += 4;
      }
    }

    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }

  k = rd[--i];
  sd %= LOG_BASE;

  // Convert trailing digits to zeros according to sd.
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }

  // Remove trailing words which are zero.
  for (; rd[i] === 0; i--) rd.pop();

  // Zero?
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;

    // Remove leading words which are zero and adjust exponent accordingly.
    for (; rd[0] === 0; e -= LOG_BASE) rd.shift();

    // Count the digits of the first word of rd to determine leading zeros.
    for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;

    // Adjust the exponent for leading zeros of the first word of rd.
    if (k < LOG_BASE) e -= LOG_BASE - k;
  }

  r.e = e;
  r.d = rd;

  return r;
}


/*
 * Return a new Decimal whose value is `x` rounded to an integer using rounding mode `rounding`.
 *
 * To emulate `Math.round`, set rounding to 7 (ROUND_HALF_CEIL).
 *
 * x {number|string|Decimal}
 *
 */
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}


/*
 * Return
 *   1    if x > 0,
 *  -1    if x < 0,
 *   0    if x is 0,
 *  -0    if x is -0,
 *   NaN  otherwise
 *
 * x {number|string|Decimal}
 *
 */
function sign(x) {
  x = new this(x);
  return x.d ? (x.d[0] ? x.s : 0 * x.s) : x.s || NaN;
}


/*
 * Return a new Decimal whose value is the sine of `x`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function sin(x) {
  return new this(x).sin();
}


/*
 * Return a new Decimal whose value is the hyperbolic sine of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function sinh(x) {
  return new this(x).sinh();
}


/*
 * Return a new Decimal whose value is the square root of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function sqrt(x) {
  return new this(x).sqrt();
}


/*
 * Return a new Decimal whose value is `x` minus `y`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function sub(x, y) {
  return new this(x).sub(y);
}


/*
 * Return a new Decimal whose value is the sum of the arguments, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * Only the result is rounded, not the intermediate calculations.
 *
 * arguments {number|string|Decimal}
 *
 */
function sum() {
  var i = 0,
    args = arguments,
    x = new this(args[i]);

  external = false;
  for (; x.s && ++i < args.length;) x = x.plus(args[i]);
  external = true;

  return finalise(x, this.precision, this.rounding);
}


/*
 * Return a new Decimal whose value is the tangent of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function tan(x) {
  return new this(x).tan();
}


/*
 * Return a new Decimal whose value is the hyperbolic tangent of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function tanh(x) {
  return new this(x).tanh();
}


/*
 * Return a new Decimal whose value is `x` truncated to an integer.
 *
 * x {number|string|Decimal}
 *
 */
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}


P[Symbol.for('nodejs.util.inspect.custom')] = P.toString;
P[Symbol.toStringTag] = 'Decimal';

// Create and configure initial Decimal constructor.
var Decimal = P.constructor = clone(DEFAULTS);

// Create the internal constants from their string values.
LN10 = new Decimal(LN10);
PI = new Decimal(PI);

// TODO
/**
 * -- Not implemented --
 *
 * Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters.
 *
 * Category: Text
 *
 * @param {*} text The text or a reference to a value that contains the text you want to change. If text does not contain any full-width letters, text is not changed.
 * @returns
 */
function ASC() {
  throw new Error('ASC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Converts a number to text, using the ß (baht) currency format.
 *
 * Category: Text
 *
 * @param {*} number A number you want to convert to text, or a reference to a value containing a number, or a formula that evaluates to a number.
 * @returns
 */
function BAHTTEXT() {
  throw new Error('BAHTTEXT is not implemented')
}

/**
 * Returns the character specified by the code number.
 *
 * Category: Text
 *
 * @param {*} number A number between 1 and 255 specifying which character you want. The character is from the character set used by your computer. Note: Excel for the web supports only CHAR(9), CHAR(10), CHAR(13), and CHAR(32) and above.
 * @returns
 */
function CHAR(number) {
  number = parseNumber(number);

  if (number === 0) {
    return value
  }

  if (number instanceof Error) {
    return number
  }

  return String.fromCharCode(number)
}

/**
 * Removes all nonprintable characters from text.
 *
 * Category: Text
 *
 * @param {*} text Any worksheet information from which you want to remove nonprintable characters.
 * @returns
 */
function CLEAN(text) {
  if (anyIsError(text)) {
    return text
  }

  text = text || '';
  const re = /[\0-\x1F]/g;

  return text.replace(re, '')
}

/**
 * Returns a numeric code for the first character in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text for which you want the code of the first character.
 * @returns
 */
function CODE(text) {
  if (anyIsError(text)) {
    return text
  }

  text = text || '';
  let result = text.charCodeAt(0);

  if (isNaN(result)) {
    result = value;
  }

  return result
}

/**
 * Joins several text items into one text item.
 *
 * Category: Text
 *
 * @returns
 */
function CONCATENATE() {
  const args = flatten(arguments);
  const someError = anyError.apply(undefined, args);

  if (someError) {
    return someError
  }

  let trueFound = 0;

  while ((trueFound = args.indexOf(true)) > -1) {
    args[trueFound] = 'TRUE';
  }

  let falseFound = 0;

  while ((falseFound = args.indexOf(false)) > -1) {
    args[falseFound] = 'FALSE';
  }

  return args.join('')
}

const CONCAT = CONCATENATE;

// TODO
/**
 * -- Not implemented --
 *
 * Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters.
 *
 * Category: Text
 *
 * @param {*} text The text or a reference to a value that contains the text you want to change. If text does not contain any half-width English letters or katakana, text is not changed.
 * @returns
 */
function DBCS() {
  throw new Error('DBCS is not implemented')
}

/**
 * Converts a number to text, using the $ (dollar) currency format.
 *
 * Category: Text
 *
 * @param {*} number A number, a reference to a value containing a number, or a formula that evaluates to a number.
 * @param {*} decimals Optional. The number of digits to the right of the decimal point. If this is negative, the number is rounded to the left of the decimal point. If you omit decimals, it is assumed to be 2.
 * @returns
 */
function DOLLAR(number, decimals = 2) {
  number = parseNumber(number);
  if (isNaN(number)) {
    return value
  }

  number = ROUND(number, decimals);

  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals >= 0 ? decimals : 0,
    maximumFractionDigits: decimals >= 0 ? decimals : 0
  };

  const formattedNumber = number.toLocaleString('en-US', options);

  if (number < 0) {
    return '$(' + formattedNumber.slice(2) + ')'
  }

  return formattedNumber
}

/**
 * Checks to see if two text values are identical.
 *
 * Category: Text
 *
 * @param {*} text1 The first text string.
 * @param {*} text2 The second text string.
 * @returns
 */
function EXACT(text1, text2) {
  if (arguments.length !== 2) {
    return na
  }

  const someError = anyError(text1, text2);

  if (someError) {
    return someError
  }

  text1 = parseString(text1);
  text2 = parseString(text2);

  return text1 === text2
}

/**
 * Locate one text string within a second text string, and return the number of the starting position of the first text string from the first character of the second text string.
 *
 * Category: Text
 *
 * @param {*} find_text The text you want to find.
 * @param {*} within_text The text containing the text you want to find.
 * @param {*} start_num Optional. Specifies the character at which to start the search. The first character in within_text is character number 1. If you omit start_num, it is assumed to be 1.
 * @returns
 */
function FIND(find_text, within_text, start_num) {
  if (arguments.length < 2) {
    return na
  }

  find_text = parseString(find_text);
  within_text = parseString(within_text);
  start_num = start_num === undefined ? 0 : start_num;
  const found_index = within_text.indexOf(find_text, start_num - 1);

  if (found_index === -1) {
    return value
  }

  return found_index + 1
}

/**
 * Formats a number as text with a fixed number of decimals.
 *
 * Category: Text
 *
 * @param {*} number The number you want to round and convert to text.
 * @param {*} decimals Optional. The number of digits to the right of the decimal point.
 * @param {*} no_commas Optional. A logical value that, if TRUE, prevents FIXED from including commas in the returned text.
 * @returns
 */
function FIXED(number, decimals = 2, no_commas = false) {
  number = parseNumber(number);
  if (isNaN(number)) {
    return value
  }

  decimals = parseNumber(decimals);
  if (isNaN(decimals)) {
    return value
  }

  if (decimals < 0) {
    const factor = Math.pow(10, -decimals);
    number = Math.round(number / factor) * factor;
  } else {
    number = number.toFixed(decimals);
  }

  if (no_commas) {
    number = number.toString().replace(/,/g, '');
  } else {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+$)/g, ',');
    number = parts.join('.');
  }

  return number
}

/**
 * Formula.js only
 *
 * @param {*} value
 * @returns
 */
function HTML2TEXT(value) {
  if (anyIsError(value)) {
    return value
  }

  let result = '';

  if (value) {
    if (value instanceof Array) {
      value.forEach((line) => {
        if (result !== '') {
          result += '\n';
        }

        result += line.replace(/<(?:.|\n)*?>/gm, '');
      });
    } else {
      result = value.replace(/<(?:.|\n)*?>/gm, '');
    }
  }

  return result
}

/**
 * Returns the leftmost characters from a text value.
 *
 * Category: Text
 *
 * @param {*} text The text string that contains the characters you want to extract.
 * @param {*} num_chars Optional. Specifies the number of characters you want LEFT to extract.
 * @returns
 */
function LEFT(text, num_chars) {
  const someError = anyError(text, num_chars);

  if (someError) {
    return someError
  }

  text = parseString(text);
  num_chars = num_chars === undefined ? 1 : num_chars;
  num_chars = parseNumber(num_chars);

  if (num_chars instanceof Error || typeof text !== 'string') {
    return value
  }

  return text.substring(0, num_chars)
}

/**
 * Returns the number of characters in a text string
 *
 * Category: Text
 *
 * @param {*} text The text whose length you want to find. Spaces count as characters.
 * @returns
 */
function LEN(text) {
  if (arguments.length === 0) {
    return error
  }

  if (text instanceof Error) {
    return text
  }

  if (Array.isArray(text)) {
    return value
  }

  const textAsString = parseString(text);

  return textAsString.length
}

/**
 * Converts text to lowercase.
 *
 * Category: Text
 *
 * @param {*} text The text you want to convert to lowercase. LOWER does not change characters in text that are not letters.
 * @returns
 */
function LOWER(text) {
  if (arguments.length !== 1) {
    return value
  }

  text = parseString(text);

  if (anyIsError(text)) {
    return text
  }

  return text.toLowerCase()
}

/**
 * Returns a specific number of characters from a text string starting at the position you specify
 *
 * Category: Text
 *
 * @param {*} text The text string containing the characters you want to extract.
 * @param {*} start_num The position of the first character you want to extract in text. The first character in text has start_num 1, and so on.
 * @param {*} num_chars Specifies the number of characters you want MID to return from text.
 * @returns
 */
function MID(text, start_num, num_chars) {
  if (start_num === undefined || start_num === null) {
    return value
  }

  start_num = parseNumber(start_num);
  num_chars = parseNumber(num_chars);

  if (anyIsError(start_num, num_chars) || typeof text !== 'string') {
    return num_chars
  }

  const begin = start_num - 1;
  const end = begin + num_chars;

  return text.substring(begin, end)
}

// TODO
/**
 * Converts text to number in a locale-independent manner.
 *
 * Category: Text
 *
 * @param {*} text The text to convert to a number.
 * @param {*} decimal_separator Optional. The character used to separate the integer and fractional part of the result.
 * @param {*} group_separator Optional. The character used to separate groupings of numbers, such as thousands from hundreds and millions from thousands.
 * @returns
 */
function NUMBERVALUE(text, decimal_separator, group_separator) {
  text = isDefined(text) ? text : '';

  if (typeof text === 'number') {
    return text
  }

  if (typeof text !== 'string') {
    return na
  }

  decimal_separator = typeof decimal_separator === 'undefined' ? '.' : decimal_separator;
  group_separator = typeof group_separator === 'undefined' ? ',' : group_separator;

  return Number(text.replace(decimal_separator, '.').replace(group_separator, ''))
}

// TODO
/**
 * -- Not implemented --
 */
function PRONETIC() {
  throw new Error('PRONETIC is not implemented')
}

/**
 * Capitalizes the first letter in each word of a text value.
 *
 * Category: Text
 *
 * @param {*} text Text enclosed in quotation marks, a formula that returns text, or a reference to a value containing the text you want to partially capitalize.
 * @returns
 */
function PROPER(text) {
  if (anyIsError(text)) {
    return text
  }

  if (isNaN(text) && typeof text === 'number') {
    return value
  }

  text = parseString(text);

  return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} regular_expression
 * @returns
 */
function REGEXEXTRACT(text, regular_expression) {
  if (arguments.length < 2) {
    return na
  }

  const match = text.match(new RegExp(regular_expression));

  return match ? match[match.length > 1 ? match.length - 1 : 0] : null
}

/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} regular_expression
 * @param {*} full
 * @returns
 */
function REGEXMATCH(text, regular_expression, full) {
  if (arguments.length < 2) {
    return na
  }

  const match = text.match(new RegExp(regular_expression));

  return full ? match : !!match
}

/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} regular_expression
 * @param {*} replacement
 * @returns
 */
function REGEXREPLACE(text, regular_expression, replacement) {
  if (arguments.length < 3) {
    return na
  }

  return text.replace(new RegExp(regular_expression), replacement)
}

/**
 * Replaces characters within text
 *
 * Category: Text
 *
 * @param {*} old_text Text in which you want to replace some characters.
 * @param {*} num_chars The number of characters in old_text that you want REPLACE to replace with new_text.
 * @param {*} length he number of characters in old_text that you want REPLACEB to replace with new_text.
 * @param {*} new_text he text that will replace characters in old_text.
 * @returns
 */
function REPLACE(old_text, num_chars, length, new_text) {
  num_chars = parseNumber(num_chars);
  length = parseNumber(length);

  if (anyIsError(num_chars, length) || typeof old_text !== 'string' || typeof new_text !== 'string') {
    return value
  }

  return old_text.substr(0, num_chars - 1) + new_text + old_text.substr(num_chars - 1 + length)
}

/**
 * Repeats text a given number of times.
 *
 * Category: Text
 *
 * @param {*} text The text you want to repeat.
 * @param {*} number_times A positive number specifying the number of times to repeat text.
 * @returns
 */
function REPT(text, number_times) {
  const someError = anyError(text, number_times);

  if (someError) {
    return someError
  }

  text = parseString(text);
  number_times = parseNumber(number_times);

  if (number_times instanceof Error) {
    return number_times
  }

  return new Array(number_times + 1).join(text)
}

/**
 * Returns the rightmost characters from a text value
 *
 * Category: Text
 *
 * @param {*} text The text string containing the characters you want to extract.
 * @param {*} num_chars Optional. Specifies the number of characters you want RIGHT to extract.
 * @returns
 */
function RIGHT(text, num_chars) {
  const someError = anyError(text, num_chars);

  if (someError) {
    return someError
  }

  text = parseString(text);
  num_chars = num_chars === undefined ? 1 : num_chars;
  num_chars = parseNumber(num_chars);

  if (num_chars instanceof Error) {
    return num_chars
  }

  return text.substring(text.length - num_chars)
}

/**
 * Finds one text value within another (not case-sensitive)
 *
 * Category: Text
 *
 * @param {*} find_text The text that you want to find.
 * @param {*} within_text The text in which you want to search for the value of the find_text argument.
 * @param {*} start_num Optional. The character number in the within_text argument at which you want to start searching.
 * @returns
 */
function SEARCH(find_text, within_text, start_num) {
  let foundAt;

  if (typeof find_text !== 'string' || typeof within_text !== 'string') {
    return value
  }

  start_num = start_num === undefined ? 0 : start_num;
  foundAt = within_text.toLowerCase().indexOf(find_text.toLowerCase(), start_num - 1) + 1;

  return foundAt === 0 ? value : foundAt
}

/**
 * Formula.js only
 *
 * @param {*} text
 * @param {*} separator
 * @returns
 */
function SPLIT(text, separator) {
  return text.split(separator)
}

/**
 * Substitutes new text for old text in a text string.
 *
 * Category: Text
 *
 * @param {*} text The text or the reference to a value containing text for which you want to substitute characters.
 * @param {*} old_text The text you want to replace.
 * @param {*} new_text The text you want to replace old_text with.
 * @param {*} instance_num Optional. Specifies which occurrence of old_text you want to replace with new_text. If you specify instance_num, only that instance of old_text is replaced. Otherwise, every occurrence of old_text in text is changed to new_text.
 * @returns
 */
function SUBSTITUTE(text, old_text, new_text, instance_num) {
  if (arguments.length < 3) {
    return na
  }

  if (!text || !old_text) {
    return text
  } else if (instance_num === undefined) {
    return text.split(old_text).join(new_text)
  } else {
    instance_num = Math.floor(Number(instance_num));

    if (Number.isNaN(instance_num) || instance_num <= 0) {
      return value
    }

    let index = 0;
    let i = 0;

    while (index > -1 && text.indexOf(old_text, index) > -1) {
      index = text.indexOf(old_text, index + 1);
      i++;

      if (index > -1 && i === instance_num) {
        return text.substring(0, index) + new_text + text.substring(index + old_text.length)
      }
    }

    return text
  }
}

/**
 * Converts its arguments to text.
 *
 * Category: Text
 *
 * @param {*} value The value you want to test.
 * @returns
 */
function T(value) {
  if (value instanceof Error) {
    return value
  }

  return typeof value === 'string' ? value : ''
}

function handleTextNumbers(value, format_text) {
  let result = '';
  const integers = value.toString().split('.')[0] || '';
  const decimals = value.toString().split('.')[1] || '';
  let currentValueIndex = 0;
  let currentIntegerIndex = 0;
  let currentDecimalIndex = 0;
  let isInteger = true;

  const numberOfHashesAndZerosBeforeDecimal = format_text.split('.')[0].match(/[0|#]/g)?.length || 0;
  const numberOfHashesAndZerosAfterDecimal = format_text.split('.')?.[1]?.match(/[0|#]/g)?.length || 0;
  const endOfDecimalIndex = Math.min(decimals.length, numberOfHashesAndZerosAfterDecimal) - 1;

  for (let i = 0; i < format_text.length; i++) {
    if (format_text[i] === '#' || format_text[i] === '0') {
      // integer portion of the number
      if (isInteger && currentIntegerIndex < integers.length) {
        // even if the number of hashes and zeros is less than the number of integers, we still need to show all the integers
        if (currentIntegerIndex === 0 && numberOfHashesAndZerosBeforeDecimal < integers.length) {
          const addToIndexes = integers.length - numberOfHashesAndZerosBeforeDecimal + 1;
          const shouldRound = addToIndexes === integers.length && !numberOfHashesAndZerosAfterDecimal;

          if (shouldRound) {
            result += Math.round(value).toString().substring(0, addToIndexes);
          } else {
            result += integers.substring(0, addToIndexes);
          }

          currentValueIndex += addToIndexes;
          currentIntegerIndex += addToIndexes;
        }
        // replace the hash or zero with the associated integer
        else {
          const shouldRound = currentIntegerIndex === integers.length - 1 && !numberOfHashesAndZerosAfterDecimal;
          if (shouldRound) {
            result += Math.round(value).toString().substr(-1);
          } else {
            result += value.toString()[currentValueIndex];
          }

          currentValueIndex++;
          currentIntegerIndex++;
        }
      }
      // decimal portion of the number
      else if (!isInteger && currentDecimalIndex < endOfDecimalIndex + 1) {
        const shouldRound = currentDecimalIndex === endOfDecimalIndex;
        if (shouldRound) {
          result += value
            .toFixed(currentDecimalIndex + 1)
            .toString()
            .substr(-1);
        } else {
          result += value.toString()[currentValueIndex];
        }

        currentValueIndex++;
        currentDecimalIndex++;
      }
    }
    // decimal point
    else if (format_text[i] === '.') {
      isInteger = false;
      if (currentIntegerIndex <= integers.length) {
        result += integers.substring(currentIntegerIndex);
        currentValueIndex = integers.length + 1;
        currentIntegerIndex = integers.length;
      }
      result += '.';
    }

    // other random characters, e.g. xx, $, etc.
    else {
      result += format_text[i];
    }
  }

  return result
}

/**
 * -- Partially implemented --
 *
 * The following are not supported:
 * - Scientific notation
 * - Leading and trailing zeros
 * - Some special formats like "[<=9999999]###-####;(###) ###-####", "###° 00' 00''"
 * - Fractions
 * - Dates and times
 * - Some accounting formats
 * - Thousands separator
 *
 * Formats a number and converts it to text.
 *
 * Category: Text
 * @params {*} value A numeric value that you want to be converted into text.
 * @params {*} format_text A text string that defines the formatting that you want to be applied to the supplied value.
 * @returns
 */
function TEXT(value$1, format_text) {
  if (value$1 === undefined || format_text === undefined) {
    return na
  }

  value$1 = parseNumber(value$1);
  if (anyIsError(value$1)) {
    return value
  }

  format_text = parseString(format_text);
  if (anyIsError('FORMAT: ', format_text)) {
    return value
  }

  let result = '';
  if (format_text === '') {
    result = format_text;
  } else if (
    // format_text.includes("#,") ||
    // format_text.includes("0,") ||
    format_text.includes('h') ||
    format_text.includes('m') ||
    format_text.includes('s') ||
    format_text.includes('d') ||
    format_text.includes('y') ||
    format_text.includes('A/P') ||
    format_text.includes('AM/PM') ||
    format_text.includes('?/') ||
    format_text.includes('/?') ||
    format_text.includes('E+') ||
    format_text.includes('E-') ||
    format_text.includes('e+') ||
    format_text.includes('e-') ||
    format_text.includes('*') ||
    format_text.includes('_') ||
    format_text.includes(';') ||
    format_text.includes('[') ||
    format_text.includes(']')
  ) {
    throw new Error('TEXT formula not implemented')
  }
  // percentage
  else if (format_text.includes('%')) {
    if (format_text.length === 1) {
      return format_text
    }
    const percentage = new Decimal(value$1).times(100).toNumber();
    result = handleTextNumbers(percentage, format_text);
  }
  // general
  else if (format_text.includes('#') || format_text.includes('0')) {
    result = handleTextNumbers(new Decimal(value$1).toNumber(), format_text);
  } else {
    throw new Error('TEXT formula not implemented')
  }

  return result
}

/**
 * Combines the text from multiple ranges and/or strings.
 *
 * Category: Text
 * @param {*} delimiter A text string, either empty, or one or more characters enclosed by double quotes, or a reference to a valid text string. If a number is supplied, it will be treated as text.
 * @param {*} ignore_empty If TRUE, ignores empty values.
 * @param {*} args Text item to be joined. A text string, or array of strings, such as a range of values.
 * @returns
 */
function TEXTJOIN(delimiter, ignore_empty, ...args) {
  if (typeof ignore_empty !== 'boolean') {
    ignore_empty = parseBool(ignore_empty);
  }

  if (arguments.length < 3) {
    return na
  }

  delimiter = delimiter !== null && delimiter !== undefined ? delimiter : '';

  let flatArgs = flatten(args);
  let textToJoin = ignore_empty ? flatArgs.filter((text) => text) : flatArgs;

  if (Array.isArray(delimiter)) {
    delimiter = flatten(delimiter);

    let chunks = textToJoin.map((item) => [item]);
    let index = 0;

    for (let i = 0; i < chunks.length - 1; i++) {
      chunks[i].push(delimiter[index]);
      index++;

      if (index === delimiter.length) {
        index = 0;
      }
    }

    textToJoin = flatten(chunks);

    return textToJoin.join('')
  }

  return textToJoin.join(delimiter)
}

/**
 * Removes spaces from text.
 *
 * Category: Text
 *
 * @param {*} text The text from which you want spaces removed.
 * @returns
 */
function TRIM(text) {
  text = parseString(text);

  if (text instanceof Error) {
    return text
  }

  return text.replace(/\s+/g, ' ').trim()
}

const UNICHAR = CHAR;

const UNICODE = CODE;

/**
 * Converts text to uppercase.
 *
 * Category: Text
 *
 * @param {*} text The text you want converted to uppercase. Text can be a reference or text string.
 * @returns
 */
function UPPER(text) {
  text = parseString(text);

  if (text instanceof Error) {
    return text
  }

  return text.toUpperCase()
}

/**
 * Converts a text argument to a number.
 *
 * Category: Text
 *
 * @param {*} text The text enclosed in quotation marks or a reference to a value containing the text you want to convert.
 * @returns
 */
function VALUE(text) {
  const anyError$1 = anyError(text);

  if (anyError$1) {
    return anyError$1
  }

  if (typeof text === 'number') {
    return text
  }

  if (!isDefined(text)) {
    text = '';
  }

  if (typeof text !== 'string') {
    return value
  }

  const isPercent = /(%)$/.test(text) || /^(%)/.test(text);
  text = text.replace(/^[^0-9-]{0,3}/, '');
  text = text.replace(/[^0-9]{0,3}$/, '');
  text = text.replace(/[ ,]/g, '');

  if (text === '') {
    return 0
  }

  let output = Number(text);

  if (isNaN(output)) {
    return value
  }

  output = output || 0;

  if (isPercent) {
    output = output * 0.01;
  }

  return output
}

function isValidBinaryNumber(number) {
  return /^[01]{1,10}$/.test(number)
}

/**
 * Returns the modified Bessel function In(x).
 *
 * Category: Engineering
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} n The order of the Bessel function. If n is not an integer, it is truncated.
 * @returns
 */
function BESSELI(x, n) {
  x = parseNumber(x);
  n = parseNumber(n);

  if (anyIsError(x, n)) {
    return value
  }

  return bessel__default["default"].besseli(x, n)
}

/**
 * Returns the Bessel function Jn(x).
 *
 * Category: Engineering
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} n The order of the Bessel function. If n is not an integer, it is truncated.
 * @returns
 */
function BESSELJ(x, n) {
  x = parseNumber(x);
  n = parseNumber(n);

  if (anyIsError(x, n)) {
    return value
  }

  return bessel__default["default"].besselj(x, n)
}

/**
 * Returns the modified Bessel function Kn(x).
 *
 * Category: Engineering
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} n The order of the function. If n is not an integer, it is truncated.
 * @returns
 */
function BESSELK(x, n) {
  x = parseNumber(x);
  n = parseNumber(n);

  if (anyIsError(x, n)) {
    return value
  }

  return bessel__default["default"].besselk(x, n)
}

/**
 * Returns the Bessel function Yn(x).
 *
 * Category: Engineering
 *
 * @param {*} x The value at which to evaluate the function.
 * @param {*} n The order of the function. If n is not an integer, it is truncated.
 * @returns
 */
function BESSELY(x, n) {
  x = parseNumber(x);
  n = parseNumber(n);

  if (anyIsError(x, n)) {
    return value
  }

  return bessel__default["default"].bessely(x, n)
}

/**
 * Converts a binary number to decimal.
 *
 * Category: Engineering
 *
 * @param {*} number The binary number you want to convert. Number cannot contain more than 10 characters (10 bits). The most significant bit of number is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @returns
 */
function BIN2DEC(number) {
  // Return error if number is not binary or contains more than 10 characters (10 digits)
  if (!isValidBinaryNumber(number)) {
    return num
  }

  // Convert binary number to decimal
  const result = parseInt(number, 2);

  // Handle negative numbers
  const stringified = number.toString();

  if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
    return parseInt(stringified.substring(1), 2) - 512
  } else {
    return result
  }
}

/**
 * Converts a binary number to hexadecimal.
 *
 * Category: Engineering
 *
 * @param {*} number The binary number you want to convert. Number cannot contain more than 10 characters (10 bits). The most significant bit of number is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, BIN2HEX uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function BIN2HEX(number, places) {
  // Return error if number is not binary or contains more than 10 characters (10 digits)
  if (!isValidBinaryNumber(number)) {
    return num
  }

  // Ignore places and return a 10-character hexadecimal number if number is negative
  const stringified = number.toString();

  if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
    return (1099511627264 + parseInt(stringified.substring(1), 2)).toString(16)
  }

  // Convert binary number to hexadecimal
  const result = parseInt(number, 2).toString(16);

  // Return hexadecimal number using the minimum number of characters necessary if places is undefined
  if (places === undefined) {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Converts a binary number to octal.
 *
 * Category: Engineering
 *
 * @param {*} number The binary number you want to convert. Number cannot contain more than 10 characters (10 bits). The most significant bit of number is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, BIN2OCT uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function BIN2OCT(number, places) {
  // Return error if number is not binary or contains more than 10 characters (10 digits)
  if (!isValidBinaryNumber(number)) {
    return num
  }

  // Ignore places and return a 10-character octal number if number is negative
  const stringified = number.toString();

  if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
    return (1073741312 + parseInt(stringified.substring(1), 2)).toString(8)
  }

  // Convert binary number to octal
  const result = parseInt(number, 2).toString(8);

  // Return octal number using the minimum number of characters necessary if places is undefined
  if (places === undefined) {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Returns a 'Bitwise And' of two numbers.
 *
 * Category: Engineering
 *
 * @param {*} number1 Must be in decimal form and greater than or equal to 0.
 * @param {*} number2 Must be in decimal form and greater than or equal to 0.
 * @returns
 */
function BITAND(number1, number2) {
  // Return error if either number is a non-numeric value
  number1 = parseNumber(number1);
  number2 = parseNumber(number2);

  if (anyIsError(number1, number2)) {
    return value
  }

  // Return error if either number is less than 0
  if (number1 < 0 || number2 < 0) {
    return num
  }

  // Return error if either number is a non-integer
  if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
    return num
  }

  // Return error if either number is greater than (2^48)-1
  if (number1 > 281474976710655 || number2 > 281474976710655) {
    return num
  }

  // Return bitwise AND of two numbers
  return number1 & number2
}

/**
 * Returns a value number shifted left by shift_amount bits.
 *
 * Category: Engineering
 *
 * @param {*} number Number must be an integer greater than or equal to 0.
 * @param {*} shift_amount Shift_amount must be an integer.
 * @returns
 */
function BITLSHIFT(number, shift_amount) {
  number = parseNumber(number);
  shift_amount = parseNumber(shift_amount);

  if (anyIsError(number, shift_amount)) {
    return value
  }

  // Return error if number is less than 0
  if (number < 0) {
    return num
  }

  // Return error if number is a non-integer
  if (Math.floor(number) !== number) {
    return num
  }

  // Return error if number is greater than (2^48)-1
  if (number > 281474976710655) {
    return num
  }

  // Return error if the absolute value of shift is greater than 53
  if (Math.abs(shift_amount) > 53) {
    return num
  }

  // Return number shifted by shift bits to the left or to the right if shift is negative
  return shift_amount >= 0 ? number << shift_amount : number >> -shift_amount
}

/**
 * Returns a bitwise OR of 2 numbers.
 *
 * Category: Engineering
 *
 * @param {*} number1 Must be in decimal form and greater than or equal to 0.
 * @param {*} number2 Must be in decimal form and greater than or equal to 0.
 * @returns
 */
function BITOR(number1, number2) {
  number1 = parseNumber(number1);
  number2 = parseNumber(number2);

  if (anyIsError(number1, number2)) {
    return value
  }

  // Return error if either number is less than 0
  if (number1 < 0 || number2 < 0) {
    return num
  }

  // Return error if either number is a non-integer
  if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
    return num
  }

  // Return error if either number is greater than (2^48)-1
  if (number1 > 281474976710655 || number2 > 281474976710655) {
    return num
  }

  // Return bitwise OR of two numbers
  return number1 | number2
}

/**
 * Returns a value number shifted right by shift_amount bits.
 *
 * Category: Engineering
 *
 * @param {*} number Must be an integer greater than or equal to 0.
 * @param {*} shift_amount Must be an integer.
 * @returns
 */
function BITRSHIFT(number, shift_amount) {
  number = parseNumber(number);
  shift_amount = parseNumber(shift_amount);

  if (anyIsError(number, shift_amount)) {
    return value
  }

  // Return error if number is less than 0
  if (number < 0) {
    return num
  }

  // Return error if number is a non-integer
  if (Math.floor(number) !== number) {
    return num
  }

  // Return error if number is greater than (2^48)-1
  if (number > 281474976710655) {
    return num
  }

  // Return error if the absolute value of shift is greater than 53
  if (Math.abs(shift_amount) > 53) {
    return num
  }

  // Return number shifted by shift bits to the right or to the left if shift is negative
  return shift_amount >= 0 ? number >> shift_amount : number << -shift_amount
}

/**
 * Returns a bitwise 'Exclusive Or' of two numbers.
 *
 * Category: Engineering
 *
 * @param {*} number1 Must be greater than or equal to 0.
 * @param {*} number2 Must be greater than or equal to 0.
 * @returns
 */
function BITXOR(number1, number2) {
  number1 = parseNumber(number1);
  number2 = parseNumber(number2);

  if (anyIsError(number1, number2)) {
    return value
  }

  // Return error if either number is less than 0
  if (number1 < 0 || number2 < 0) {
    return num
  }

  // Return error if either number is a non-integer
  if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
    return num
  }

  // Return error if either number is greater than (2^48)-1
  if (number1 > 281474976710655 || number2 > 281474976710655) {
    return num
  }

  // Return bitwise XOR of two numbers
  return number1 ^ number2
}

/**
 * Converts real and imaginary coefficients into a complex number.
 *
 * Category: Engineering
 *
 * @param {*} real_num The real coefficient of the complex number.
 * @param {*} i_num The imaginary coefficient of the complex number.
 * @param {*} suffix Optional. The suffix for the imaginary component of the complex number. If omitted, suffix is assumed to be "i".
 * @returns
 */
function COMPLEX(real_num, i_num, suffix) {
  real_num = parseNumber(real_num);
  i_num = parseNumber(i_num);

  if (anyIsError(real_num, i_num)) {
    return real_num
  }

  // Set suffix
  suffix = suffix === undefined ? 'i' : suffix;

  // Return error if suffix is neither "i" nor "j"
  if (suffix !== 'i' && suffix !== 'j') {
    return value
  }

  // Return complex number
  if (real_num === 0 && i_num === 0) {
    return 0
  } else if (real_num === 0) {
    return i_num === 1 ? suffix : i_num.toString() + suffix
  } else if (i_num === 0) {
    return real_num.toString()
  } else {
    const sign = i_num > 0 ? '+' : '';
    return real_num.toString() + sign + (i_num === 1 ? suffix : i_num.toString() + suffix)
  }
}

/**
 * Converts a number from one measurement system to another.
 *
 * Category: Engineering
 *
 * @param {*} number is the value in from_units to convert.
 * @param {*} from_unit is the units for number.
 * @param {*} to_unit is the units for the result. CONVERT accepts the following text values (in quotation marks) for from_unit and to_unit.
 * @returns
 */
function CONVERT(number, from_unit, to_unit) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  // List of units supported by CONVERT and units defined by the International System of Units
  // [Name, Symbol, Alternate symbols, Quantity, ISU, CONVERT, Conversion ratio]
  const units = [
    ['a.u. of action', '?', null, 'action', false, false, 1.05457168181818e-34],
    ['a.u. of charge', 'e', null, 'electric_charge', false, false, 1.60217653141414e-19],
    ['a.u. of energy', 'Eh', null, 'energy', false, false, 4.35974417757576e-18],
    ['a.u. of length', 'a?', null, 'length', false, false, 5.29177210818182e-11],
    ['a.u. of mass', 'm?', null, 'mass', false, false, 9.10938261616162e-31],
    ['a.u. of time', '?/Eh', null, 'time', false, false, 2.41888432650516e-17],
    ['admiralty knot', 'admkn', null, 'speed', false, true, 0.514773333],
    ['ampere', 'A', null, 'electric_current', true, false, 1],
    ['ampere per meter', 'A/m', null, 'magnetic_field_intensity', true, false, 1],
    ['ångström', 'Å', ['ang'], 'length', false, true, 1e-10],
    ['are', 'ar', null, 'area', false, true, 100],
    ['astronomical unit', 'ua', null, 'length', false, false, 1.49597870691667e-11],
    ['bar', 'bar', null, 'pressure', false, false, 100000],
    ['barn', 'b', null, 'area', false, false, 1e-28],
    ['becquerel', 'Bq', null, 'radioactivity', true, false, 1],
    ['bit', 'bit', ['b'], 'information', false, true, 1],
    ['btu', 'BTU', ['btu'], 'energy', false, true, 1055.05585262],
    ['byte', 'byte', null, 'information', false, true, 8],
    ['candela', 'cd', null, 'luminous_intensity', true, false, 1],
    ['candela per square metre', 'cd/m?', null, 'luminance', true, false, 1],
    ['coulomb', 'C', null, 'electric_charge', true, false, 1],
    ['cubic ångström', 'ang3', ['ang^3'], 'volume', false, true, 1e-30],
    ['cubic foot', 'ft3', ['ft^3'], 'volume', false, true, 0.028316846592],
    ['cubic inch', 'in3', ['in^3'], 'volume', false, true, 0.000016387064],
    ['cubic light-year', 'ly3', ['ly^3'], 'volume', false, true, 8.46786664623715e-47],
    ['cubic metre', 'm?', null, 'volume', true, true, 1],
    ['cubic mile', 'mi3', ['mi^3'], 'volume', false, true, 4168181825.44058],
    ['cubic nautical mile', 'Nmi3', ['Nmi^3'], 'volume', false, true, 6352182208],
    ['cubic Pica', 'Pica3', ['Picapt3', 'Pica^3', 'Picapt^3'], 'volume', false, true, 7.58660370370369e-8],
    ['cubic yard', 'yd3', ['yd^3'], 'volume', false, true, 0.764554857984],
    ['cup', 'cup', null, 'volume', false, true, 0.0002365882365],
    ['dalton', 'Da', ['u'], 'mass', false, false, 1.66053886282828e-27],
    ['day', 'd', ['day'], 'time', false, true, 86400],
    ['degree', '°', null, 'angle', false, false, 0.0174532925199433],
    ['degrees Rankine', 'Rank', null, 'temperature', false, true, 0.555555555555556],
    ['dyne', 'dyn', ['dy'], 'force', false, true, 0.00001],
    ['electronvolt', 'eV', ['ev'], 'energy', false, true, 1.60217656514141],
    ['ell', 'ell', null, 'length', false, true, 1.143],
    ['erg', 'erg', ['e'], 'energy', false, true, 1e-7],
    ['farad', 'F', null, 'electric_capacitance', true, false, 1],
    ['fluid ounce', 'oz', null, 'volume', false, true, 0.0000295735295625],
    ['foot', 'ft', null, 'length', false, true, 0.3048],
    ['foot-pound', 'flb', null, 'energy', false, true, 1.3558179483314],
    ['gal', 'Gal', null, 'acceleration', false, false, 0.01],
    ['gallon', 'gal', null, 'volume', false, true, 0.003785411784],
    ['gauss', 'G', ['ga'], 'magnetic_flux_density', false, true, 1],
    ['grain', 'grain', null, 'mass', false, true, 0.0000647989],
    ['gram', 'g', null, 'mass', false, true, 0.001],
    ['gray', 'Gy', null, 'absorbed_dose', true, false, 1],
    ['gross registered ton', 'GRT', ['regton'], 'volume', false, true, 2.8316846592],
    ['hectare', 'ha', null, 'area', false, true, 10000],
    ['henry', 'H', null, 'inductance', true, false, 1],
    ['hertz', 'Hz', null, 'frequency', true, false, 1],
    ['horsepower', 'HP', ['h'], 'power', false, true, 745.69987158227],
    ['horsepower-hour', 'HPh', ['hh', 'hph'], 'energy', false, true, 2684519.538],
    ['hour', 'h', ['hr'], 'time', false, true, 3600],
    ['imperial gallon (U.K.)', 'uk_gal', null, 'volume', false, true, 0.00454609],
    ['imperial hundredweight', 'lcwt', ['uk_cwt', 'hweight'], 'mass', false, true, 50.802345],
    ['imperial quart (U.K)', 'uk_qt', null, 'volume', false, true, 0.0011365225],
    ['imperial ton', 'brton', ['uk_ton', 'LTON'], 'mass', false, true, 1016.046909],
    ['inch', 'in', null, 'length', false, true, 0.0254],
    ['international acre', 'uk_acre', null, 'area', false, true, 4046.8564224],
    ['IT calorie', 'cal', null, 'energy', false, true, 4.1868],
    ['joule', 'J', null, 'energy', true, true, 1],
    ['katal', 'kat', null, 'catalytic_activity', true, false, 1],
    ['kelvin', 'K', ['kel'], 'temperature', true, true, 1],
    ['kilogram', 'kg', null, 'mass', true, true, 1],
    ['knot', 'kn', null, 'speed', false, true, 0.514444444444444],
    ['light-year', 'ly', null, 'length', false, true, 9460730472580800],
    ['litre', 'L', ['l', 'lt'], 'volume', false, true, 0.001],
    ['lumen', 'lm', null, 'luminous_flux', true, false, 1],
    ['lux', 'lx', null, 'illuminance', true, false, 1],
    ['maxwell', 'Mx', null, 'magnetic_flux', false, false, 1e-18],
    ['measurement ton', 'MTON', null, 'volume', false, true, 1.13267386368],
    ['meter per hour', 'm/h', ['m/hr'], 'speed', false, true, 0.00027777777777778],
    ['meter per second', 'm/s', ['m/sec'], 'speed', true, true, 1],
    ['meter per second squared', 'm?s??', null, 'acceleration', true, false, 1],
    ['parsec', 'pc', ['parsec'], 'length', false, true, 30856775814671900],
    ['meter squared per second', 'm?/s', null, 'kinematic_viscosity', true, false, 1],
    ['metre', 'm', null, 'length', true, true, 1],
    ['miles per hour', 'mph', null, 'speed', false, true, 0.44704],
    ['millimetre of mercury', 'mmHg', null, 'pressure', false, false, 133.322],
    ['minute', '?', null, 'angle', false, false, 0.000290888208665722],
    ['minute', 'min', ['mn'], 'time', false, true, 60],
    ['modern teaspoon', 'tspm', null, 'volume', false, true, 0.000005],
    ['mole', 'mol', null, 'amount_of_substance', true, false, 1],
    ['morgen', 'Morgen', null, 'area', false, true, 2500],
    ['n.u. of action', '?', null, 'action', false, false, 1.05457168181818e-34],
    ['n.u. of mass', 'm?', null, 'mass', false, false, 9.10938261616162e-31],
    ['n.u. of speed', 'c?', null, 'speed', false, false, 299792458],
    ['n.u. of time', '?/(me?c??)', null, 'time', false, false, 1.28808866778687e-21],
    ['nautical mile', 'M', ['Nmi'], 'length', false, true, 1852],
    ['newton', 'N', null, 'force', true, true, 1],
    ['œrsted', 'Oe ', null, 'magnetic_field_intensity', false, false, 79.5774715459477],
    ['ohm', 'Ω', null, 'electric_resistance', true, false, 1],
    ['ounce mass', 'ozm', null, 'mass', false, true, 0.028349523125],
    ['pascal', 'Pa', null, 'pressure', true, false, 1],
    ['pascal second', 'Pa?s', null, 'dynamic_viscosity', true, false, 1],
    ['pferdestärke', 'PS', null, 'power', false, true, 735.49875],
    ['phot', 'ph', null, 'illuminance', false, false, 0.0001],
    ['pica (1/6 inch)', 'pica', null, 'length', false, true, 0.00035277777777778],
    ['pica (1/72 inch)', 'Pica', ['Picapt'], 'length', false, true, 0.00423333333333333],
    ['poise', 'P', null, 'dynamic_viscosity', false, false, 0.1],
    ['pond', 'pond', null, 'force', false, true, 0.00980665],
    ['pound force', 'lbf', null, 'force', false, true, 4.4482216152605],
    ['pound mass', 'lbm', null, 'mass', false, true, 0.45359237],
    ['quart', 'qt', null, 'volume', false, true, 0.000946352946],
    ['radian', 'rad', null, 'angle', true, false, 1],
    ['second', '?', null, 'angle', false, false, 0.00000484813681109536],
    ['second', 's', ['sec'], 'time', true, true, 1],
    ['short hundredweight', 'cwt', ['shweight'], 'mass', false, true, 45.359237],
    ['siemens', 'S', null, 'electrical_conductance', true, false, 1],
    ['sievert', 'Sv', null, 'equivalent_dose', true, false, 1],
    ['slug', 'sg', null, 'mass', false, true, 14.59390294],
    ['square ångström', 'ang2', ['ang^2'], 'area', false, true, 1e-20],
    ['square foot', 'ft2', ['ft^2'], 'area', false, true, 0.09290304],
    ['square inch', 'in2', ['in^2'], 'area', false, true, 0.00064516],
    ['square light-year', 'ly2', ['ly^2'], 'area', false, true, 8.95054210748189e31],
    ['square meter', 'm?', null, 'area', true, true, 1],
    ['square mile', 'mi2', ['mi^2'], 'area', false, true, 2589988.110336],
    ['square nautical mile', 'Nmi2', ['Nmi^2'], 'area', false, true, 3429904],
    ['square Pica', 'Pica2', ['Picapt2', 'Pica^2', 'Picapt^2'], 'area', false, true, 0.00001792111111111],
    ['square yard', 'yd2', ['yd^2'], 'area', false, true, 0.83612736],
    ['statute mile', 'mi', null, 'length', false, true, 1609.344],
    ['steradian', 'sr', null, 'solid_angle', true, false, 1],
    ['stilb', 'sb', null, 'luminance', false, false, 0.0001],
    ['stokes', 'St', null, 'kinematic_viscosity', false, false, 0.0001],
    ['stone', 'stone', null, 'mass', false, true, 6.35029318],
    ['tablespoon', 'tbs', null, 'volume', false, true, 0.0000147868],
    ['teaspoon', 'tsp', null, 'volume', false, true, 0.00000492892],
    ['tesla', 'T', null, 'magnetic_flux_density', true, true, 1],
    ['thermodynamic calorie', 'c', null, 'energy', false, true, 4.184],
    ['ton', 'ton', null, 'mass', false, true, 907.18474],
    ['tonne', 't', null, 'mass', false, false, 1000],
    ['U.K. pint', 'uk_pt', null, 'volume', false, true, 0.00056826125],
    ['U.S. bushel', 'bushel', null, 'volume', false, true, 0.03523907],
    ['U.S. oil barrel', 'barrel', null, 'volume', false, true, 0.158987295],
    ['U.S. pint', 'pt', ['us_pt'], 'volume', false, true, 0.000473176473],
    ['U.S. survey mile', 'survey_mi', null, 'length', false, true, 1609.347219],
    ['U.S. survey/statute acre', 'us_acre', null, 'area', false, true, 4046.87261],
    ['volt', 'V', null, 'voltage', true, false, 1],
    ['watt', 'W', null, 'power', true, true, 1],
    ['watt-hour', 'Wh', ['wh'], 'energy', false, true, 3600],
    ['weber', 'Wb', null, 'magnetic_flux', true, false, 1],
    ['yard', 'yd', null, 'length', false, true, 0.9144],
    ['year', 'yr', null, 'time', false, true, 31557600]
  ];

  // Binary prefixes
  // [Name, Prefix power of 2 value, Previx value, Abbreviation, Derived from]
  const binary_prefixes = {
    Yi: ['yobi', 80, 1208925819614629174706176, 'Yi', 'yotta'],
    Zi: ['zebi', 70, 1180591620717411303424, 'Zi', 'zetta'],
    Ei: ['exbi', 60, 1152921504606846976, 'Ei', 'exa'],
    Pi: ['pebi', 50, 1125899906842624, 'Pi', 'peta'],
    Ti: ['tebi', 40, 1099511627776, 'Ti', 'tera'],
    Gi: ['gibi', 30, 1073741824, 'Gi', 'giga'],
    Mi: ['mebi', 20, 1048576, 'Mi', 'mega'],
    ki: ['kibi', 10, 1024, 'ki', 'kilo']
  };

  // Unit prefixes
  // [Name, Multiplier, Abbreviation]
  const unit_prefixes = {
    Y: ['yotta', 1e24, 'Y'],
    Z: ['zetta', 1e21, 'Z'],
    E: ['exa', 1e18, 'E'],
    P: ['peta', 1e15, 'P'],
    T: ['tera', 1e12, 'T'],
    G: ['giga', 1e9, 'G'],
    M: ['mega', 1e6, 'M'],
    k: ['kilo', 1e3, 'k'],
    h: ['hecto', 1e2, 'h'],
    e: ['dekao', 1e1, 'e'],
    d: ['deci', 1e-1, 'd'],
    c: ['centi', 1e-2, 'c'],
    m: ['milli', 1e-3, 'm'],
    u: ['micro', 1e-6, 'u'],
    n: ['nano', 1e-9, 'n'],
    p: ['pico', 1e-12, 'p'],
    f: ['femto', 1e-15, 'f'],
    a: ['atto', 1e-18, 'a'],
    z: ['zepto', 1e-21, 'z'],
    y: ['yocto', 1e-24, 'y']
  };

  // Initialize units and multipliers
  let from = null;
  let to = null;
  let base_from_unit = from_unit;
  let base_to_unit = to_unit;
  let from_multiplier = 1;
  let to_multiplier = 1;
  let alt;

  // Lookup from and to units
  for (let i = 0; i < units.length; i++) {
    alt = units[i][2] === null ? [] : units[i][2];

    if (units[i][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
      from = units[i];
    }

    if (units[i][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
      to = units[i];
    }
  }

  // Lookup from prefix
  if (from === null) {
    const from_binary_prefix = binary_prefixes[from_unit.substring(0, 2)];
    let from_unit_prefix = unit_prefixes[from_unit.substring(0, 1)];

    // Handle dekao unit prefix (only unit prefix with two characters)
    if (from_unit.substring(0, 2) === 'da') {
      from_unit_prefix = ['dekao', 1e1, 'da'];
    }

    // Handle binary prefixes first (so that 'Yi' is processed before 'Y')
    if (from_binary_prefix) {
      from_multiplier = from_binary_prefix[2];
      base_from_unit = from_unit.substring(2);
    } else if (from_unit_prefix) {
      from_multiplier = from_unit_prefix[1];
      base_from_unit = from_unit.substring(from_unit_prefix[2].length);
    }

    // Lookup from unit
    for (let j = 0; j < units.length; j++) {
      alt = units[j][2] === null ? [] : units[j][2];

      if (units[j][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
        from = units[j];
      }
    }
  }

  // Lookup to prefix
  if (to === null) {
    const to_binary_prefix = binary_prefixes[to_unit.substring(0, 2)];
    let to_unit_prefix = unit_prefixes[to_unit.substring(0, 1)];

    // Handle dekao unit prefix (only unit prefix with two characters)
    if (to_unit.substring(0, 2) === 'da') {
      to_unit_prefix = ['dekao', 1e1, 'da'];
    }

    // Handle binary prefixes first (so that 'Yi' is processed before 'Y')
    if (to_binary_prefix) {
      to_multiplier = to_binary_prefix[2];
      base_to_unit = to_unit.substring(2);
    } else if (to_unit_prefix) {
      to_multiplier = to_unit_prefix[1];
      base_to_unit = to_unit.substring(to_unit_prefix[2].length);
    }

    // Lookup to unit
    for (let k = 0; k < units.length; k++) {
      alt = units[k][2] === null ? [] : units[k][2];

      if (units[k][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
        to = units[k];
      }
    }
  }

  // Return error if a unit does not exist
  if (from === null || to === null) {
    return na
  }

  // Return error if units represent different quantities
  if (from[3] !== to[3]) {
    return na
  }

  // Return converted number
  return (number * from[6] * from_multiplier) / (to[6] * to_multiplier)
}

/**
 * Converts a decimal number to binary.
 *
 * Category: Engineering
 *
 * @param {*} number The decimal integer you want to convert. If number is negative, valid place values are ignored and DEC2BIN returns a 10-character (10-bit) binary number in which the most significant bit is the sign bit. The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, DEC2BIN uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function DEC2BIN(number, places) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  // Return error if number is not decimal, is lower than -512, or is greater than 511
  if (!/^-?[0-9]{1,3}$/.test(number) || number < -512 || number > 511) {
    return num
  }

  // Ignore places and return a 10-character binary number if number is negative
  if (number < 0) {
    return '1' + REPT('0', 9 - (512 + number).toString(2).length) + (512 + number).toString(2)
  }

  // Convert decimal number to binary
  const result = parseInt(number, 10).toString(2);

  // Return binary number using the minimum number of characters necessary if places is undefined
  if (typeof places === 'undefined') {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Converts a decimal number to hexadecimal.
 *
 * Category: Engineering
 *
 * @param {*} number The decimal integer you want to convert. If number is negative, places is ignored and DEC2HEX returns a 10-character (40-bit) hexadecimal number in which the most significant bit is the sign bit. The remaining 39 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, DEC2HEX uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function DEC2HEX(number, places) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  // Return error if number is not decimal, is lower than -549755813888, or is greater than 549755813887
  if (!/^-?[0-9]{1,12}$/.test(number) || number < -549755813888 || number > 549755813887) {
    return num
  }

  // Ignore places and return a 10-character hexadecimal number if number is negative
  if (number < 0) {
    return (1099511627776 + number).toString(16)
  }

  // Convert decimal number to hexadecimal
  const result = parseInt(number, 10).toString(16);

  // Return hexadecimal number using the minimum number of characters necessary if places is undefined
  if (typeof places === 'undefined') {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Converts a decimal number to octal.
 *
 * Category: Engineering
 *
 * @param {*} number The decimal integer you want to convert. If number is negative, places is ignored and DEC2OCT returns a 10-character (30-bit) octal number in which the most significant bit is the sign bit. The remaining 29 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, DEC2OCT uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function DEC2OCT(number, places) {
  number = parseNumber(number);

  if (number instanceof Error) {
    return number
  }

  // Return error if number is not decimal, is lower than -549755813888, or is greater than 549755813887
  if (!/^-?[0-9]{1,9}$/.test(number) || number < -536870912 || number > 536870911) {
    return num
  }

  // Ignore places and return a 10-character octal number if number is negative
  if (number < 0) {
    return (1073741824 + number).toString(8)
  }

  // Convert decimal number to octal
  const result = parseInt(number, 10).toString(8);

  // Return octal number using the minimum number of characters necessary if places is undefined
  if (typeof places === 'undefined') {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Tests whether two values are equal.
 *
 * Category: Engineering
 *
 * @param {*} number1 The first number.
 * @param {*} number2 Optional. The second number. If omitted, number2 is assumed to be zero.
 * @returns
 */
function DELTA(number1, number2) {
  // Set number2 to zero if undefined
  number2 = number2 === undefined ? 0 : number2;
  number1 = parseNumber(number1);
  number2 = parseNumber(number2);

  if (anyIsError(number1, number2)) {
    return value
  }

  // Return delta
  return number1 === number2 ? 1 : 0
}

// TODO: why is upper_bound not used ? The excel documentation has no examples with upper_bound
/**
 * Returns the error function.
 *
 * Category: Engineering
 *
 * @param {*} lower_limit The lower bound for integrating ERF.
 * @param {*} upper_limit Optional. The upper bound for integrating ERF. If omitted, ERF integrates between zero and lower_limit.
 * @returns
 */
function ERF(lower_limit, upper_limit) {
  // Set number2 to zero if undefined
  upper_limit = upper_limit === undefined ? 0 : upper_limit;

  lower_limit = parseNumber(lower_limit);
  upper_limit = parseNumber(upper_limit);

  if (anyIsError(lower_limit, upper_limit)) {
    return value
  }

  return jStat__default["default"].erf(lower_limit)
}

// TODO

/**
 * -- Not implemented --
 *
 * Returns the error function.
 *
 * Category: Engineering
 *
 * @param {*} x The lower bound for integrating ERF.PRECISE.
 * @returns
 */
ERF.PRECISE = () => {
  throw new Error('ERF.PRECISE is not implemented')
};

/**
 * Returns the complementary error function.
 *
 * Category: Engineering
 *
 * @param {*} x The lower bound for integrating ERFC.
 * @returns
 */
function ERFC(x) {
  // Return error if x is not a number
  if (isNaN(x)) {
    return value
  }

  return jStat__default["default"].erfc(x)
}

// TODO

/**
 * -- Not implemented --
 *
 * Returns the complementary ERF function integrated between x and infinity.
 *
 * Category: Engineering
 *
 * @param {*} x The lower bound for integrating ERFC.PRECISE.
 * @returns
 */
ERFC.PRECISE = () => {
  throw new Error('ERFC.PRECISE is not implemented')
};

/**
 * Tests whether a number is greater than a threshold value.
 *
 * Category: Engineering
 *
 * @param {*} number The value to test against step.
 * @param {*} step Optional. The threshold value. If you omit a value for step, GESTEP uses zero.
 * @returns
 */
function GESTEP(number, step) {
  step = step || 0;
  number = parseNumber(number);

  if (anyIsError(step, number)) {
    return number
  }

  // Return delta
  return number >= step ? 1 : 0
}

/**
 * Converts a hexadecimal number to binary.
 *
 * Category: Engineering
 *
 * @param {*} number The hexadecimal number you want to convert. Number cannot contain more than 10 characters. The most significant bit of number is the sign bit (40th bit from the right). The remaining 9 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, HEX2BIN uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function HEX2BIN(number, places) {
  // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
  if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
    return num
  }

  // Check if number is negative
  const negative = !!(number.length === 10 && number.substring(0, 1).toLowerCase() === 'f');

  // Convert hexadecimal number to decimal
  const decimal = negative ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);

  // Return error if number is lower than -512 or greater than 511
  if (decimal < -512 || decimal > 511) {
    return num
  }

  // Ignore places and return a 10-character binary number if number is negative
  if (negative) {
    return '1' + REPT('0', 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2)
  }

  // Convert decimal number to binary
  const result = decimal.toString(2);

  // Return binary number using the minimum number of characters necessary if places is undefined
  if (places === undefined) {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Converts a hexadecimal number to decimal.
 *
 * Category: Engineering
 *
 * @param {*} number The hexadecimal number you want to convert. Number cannot contain more than 10 characters (40 bits). The most significant bit of number is the sign bit. The remaining 39 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @returns
 */
function HEX2DEC(number) {
  // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
  if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
    return num
  }

  // Convert hexadecimal number to decimal
  const decimal = parseInt(number, 16);

  // Return decimal number
  return decimal >= 549755813888 ? decimal - 1099511627776 : decimal
}

/**
 * Converts a hexadecimal number to octal.
 *
 * Category: Engineering
 *
 * @param {*} number The hexadecimal number you want to convert. Number cannot contain more than 10 characters. The most significant bit of number is the sign bit. The remaining 39 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, HEX2OCT uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function HEX2OCT(number, places) {
  // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
  if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
    return num
  }

  // Convert hexadecimal number to decimal
  const decimal = parseInt(number, 16);

  // Return error if number is positive and greater than 0x1fffffff (536870911)
  if (decimal > 536870911 && decimal < 1098974756864) {
    return num
  }

  // Ignore places and return a 10-character octal number if number is negative
  if (decimal >= 1098974756864) {
    return (decimal - 1098437885952).toString(8)
  }

  // Convert decimal number to octal
  const result = decimal.toString(8);

  // Return octal number using the minimum number of characters necessary if places is undefined
  if (places === undefined) {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Returns the absolute value (modulus) of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the absolute value.
 * @returns
 */
function IMABS(inumber) {
  // Lookup real and imaginary coefficients using exports.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  // Return error if either coefficient is not a number
  if (anyIsError(x, y)) {
    return value
  }

  // Return absolute value of complex number
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

/**
 * Returns the imaginary coefficient of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the imaginary coefficient.
 * @returns
 */
function IMAGINARY(inumber) {
  if (inumber === undefined || inumber === true || inumber === false) {
    return value
  }

  // Return 0 if inumber is equal to 0
  if (inumber === 0 || inumber === '0') {
    return 0
  }

  // Handle special cases
  if (['i', 'j'].indexOf(inumber) >= 0) {
    return 1
  }

  // Force string type
  inumber = inumber + '';

  // Normalize imaginary coefficient
  inumber = inumber.replace('+i', '+1i').replace('-i', '-1i').replace('+j', '+1j').replace('-j', '-1j');

  // Lookup sign
  let plus = inumber.indexOf('+');
  let minus = inumber.indexOf('-');

  if (plus === 0) {
    plus = inumber.indexOf('+', 1);
  }

  if (minus === 0) {
    minus = inumber.indexOf('-', 1);
  }

  // Lookup imaginary unit
  const last = inumber.substring(inumber.length - 1, inumber.length);
  const unit = last === 'i' || last === 'j';

  if (plus >= 0 || minus >= 0) {
    // Return error if imaginary unit is neither i nor j
    if (!unit) {
      return num
    }

    // Return imaginary coefficient of complex number
    if (plus >= 0) {
      return isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1))
        ? num
        : Number(inumber.substring(plus + 1, inumber.length - 1))
    } else {
      return isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1))
        ? num
        : -Number(inumber.substring(minus + 1, inumber.length - 1))
    }
  } else {
    if (unit) {
      return isNaN(inumber.substring(0, inumber.length - 1)) ? num : inumber.substring(0, inumber.length - 1)
    } else {
      return isNaN(inumber) ? num : 0
    }
  }
}

/**
 * Returns the argument theta, an angle expressed in radians.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the argument .
 * @returns
 */
function IMARGUMENT(inumber) {
  // Lookup real and imaginary coefficients using exports.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  // Return error if either coefficient is not a number
  if (anyIsError(x, y)) {
    return value
  }

  // Return error if inumber is equal to zero
  if (x === 0 && y === 0) {
    return div0
  }

  // Return PI/2 if x is equal to zero and y is positive
  if (x === 0 && y > 0) {
    return Math.PI / 2
  }

  // Return -PI/2 if x is equal to zero and y is negative
  if (x === 0 && y < 0) {
    return -Math.PI / 2
  }

  // Return zero if x is negative and y is equal to zero
  if (y === 0 && x > 0) {
    return 0
  }

  // Return zero if x is negative and y is equal to zero
  if (y === 0 && x < 0) {
    return -Math.PI
  }

  // Return argument of complex number
  if (x > 0) {
    return Math.atan(y / x)
  } else if (x < 0 && y >= 0) {
    return Math.atan(y / x) + Math.PI
  } else {
    return Math.atan(y / x) - Math.PI
  }
}

/**
 * Returns the complex conjugate of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the conjugate.
 * @returns
 */
function IMCONJUGATE(inumber) {
  // Lookup real and imaginary coefficients using exports.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return conjugate of complex number
  return y !== 0 ? COMPLEX(x, -y, unit) : inumber
}

/**
 * Returns the cosine of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the cosine.
 * @returns
 */
function IMCOS(inumber) {
  // Lookup real and imaginary coefficients using exports.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return cosine of complex number
  return COMPLEX(
    (Math.cos(x) * (Math.exp(y) + Math.exp(-y))) / 2,
    (-Math.sin(x) * (Math.exp(y) - Math.exp(-y))) / 2,
    unit
  )
}

/**
 * Returns the hyperbolic cosine of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the hyperbolic cosine.
 * @returns
 */
function IMCOSH(inumber) {
  // Lookup real and imaginary coefficients using exports.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return hyperbolic cosine of complex number
  return COMPLEX(
    (Math.cos(y) * (Math.exp(x) + Math.exp(-x))) / 2,
    (Math.sin(y) * (Math.exp(x) - Math.exp(-x))) / 2,
    unit
  )
}

/**
 * Returns the cotangent of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the cotangent.
 * @returns
 */
function IMCOT(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Return cotangent of complex number
  return IMDIV(IMCOS(inumber), IMSIN(inumber))
}

/**
 * Returns the quotient of two complex numbers.
 *
 * Category: Engineering
 *
 * @param {*} inumber1 The complex numerator or dividend.
 * @param {*} inumber2 The complex denominator or divisor.
 * @returns
 */
function IMDIV(inumber1, inumber2) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const a = IMREAL(inumber1);
  const b = IMAGINARY(inumber1);
  const c = IMREAL(inumber2);
  const d = IMAGINARY(inumber2);

  if (anyIsError(a, b, c, d)) {
    return value
  }

  // Lookup imaginary unit
  const unit1 = inumber1.substring(inumber1.length - 1);
  const unit2 = inumber2.substring(inumber2.length - 1);
  let unit = 'i';

  if (unit1 === 'j') {
    unit = 'j';
  } else if (unit2 === 'j') {
    unit = 'j';
  }

  // Return error if inumber2 is null
  if (c === 0 && d === 0) {
    return num
  }

  // Return exponential of complex number
  const den = c * c + d * d;
  return COMPLEX((a * c + b * d) / den, (b * c - a * d) / den, unit)
}

/**
 * Returns the exponential of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the exponential.
 * @returns
 */
function IMEXP(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return exponential of complex number
  const e = Math.exp(x);
  return COMPLEX(e * Math.cos(y), e * Math.sin(y), unit)
}

/**
 * Returns the natural logarithm of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the natural logarithm.
 * @returns
 */
function IMLN(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return exponential of complex number
  return COMPLEX(Math.log(Math.sqrt(x * x + y * y)), Math.atan(y / x), unit)
}

/**
 * Returns the base-10 logarithm of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the common logarithm.
 * @returns
 */
function IMLOG10(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return exponential of complex number
  return COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(10), Math.atan(y / x) / Math.log(10), unit)
}

/**
 * Returns the base-2 logarithm of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the base-2 logarithm.
 * @returns
 */
function IMLOG2(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return exponential of complex number
  return COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(2), Math.atan(y / x) / Math.log(2), unit)
}

/**
 * Returns a complex number raised to an integer power.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number you want to raise to a power.
 * @param {*} number The power to which you want to raise the complex number.
 * @returns
 */
function IMPOWER(inumber, number) {
  number = parseNumber(number);
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(number, x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Calculate power of modulus
  const p = Math.pow(IMABS(inumber), number);

  // Calculate argument
  const t = IMARGUMENT(inumber);

  // Return exponential of complex number
  return COMPLEX(p * Math.cos(number * t), p * Math.sin(number * t), unit)
}

/**
 * Returns the product of complex numbers.
 *
 * Category: Engineering
 *
 * @param {*} args inumber1, [inumber2], … Inumber1 is required, subsequent inumbers are not. 1 to 255 complex numbers to multiply.
 * @returns
 */
function IMPRODUCT() {
  // Initialize result
  let result = arguments[0];

  if (!arguments.length) {
    return value
  }

  // Loop on all numbers
  for (let i = 1; i < arguments.length; i++) {
    // Lookup coefficients of two complex numbers
    const a = IMREAL(result);
    const b = IMAGINARY(result);
    const c = IMREAL(arguments[i]);
    const d = IMAGINARY(arguments[i]);

    if (anyIsError(a, b, c, d)) {
      return value
    }

    // Complute product of two complex numbers
    result = COMPLEX(a * c - b * d, a * d + b * c);
  }

  // Return product of complex numbers
  return result
}

/**
 * Returns the real coefficient of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the real coefficient.
 * @returns
 */
function IMREAL(inumber) {
  if (inumber === undefined || inumber === true || inumber === false) {
    return value
  }

  // Return 0 if inumber is equal to 0
  if (inumber === 0 || inumber === '0') {
    return 0
  }

  // Handle special cases
  if (['i', '+i', '1i', '+1i', '-i', '-1i', 'j', '+j', '1j', '+1j', '-j', '-1j'].indexOf(inumber) >= 0) {
    return 0
  }

  // Force String type
  inumber = inumber + '';

  // Lookup sign
  let plus = inumber.indexOf('+');
  let minus = inumber.indexOf('-');

  if (plus === 0) {
    plus = inumber.indexOf('+', 1);
  }

  if (minus === 0) {
    minus = inumber.indexOf('-', 1);
  }

  // Lookup imaginary unit
  const last = inumber.substring(inumber.length - 1, inumber.length);
  const unit = last === 'i' || last === 'j';

  if (plus >= 0 || minus >= 0) {
    // Return error if imaginary unit is neither i nor j
    if (!unit) {
      return num
    }

    // Return real coefficient of complex number
    if (plus >= 0) {
      return isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1))
        ? num
        : Number(inumber.substring(0, plus))
    } else {
      return isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1))
        ? num
        : Number(inumber.substring(0, minus))
    }
  } else {
    if (unit) {
      return isNaN(inumber.substring(0, inumber.length - 1)) ? num : 0
    } else {
      return isNaN(inumber) ? num : inumber
    }
  }
}

/**
 * Returns the secant of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the secant.
 * @returns
 */
function IMSEC(inumber) {
  // Return error if inumber is a logical value
  if (inumber === true || inumber === false) {
    return value
  }

  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Return secant of complex number
  return IMDIV('1', IMCOS(inumber))
}

/**
 * Returns the hyperbolic secant of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the hyperbolic secant.
 * @returns
 */
function IMSECH(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Return hyperbolic secant of complex number
  return IMDIV('1', IMCOSH(inumber))
}

/**
 * Returns the sine of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the sine.
 * @returns
 */
function IMSIN(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return sine of complex number
  return COMPLEX(
    (Math.sin(x) * (Math.exp(y) + Math.exp(-y))) / 2,
    (Math.cos(x) * (Math.exp(y) - Math.exp(-y))) / 2,
    unit
  )
}

/**
 * Returns the hyperbolic sine of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the hyperbolic sine.
 * @returns
 */
function IMSINH(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Return hyperbolic sine of complex number
  return COMPLEX(
    (Math.cos(y) * (Math.exp(x) - Math.exp(-x))) / 2,
    (Math.sin(y) * (Math.exp(x) + Math.exp(-x))) / 2,
    unit
  )
}

/**
 * Returns the square root of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the square root.
 * @returns
 */
function IMSQRT(inumber) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Lookup imaginary unit
  let unit = inumber.substring(inumber.length - 1);
  unit = unit === 'i' || unit === 'j' ? unit : 'i';

  // Calculate power of modulus
  const s = Math.sqrt(IMABS(inumber));

  // Calculate argument
  const t = IMARGUMENT(inumber);

  // Return exponential of complex number
  return COMPLEX(s * Math.cos(t / 2), s * Math.sin(t / 2), unit)
}

/**
 * Returns the cosecant of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the cosecant.
 * @returns
 */
function IMCSC(inumber) {
  // Return error if inumber is a logical value
  if (inumber === true || inumber === false) {
    return value
  }

  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  // Return error if either coefficient is not a number
  if (anyIsError(x, y)) {
    return num
  }

  // Return cosecant of complex number
  return IMDIV('1', IMSIN(inumber))
}

/**
 * Returns the hyperbolic cosecant of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the hyperbolic cosecant.
 * @returns
 */
function IMCSCH(inumber) {
  // Return error if inumber is a logical value
  if (inumber === true || inumber === false) {
    return value
  }

  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  // Return error if either coefficient is not a number
  if (anyIsError(x, y)) {
    return num
  }

  // Return hyperbolic cosecant of complex number
  return IMDIV('1', IMSINH(inumber))
}

/**
 * Returns the difference between two complex numbers.
 *
 * Category: Engineering
 *
 * @param {*} inumber1 The complex number from which to subtract inumber2.
 * @param {*} inumber2 The complex number to subtract from inumber1.
 * @returns
 */
function IMSUB(inumber1, inumber2) {
  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const a = IMREAL(inumber1);
  const b = IMAGINARY(inumber1);
  const c = IMREAL(inumber2);
  const d = IMAGINARY(inumber2);

  if (anyIsError(a, b, c, d)) {
    return value
  }

  // Lookup imaginary unit
  const unit1 = inumber1.substring(inumber1.length - 1);
  const unit2 = inumber2.substring(inumber2.length - 1);
  let unit = 'i';

  if (unit1 === 'j') {
    unit = 'j';
  } else if (unit2 === 'j') {
    unit = 'j';
  }

  // Return _ of two complex numbers
  return COMPLEX(a - c, b - d, unit)
}

/**
 * Returns the sum of complex numbers.
 *
 * Category: Engineering
 *
 * @param {*} args inumber1, [inumber2], ... Inumber1 is required, subsequent numbers are not. 1 to 255 complex numbers to add.
 * @returns
 */
function IMSUM() {
  if (!arguments.length) {
    return value
  }

  const args = flatten(arguments);

  // Initialize result
  let result = args[0];

  // Loop on all numbers
  for (let i = 1; i < args.length; i++) {
    // Lookup coefficients of two complex numbers
    const a = IMREAL(result);
    const b = IMAGINARY(result);
    const c = IMREAL(args[i]);
    const d = IMAGINARY(args[i]);

    if (anyIsError(a, b, c, d)) {
      return value
    }

    // Complute product of two complex numbers
    result = COMPLEX(a + c, b + d);
  }

  // Return sum of complex numbers
  return result
}

/**
 * Returns the tangent of a complex number.
 *
 * Category: Engineering
 *
 * @param {*} inumber A complex number for which you want the tangent.
 * @returns
 */
function IMTAN(inumber) {
  // Return error if inumber is a logical value
  if (inumber === true || inumber === false) {
    return value
  }

  // Lookup real and imaginary coefficients using Formula.js [http://formulajs.org]
  const x = IMREAL(inumber);
  const y = IMAGINARY(inumber);

  if (anyIsError(x, y)) {
    return value
  }

  // Return tangent of complex number
  return IMDIV(IMSIN(inumber), IMCOS(inumber))
}

/**
 * Converts an octal number to binary.
 *
 * Category: Engineering
 *
 * @param {*} number The octal number you want to convert. Number may not contain more than 10 characters. The most significant bit of number is the sign bit. The remaining 29 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, OCT2BIN uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function OCT2BIN(number, places) {
  // Return error if number is not hexadecimal or contains more than ten characters (10 digits)
  if (!/^[0-7]{1,10}$/.test(number)) {
    return num
  }

  // Check if number is negative
  const negative = !!(number.length === 10 && number.substring(0, 1) === '7');

  // Convert octal number to decimal
  const decimal = negative ? parseInt(number, 8) - 1073741824 : parseInt(number, 8);

  // Return error if number is lower than -512 or greater than 511
  if (decimal < -512 || decimal > 511) {
    return num
  }

  // Ignore places and return a 10-character binary number if number is negative
  if (negative) {
    return '1' + REPT('0', 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2)
  }

  // Convert decimal number to binary
  const result = decimal.toString(2);

  // Return binary number using the minimum number of characters necessary if places is undefined
  if (typeof places === 'undefined') {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

/**
 * Converts an octal number to decimal.
 *
 * Category: Engineering
 *
 * @param {*} number The octal number you want to convert. Number may not contain more than 10 octal characters (30 bits). The most significant bit of number is the sign bit. The remaining 29 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @returns
 */
function OCT2DEC(number) {
  // Return error if number is not octal or contains more than ten characters (10 digits)
  if (!/^[0-7]{1,10}$/.test(number)) {
    return num
  }

  // Convert octal number to decimal
  const decimal = parseInt(number, 8);

  // Return decimal number
  return decimal >= 536870912 ? decimal - 1073741824 : decimal
}

/**
 * Converts an octal number to hexadecimal.
 *
 * Category: Engineering
 *
 * @param {*} number The octal number you want to convert. Number may not contain more than 10 octal characters (30 bits). The most significant bit of number is the sign bit. The remaining 29 bits are magnitude bits. Negative numbers are represented using two's-complement notation.
 * @param {*} places Optional. The number of characters to use. If places is omitted, OCT2HEX uses the minimum number of characters necessary. Places is useful for padding the return value with leading 0s (zeros).
 * @returns
 */
function OCT2HEX(number, places) {
  // Return error if number is not octal or contains more than ten characters (10 digits)
  if (!/^[0-7]{1,10}$/.test(number)) {
    return num
  }

  // Convert octal number to decimal
  const decimal = parseInt(number, 8);

  // Ignore places and return a 10-character octal number if number is negative
  if (decimal >= 536870912) {
    return 'ff' + (decimal + 3221225472).toString(16)
  }

  // Convert decimal number to hexadecimal
  const result = decimal.toString(16);

  // Return hexadecimal number using the minimum number of characters necessary if places is undefined
  if (places === undefined) {
    return result
  } else {
    // Return error if places is nonnumeric
    if (isNaN(places)) {
      return value
    }

    // Return error if places is negative
    if (places < 0) {
      return num
    }

    // Truncate places in case it is not an integer
    places = Math.floor(places);

    // Pad return value with leading 0s (zeros) if necessary (using Underscore.string)
    return places >= result.length ? REPT('0', places - result.length) + result : num
  }
}

const BETADIST = BETA.DIST;
const BETAINV = BETA.INV;
const BINOMDIST = BINOM.DIST;
const CEILINGMATH = CEILING.MATH;
const CEILINGPRECISE = CEILING.PRECISE;
const CHIDIST = CHISQ.DIST;
const CHIDISTRT = CHISQ.DIST.RT;
const CHIINV = CHISQ.INV;
const CHIINVRT = CHISQ.INV.RT;
const CHITEST = CHISQ.TEST;
const COVAR = COVARIANCE.P;
const COVARIANCEP = COVARIANCE.P;
const COVARIANCES = COVARIANCE.S;
const CRITBINOM = BINOM.INV;
const ERFCPRECISE = ERFC.PRECISE;
const ERFPRECISE = ERF.PRECISE;
const EXPONDIST = EXPON.DIST;
const FDIST = F.DIST;
const FDISTRT = F.DIST.RT;
const FINV = F.INV;
const FINVRT = F.INV.RT;
const FLOORMATH = FLOOR.MATH;
const FLOORPRECISE = FLOOR.PRECISE;
const FTEST = F.TEST;
const GAMMADIST = GAMMA.DIST;
const GAMMAINV = GAMMA.INV;
const GAMMALNPRECISE = GAMMALN.PRECISE;
const HYPGEOMDIST = HYPGEOM.DIST;
const LOGINV = LOGNORM.INV;
const LOGNORMDIST = LOGNORM.DIST;
const LOGNORMINV = LOGNORM.INV;
const MODEMULT = MODE.MULT;
const MODESNGL = MODE.SNGL;
const NEGBINOMDIST = NEGBINOM.DIST;
const NETWORKDAYSINTL = NETWORKDAYS.INTL;
const NORMDIST = NORM.DIST;
const NORMINV = NORM.INV;
const NORMSDIST = NORM.S.DIST;
const NORMSINV = NORM.S.INV;
const PERCENTILEEXC = PERCENTILE.EXC;
const PERCENTILEINC = PERCENTILE.INC;
const PERCENTRANKEXC = PERCENTRANK.EXC;
const PERCENTRANKINC = PERCENTRANK.INC;
const POISSONDIST = POISSON.DIST;
const QUARTILEEXC = QUARTILE.EXC;
const QUARTILEINC = QUARTILE.INC;
const RANKAVG = RANK.AVG;
const RANKEQ = RANK.EQ;
const SKEWP = SKEW.P;
const STDEVP = STDEV.P;
const STDEVS = STDEV.S;
const TDIST = T$1.DIST;
const TDISTRT = T$1.DIST.RT;
const TINV = T$1.INV;
const TTEST = T$1.TEST;
const VARP = VAR.P;
const VARS = VAR.S;
const WEIBULLDIST = WEIBULL.DIST;
const WORKDAYINTL = WORKDAY.INTL;
const ZTEST = Z.TEST;

function compact(array) {
  const result = [];

  arrayEach(array, (value) => {
    if (value) {
      result.push(value);
    }
  });

  return result
}

/**
 * Formula.js only
 *
 * @param {*} database
 * @param {*} title
 * @returns
 */
function FINDFIELD(database, title) {
  let index = null;

  arrayEach(database, (value, i) => {
    if (value[0] === title) {
      index = i;

      return false
    }
  });

  // Return error if the input field title is incorrect
  if (index == null) {
    return value
  }

  return index
}

function findResultIndex(database, criterias) {
  const matches = {};

  for (let i = 1; i < database[0].length; ++i) {
    matches[i] = true;
  }

  let maxCriteriaLength = criterias[0].length;

  for (let i = 1; i < criterias.length; ++i) {
    if (criterias[i].length > maxCriteriaLength) {
      maxCriteriaLength = criterias[i].length;
    }
  }

  for (let k = 1; k < database.length; ++k) {
    for (let l = 1; l < database[k].length; ++l) {
      let currentCriteriaResult = false;
      let hasMatchingCriteria = false;

      for (let j = 0; j < criterias.length; ++j) {
        const criteria = criterias[j];

        if (criteria.length < maxCriteriaLength) {
          continue
        }

        const criteriaField = criteria[0];

        if (database[k][0] !== criteriaField) {
          continue
        }

        hasMatchingCriteria = true;

        for (let p = 1; p < criteria.length; ++p) {
          if (!currentCriteriaResult) {
            const isWildcard = criteria[p] === void 0 || criteria[p] === '*';

            if (isWildcard) {
              currentCriteriaResult = true;
            } else {
              const tokenizedCriteria = parse(criteria[p] + '');
              const tokens = [createToken(database[k][l], TOKEN_TYPE_LITERAL)].concat(
                tokenizedCriteria
              );

              currentCriteriaResult = compute(tokens);
            }
          }
        }
      }

      if (hasMatchingCriteria) {
        matches[l] = matches[l] && currentCriteriaResult;
      }
    }
  }

  const result = [];

  for (let n = 0; n < database[0].length; ++n) {
    if (matches[n]) {
      result.push(n - 1);
    }
  }

  return result
}

// Database functions
/**
 * Returns the average of selected database entries.
 *
 * Category: Database
 *
 * @param {*} database Range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria Range of values that contains the conditions you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DAVERAGE(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  let sum = 0;

  arrayEach(resultIndexes, (value) => {
    sum += targetFields[value];
  });

  return resultIndexes.length === 0 ? div0 : sum / resultIndexes.length
}

/**
 * Counts the values that contain numbers in a database.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as the argument includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DCOUNT(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  const targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  return COUNT(targetValues)
}

/**
 * Counts nonblank values in a database.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Optional. Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DCOUNTA(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  const targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  return COUNTA(targetValues)
}

/**
 * Extracts from a database a single record that matches the specified criteria.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DGET(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  // Return error if no record meets the criteria
  if (resultIndexes.length === 0) {
    return value
  }
  // Returns the #NUM! error value because more than one record meets the
  // criteria
  if (resultIndexes.length > 1) {
    return num
  }

  return targetFields[resultIndexes[0]]
}

/**
 * Returns the maximum value from selected database entries.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DMAX(database, field, criteria) {
  // Return error if field is not a number and not a string

  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  let maxValue = targetFields[resultIndexes[0]];

  arrayEach(resultIndexes, (value) => {
    if (maxValue < targetFields[value]) {
      maxValue = targetFields[value];
    }
  });

  return maxValue
}

/**
 * Returns the minimum value from selected database entries.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DMIN(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  let minValue = targetFields[resultIndexes[0]];

  arrayEach(resultIndexes, (value) => {
    if (minValue > targetFields[value]) {
      minValue = targetFields[value];
    }
  });

  return minValue
}

/**
 * Multiplies the values in a particular field of records that match the criteria in a database.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DPRODUCT(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  let targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });
  targetValues = compact(targetValues);

  let result = 1;

  arrayEach(targetValues, (value) => {
    result *= value;
  });

  return result
}

/**
 * Estimates the standard deviation based on a sample of selected database entries.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DSTDEV(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  let targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  targetValues = compact(targetValues);

  return STDEV.S(targetValues)
}

/**
 * Calculates the standard deviation based on the entire population of selected database entries.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DSTDEVP(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  let targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  targetValues = compact(targetValues);

  return STDEV.P(targetValues)
}

/**
 * Adds the numbers in the field column of records in the database that match the criteria.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria Is the range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DSUM(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  const targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  return SUM(targetValues)
}

/**
 * Estimates variance based on a sample from selected database entries.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DVAR(database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  const targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  return VAR.S(targetValues)
}

/**
 * Calculates variance based on the entire population of selected database entries.
 *
 * Category: Database
 *
 * @param {*} database The range of values that makes up the list or database. A database is a list of related data in which rows of related information are records, and columns of data are fields. The first row of the list contains labels for each column.
 * @param {*} field Indicates which column is used in the function. Enter the column label enclosed between double quotation marks, such as "Age" or "Yield," or a number (without quotation marks) that represents the position of the column within the list: 1 for the first column, 2 for the second column, and so on.
 * @param {*} criteria The range of values that contains the conditions that you specify. You can use any range for the criteria argument, as long as it includes at least one column label and at least one value below the column label in which you specify a condition for the column.
 * @returns
 */
function DVARP(database, field, criteria) {
  // Return error if field is not a number and not a string

  if (isNaN(field) && typeof field !== 'string') {
    return value
  }

  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];

  if (typeof field === 'string') {
    const index = FINDFIELD(database, field);
    targetFields = rest(database[index]);
  } else {
    targetFields = rest(database[field]);
  }

  const targetValues = [];

  arrayEach(resultIndexes, (value) => {
    targetValues.push(targetFields[value]);
  });

  return VAR.P(targetValues)
}

function validDate(d) {
  return d && d.getTime && !isNaN(d.getTime())
}

function ensureDate(d) {
  return d instanceof Date ? d : new Date(d)
}

/**
 * Returns the accrued interest for a security that pays periodic interest.
 *
 * Category: Financial
 *
 * @param {*} issue The security's issue date.
 * @param {*} first_interest The security's first interest date.
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} rate The security's annual coupon rate.
 * @param {*} par The security's par value. If you omit par, ACCRINT uses $1,000.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @param {*} calc_method Optional. Not implemented in formulajs. A logical value that specifies the way to calculate the total accrued interest when the date of settlement is later than the date of first_interest. A value of TRUE (1) returns the total accrued interest from issue to settlement. A value of FALSE (0) returns the accrued interest from first_interest to settlement. If you do not enter the argument, it defaults to TRUE.
 * @returns
 */
function ACCRINT(issue, first_interest, settlement, rate, par, frequency, basis) {
  // Return error if either date is invalid
  issue = ensureDate(issue);
  first_interest = ensureDate(first_interest);
  settlement = ensureDate(settlement);

  if (!validDate(issue) || !validDate(first_interest) || !validDate(settlement)) {
    return value
  }

  // Return error if either rate or par are lower than or equal to zero
  if (rate <= 0 || par <= 0) {
    return num
  }

  // Return error if frequency is neither 1, 2, or 4
  if ([1, 2, 4].indexOf(frequency) === -1) {
    return num
  }

  // Return error if basis is neither 0, 1, 2, 3, or 4
  if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
    return num
  }

  // Return error if settlement is before or equal to issue
  if (settlement <= issue) {
    return num
  }

  // Set default values
  par = par || 0;
  basis = basis || 0;

  // Compute accrued interest
  return par * rate * YEARFRAC(issue, settlement, basis)
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the accrued interest for a security that pays interest at maturity.
 *
 * Category: Financial
 *
 * @param {*} issue The security's issue date.
 * @param {*} settlement The security's maturity date.
 * @param {*} rate The security's annual coupon rate.
 * @param {*} par The security's par value. If you omit par, ACCRINTM uses $1,000.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function ACCRINTM() {
  throw new Error('ACCRINTM is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the depreciation for each accounting period by using a depreciation coefficient.
 *
 * Category: Financial
 *
 * @param {*} cost The cost of the asset.
 * @param {*} date_purchased The date of the purchase of the asset.
 * @param {*} first_period The date of the end of the first period.
 * @param {*} salvage The salvage value at the end of the life of the asset.
 * @param {*} period The period.
 * @param {*} rate The rate of depreciation.
 * @param {*} basis Optional. The year basis to be used.
 * @returns
 */
function AMORDEGRC() {
  throw new Error('AMORDEGRC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the depreciation for each accounting period.
 *
 * Category: Financial
 *
 * @param {*} cost The cost of the asset.
 * @param {*} date_purchased The date of the purchase of the asset.
 * @param {*} first_period The date of the end of the first period.
 * @param {*} salvage The salvage value at the end of the life of the asset.
 * @param {*} period The period.
 * @param {*} rate The rate of depreciation.
 * @param {*} basis Optional. The year basis to be used.
 * @returns
 */
function AMORLINC() {
  throw new Error('AMORLINC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the number of days from the beginning of the coupon period to the settlement date.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function COUPDAYBS() {
  throw new Error('COUPDAYBS is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the number of days in the coupon period that contains the settlement date.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function COUPDAYS() {
  throw new Error('COUPDAYS is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the number of days from the settlement date to the next coupon date.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function COUPDAYSNC() {
  throw new Error('COUPDAYSNC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the next coupon date after the settlement date.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function COUPNCD() {
  throw new Error('COUPNCD is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the number of coupons payable between the settlement date and maturity date.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function COUPNUM() {
  throw new Error('COUPNUM is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the previous coupon date before the settlement date.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function COUPPCD() {
  throw new Error('COUPPCD is not implemented')
}

/**
 * Returns the cumulative interest paid between two periods.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate.
 * @param {*} nper The total number of payment periods.
 * @param {*} pv The present value.
 * @param {*} start_period The first period in the calculation. Payment periods are numbered beginning with 1.
 * @param {*} end_period The last period in the calculation.
 * @param {*} type The timing of the payment.
 * @returns
 */
function CUMIPMT(rate, nper, pv, start_period, end_period, type) {
  rate = parseNumber(rate);
  nper = parseNumber(nper);
  pv = parseNumber(pv);

  if (anyIsError(rate, nper, pv)) {
    return value
  }

  if (rate <= 0 || nper <= 0 || pv <= 0) {
    return num
  }

  if (start_period < 1 || end_period < 1 || start_period > end_period) {
    return num
  }

  if (type !== 0 && type !== 1) {
    return num
  }

  const payment = PMT(rate, nper, pv, 0, type);
  let interest = 0;

  if (start_period === 1) {
    if (type === 0) {
      interest = -pv;
    }

    start_period++;
  }

  for (let i = start_period; i <= end_period; i++) {
    interest += type === 1 ? FV(rate, i - 2, payment, pv, 1) - payment : FV(rate, i - 1, payment, pv, 0);
  }

  interest *= rate;

  return interest
}

/**
 * Returns the cumulative principal paid on a loan between two periods.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate.
 * @param {*} nper The total number of payment periods.
 * @param {*} pv The present value.
 * @param {*} start_period The first period in the calculation. Payment periods are numbered beginning with 1.
 * @param {*} end_period The last period in the calculation.
 * @param {*} type The timing of the payment.
 * @returns
 */
function CUMPRINC(rate, nper, pv, start_period, end, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
  rate = parseNumber(rate);
  nper = parseNumber(nper);
  pv = parseNumber(pv);

  if (anyIsError(rate, nper, pv)) {
    return value
  }

  // Return error if either rate, nper, or value are lower than or equal to zero
  if (rate <= 0 || nper <= 0 || pv <= 0) {
    return num
  }

  // Return error if start < 1, end < 1, or start > end
  if (start_period < 1 || end < 1 || start_period > end) {
    return num
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    return num
  }

  // Compute cumulative principal
  const payment = PMT(rate, nper, pv, 0, type);
  let principal = 0;

  if (start_period === 1) {
    principal = type === 0 ? payment + pv * rate : payment;

    start_period++;
  }

  for (let i = start_period; i <= end; i++) {
    principal +=
      type > 0
        ? payment - (FV(rate, i - 2, payment, pv, 1) - payment) * rate
        : payment - FV(rate, i - 1, payment, pv, 0) * rate;
  }

  // Return cumulative principal
  return principal
}

/**
 * Returns the depreciation of an asset for a specified period by using the fixed-declining balance method.
 *
 * Category: Financial
 *
 * @param {*} cost The initial cost of the asset.
 * @param {*} salvage The value at the end of the depreciation (sometimes called the salvage value of the asset).
 * @param {*} life The number of periods over which the asset is being depreciated (sometimes called the useful life of the asset).
 * @param {*} period The period for which you want to calculate the depreciation. Period must use the same units as life.
 * @param {*} month Optional. The number of months in the first year. If month is omitted, it is assumed to be 12.
 * @returns
 */
function DB(cost, salvage, life, period, month) {
  // Initialize month
  month = month === undefined ? 12 : month;

  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  period = parseNumber(period);
  month = parseNumber(month);

  if (anyIsError(cost, salvage, life, period, month)) {
    return value
  }

  // Return error if any of the parameters is negative
  if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
    return num
  }

  // Return error if month is not an integer between 1 and 12
  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(month) === -1) {
    return num
  }

  // Return error if period is greater than life
  if (period > life) {
    return num
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0
  }

  // Rate is rounded to three decimals places
  const rate = (1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

  // Compute initial depreciation
  const initial = (cost * rate * month) / 12;

  // Compute total depreciation
  let total = initial;
  let current = 0;
  const ceiling = period === life ? life - 1 : period;

  for (let i = 2; i <= ceiling; i++) {
    current = (cost - total) * rate;
    total += current;
  }

  // Depreciation for the first and last periods are special cases
  if (period === 1) {
    // First period
    return initial
  } else if (period === life) {
    // Last period

    return (cost - total) * rate
  } else {
    return current
  }
}

/**
 * Returns the depreciation of an asset for a specified period by using the double-declining balance method or some other method that you specify.
 *
 * Category: Financial
 *
 * @param {*} cost The initial cost of the asset.
 * @param {*} salvage The value at the end of the depreciation (sometimes called the salvage value of the asset). This value can be 0.
 * @param {*} life The number of periods over which the asset is being depreciated (sometimes called the useful life of the asset).
 * @param {*} period The period for which you want to calculate the depreciation. Period must use the same units as life.
 * @param {*} factor Optional. The rate at which the balance declines. If factor is omitted, it is assumed to be 2 (the double-declining balance method).
 * @returns
 */
function DDB(cost, salvage, life, period, factor) {
  // Initialize factor
  factor = factor === undefined ? 2 : factor;

  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  period = parseNumber(period);
  factor = parseNumber(factor);

  if (anyIsError(cost, salvage, life, period, factor)) {
    return value
  }

  // Return error if any of the parameters is negative or if factor is null
  if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
    return num
  }

  // Return error if period is greater than life
  if (period > life) {
    return num
  }

  // Return 0 (zero) if salvage is greater than or equal to cost
  if (salvage >= cost) {
    return 0
  }

  // Compute depreciation
  let total = 0;
  let current = 0;

  for (let i = 1; i <= period; i++) {
    current = Math.min((cost - total) * (factor / life), cost - salvage - total);
    total += current;
  }

  // Return depreciation
  return current
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the discount rate for a security.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} pr The security's price per $100 face value.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function DISC() {
  throw new Error('DISC is not implemented')
}

/**
 * Converts a dollar price, expressed as a fraction, into a dollar price, expressed as a decimal number.
 *
 * Category: Financial
 *
 * @param {*} fractional_dollar A number expressed as an integer part and a fraction part, separated by a decimal symbol.
 * @param {*} fraction The integer to use in the denominator of the fraction.
 * @returns
 */
function DOLLARDE(fractional_dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice
  fractional_dollar = parseNumber(fractional_dollar);
  fraction = parseNumber(fraction);

  if (anyIsError(fractional_dollar, fraction)) {
    return value
  }

  // Return error if fraction is negative
  if (fraction < 0) {
    return num
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    return div0
  }

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  let result = parseInt(fractional_dollar, 10);

  // Add decimal part
  result += ((fractional_dollar % 1) * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10))) / fraction;

  // Round result
  const power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
  result = Math.round(result * power) / power;

  // Return converted dollar price
  return result
}

/**
 * Converts a dollar price, expressed as a decimal number, into a dollar price, expressed as a fraction.
 *
 * Category: Financial
 *
 * @param {*} decimal_dollar A decimal number.
 * @param {*} fraction The integer to use in the denominator of a fraction.
 * @returns
 */
function DOLLARFR(decimal_dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice
  decimal_dollar = parseNumber(decimal_dollar);
  fraction = parseNumber(fraction);

  if (anyIsError(decimal_dollar, fraction)) {
    return value
  }

  // Return error if fraction is negative
  if (fraction < 0) {
    return num
  }

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) {
    return div0
  }

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  let result = parseInt(decimal_dollar, 10);

  // Add decimal part
  result += (decimal_dollar % 1) * Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) * fraction;

  // Return converted dollar price
  return result
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the annual duration of a security with periodic interest payments.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} coupon The security's annual coupon rate.
 * @param {*} yld The security's annual yield.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function DURATION() {
  throw new Error('DURATION is not implemented')
}

/**
 * Returns the effective annual interest rate.
 *
 * Category: Financial
 *
 * @param {*} nominal_rate The nominal interest rate.
 * @param {*} npery The number of compounding periods per year.
 * @returns
 */
function EFFECT(nominal_rate, npery) {
  nominal_rate = parseNumber(nominal_rate);
  npery = parseNumber(npery);

  if (anyIsError(nominal_rate, npery)) {
    return value
  }

  // Return error if rate <=0 or periods < 1
  if (nominal_rate <= 0 || npery < 1) {
    return num
  }

  // Truncate periods if it is not an integer
  npery = parseInt(npery, 10);

  // Return effective annual interest rate
  return Math.pow(1 + nominal_rate / npery, npery) - 1
}

/**
 * Returns the future value of an investment.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period.
 * @param {*} nper The total number of payment periods in an annuity.
 * @param {*} pmt The payment made each period; it cannot change over the life of the annuity. Typically, pmt contains principal and interest but no other fees or taxes. If pmt is omitted, you must include the pv argument.
 * @param {*} pv Optional. The present value, or the lump-sum amount that a series of future payments is worth right now. If pv is omitted, it is assumed to be 0 (zero), and you must include the pmt argument.
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due. If type is omitted, it is assumed to be 0.
 * @returns
 */
function FV(rate, nper, payment, value$1, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  value$1 = value$1 || 0;
  type = type || 0;

  rate = parseNumber(rate);
  nper = parseNumber(nper);
  payment = parseNumber(payment);
  value$1 = parseNumber(value$1);
  type = parseNumber(type);

  if (anyIsError(rate, nper, payment, value$1, type)) {
    return value
  }

  // Return future value
  let result;

  if (rate === 0) {
    result = value$1 + payment * nper;
  } else {
    const term = Math.pow(1 + rate, nper);

    result =
      type === 1
        ? value$1 * term + (payment * (1 + rate) * (term - 1)) / rate
        : value$1 * term + (payment * (term - 1)) / rate;
  }

  return -result
}

/**
 * Returns the future value of an initial principal after applying a series of compound interest rates.
 *
 * Category: Financial
 *
 * @param {*} principal The present value.
 * @param {*} schedule An array of interest rates to apply.
 * @returns
 */
function FVSCHEDULE(principal, schedule) {
  principal = parseNumber(principal);
  schedule = parseNumberArray(flatten(schedule));

  if (anyIsError(principal, schedule)) {
    return value
  }

  const n = schedule.length;
  let future = principal;

  // Apply all interests in schedule

  for (let i = 0; i < n; i++) {
    // Apply scheduled interest
    future *= 1 + schedule[i];
  }

  // Return future value
  return future
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the interest rate for a fully invested security.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} investment The amount invested in the security.
 * @param {*} redemption The amount to be received at maturity.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function INTRATE() {
  throw new Error('INTRATE is not implemented')
}

/**
 * Returns the interest payment for an investment for a given period.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period.
 * @param {*} per The period for which you want to find the interest and must be in the range 1 to nper.
 * @param {*} nper The total number of payment periods in an annuity.
 * @param {*} pv The present value, or the lump-sum amount that a series of future payments is worth right now.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (the future value of a loan, for example, is 0).
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due. If type is omitted, it is assumed to be 0.
 * @returns
 */
function IPMT(rate, per, nper, pv, fv, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  fv = fv || 0;
  type = type || 0;

  rate = parseNumber(rate);
  per = parseNumber(per);
  nper = parseNumber(nper);
  pv = parseNumber(pv);
  fv = parseNumber(fv);
  type = parseNumber(type);

  if (anyIsError(rate, per, nper, pv, fv, type)) {
    return value
  }

  // Compute payment
  const payment = PMT(rate, nper, pv, fv, type);

  // Compute interest
  let interest =
    per === 1
      ? type === 1
        ? 0
        : -pv
      : type === 1
      ? FV(rate, per - 2, payment, pv, 1) - payment
      : FV(rate, per - 1, payment, pv, 0);

  // Return interest
  return interest * rate
}

/**
 * Returns the internal rate of return for a series of cash flows.
 *
 * Category: Financial
 *
 * @param {*} values An array or a reference to values that contain numbers for which you want to calculate the internal rate of return.
 - Values must contain at least one positive value and one negative value to calculate the internal rate of return.
 - IRR uses the order of values to interpret the order of cash flows. Be sure to enter your payment and income values in the sequence you want.
 - If an array or reference argument contains text, logical values, or empty values, those values are ignored.
 * @param {*} guess Optional. A number that you guess is close to the result of IRR.
 - Microsoft Excel uses an iterative technique for calculating IRR. Starting with guess, IRR cycles through the calculation until the result is accurate within 0.00001 percent. If IRR can't find a result that works after 20 tries, the #NUM! error value is returned.
 - In most cases you do not need to provide guess for the IRR calculation. If guess is omitted, it is assumed to be 0.1 (10 percent).
 - If IRR gives the #NUM! error value, or if the result is not close to what you expected, try again with a different value for guess.
 * @returns
 */
function IRR(values, guess) {
  // Credits: algorithm inspired by Apache OpenOffice
  guess = guess || 0;

  values = parseNumberArray(flatten(values));
  guess = parseNumber(guess);

  if (anyIsError(values, guess)) {
    return value
  }

  // Calculates the resulting amount
  const irrResult = (values, dates, rate) => {
    const r = rate + 1;
    let result = values[0];

    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
    }

    return result
  };

  // Calculates the first derivation
  const irrResultDeriv = (values, dates, rate) => {
    const r = rate + 1;
    let result = 0;

    for (let i = 1; i < values.length; i++) {
      const frac = (dates[i] - dates[0]) / 365;
      result -= (frac * values[i]) / Math.pow(r, frac + 1);
    }

    return result
  };

  // Initialize dates and check that values contains at least one positive value and one negative value
  const dates = [];
  let positive = false;
  let negative = false;

  for (let i = 0; i < values.length; i++) {
    dates[i] = i === 0 ? 0 : dates[i - 1] + 365;

    if (values[i] > 0) {
      positive = true;
    }

    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    return num
  }

  // Initialize guess and resultRate
  guess = guess === undefined ? 0.1 : guess;
  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  const epsMax = 1e-10;

  // Implement Newton's method
  let newRate, epsRate, resultValue;
  let contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
  } while (contLoop)

  // Return internal rate of return
  return resultRate
}

/**
 * Calculates the interest paid during a specific period of an investment.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate for the investment.
 * @param {*} per The period for which you want to find the interest, and must be between 1 and Nper.
 * @param {*} nper The total number of payment periods for the investment.
 * @param {*} pv The present value of the investment. For a loan, Pv is the loan amount.
 *
 * @returns
 */
function ISPMT(rate, per, nper, pv) {
  rate = parseNumber(rate);
  per = parseNumber(per);
  nper = parseNumber(nper);
  pv = parseNumber(pv);

  if (anyIsError(rate, per, nper, pv)) {
    return value
  }

  // Return interest
  return pv * rate * (per / nper - 1)
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the Macauley modified duration for a security with an assumed par value of $100.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} coupon The security's annual coupon rate.
 * @param {*} yld The security's annual yield.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function MDURATION() {
  throw new Error('MDURATION is not implemented')
}

/**
 * Returns the internal rate of return where positive and negative cash flows are financed at different rates.
 *
 * Category: Financial
 *
 * @param {*} values An array or a reference to values that contain numbers. These numbers represent a series of payments (negative values) and income (positive values) occurring at regular periods.
 - Values must contain at least one positive value and one negative value to calculate the modified internal rate of return. Otherwise, MIRR returns the #DIV/0! error value.
 - If an array or reference argument contains text, logical values, or empty values, those values are ignored; however, values with the value zero are included.
 * @param {*} finance_rate The interest rate you pay on the money used in the cash flows.
 * @param {*} reinvest_rate The interest rate you receive on the cash flows as you reinvest them.
 * @returns
 */
function MIRR(values, finance_rate, reinvest_rate) {
  values = parseNumberArray(flatten(values));
  finance_rate = parseNumber(finance_rate);
  reinvest_rate = parseNumber(reinvest_rate);

  if (anyIsError(values, finance_rate, reinvest_rate)) {
    return value
  }

  // Initialize number of values
  const n = values.length;

  // Lookup payments (negative values) and incomes (positive values)
  const payments = [];
  const incomes = [];

  for (let i = 0; i < n; i++) {
    if (values[i] < 0) {
      payments.push(values[i]);
    } else {
      incomes.push(values[i]);
    }
  }

  // Return modified internal rate of return
  const num = -NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
  const den = NPV(finance_rate, payments) * (1 + finance_rate);

  return Math.pow(num / den, 1 / (n - 1)) - 1
}

/**
 * Returns the annual nominal interest rate.
 *
 * Category: Financial
 *
 * @param {*} effect_rate The effective interest rate.
 * @param {*} npery The number of compounding periods per year.
 * @returns
 */
function NOMINAL(effect_rate, npery) {
  effect_rate = parseNumber(effect_rate);
  npery = parseNumber(npery);

  if (anyIsError(effect_rate, npery)) {
    return value
  }

  // Return error if rate <=0 or periods < 1
  if (effect_rate <= 0 || npery < 1) {
    return num
  }

  // Truncate periods if it is not an integer
  npery = parseInt(npery, 10);

  // Return nominal annual interest rate
  return (Math.pow(effect_rate + 1, 1 / npery) - 1) * npery
}

/**
 * Returns the number of periods for an investment.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period.
 * @param {*} pmt The payment made each period; it cannot change over the life of the annuity. Typically, pmt contains principal and interest but no other fees or taxes.
 * @param {*} pv The present value, or the lump-sum amount that a series of future payments is worth right now.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (the future value of a loan, for example, is 0).
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due.
 * @returns
 */
function NPER(rate, pmt, pv, fv, type) {
  type = type === undefined ? 0 : type;
  fv = fv === undefined ? 0 : fv;

  rate = parseNumber(rate);
  pmt = parseNumber(pmt);
  pv = parseNumber(pv);
  fv = parseNumber(fv);
  type = parseNumber(type);

  if (anyIsError(rate, pmt, pv, fv, type)) {
    return value
  }

  if (rate === 0) {
    return -(pv + fv) / pmt
  } else {
    const num = pmt * (1 + rate * type) - fv * rate;
    const den = pv * rate + pmt * (1 + rate * type);

    return Math.log(num / den) / Math.log(1 + rate)
  }
}

/**
 * Returns the net present value of an investment based on a series of periodic cash flows and a discount rate.
 *
 * Category: Financial
 *
 * @param {*} rate The rate of discount over the length of one period.
 * @param {*} args value1, value2, ... Value1 is required, subsequent values are optional. 1 to 254 arguments representing the payments and income.
 - value1, value2, ... must be equally spaced in time and occur at the end of each period.
 - NPV uses the order of value1, value2, ... to interpret the order of cash flows. Be sure to enter your payment and income values in the correct sequence.
 - Arguments that are empty values, logical values, or text representations of numbers, error values, or text that cannot be translated into numbers are ignored.
 - If an argument is an array or reference, only numbers in that array or reference are counted. Empty values, logical values, text, or error values in the array or reference are ignored.
 * @returns
 */
function NPV() {
  const args = parseNumberArray(flatten(arguments));

  if (args instanceof Error) {
    return args
  }

  // Lookup rate
  const rate = args[0];

  // Initialize net present value
  let value = 0;

  // Loop on all values
  for (let j = 1; j < args.length; j++) {
    value += args[j] / Math.pow(1 + rate, j);
  }

  // Return net present value
  return value
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the price per $100 face value of a security with an odd first period.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} issue The security's issue date.
 * @param {*} first_coupon The security's first coupon date.
 * @param {*} rate The security's interest rate.
 * @param {*} yld The security's annual yield.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function ODDFPRICE() {
  throw new Error('ODDFPRICE is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the yield of a security with an odd first period.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} issue The security's issue date.
 * @param {*} first_coupon The security's first coupon date.
 * @param {*} rate The security's interest rate.
 * @param {*} pr The security's price.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function ODDFYIELD() {
  throw new Error('ODDFYIELD is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the price per $100 face value of a security with an odd last period.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} last_interest The security's last coupon date.
 * @param {*} rate The security's interest rate.
 * @param {*} yld The security's annual yield.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function ODDLPRICE() {
  throw new Error('ODDLPRICE is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the yield of a security with an odd last period.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} last_interest The security's last coupon date.
 * @param {*} rate The security's interest rate
 * @param {*} pr The security's price.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function ODDLYIELD() {
  throw new Error('ODDLYIELD is not implemented')
}

/**
 * Returns the number of periods required by an investment to reach a specified value.
 *
 * Category: Financial
 *
 * @param {*} rate Rate is the interest rate per period.
 * @param {*} pv Pv is the present value of the investment.
 * @param {*} fv Fv is the desired future value of the investment.
 * @returns
 */
function PDURATION(rate, pv, fv) {
  rate = parseNumber(rate);
  pv = parseNumber(pv);
  fv = parseNumber(fv);

  if (anyIsError(rate, pv, fv)) {
    return value
  }

  // Return error if rate <=0
  if (rate <= 0) {
    return num
  }

  // Return number of periods
  return (Math.log(fv) - Math.log(pv)) / Math.log(1 + rate)
}

/**
 * Returns the periodic payment for an annuity.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate for the loan.
 * @param {*} nper The total number of payments for the loan.
 * @param {*} pv The present value, or the total amount that a series of future payments is worth now; also known as the principal.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
 * @param {*} type Optional. The number 0 (zero) or 1 and indicates when payments are due.
 * @returns
 */
function PMT(rate, nper, pv, fv, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  fv = fv || 0;
  type = type || 0;

  rate = parseNumber(rate);
  nper = parseNumber(nper);
  pv = parseNumber(pv);
  fv = parseNumber(fv);
  type = parseNumber(type);

  if (anyIsError(rate, nper, pv, fv, type)) {
    return value
  }

  // Return payment
  let result;

  if (rate === 0) {
    result = (pv + fv) / nper;
  } else {
    const term = Math.pow(1 + rate, nper);

    result =
      type === 1
        ? ((fv * rate) / (term - 1) + (pv * rate) / (1 - 1 / term)) / (1 + rate)
        : (fv * rate) / (term - 1) + (pv * rate) / (1 - 1 / term);
  }

  return -result
}

/**
 * Returns the payment on the principal for an investment for a given period.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period.
 * @param {*} per Specifies the period and must be in the range 1 to nper.
 * @param {*} nper The total number of payment periods in an annuity.
 * @param {*} pv The present value — the total amount that a series of future payments is worth now.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due.
 * @returns
 */
function PPMT(rate, per, nper, pv, fv, type) {
  fv = fv || 0;
  type = type || 0;

  rate = parseNumber(rate);
  nper = parseNumber(nper);
  pv = parseNumber(pv);
  fv = parseNumber(fv);
  type = parseNumber(type);

  if (anyIsError(rate, nper, pv, fv, type)) {
    return value
  }

  return PMT(rate, nper, pv, fv, type) - IPMT(rate, per, nper, pv, fv, type)
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the price per $100 face value of a security that pays periodic interest.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} rate The security's annual coupon rate.
 * @param {*} yld The security's annual yield.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function PRICE() {
  throw new Error('PRICE is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the price per $100 face value of a discounted security.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} discount The security's discount rate.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function PRICEDISC() {
  throw new Error('PRICEDISC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the price per $100 face value of a security that pays interest at maturity.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} issue The security's issue date, expressed as a serial date number.
 * @param {*} rate The security's interest rate at date of issue.
 * @param {*} yld The security's annual yield.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function PRICEMAT() {
  throw new Error('PRICEMAT is not implemented')
}

/**
 * Returns the present value of an investment.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period. For example, if you obtain an automobile loan at a 10 percent annual interest rate and make monthly payments, your interest rate per month is 10%/12, or 0.83%. You would enter 10%/12, or 0.83%, or 0.0083, into the formula as the rate.
 * @param {*} nper The total number of payment periods in an annuity. For example, if you get a four-year car loan and make monthly payments, your loan has 4*12 (or 48) periods. You would enter 48 into the formula for nper.
 * @param {*} pmt The payment made each period and cannot change over the life of the annuity. Typically, pmt includes principal and interest but no other fees or taxes. For example, the monthly payments on a $10,000, four-year car loan at 12 percent are $263.33. You would enter -263.33 into the formula as the pmt. If pmt is omitted, you must include the fv argument.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (the future value of a loan, for example, is 0). For example, if you want to save $50,000 to pay for a special project in 18 years, then $50,000 is the future value. You could then make a conservative guess at an interest rate and determine how much you must save each month. If fv is omitted, you must include the pmt argument.
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due.
 * @returns
 */
function PV(rate, per, pmt, fv, type) {
  fv = fv || 0;
  type = type || 0;

  rate = parseNumber(rate);
  per = parseNumber(per);
  pmt = parseNumber(pmt);
  fv = parseNumber(fv);
  type = parseNumber(type);

  if (anyIsError(rate, per, pmt, fv, type)) {
    return value
  }

  // Return present value
  return rate === 0
    ? -pmt * per - fv
    : (((1 - Math.pow(1 + rate, per)) / rate) * pmt * (1 + rate * type) - fv) / Math.pow(1 + rate, per)
}

/**
 * Returns the interest rate per period of an annuity.
 *
 * Category: Financial
 *
 * @param {*} nper The total number of payment periods in an annuity.
 * @param {*} pmt The payment made each period and cannot change over the life of the annuity. Typically, pmt includes principal and interest but no other fees or taxes. If pmt is omitted, you must include the fv argument.
 * @param {*} pv The present value — the total amount that a series of future payments is worth now.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (the future value of a loan, for example, is 0). If fv is omitted, you must include the pmt argument.
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due.
 * @param {*} guess Optional. Your guess for what the rate will be. If you omit guess, it is assumed to be 10 percent. If RATE does not converge, try different values for guess. RATE usually converges if guess is between 0 and 1.
 - If you omit guess, it is assumed to be 10 percent.
 - If RATE does not converge, try different values for guess. RATE usually converges if guess is between 0 and 1.
 * @returns
 */
function RATE(nper, pmt, pv, fv, type, guess) {
  guess = guess === undefined ? 0.01 : guess;
  fv = fv === undefined ? 0 : fv;
  type = type === undefined ? 0 : type;

  nper = parseNumber(nper);
  pmt = parseNumber(pmt);
  pv = parseNumber(pv);
  fv = parseNumber(fv);
  type = parseNumber(type);
  guess = parseNumber(guess);

  if (anyIsError(nper, pmt, pv, fv, type, guess)) {
    return value
  }

  const epsMax = 1e-10;
  const iterMax = 20;
  let rate = guess;

  type = type ? 1 : 0;

  for (let i = 0; i < iterMax; i++) {
    if (rate <= -1) {
      return num
    }

    let y, f;

    if (Math.abs(rate) < epsMax) {
      y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
    } else {
      f = Math.pow(1 + rate, nper);
      y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
    }

    if (Math.abs(y) < epsMax) {
      return rate
    }

    let dy;

    if (Math.abs(rate) < epsMax) {
      dy = pv * nper + pmt * type * nper;
    } else {
      f = Math.pow(1 + rate, nper);
      const df = nper * Math.pow(1 + rate, nper - 1);
      dy = pv * df + pmt * (1 / rate + type) * df + pmt * (-1 / (rate * rate)) * (f - 1);
    }

    rate -= y / dy;
  }

  return rate
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the amount received at maturity for a fully invested security.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} investment The amount invested in the security.
 * @param {*} discount The security's discount rate.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function RECEIVED() {
  throw new Error('RECEIVED is not implemented')
}

/**
 * Returns an equivalent interest rate for the growth of an investment.
 *
 * Category: Financial
 *
 * @param {*} nper Nper is the number of periods for the investment.
 * @param {*} pv Pv is the present value of the investment.
 * @param {*} fv Fv is the future value of the investment.
 * @returns
 */
function RRI(nper, pv, fv) {
  nper = parseNumber(nper);
  pv = parseNumber(pv);
  fv = parseNumber(fv);

  if (anyIsError(nper, pv, fv)) {
    return value
  }

  // Return error if nper or present is equal to 0 (zero)
  if (nper === 0 || pv === 0) {
    return num
  }

  // Return equivalent interest rate
  return Math.pow(fv / pv, 1 / nper) - 1
}

/**
 * Returns the straight-line depreciation of an asset for one period.
 *
 * Category: Financial
 *
 * @param {*} cost The initial cost of the asset.
 * @param {*} salvage The value at the end of the depreciation (sometimes called the salvage value of the asset).
 * @param {*} life The number of periods over which the asset is depreciated (sometimes called the useful life of the asset).
 * @returns
 */
function SLN(cost, salvage, life) {
  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);

  if (anyIsError(cost, salvage, life)) {
    return value
  }

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    return num
  }

  // Return straight-line depreciation
  return (cost - salvage) / life
}

/**
 * Returns the sum-of-years' digits depreciation of an asset for a specified period.
 *
 * Category: Financial
 *
 * @param {*} cost The initial cost of the asset.
 * @param {*} salvage The value at the end of the depreciation (sometimes called the salvage value of the asset).
 * @param {*} life The number of periods over which the asset is depreciated (sometimes called the useful life of the asset).
 * @param {*} per The period and must use the same units as life.
 * @returns
 */
function SYD(cost, salvage, life, per) {
  // Return error if any of the parameters is not a number
  cost = parseNumber(cost);
  salvage = parseNumber(salvage);
  life = parseNumber(life);
  per = parseNumber(per);

  if (anyIsError(cost, salvage, life, per)) {
    return value
  }

  // Return error if life equal to 0 (zero)
  if (life === 0) {
    return num
  }

  // Return error if period is lower than 1 or greater than life
  if (per < 1 || per > life) {
    return num
  }

  // Truncate period if it is not an integer
  per = parseInt(per, 10);

  // Return straight-line depreciation
  return ((cost - salvage) * (life - per + 1) * 2) / (life * (life + 1))
}

/**
 * Returns the bond-equivalent yield for a Treasury bill.
 *
 * Category: Financial
 *
 * @param {*} settlement The Treasury bill's settlement date. The security settlement date is the date after the issue date when the Treasury bill is traded to the buyer.
 * @param {*} maturity The Treasury bill's maturity date. The maturity date is the date when the Treasury bill expires.
 * @param {*} discount The Treasury bill's discount rate.
 * @returns
 */
function TBILLEQ(settlement, maturity, discount) {
  settlement = parseDate(settlement);
  maturity = parseDate(maturity);
  discount = parseNumber(discount);

  if (anyIsError(settlement, maturity, discount)) {
    return value
  }

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    return num
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return num
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return num
  }

  // Return bond-equivalent yield
  return (365 * discount) / (360 - discount * DAYS360(settlement, maturity, false))
}

/**
 * Returns the price per $100 face value for a Treasury bill.
 *
 * Category: Financial
 *
 * @param {*} settlement The Treasury bill's settlement date. The security settlement date is the date after the issue date when the Treasury bill is traded to the buyer.
 * @param {*} maturity The Treasury bill's maturity date. The maturity date is the date when the Treasury bill expires.
 * @param {*} discount The Treasury bill's discount rate.
 * @returns
 */
function TBILLPRICE(settlement, maturity, discount) {
  settlement = parseDate(settlement);
  maturity = parseDate(maturity);
  discount = parseNumber(discount);

  if (anyIsError(settlement, maturity, discount)) {
    return value
  }

  // Return error if discount is lower than or equal to zero
  if (discount <= 0) {
    return num
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return num
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return num
  }

  // Return bond-equivalent yield
  return 100 * (1 - (discount * DAYS360(settlement, maturity, false)) / 360)
}

/**
 * Returns the yield for a Treasury bill.
 *
 * Category: Financial
 *
 * @param {*} settlement The Treasury bill's settlement date. The security settlement date is the date after the issue date when the Treasury bill is traded to the buyer.
 * @param {*} maturity The Treasury bill's maturity date. The maturity date is the date when the Treasury bill expires.
 * @param {*} pr The Treasury bill's price per $100 face value.
 * @returns
 */
function TBILLYIELD(settlement, maturity, pr) {
  settlement = parseDate(settlement);
  maturity = parseDate(maturity);
  pr = parseNumber(pr);

  if (anyIsError(settlement, maturity, pr)) {
    return value
  }

  // Return error if price is lower than or equal to zero
  if (pr <= 0) {
    return num
  }

  // Return error if settlement is greater than maturity
  if (settlement > maturity) {
    return num
  }

  // Return error if maturity is more than one year after settlement
  if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
    return num
  }

  // Return bond-equivalent yield
  return ((100 - pr) * 360) / (pr * DAYS360(settlement, maturity, false))
}

// TODO
/**
 * -- Not implemented --
 * 
 * Returns the depreciation of an asset for a specified or partial period by using a declining balance method.
 *
 * Category: Financial
 *
 * @param {*} cost The initial cost of the asset.
 * @param {*} salvage The value at the end of the depreciation (sometimes called the salvage value of the asset). This value can be 0.
 * @param {*} life The number of periods over which the asset is depreciated (sometimes called the useful life of the asset).
 * @param {*} start_period The starting period for which you want to calculate the depreciation. Start_period must use the same units as life.
 * @param {*} end_period The ending period for which you want to calculate the depreciation. End_period must use the same units as life.
 * @param {*} factor Optional. The rate at which the balance declines. If factor is omitted, it is assumed to be 2 (the double-declining balance method). Change factor if you do not want to use the double-declining balance method. For a description of the double-declining balance method, see DDB.
 * @param {*} no_switch Optional. A logical value specifying whether to switch to straight-line depreciation when depreciation is greater than the declining balance calculation.
 - If no_switch is TRUE, Microsoft Excel does not switch to straight-line depreciation even when the depreciation is greater than the declining balance calculation.
 - If no_switch is FALSE or omitted, Excel switches to straight-line depreciation when depreciation is greater than the declining balance calculation.
 * @returns
 */
function VDB() {
  throw new Error('VDB is not implemented')
}

/**
 * Returns the internal rate of return for a schedule of cash flows that is not necessarily periodic.
 *
 * Category: Financial
 *
 * @param {*} values A series of cash flows that corresponds to a schedule of payments in dates. The first payment is optional and corresponds to a cost or payment that occurs at the beginning of the investment. If the first value is a cost or payment, it must be a negative value. All succeeding payments are discounted based on a 365-day year. The series of values must contain at least one positive and one negative value.
 * @param {*} dates A schedule of payment dates that corresponds to the cash flow payments. Dates may occur in any order. Dates should be entered by using the DATE function, or as results of other formulas or functions. For example, use DATE(2008,5,23) for the 23rd day of May, 2008. Problems can occur if dates are entered as text. .
 * @param {*} guess Optional. A number that you guess is close to the result of XIRR.
 * @returns
 */
function XIRR(values, dates, guess) {
  // Credits: algorithm inspired by Apache OpenOffice
  values = parseNumberArray(flatten(values));
  dates = parseDateArray(flatten(dates));
  guess = parseNumber(guess);

  if (anyIsError(values, dates, guess)) {
    return value
  }

  // Calculates the resulting amount
  const irrResult = (values, dates, rate) => {
    const r = rate + 1;
    let result = values[0];

    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, DAYS(dates[i], dates[0]) / 365);
    }

    return result
  };

  // Calculates the first derivation
  const irrResultDeriv = (values, dates, rate) => {
    const r = rate + 1;
    let result = 0;

    for (let i = 1; i < values.length; i++) {
      const frac = DAYS(dates[i], dates[0]) / 365;
      result -= (frac * values[i]) / Math.pow(r, frac + 1);
    }

    return result
  };

  // Check that values contains at least one positive value and one negative value
  let positive = false;
  let negative = false;

  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      positive = true;
    }

    if (values[i] < 0) {
      negative = true;
    }
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) {
    return num
  }

  // Initialize guess and resultRate
  guess = guess || 0.1;
  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  const epsMax = 1e-10;

  // Implement Newton's method
  let newRate, epsRate, resultValue;
  let contLoop = true;

  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
  } while (contLoop)

  // Return internal rate of return
  return resultRate
}

/**
 * Returns the net present value for a schedule of cash flows that is not necessarily periodic.
 *
 * Category: Financial
 *
 * @param {*} rate The discount rate to apply to the cash flows.
 * @param {*} values A series of cash flows that corresponds to a schedule of payments in dates. The first payment is optional and corresponds to a cost or payment that occurs at the beginning of the investment. If the first value is a cost or payment, it must be a negative value. All succeeding payments are discounted based on a 365-day year. The series of values must contain at least one positive value and one negative value.
 * @param {*} dates A schedule of payment dates that corresponds to the cash flow payments. The first payment date indicates the beginning of the schedule of payments. All other dates must be later than this date, but they may occur in any order.
 * @returns
 */
function XNPV(rate, values, dates) {
  rate = parseNumber(rate);
  values = parseNumberArray(flatten(values));
  dates = parseDateArray(flatten(dates));

  if (anyIsError(rate, values, dates)) {
    return value
  }

  let result = 0;

  for (let i = 0; i < values.length; i++) {
    result += values[i] / Math.pow(1 + rate, DAYS(dates[i], dates[0]) / 365);
  }

  return result
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the yield on a security that pays periodic interest.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} rate The security's annual coupon rate.
 * @param {*} pr The security's price per $100 face value.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} frequency The number of coupon payments per year. For annual payments, frequency = 1; for semiannual, frequency = 2; for quarterly, frequency = 4.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function YIELD() {
  throw new Error('YIELD is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the annual yield for a discounted security; for example, a Treasury bill.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} pr The security's price per $100 face value.
 * @param {*} redemption The security's redemption value per $100 face value.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function YIELDDISC() {
  throw new Error('YIELDDISC is not implemented')
}

// TODO
/**
 * -- Not implemented --
 *
 * Returns the annual yield of a security that pays interest at maturity.
 *
 * Category: Financial
 *
 * @param {*} settlement The security's settlement date. The security settlement date is the date after the issue date when the security is traded to the buyer.
 * @param {*} maturity The security's maturity date. The maturity date is the date when the security expires.
 * @param {*} issue The security's issue date, expressed as a serial date number.
 * @param {*} rate The security's interest rate at date of issue.
 * @param {*} pr The security's price per $100 face value.
 * @param {*} basis Optional. The type of day count basis to use.
 * @returns
 */
function YIELDMAT() {
  throw new Error('YIELDMAT is not implemented')
}

/**
 * Returns TRUE if all of its arguments are TRUE.
 *
 * Category: Logical
 *
 * @returns
 */
function AND() {
  const args = flatten(arguments);
  let result = value;

  for (let i = 0; i < args.length; i++) {
    if (args[i] instanceof Error) {
      return args[i]
    }

    if (args[i] === undefined || args[i] === null || typeof args[i] === 'string') {
      continue
    }

    if (result === value) {
      result = true;
    }

    if (!args[i]) {
      result = false;
    }
  }

  return result
}

/**
 * Returns the logical value FALSE.
 *
 * Category: Logical
 *
 * @returns
 */
function FALSE() {
  return false
}

/**
 * Specifies a logical test to perform.
 *
 * Category: Logical
 *
 * @param {*} logical_test
 * @param {*} value_if_true
 * @param {*} value_if_false
 *
 * @returns
 */
function IF(logical_test, value_if_true, value_if_false) {
  if (logical_test instanceof Error) {
    return logical_test
  }

  value_if_true = arguments.length >= 2 ? value_if_true : true;

  if (value_if_true === undefined || value_if_true === null) {
    value_if_true = 0;
  }

  value_if_false = arguments.length === 3 ? value_if_false : false;

  if (value_if_false === undefined || value_if_false === null) {
    value_if_false = 0;
  }

  return logical_test ? value_if_true : value_if_false
}

/**
 * Checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition.
 *
 * Category: Logical
 *
 * @returns
 */
function IFS() {
  for (let i = 0; i < arguments.length / 2; i++) {
    if (arguments[i * 2]) {
      return arguments[i * 2 + 1]
    }
  }

  return na
}

/**
 * Returns a value you specify if a formula evaluates to an error; otherwise, returns the result of the formula.
 *
 * Category: Logical
 *
 * @param {*} value The argument that is checked for an error.
 * @param {*} value_if_error The value to return if the formula evaluates to an error. The following error types are evaluated: #N/A, #VALUE!, #REF!, #DIV/0!, #NUM!, #NAME?, or #NULL!.
 * @returns
 */
function IFERROR(value, value_if_error) {
  if (ISERROR(value)) {
    return value_if_error
  }

  return value
}

/**
 * Returns the value you specify if the expression resolves to #N/A, otherwise returns the result of the expression.
 *
 * Category: Logical
 *
 * @returns
 */
function IFNA(value, value_if_na) {
  return value === na ? value_if_na : value
}

/**
 * Reverses the logic of its argument.
 *
 * Category: Logical
 *
 * @returns
 */
function NOT(logical) {
  if (typeof logical === 'string') {
    return value
  }

  if (logical instanceof Error) {
    return logical
  }

  return !logical
}

/**
 * Returns TRUE if any argument is TRUE.
 *
 * Category: Logical
 *
 * @returns
 */
function OR() {
  const args = flatten(arguments);
  let result = value;

  for (let i = 0; i < args.length; i++) {
    if (args[i] instanceof Error) {
      return args[i]
    }

    if (args[i] === undefined || args[i] === null || typeof args[i] === 'string') {
      continue
    }

    if (result === value) {
      result = false;
    }

    if (args[i]) {
      result = true;
    }
  }

  return result
}

/**
 * Returns the logical value TRUE.
 *
 * Category: Logical
 *
 * @returns
 */
function TRUE() {
  return true
}

/**
 * Returns a logical exclusive OR of all arguments.
 *
 * Category: Logical
 *
 * @param {*} args logical1, logical2,… Logical 1 is required, subsequent logical values are optional. 1 to 254 conditions you want to test that can be either TRUE or FALSE, and can be logical values, arrays, or references.
 * @returns
 */
function XOR() {
  const args = flatten(arguments);
  let result = value;

  for (let i = 0; i < args.length; i++) {
    if (args[i] instanceof Error) {
      return args[i]
    }

    if (args[i] === undefined || args[i] === null || typeof args[i] === 'string') {
      continue
    }

    if (result === value) {
      result = 0;
    }

    if (args[i]) {
      result++;
    }
  }

  if (result === value) {
    return result
  }

  return !!(Math.floor(Math.abs(result)) & 1)
}

/**
 * Evaluates an expression against a list of values and returns the result corresponding to the first matching value. If there is no match, an optional default value may be returned.
 *
 * Category: Logical
 *
 * @returns
 */
function SWITCH() {
  let result;

  if (arguments.length > 0) {
    const targetValue = arguments[0];
    const argc = arguments.length - 1;
    const switchCount = Math.floor(argc / 2);
    let switchSatisfied = false;
    const hasDefaultClause = argc % 2 !== 0;
    const defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];

    if (switchCount) {
      for (let index = 0; index < switchCount; index++) {
        if (targetValue === arguments[index * 2 + 1]) {
          result = arguments[index * 2 + 2];
          switchSatisfied = true;
          break
        }
      }
    }

    if (!switchSatisfied) {
      result = hasDefaultClause ? defaultClause : na;
    }
  } else {
    result = value;
  }

  return result
}

const FLATTEN = flatten;

function ARGS2ARRAY() {
  return Array.prototype.slice.call(arguments, 0)
}

/**
 * Formula.js only
 *
 * @param {*} context
 * @param {*} reference
 * @returns
 */
function REFERENCE(context, reference) {
  if (!arguments.length) {
    return error
  }

  try {
    const path = reference.split('.');
    let result = context;

    for (let i = 0; i < path.length; ++i) {
      const step = path[i];

      if (step[step.length - 1] === ']') {
        const opening = step.indexOf('[');
        const index = step.substring(opening + 1, step.length - 1);
        result = result[step.substring(0, opening)][index];
      } else {
        result = result[step];
      }
    }

    return result
  } catch (error) {}
}

/**
 * Formula.js only
 *
 * @param {*} array
 * @param {*} separator
 * @returns
 */
function JOIN(array, separator) {
  return array.join(separator)
}

/**
 * Formula.js only
 *
 * @returns
 */
function NUMBERS() {
  const possibleNumbers = flatten(arguments);

  return possibleNumbers.filter((el) => typeof el === 'number')
}

/**
 * SINGLE (@ symbol)
 *
 * Implicit intersection - Reduces many values to a single value, e.g. [[1, 2], [3, 4]] -> 1. Supports Excel versions without dynamic array functionality.
 *
 * @param {*} value The value to be reduced to a single value. Can be a number, string, boolean, array, etc.
 * @returns
 */
function SINGLE(value) {
  if (value instanceof Array) {
    for (let i = 0; i < value.length; i++) {
      if (!(value[i] instanceof Array)) {
        return na
      }

      if (value[i].length === 0) {
        return na
      }

      if (value[i].length !== value[0].length) {
        return na
      }
    }

    return value[0][0]
  }

  return value
}

exports.ABS = ABS;
exports.ACCRINT = ACCRINT;
exports.ACCRINTM = ACCRINTM;
exports.ACOS = ACOS;
exports.ACOSH = ACOSH;
exports.ACOT = ACOT;
exports.ACOTH = ACOTH;
exports.ADD = ADD;
exports.AGGREGATE = AGGREGATE;
exports.AMORDEGRC = AMORDEGRC;
exports.AMORLINC = AMORLINC;
exports.AND = AND;
exports.ARABIC = ARABIC;
exports.ARGS2ARRAY = ARGS2ARRAY;
exports.ASC = ASC;
exports.ASIN = ASIN;
exports.ASINH = ASINH;
exports.ATAN = ATAN;
exports.ATAN2 = ATAN2;
exports.ATANH = ATANH;
exports.AVEDEV = AVEDEV;
exports.AVERAGE = AVERAGE;
exports.AVERAGEA = AVERAGEA;
exports.AVERAGEIF = AVERAGEIF;
exports.AVERAGEIFS = AVERAGEIFS;
exports.BAHTTEXT = BAHTTEXT;
exports.BASE = BASE$1;
exports.BESSELI = BESSELI;
exports.BESSELJ = BESSELJ;
exports.BESSELK = BESSELK;
exports.BESSELY = BESSELY;
exports.BETA = BETA;
exports.BETADIST = BETADIST;
exports.BETAINV = BETAINV;
exports.BIN2DEC = BIN2DEC;
exports.BIN2HEX = BIN2HEX;
exports.BIN2OCT = BIN2OCT;
exports.BINOM = BINOM;
exports.BINOMDIST = BINOMDIST;
exports.BITAND = BITAND;
exports.BITLSHIFT = BITLSHIFT;
exports.BITOR = BITOR;
exports.BITRSHIFT = BITRSHIFT;
exports.BITXOR = BITXOR;
exports.CEILING = CEILING;
exports.CEILINGMATH = CEILINGMATH;
exports.CEILINGPRECISE = CEILINGPRECISE;
exports.CELL = CELL;
exports.CHAR = CHAR;
exports.CHIDIST = CHIDIST;
exports.CHIDISTRT = CHIDISTRT;
exports.CHIINV = CHIINV;
exports.CHIINVRT = CHIINVRT;
exports.CHISQ = CHISQ;
exports.CHITEST = CHITEST;
exports.CHOOSE = CHOOSE;
exports.CLEAN = CLEAN;
exports.CODE = CODE;
exports.COLUMN = COLUMN;
exports.COLUMNS = COLUMNS;
exports.COMBIN = COMBIN;
exports.COMBINA = COMBINA;
exports.COMPLEX = COMPLEX;
exports.CONCAT = CONCAT;
exports.CONCATENATE = CONCATENATE;
exports.CONFIDENCE = CONFIDENCE;
exports.CONVERT = CONVERT;
exports.CORREL = CORREL;
exports.COS = COS;
exports.COSH = COSH;
exports.COT = COT;
exports.COTH = COTH;
exports.COUNT = COUNT;
exports.COUNTA = COUNTA;
exports.COUNTBLANK = COUNTBLANK;
exports.COUNTIF = COUNTIF;
exports.COUNTIFS = COUNTIFS;
exports.COUNTIN = COUNTIN;
exports.COUNTUNIQUE = COUNTUNIQUE;
exports.COUPDAYBS = COUPDAYBS;
exports.COUPDAYS = COUPDAYS;
exports.COUPDAYSNC = COUPDAYSNC;
exports.COUPNCD = COUPNCD;
exports.COUPNUM = COUPNUM;
exports.COUPPCD = COUPPCD;
exports.COVAR = COVAR;
exports.COVARIANCE = COVARIANCE;
exports.COVARIANCEP = COVARIANCEP;
exports.COVARIANCES = COVARIANCES;
exports.CRITBINOM = CRITBINOM;
exports.CSC = CSC;
exports.CSCH = CSCH;
exports.CUMIPMT = CUMIPMT;
exports.CUMPRINC = CUMPRINC;
exports.DATE = DATE;
exports.DATEDIF = DATEDIF;
exports.DATEVALUE = DATEVALUE;
exports.DAVERAGE = DAVERAGE;
exports.DAY = DAY;
exports.DAYS = DAYS;
exports.DAYS360 = DAYS360;
exports.DB = DB;
exports.DBCS = DBCS;
exports.DCOUNT = DCOUNT;
exports.DCOUNTA = DCOUNTA;
exports.DDB = DDB;
exports.DEC2BIN = DEC2BIN;
exports.DEC2HEX = DEC2HEX;
exports.DEC2OCT = DEC2OCT;
exports.DECIMAL = DECIMAL;
exports.DEGREES = DEGREES;
exports.DELTA = DELTA;
exports.DEVSQ = DEVSQ;
exports.DGET = DGET;
exports.DISC = DISC;
exports.DIVIDE = DIVIDE;
exports.DMAX = DMAX;
exports.DMIN = DMIN;
exports.DOLLAR = DOLLAR;
exports.DOLLARDE = DOLLARDE;
exports.DOLLARFR = DOLLARFR;
exports.DPRODUCT = DPRODUCT;
exports.DSTDEV = DSTDEV;
exports.DSTDEVP = DSTDEVP;
exports.DSUM = DSUM;
exports.DURATION = DURATION;
exports.DVAR = DVAR;
exports.DVARP = DVARP;
exports.E = E;
exports.EDATE = EDATE;
exports.EFFECT = EFFECT;
exports.EOMONTH = EOMONTH;
exports.EQ = EQ;
exports.ERF = ERF;
exports.ERFC = ERFC;
exports.ERFCPRECISE = ERFCPRECISE;
exports.ERFPRECISE = ERFPRECISE;
exports.ERROR = ERROR;
exports.EVEN = EVEN;
exports.EXACT = EXACT;
exports.EXP = EXP;
exports.EXPON = EXPON;
exports.EXPONDIST = EXPONDIST;
exports.F = F;
exports.FACT = FACT;
exports.FACTDOUBLE = FACTDOUBLE;
exports.FALSE = FALSE;
exports.FDIST = FDIST;
exports.FDISTRT = FDISTRT;
exports.FILTER = FILTER;
exports.FIND = FIND;
exports.FINDFIELD = FINDFIELD;
exports.FINV = FINV;
exports.FINVRT = FINVRT;
exports.FISHER = FISHER;
exports.FISHERINV = FISHERINV;
exports.FIXED = FIXED;
exports.FLATTEN = FLATTEN;
exports.FLOOR = FLOOR;
exports.FLOORMATH = FLOORMATH;
exports.FLOORPRECISE = FLOORPRECISE;
exports.FORECAST = FORECAST;
exports.FREQUENCY = FREQUENCY;
exports.FTEST = FTEST;
exports.FV = FV;
exports.FVSCHEDULE = FVSCHEDULE;
exports.GAMMA = GAMMA;
exports.GAMMADIST = GAMMADIST;
exports.GAMMAINV = GAMMAINV;
exports.GAMMALN = GAMMALN;
exports.GAMMALNPRECISE = GAMMALNPRECISE;
exports.GAUSS = GAUSS;
exports.GCD = GCD;
exports.GEOMEAN = GEOMEAN;
exports.GESTEP = GESTEP;
exports.GROWTH = GROWTH;
exports.GT = GT;
exports.GTE = GTE;
exports.HARMEAN = HARMEAN;
exports.HEX2BIN = HEX2BIN;
exports.HEX2DEC = HEX2DEC;
exports.HEX2OCT = HEX2OCT;
exports.HLOOKUP = HLOOKUP;
exports.HOUR = HOUR;
exports.HTML2TEXT = HTML2TEXT;
exports.HYPGEOM = HYPGEOM;
exports.HYPGEOMDIST = HYPGEOMDIST;
exports.IF = IF;
exports.IFERROR = IFERROR;
exports.IFNA = IFNA;
exports.IFS = IFS;
exports.IMABS = IMABS;
exports.IMAGINARY = IMAGINARY;
exports.IMARGUMENT = IMARGUMENT;
exports.IMCONJUGATE = IMCONJUGATE;
exports.IMCOS = IMCOS;
exports.IMCOSH = IMCOSH;
exports.IMCOT = IMCOT;
exports.IMCSC = IMCSC;
exports.IMCSCH = IMCSCH;
exports.IMDIV = IMDIV;
exports.IMEXP = IMEXP;
exports.IMLN = IMLN;
exports.IMLOG10 = IMLOG10;
exports.IMLOG2 = IMLOG2;
exports.IMPOWER = IMPOWER;
exports.IMPRODUCT = IMPRODUCT;
exports.IMREAL = IMREAL;
exports.IMSEC = IMSEC;
exports.IMSECH = IMSECH;
exports.IMSIN = IMSIN;
exports.IMSINH = IMSINH;
exports.IMSQRT = IMSQRT;
exports.IMSUB = IMSUB;
exports.IMSUM = IMSUM;
exports.IMTAN = IMTAN;
exports.INDEX = INDEX;
exports.INFO = INFO;
exports.INT = INT;
exports.INTERCEPT = INTERCEPT;
exports.INTERVAL = INTERVAL;
exports.INTRATE = INTRATE;
exports.IPMT = IPMT;
exports.IRR = IRR;
exports.ISBINARY = ISBINARY;
exports.ISBLANK = ISBLANK;
exports.ISERR = ISERR;
exports.ISERROR = ISERROR;
exports.ISEVEN = ISEVEN;
exports.ISFORMULA = ISFORMULA;
exports.ISLOGICAL = ISLOGICAL;
exports.ISNA = ISNA;
exports.ISNONTEXT = ISNONTEXT;
exports.ISNUMBER = ISNUMBER;
exports.ISO = ISO;
exports.ISODD = ISODD;
exports.ISOWEEKNUM = ISOWEEKNUM;
exports.ISPMT = ISPMT;
exports.ISREF = ISREF;
exports.ISTEXT = ISTEXT;
exports.JOIN = JOIN;
exports.KURT = KURT;
exports.LARGE = LARGE;
exports.LCM = LCM;
exports.LEFT = LEFT;
exports.LEN = LEN;
exports.LINEST = LINEST;
exports.LN = LN;
exports.LN10 = LN10$1;
exports.LN2 = LN2;
exports.LOG = LOG;
exports.LOG10 = LOG10;
exports.LOG10E = LOG10E;
exports.LOG2E = LOG2E;
exports.LOGEST = LOGEST;
exports.LOGINV = LOGINV;
exports.LOGNORM = LOGNORM;
exports.LOGNORMDIST = LOGNORMDIST;
exports.LOGNORMINV = LOGNORMINV;
exports.LOOKUP = LOOKUP;
exports.LOWER = LOWER;
exports.LT = LT;
exports.LTE = LTE;
exports.MATCH = MATCH;
exports.MAX = MAX;
exports.MAXA = MAXA;
exports.MDURATION = MDURATION;
exports.MEDIAN = MEDIAN;
exports.MID = MID;
exports.MIN = MIN;
exports.MINA = MINA;
exports.MINUS = MINUS;
exports.MINUTE = MINUTE;
exports.MIRR = MIRR;
exports.MOD = MOD;
exports.MODE = MODE;
exports.MODEMULT = MODEMULT;
exports.MODESNGL = MODESNGL;
exports.MONTH = MONTH;
exports.MROUND = MROUND;
exports.MULTINOMIAL = MULTINOMIAL;
exports.MULTIPLY = MULTIPLY;
exports.N = N;
exports.NA = NA;
exports.NE = NE;
exports.NEGBINOM = NEGBINOM;
exports.NEGBINOMDIST = NEGBINOMDIST;
exports.NETWORKDAYS = NETWORKDAYS;
exports.NETWORKDAYSINTL = NETWORKDAYSINTL;
exports.NOMINAL = NOMINAL;
exports.NORM = NORM;
exports.NORMDIST = NORMDIST;
exports.NORMINV = NORMINV;
exports.NORMSDIST = NORMSDIST;
exports.NORMSINV = NORMSINV;
exports.NOT = NOT;
exports.NOW = NOW;
exports.NPER = NPER;
exports.NPV = NPV;
exports.NUMBERS = NUMBERS;
exports.NUMBERVALUE = NUMBERVALUE;
exports.OCT2BIN = OCT2BIN;
exports.OCT2DEC = OCT2DEC;
exports.OCT2HEX = OCT2HEX;
exports.ODD = ODD;
exports.ODDFPRICE = ODDFPRICE;
exports.ODDFYIELD = ODDFYIELD;
exports.ODDLPRICE = ODDLPRICE;
exports.ODDLYIELD = ODDLYIELD;
exports.OR = OR;
exports.PDURATION = PDURATION;
exports.PEARSON = PEARSON;
exports.PERCENTILE = PERCENTILE;
exports.PERCENTILEEXC = PERCENTILEEXC;
exports.PERCENTILEINC = PERCENTILEINC;
exports.PERCENTRANK = PERCENTRANK;
exports.PERCENTRANKEXC = PERCENTRANKEXC;
exports.PERCENTRANKINC = PERCENTRANKINC;
exports.PERMUT = PERMUT;
exports.PERMUTATIONA = PERMUTATIONA;
exports.PHI = PHI;
exports.PI = PI$1;
exports.PMT = PMT;
exports.POISSON = POISSON;
exports.POISSONDIST = POISSONDIST;
exports.POW = POW;
exports.POWER = POWER;
exports.PPMT = PPMT;
exports.PRICE = PRICE;
exports.PRICEDISC = PRICEDISC;
exports.PRICEMAT = PRICEMAT;
exports.PROB = PROB;
exports.PRODUCT = PRODUCT;
exports.PRONETIC = PRONETIC;
exports.PROPER = PROPER;
exports.PV = PV;
exports.QUARTILE = QUARTILE;
exports.QUARTILEEXC = QUARTILEEXC;
exports.QUARTILEINC = QUARTILEINC;
exports.QUOTIENT = QUOTIENT;
exports.RADIANS = RADIANS;
exports.RAND = RAND;
exports.RANDBETWEEN = RANDBETWEEN;
exports.RANK = RANK;
exports.RANKAVG = RANKAVG;
exports.RANKEQ = RANKEQ;
exports.RATE = RATE;
exports.RECEIVED = RECEIVED;
exports.REFERENCE = REFERENCE;
exports.REGEXEXTRACT = REGEXEXTRACT;
exports.REGEXMATCH = REGEXMATCH;
exports.REGEXREPLACE = REGEXREPLACE;
exports.REPLACE = REPLACE;
exports.REPT = REPT;
exports.RIGHT = RIGHT;
exports.ROMAN = ROMAN;
exports.ROUND = ROUND;
exports.ROUNDDOWN = ROUNDDOWN;
exports.ROUNDUP = ROUNDUP;
exports.ROW = ROW;
exports.ROWS = ROWS;
exports.RRI = RRI;
exports.RSQ = RSQ;
exports.SEARCH = SEARCH;
exports.SEC = SEC;
exports.SECH = SECH;
exports.SECOND = SECOND;
exports.SERIESSUM = SERIESSUM;
exports.SHEET = SHEET;
exports.SHEETS = SHEETS;
exports.SIGN = SIGN;
exports.SIN = SIN;
exports.SINGLE = SINGLE;
exports.SINH = SINH;
exports.SKEW = SKEW;
exports.SKEWP = SKEWP;
exports.SLN = SLN;
exports.SLOPE = SLOPE;
exports.SMALL = SMALL;
exports.SORT = SORT;
exports.SPLIT = SPLIT;
exports.SQRT = SQRT;
exports.SQRT1_2 = SQRT1_2;
exports.SQRT2 = SQRT2;
exports.SQRTPI = SQRTPI;
exports.STANDARDIZE = STANDARDIZE;
exports.STDEV = STDEV;
exports.STDEVA = STDEVA;
exports.STDEVP = STDEVP;
exports.STDEVPA = STDEVPA;
exports.STDEVS = STDEVS;
exports.STEYX = STEYX;
exports.SUBSTITUTE = SUBSTITUTE;
exports.SUBTOTAL = SUBTOTAL;
exports.SUM = SUM;
exports.SUMIF = SUMIF;
exports.SUMIFS = SUMIFS;
exports.SUMPRODUCT = SUMPRODUCT;
exports.SUMSQ = SUMSQ;
exports.SUMX2MY2 = SUMX2MY2;
exports.SUMX2PY2 = SUMX2PY2;
exports.SUMXMY2 = SUMXMY2;
exports.SWITCH = SWITCH;
exports.SYD = SYD;
exports.T = T;
exports.TAN = TAN;
exports.TANH = TANH;
exports.TBILLEQ = TBILLEQ;
exports.TBILLPRICE = TBILLPRICE;
exports.TBILLYIELD = TBILLYIELD;
exports.TDIST = TDIST;
exports.TDISTRT = TDISTRT;
exports.TEXT = TEXT;
exports.TEXTJOIN = TEXTJOIN;
exports.TIME = TIME;
exports.TIMEVALUE = TIMEVALUE;
exports.TINV = TINV;
exports.TODAY = TODAY;
exports.TRANSPOSE = TRANSPOSE;
exports.TREND = TREND;
exports.TRIM = TRIM;
exports.TRIMMEAN = TRIMMEAN;
exports.TRUE = TRUE;
exports.TRUNC = TRUNC;
exports.TTEST = TTEST;
exports.TYPE = TYPE;
exports.UNICHAR = UNICHAR;
exports.UNICODE = UNICODE;
exports.UNIQUE = UNIQUE;
exports.UPPER = UPPER;
exports.VALUE = VALUE;
exports.VAR = VAR;
exports.VARA = VARA;
exports.VARP = VARP;
exports.VARPA = VARPA;
exports.VARS = VARS;
exports.VDB = VDB;
exports.VLOOKUP = VLOOKUP;
exports.WEEKDAY = WEEKDAY;
exports.WEEKNUM = WEEKNUM;
exports.WEIBULL = WEIBULL;
exports.WEIBULLDIST = WEIBULLDIST;
exports.WORKDAY = WORKDAY;
exports.WORKDAYINTL = WORKDAYINTL;
exports.XIRR = XIRR;
exports.XMATCH = XMATCH;
exports.XNPV = XNPV;
exports.XOR = XOR;
exports.YEAR = YEAR;
exports.YEARFRAC = YEARFRAC;
exports.YIELD = YIELD;
exports.YIELDDISC = YIELDDISC;
exports.YIELDMAT = YIELDMAT;
exports.Z = Z;
exports.ZTEST = ZTEST;
