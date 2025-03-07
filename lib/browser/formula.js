/* @formulajs/formulajs v3.2.0 */
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

(function(global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.formulajs = {}));
})(this, (function(exports) {
  "use strict";
  var nil = new Error("#NULL!");
  var div0 = new Error("#DIV/0!");
  var value = new Error("#VALUE!");
  var ref = new Error("#REF!");
  var name = new Error("#NAME?");
  var num = new Error("#NUM!");
  var na = new Error("#N/A");
  var error = new Error("#ERROR!");
  var data = new Error("#GETTING_DATA");
  var calc = new Error("#CALC!");
  function flattenShallow(array) {
    if (!array || !array.reduce) {
      return [ array ];
    }
    return array.reduce((function(a, b) {
      var aIsArray = Array.isArray(a);
      var bIsArray = Array.isArray(b);
      if (aIsArray && bIsArray) {
        return a.concat(b);
      }
      if (aIsArray) {
        a.push(b);
        return a;
      }
      if (bIsArray) {
        return [ a ].concat(b);
      }
      return [ a, b ];
    }));
  }
  function isFlat(array) {
    if (!array) {
      return false;
    }
    for (var i = 0; i < array.length; ++i) {
      if (Array.isArray(array[i])) {
        return false;
      }
    }
    return true;
  }
  function flatten() {
    var result;
    if (arguments.length === 1) {
      var argument = arguments[0];
      result = isArrayLike(argument) ? argsToArray.apply(null, arguments) : [ argument ];
    } else {
      result = Array.from(arguments);
    }
    while (!isFlat(result)) {
      result = flattenShallow(result);
    }
    return result;
  }
  function isArrayLike(a) {
    return a != null && typeof a.length === "number" && typeof a !== "string";
  }
  function argsToArray(args) {
    var result = [];
    arrayEach(args, (function(value) {
      result.push(value);
    }));
    return result;
  }
  function numbers() {
    var possibleNumbers = flatten.apply(null, arguments);
    return possibleNumbers.filter((function(el) {
      return typeof el === "number";
    }));
  }
  function cleanFloat(number) {
    var power = 1e14;
    return Math.round(number * power) / power;
  }
  function parseBool(bool) {
    if (typeof bool === "boolean") {
      return bool;
    }
    if (bool instanceof Error) {
      return bool;
    }
    if (typeof bool === "number") {
      return bool !== 0;
    }
    if (typeof bool === "string") {
      var up = bool.toUpperCase();
      if (up === "TRUE") {
        return true;
      }
      if (up === "FALSE") {
        return false;
      }
    }
    if (bool instanceof Date && !isNaN(bool)) {
      return true;
    }
    return value;
  }
  function parseNumber(string) {
    if (string instanceof Error) {
      return string;
    }
    if (string === undefined || string === null || string === "") {
      return 0;
    }
    if (typeof string === "boolean") {
      string = +string;
    }
    if (!isNaN(string)) {
      return parseFloat(string);
    }
    return value;
  }
  function parseString(string) {
    if (string instanceof Error) {
      return string;
    }
    if (string === undefined || string === null) {
      return "";
    }
    return string.toString();
  }
  function parseNumberArray(arr) {
    var len;
    if (!arr || (len = arr.length) === 0) {
      return value;
    }
    var parsed;
    while (len--) {
      if (arr[len] instanceof Error) {
        return arr[len];
      }
      parsed = parseNumber(arr[len]);
      if (parsed instanceof Error) {
        return parsed;
      }
      arr[len] = parsed;
    }
    return arr;
  }
  function serialNumberToDate(serial) {
    if (serial < 60) {
      serial += 1;
    }
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1e3);
    var fractional_day = serial - Math.floor(serial) + 1e-7;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    var days = date_info.getUTCDate();
    var month = date_info.getUTCMonth();
    if (serial >= 60 && serial < 61) {
      days = 29;
      month = 1;
    }
    return new Date(date_info.getUTCFullYear(), month, days, hours, minutes, seconds);
  }
  function parseDate(date) {
    if (!isNaN(date)) {
      if (date instanceof Date) {
        return new Date(date);
      }
      var d = parseFloat(date);
      if (d < 0 || d >= 2958466) {
        return num;
      }
      return serialNumberToDate(d);
    }
    if (typeof date === "string") {
      date = /(\d{4})-(\d\d?)-(\d\d?)$/.test(date) ? new Date(date + "T00:00:00.000") : new Date(date);
      if (!isNaN(date)) {
        return date;
      }
    }
    return value;
  }
  function parseDateArray(arr) {
    var len = arr.length;
    var parsed;
    while (len--) {
      parsed = parseDate(arr[len]);
      if (parsed === value) {
        return parsed;
      }
      arr[len] = parsed;
    }
    return arr;
  }
  function anyError() {
    for (var n = 0; n < arguments.length; n++) {
      if (arguments[n] instanceof Error) {
        return arguments[n];
      }
    }
    return undefined;
  }
  function isDefined(arg) {
    return arg !== undefined && arg !== null;
  }
  function anyIsError() {
    var n = arguments.length;
    while (n--) {
      if (arguments[n] instanceof Error) {
        return true;
      }
    }
    return false;
  }
  function anyIsString() {
    var n = arguments.length;
    while (n--) {
      if (typeof arguments[n] === "string") {
        return true;
      }
    }
    return false;
  }
  function arrayValuesToNumbers(arr) {
    var n = arr.length;
    var el;
    while (n--) {
      el = arr[n];
      if (typeof el === "number") {
        continue;
      }
      if (el === true) {
        arr[n] = 1;
        continue;
      }
      if (el === false) {
        arr[n] = 0;
        continue;
      }
      if (typeof el === "string") {
        var number = parseNumber(el);
        arr[n] = number instanceof Error ? 0 : number;
      }
    }
    return arr;
  }
  function rest(array, idx) {
    idx = idx || 1;
    if (!array || typeof array.slice !== "function") {
      return array;
    }
    return array.slice(idx);
  }
  function initial(array, idx) {
    idx = idx || 1;
    if (!array || typeof array.slice !== "function") {
      return array;
    }
    return array.slice(0, array.length - idx);
  }
  function arrayEach(array, iteratee) {
    var index = -1;
    var length = array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  function transpose(matrix) {
    if (!matrix) {
      return value;
    }
    return matrix[0].map((function(col, i) {
      return matrix.map((function(row) {
        return row[i];
      }));
    }));
  }
  function addEmptyValuesToArray(array, requiredLength, requiredHeight) {
    if (!array || !requiredLength || !requiredHeight) {
      return array;
    }
    if (requiredLength < 0 || requiredHeight < 0) {
      return array;
    }
    if (!Array.isArray(array) || !array.length) return array;
    for (var i = 0; i < array.length; i++) {
      if (!(array[i] instanceof Array)) return array;
    }
    for (var _i2 = 0; _i2 < array.length; _i2++) {
      if (array[_i2].length < requiredLength) {
        for (var j = array[_i2].length; j < requiredLength; j++) {
          array[_i2].push("");
        }
      }
    }
    if (array.length < requiredHeight) {
      for (var _i3 = array.length; _i3 < requiredHeight; _i3++) {
        array.push([]);
        for (var _j = 0; _j < requiredLength; _j++) {
          array[_i3].push("");
        }
      }
    }
    return array;
  }
  var d1900 = new Date(Date.UTC(1900, 0, 1));
  var WEEK_STARTS = [ undefined, 0, 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 2, 3, 4, 5, 6, 0 ];
  var WEEK_TYPES = [ [], [ 1, 2, 3, 4, 5, 6, 7 ], [ 7, 1, 2, 3, 4, 5, 6 ], [ 6, 0, 1, 2, 3, 4, 5 ], [], [], [], [], [], [], [], [ 7, 1, 2, 3, 4, 5, 6 ], [ 6, 7, 1, 2, 3, 4, 5 ], [ 5, 6, 7, 1, 2, 3, 4 ], [ 4, 5, 6, 7, 1, 2, 3 ], [ 3, 4, 5, 6, 7, 1, 2 ], [ 2, 3, 4, 5, 6, 7, 1 ], [ 1, 2, 3, 4, 5, 6, 7 ] ];
  var WEEKEND_TYPES = [ [], [ 6, 0 ], [ 0, 1 ], [ 1, 2 ], [ 2, 3 ], [ 3, 4 ], [ 4, 5 ], [ 5, 6 ], undefined, undefined, undefined, [ 0, 0 ], [ 1, 1 ], [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ] ];
  function DATE(year, month, day) {
    var result;
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
    return result;
  }
  function DATEDIF(start_date, end_date, unit) {
    unit = unit.toUpperCase();
    start_date = parseDate(start_date);
    end_date = parseDate(end_date);
    var start_date_year = start_date.getFullYear();
    var start_date_month = start_date.getMonth();
    var start_date_day = start_date.getDate();
    var end_date_year = end_date.getFullYear();
    var end_date_month = end_date.getMonth();
    var end_date_day = end_date.getDate();
    var result;
    switch (unit) {
     case "Y":
      result = Math.floor(YEARFRAC(start_date, end_date));
      break;

     case "D":
      result = DAYS(end_date, start_date);
      break;

     case "M":
      result = end_date_month - start_date_month + 12 * (end_date_year - start_date_year);
      if (end_date_day < start_date_day) {
        result--;
      }
      break;

     case "MD":
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
      break;

     case "YM":
      result = end_date_month - start_date_month + 12 * (end_date_year - start_date_year);
      if (end_date_day < start_date_day) {
        result--;
      }
      result = result % 12;
      break;

     case "YD":
      if (end_date_month > start_date_month || end_date_month === start_date_month && end_date_day < start_date_day) {
        start_date.setFullYear(end_date_year);
      } else {
        start_date.setFullYear(end_date_year - 1);
      }
      result = DAYS(end_date, start_date);
      break;
    }
    return result;
  }
  function DATEVALUE(date_text) {
    if (typeof date_text !== "string") {
      return value;
    }
    var date = Date.parse(date_text);
    if (isNaN(date)) {
      return value;
    }
    return new Date(date_text);
  }
  function DAY(serial_number) {
    var date = parseDate(serial_number);
    if (date instanceof Error) {
      return date;
    }
    return date.getDate();
  }
  function startOfDay(date) {
    var newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
  function DAYS(end_date, start_date) {
    end_date = parseDate(end_date);
    start_date = parseDate(start_date);
    if (end_date instanceof Error) {
      return end_date;
    }
    if (start_date instanceof Error) {
      return start_date;
    }
    return serial(startOfDay(end_date)) - serial(startOfDay(start_date));
  }
  function DAYS360(start_date, end_date, method) {
    method = parseBool(method || "false");
    start_date = parseDate(start_date);
    end_date = parseDate(end_date);
    if (start_date instanceof Error) {
      return start_date;
    }
    if (end_date instanceof Error) {
      return end_date;
    }
    if (method instanceof Error) {
      return method;
    }
    var sm = start_date.getMonth();
    var em = end_date.getMonth();
    var sd, ed;
    if (method) {
      sd = start_date.getDate() === 31 ? 30 : start_date.getDate();
      ed = end_date.getDate() === 31 ? 30 : end_date.getDate();
    } else {
      var smd = new Date(start_date.getFullYear(), sm + 1, 0).getDate();
      var emd = new Date(end_date.getFullYear(), em + 1, 0).getDate();
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
    return 360 * (end_date.getFullYear() - start_date.getFullYear()) + 30 * (em - sm) + (ed - sd);
  }
  function EDATE(start_date, months) {
    start_date = parseDate(start_date);
    if (start_date instanceof Error) {
      return start_date;
    }
    if (isNaN(months)) {
      return value;
    }
    months = parseInt(months, 10);
    start_date.setMonth(start_date.getMonth() + months);
    return start_date;
  }
  function EOMONTH(start_date, months) {
    start_date = parseDate(start_date);
    if (start_date instanceof Error) {
      return start_date;
    }
    if (isNaN(months)) {
      return value;
    }
    months = parseInt(months, 10);
    return new Date(start_date.getFullYear(), start_date.getMonth() + months + 1, 0);
  }
  function HOUR(serial_number) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    return serial_number.getHours();
  }
  function INTERVAL(second) {
    if (typeof second !== "number" && typeof second !== "string") {
      return value;
    } else {
      second = parseInt(second, 10);
    }
    var year = Math.floor(second / 94608e4);
    second = second % 94608e4;
    var month = Math.floor(second / 2592e3);
    second = second % 2592e3;
    var day = Math.floor(second / 86400);
    second = second % 86400;
    var hour = Math.floor(second / 3600);
    second = second % 3600;
    var min = Math.floor(second / 60);
    second = second % 60;
    var sec = second;
    year = year > 0 ? year + "Y" : "";
    month = month > 0 ? month + "M" : "";
    day = day > 0 ? day + "D" : "";
    hour = hour > 0 ? hour + "H" : "";
    min = min > 0 ? min + "M" : "";
    sec = sec > 0 ? sec + "S" : "";
    return "P" + year + month + day + "T" + hour + min + sec;
  }
  function ISOWEEKNUM(date) {
    date = parseDate(date);
    if (date instanceof Error) {
      return date;
    }
    date = startOfDay(date);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    var yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - yearStart) / 864e5 + 1) / 7);
  }
  function MINUTE(serial_number) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    return serial_number.getMinutes();
  }
  function MONTH(serial_number) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    return serial_number.getMonth() + 1;
  }
  function NETWORKDAYS(start_date, end_date, holidays) {
    return NETWORKDAYS.INTL(start_date, end_date, 1, holidays);
  }
  NETWORKDAYS.INTL = function(start_date, end_date, weekend, holidays) {
    start_date = parseDate(start_date);
    if (start_date instanceof Error) {
      return start_date;
    }
    end_date = parseDate(end_date);
    if (end_date instanceof Error) {
      return end_date;
    }
    var isMask = false;
    var maskDays = [];
    var maskIndex = [ 1, 2, 3, 4, 5, 6, 0 ];
    var maskRegex = new RegExp("^[0|1]{7}$");
    if (weekend === undefined) {
      weekend = WEEKEND_TYPES[1];
    } else if (typeof weekend === "string" && maskRegex.test(weekend)) {
      isMask = true;
      weekend = weekend.split("");
      for (var i = 0; i < weekend.length; i++) {
        if (weekend[i] === "1") {
          maskDays.push(maskIndex[i]);
        }
      }
    } else {
      weekend = WEEKEND_TYPES[weekend];
    }
    if (!(weekend instanceof Array)) {
      return value;
    }
    if (holidays === undefined) {
      holidays = [];
    } else if (!(holidays instanceof Array)) {
      holidays = [ holidays ];
    }
    for (var _i4 = 0; _i4 < holidays.length; _i4++) {
      var h = parseDate(holidays[_i4]);
      if (h instanceof Error) {
        return h;
      }
      holidays[_i4] = h;
    }
    var days = Math.round((end_date - start_date) / (1e3 * 60 * 60 * 24)) + 1;
    var total = days;
    var day = start_date;
    for (var _i5 = 0; _i5 < days; _i5++) {
      var d = (new Date).getTimezoneOffset() > 0 ? day.getUTCDay() : day.getDay();
      var dec = isMask ? maskDays.includes(d) : d === weekend[0] || d === weekend[1];
      for (var j = 0; j < holidays.length; j++) {
        var holiday = holidays[j];
        if (holiday.getDate() === day.getDate() && holiday.getMonth() === day.getMonth() && holiday.getFullYear() === day.getFullYear()) {
          dec = true;
          break;
        }
      }
      if (dec) {
        total--;
      }
      day.setDate(day.getDate() + 1);
    }
    return total;
  };
  function NOW() {
    return new Date;
  }
  function SECOND(serial_number) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    return serial_number.getSeconds();
  }
  function TIME(hour, minute, second) {
    hour = parseNumber(hour);
    minute = parseNumber(minute);
    second = parseNumber(second);
    if (anyIsError(hour, minute, second)) {
      return value;
    }
    if (hour < 0 || minute < 0 || second < 0) {
      return num;
    }
    return (3600 * hour + 60 * minute + second) / 86400;
  }
  function TIMEVALUE(time_text) {
    time_text = parseDate(time_text);
    if (time_text instanceof Error) {
      return time_text;
    }
    return (3600 * time_text.getHours() + 60 * time_text.getMinutes() + time_text.getSeconds()) / 86400;
  }
  function TODAY() {
    return startOfDay(new Date);
  }
  function WEEKDAY(serial_number, return_type) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    if (return_type === undefined) {
      return_type = 1;
    }
    var day = serial_number.getDay();
    return WEEK_TYPES[return_type][day];
  }
  function WEEKNUM(serial_number, return_type) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    if (return_type === undefined) {
      return_type = 1;
    }
    if (return_type === 21) {
      return ISOWEEKNUM(serial_number);
    }
    var week_start = WEEK_STARTS[return_type];
    var jan = new Date(serial_number.getFullYear(), 0, 1);
    var inc = jan.getDay() < week_start ? 1 : 0;
    jan -= Math.abs(jan.getDay() - week_start) * 24 * 60 * 60 * 1e3;
    return Math.floor((serial_number - jan) / (1e3 * 60 * 60 * 24) / 7 + 1) + inc;
  }
  function WORKDAY(start_date, days, holidays) {
    return WORKDAY.INTL(start_date, days, 1, holidays);
  }
  WORKDAY.INTL = function(start_date, days, weekend, holidays) {
    start_date = parseDate(start_date);
    if (start_date instanceof Error) {
      return start_date;
    }
    days = parseNumber(days);
    if (days instanceof Error) {
      return days;
    }
    if (days < 0) {
      return num;
    }
    if (weekend === undefined) {
      weekend = WEEKEND_TYPES[1];
    } else {
      weekend = WEEKEND_TYPES[weekend];
    }
    if (!(weekend instanceof Array)) {
      return value;
    }
    if (holidays === undefined) {
      holidays = [];
    } else if (!(holidays instanceof Array)) {
      holidays = [ holidays ];
    }
    for (var i = 0; i < holidays.length; i++) {
      var h = parseDate(holidays[i]);
      if (h instanceof Error) {
        return h;
      }
      holidays[i] = h;
    }
    var d = 0;
    while (d < days) {
      start_date.setDate(start_date.getDate() + 1);
      var day = start_date.getDay();
      if (day === weekend[0] || day === weekend[1]) {
        continue;
      }
      for (var j = 0; j < holidays.length; j++) {
        var holiday = holidays[j];
        if (holiday.getDate() === start_date.getDate() && holiday.getMonth() === start_date.getMonth() && holiday.getFullYear() === start_date.getFullYear()) {
          d--;
          break;
        }
      }
      d++;
    }
    return start_date;
  };
  function YEAR(serial_number) {
    serial_number = parseDate(serial_number);
    if (serial_number instanceof Error) {
      return serial_number;
    }
    return serial_number.getFullYear();
  }
  function isLeapYear(year) {
    return new Date(year, 1, 29).getMonth() === 1;
  }
  function daysBetween(start_date, end_date) {
    return Math.ceil((end_date - start_date) / 1e3 / 60 / 60 / 24);
  }
  function YEARFRAC(start_date, end_date, basis) {
    start_date = parseDate(start_date);
    if (start_date instanceof Error) {
      return start_date;
    }
    end_date = parseDate(end_date);
    if (end_date instanceof Error) {
      return end_date;
    }
    basis = basis || 0;
    var sd = start_date.getDate();
    var sm = start_date.getMonth() + 1;
    var sy = start_date.getFullYear();
    var ed = end_date.getDate();
    var em = end_date.getMonth() + 1;
    var ey = end_date.getFullYear();
    switch (basis) {
     case 0:
      if (sd === 31 && ed === 31) {
        sd = 30;
        ed = 30;
      } else if (sd === 31) {
        sd = 30;
      } else if (sd === 30 && ed === 31) {
        ed = 30;
      }
      return (ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360;

     case 1:
      {
        var feb29Between = function feb29Between(date1, date2) {
          var year1 = date1.getFullYear();
          var mar1year1 = new Date(year1, 2, 1);
          if (isLeapYear(year1) && date1 < mar1year1 && date2 >= mar1year1) {
            return true;
          }
          var year2 = date2.getFullYear();
          var mar1year2 = new Date(year2, 2, 1);
          return isLeapYear(year2) && date2 >= mar1year2 && date1 < mar1year2;
        };
        var ylength = 365;
        if (sy === ey || sy + 1 === ey && (sm > em || sm === em && sd >= ed)) {
          if (sy === ey && isLeapYear(sy) || feb29Between(start_date, end_date) || em === 1 && ed === 29) {
            ylength = 366;
          }
          return daysBetween(start_date, end_date) / ylength;
        }
        var years = ey - sy + 1;
        var days = (new Date(ey + 1, 0, 1) - new Date(sy, 0, 1)) / 1e3 / 60 / 60 / 24;
        var average = days / years;
        return daysBetween(start_date, end_date) / average;
      }

     case 2:
      return daysBetween(start_date, end_date) / 360;

     case 3:
      return daysBetween(start_date, end_date) / 365;

     case 4:
      return (ed + em * 30 + ey * 360 - (sd + sm * 30 + sy * 360)) / 360;
    }
  }
  function serial(date) {
    var addOn = date > -22038912e5 ? 2 : 1;
    return Math.ceil((date - d1900) / 864e5) + addOn;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var bessel = {};
  (function(exports) {
    (function(factory) {
      if (typeof DO_NOT_EXPORT_BESSEL === "undefined") {
        {
          factory(exports);
        }
      } else {
        factory({});
      }
    })((function(BESSEL) {
      BESSEL.version = "1.0.2";
      var M = Math;
      function _horner(arr, v) {
        for (var i = 0, z = 0; i < arr.length; ++i) {
          z = v * z + arr[i];
        }
        return z;
      }
      function _bessel_iter(x, n, f0, f1, sign) {
        if (n === 0) return f0;
        if (n === 1) return f1;
        var tdx = 2 / x, f2 = f1;
        for (var o = 1; o < n; ++o) {
          f2 = f1 * o * tdx + sign * f0;
          f0 = f1;
          f1 = f2;
        }
        return f2;
      }
      function _bessel_wrap(bessel0, bessel1, name, nonzero, sign) {
        return function bessel(x, n) {
          if (nonzero) {
            if (x === 0) return nonzero == 1 ? -Infinity : Infinity; else if (x < 0) return NaN;
          }
          if (n === 0) return bessel0(x);
          if (n === 1) return bessel1(x);
          if (n < 0) return NaN;
          n |= 0;
          var b0 = bessel0(x), b1 = bessel1(x);
          return _bessel_iter(x, n, b0, b1, sign);
        };
      }
      var besselj = function() {
        var W = .636619772;
        var b0_a1a = [ 57568490574, -13362590354, 651619640.7, -11214424.18, 77392.33017, -184.9052456 ].reverse();
        var b0_a2a = [ 57568490411, 1029532985, 9494680.718, 59272.64853, 267.8532712, 1 ].reverse();
        var b0_a1b = [ 1, -.001098628627, 2734510407e-14, -2073370639e-15, 2.093887211e-7 ].reverse();
        var b0_a2b = [ -.01562499995, .0001430488765, -6911147651e-15, 7.621095161e-7, -9.34935152e-8 ].reverse();
        function bessel0(x) {
          var a = 0, a1 = 0, a2 = 0, y = x * x;
          if (x < 8) {
            a1 = _horner(b0_a1a, y);
            a2 = _horner(b0_a2a, y);
            a = a1 / a2;
          } else {
            var xx = x - .785398164;
            y = 64 / y;
            a1 = _horner(b0_a1b, y);
            a2 = _horner(b0_a2b, y);
            a = M.sqrt(W / x) * (M.cos(xx) * a1 - M.sin(xx) * a2 * 8 / x);
          }
          return a;
        }
        var b1_a1a = [ 72362614232, -7895059235, 242396853.1, -2972611.439, 15704.4826, -30.16036606 ].reverse();
        var b1_a2a = [ 144725228442, 2300535178, 18583304.74, 99447.43394, 376.9991397, 1 ].reverse();
        var b1_a1b = [ 1, .00183105, -3516396496e-14, 2457520174e-15, -2.40337019e-7 ].reverse();
        var b1_a2b = [ .04687499995, -.0002002690873, 8449199096e-15, -8.8228987e-7, 1.05787412e-7 ].reverse();
        function bessel1(x) {
          var a = 0, a1 = 0, a2 = 0, y = x * x, xx = M.abs(x) - 2.356194491;
          if (Math.abs(x) < 8) {
            a1 = x * _horner(b1_a1a, y);
            a2 = _horner(b1_a2a, y);
            a = a1 / a2;
          } else {
            y = 64 / y;
            a1 = _horner(b1_a1b, y);
            a2 = _horner(b1_a2b, y);
            a = M.sqrt(W / M.abs(x)) * (M.cos(xx) * a1 - M.sin(xx) * a2 * 8 / M.abs(x));
            if (x < 0) a = -a;
          }
          return a;
        }
        return function besselj(x, n) {
          n = Math.round(n);
          if (!isFinite(x)) return isNaN(x) ? x : 0;
          if (n < 0) return (n % 2 ? -1 : 1) * besselj(x, -n);
          if (x < 0) return (n % 2 ? -1 : 1) * besselj(-x, n);
          if (n === 0) return bessel0(x);
          if (n === 1) return bessel1(x);
          if (x === 0) return 0;
          var ret = 0;
          if (x > n) {
            ret = _bessel_iter(x, n, bessel0(x), bessel1(x), -1);
          } else {
            var m = 2 * M.floor((n + M.floor(M.sqrt(40 * n))) / 2);
            var jsum = false;
            var bjp = 0, sum = 0;
            var bj = 1, bjm = 0;
            var tox = 2 / x;
            for (var j = m; j > 0; j--) {
              bjm = j * tox * bj - bjp;
              bjp = bj;
              bj = bjm;
              if (M.abs(bj) > 1e10) {
                bj *= 1e-10;
                bjp *= 1e-10;
                ret *= 1e-10;
                sum *= 1e-10;
              }
              if (jsum) sum += bj;
              jsum = !jsum;
              if (j == n) ret = bjp;
            }
            sum = 2 * sum - bj;
            ret /= sum;
          }
          return ret;
        };
      }();
      var bessely = function() {
        var W = .636619772;
        var b0_a1a = [ -2957821389, 7062834065, -512359803.6, 10879881.29, -86327.92757, 228.4622733 ].reverse();
        var b0_a2a = [ 40076544269, 745249964.8, 7189466.438, 47447.2647, 226.1030244, 1 ].reverse();
        var b0_a1b = [ 1, -.001098628627, 2734510407e-14, -2073370639e-15, 2.093887211e-7 ].reverse();
        var b0_a2b = [ -.01562499995, .0001430488765, -6911147651e-15, 7.621095161e-7, -9.34945152e-8 ].reverse();
        function bessel0(x) {
          var a = 0, a1 = 0, a2 = 0, y = x * x, xx = x - .785398164;
          if (x < 8) {
            a1 = _horner(b0_a1a, y);
            a2 = _horner(b0_a2a, y);
            a = a1 / a2 + W * besselj(x, 0) * M.log(x);
          } else {
            y = 64 / y;
            a1 = _horner(b0_a1b, y);
            a2 = _horner(b0_a2b, y);
            a = M.sqrt(W / x) * (M.sin(xx) * a1 + M.cos(xx) * a2 * 8 / x);
          }
          return a;
        }
        var b1_a1a = [ -4900604943e3, 127527439e4, -51534381390, 734926455.1, -4237922.726, 8511.937935 ].reverse();
        var b1_a2a = [ 249958057e5, 424441966400, 3733650367, 22459040.02, 102042.605, 354.9632885, 1 ].reverse();
        var b1_a1b = [ 1, .00183105, -3516396496e-14, 2457520174e-15, -2.40337019e-7 ].reverse();
        var b1_a2b = [ .04687499995, -.0002002690873, 8449199096e-15, -8.8228987e-7, 1.05787412e-7 ].reverse();
        function bessel1(x) {
          var a = 0, a1 = 0, a2 = 0, y = x * x, xx = x - 2.356194491;
          if (x < 8) {
            a1 = x * _horner(b1_a1a, y);
            a2 = _horner(b1_a2a, y);
            a = a1 / a2 + W * (besselj(x, 1) * M.log(x) - 1 / x);
          } else {
            y = 64 / y;
            a1 = _horner(b1_a1b, y);
            a2 = _horner(b1_a2b, y);
            a = M.sqrt(W / x) * (M.sin(xx) * a1 + M.cos(xx) * a2 * 8 / x);
          }
          return a;
        }
        return _bessel_wrap(bessel0, bessel1, "BESSELY", 1, -1);
      }();
      var besseli = function() {
        var b0_a = [ 1, 3.5156229, 3.0899424, 1.2067492, .2659732, .0360768, .0045813 ].reverse();
        var b0_b = [ .39894228, .01328592, .00225319, -.00157565, .00916281, -.02057706, .02635537, -.01647633, .00392377 ].reverse();
        function bessel0(x) {
          if (x <= 3.75) return _horner(b0_a, x * x / (3.75 * 3.75));
          return M.exp(M.abs(x)) / M.sqrt(M.abs(x)) * _horner(b0_b, 3.75 / M.abs(x));
        }
        var b1_a = [ .5, .87890594, .51498869, .15084934, .02658733, .00301532, 32411e-8 ].reverse();
        var b1_b = [ .39894228, -.03988024, -.00362018, .00163801, -.01031555, .02282967, -.02895312, .01787654, -.00420059 ].reverse();
        function bessel1(x) {
          if (x < 3.75) return x * _horner(b1_a, x * x / (3.75 * 3.75));
          return (x < 0 ? -1 : 1) * M.exp(M.abs(x)) / M.sqrt(M.abs(x)) * _horner(b1_b, 3.75 / M.abs(x));
        }
        return function besseli(x, n) {
          n = Math.round(n);
          if (n === 0) return bessel0(x);
          if (n === 1) return bessel1(x);
          if (n < 0) return NaN;
          if (M.abs(x) === 0) return 0;
          if (x == Infinity) return Infinity;
          var ret = 0, j, tox = 2 / M.abs(x), bip = 0, bi = 1, bim = 0;
          var m = 2 * M.round((n + M.round(M.sqrt(40 * n))) / 2);
          for (j = m; j > 0; j--) {
            bim = j * tox * bi + bip;
            bip = bi;
            bi = bim;
            if (M.abs(bi) > 1e10) {
              bi *= 1e-10;
              bip *= 1e-10;
              ret *= 1e-10;
            }
            if (j == n) ret = bip;
          }
          ret *= besseli(x, 0) / bi;
          return x < 0 && n % 2 ? -ret : ret;
        };
      }();
      var besselk = function() {
        var b0_a = [ -.57721566, .4227842, .23069756, .0348859, .00262698, 1075e-7, 74e-7 ].reverse();
        var b0_b = [ 1.25331414, -.07832358, .02189568, -.01062446, .00587872, -.0025154, 53208e-8 ].reverse();
        function bessel0(x) {
          if (x <= 2) return -M.log(x / 2) * besseli(x, 0) + _horner(b0_a, x * x / 4);
          return M.exp(-x) / M.sqrt(x) * _horner(b0_b, 2 / x);
        }
        var b1_a = [ 1, .15443144, -.67278579, -.18156897, -.01919402, -.00110404, -4686e-8 ].reverse();
        var b1_b = [ 1.25331414, .23498619, -.0365562, .01504268, -.00780353, .00325614, -68245e-8 ].reverse();
        function bessel1(x) {
          if (x <= 2) return M.log(x / 2) * besseli(x, 1) + 1 / x * _horner(b1_a, x * x / 4);
          return M.exp(-x) / M.sqrt(x) * _horner(b1_b, 2 / x);
        }
        return _bessel_wrap(bessel0, bessel1, "BESSELK", 2, 1);
      }();
      BESSEL.besselj = besselj;
      BESSEL.bessely = bessely;
      BESSEL.besseli = besseli;
      BESSEL.besselk = besselk;
    }));
  })(bessel);
  var jstat = {
    exports: {}
  };
  (function(module, exports) {
    (function(window, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, (function() {
      var jStat = function(Math, undefined$1) {
        var concat = Array.prototype.concat;
        var slice = Array.prototype.slice;
        var toString = Object.prototype.toString;
        function calcRdx(n, m) {
          var val = n > m ? n : m;
          return Math.pow(10, 17 - ~~(Math.log(val > 0 ? val : -val) * Math.LOG10E));
        }
        var isArray = Array.isArray || function isArray(arg) {
          return toString.call(arg) === "[object Array]";
        };
        function isFunction(arg) {
          return toString.call(arg) === "[object Function]";
        }
        function isNumber(num) {
          return typeof num === "number" ? num - num === 0 : false;
        }
        function toVector(arr) {
          return concat.apply([], arr);
        }
        function jStat() {
          return new jStat._init(arguments);
        }
        jStat.fn = jStat.prototype;
        jStat._init = function _init(args) {
          if (isArray(args[0])) {
            if (isArray(args[0][0])) {
              if (isFunction(args[1])) args[0] = jStat.map(args[0], args[1]);
              for (var i = 0; i < args[0].length; i++) {
                this[i] = args[0][i];
              }
              this.length = args[0].length;
            } else {
              this[0] = isFunction(args[1]) ? jStat.map(args[0], args[1]) : args[0];
              this.length = 1;
            }
          } else if (isNumber(args[0])) {
            this[0] = jStat.seq.apply(null, args);
            this.length = 1;
          } else if (args[0] instanceof jStat) {
            return jStat(args[0].toArray());
          } else {
            this[0] = [];
            this.length = 1;
          }
          return this;
        };
        jStat._init.prototype = jStat.prototype;
        jStat._init.constructor = jStat;
        jStat.utils = {
          calcRdx: calcRdx,
          isArray: isArray,
          isFunction: isFunction,
          isNumber: isNumber,
          toVector: toVector
        };
        jStat._random_fn = Math.random;
        jStat.setRandom = function setRandom(fn) {
          if (typeof fn !== "function") throw new TypeError("fn is not a function");
          jStat._random_fn = fn;
        };
        jStat.extend = function extend(obj) {
          var i, j;
          if (arguments.length === 1) {
            for (j in obj) {
              jStat[j] = obj[j];
            }
            return this;
          }
          for (i = 1; i < arguments.length; i++) {
            for (j in arguments[i]) {
              obj[j] = arguments[i][j];
            }
          }
          return obj;
        };
        jStat.rows = function rows(arr) {
          return arr.length || 1;
        };
        jStat.cols = function cols(arr) {
          return arr[0].length || 1;
        };
        jStat.dimensions = function dimensions(arr) {
          return {
            rows: jStat.rows(arr),
            cols: jStat.cols(arr)
          };
        };
        jStat.row = function row(arr, index) {
          if (isArray(index)) {
            return index.map((function(i) {
              return jStat.row(arr, i);
            }));
          }
          return arr[index];
        };
        jStat.rowa = function rowa(arr, i) {
          return jStat.row(arr, i);
        };
        jStat.col = function col(arr, index) {
          if (isArray(index)) {
            var submat = jStat.arange(arr.length).map((function() {
              return new Array(index.length);
            }));
            index.forEach((function(ind, i) {
              jStat.arange(arr.length).forEach((function(j) {
                submat[j][i] = arr[j][ind];
              }));
            }));
            return submat;
          }
          var column = new Array(arr.length);
          for (var i = 0; i < arr.length; i++) {
            column[i] = [ arr[i][index] ];
          }
          return column;
        };
        jStat.cola = function cola(arr, i) {
          return jStat.col(arr, i).map((function(a) {
            return a[0];
          }));
        };
        jStat.diag = function diag(arr) {
          var nrow = jStat.rows(arr);
          var res = new Array(nrow);
          for (var row = 0; row < nrow; row++) {
            res[row] = [ arr[row][row] ];
          }
          return res;
        };
        jStat.antidiag = function antidiag(arr) {
          var nrow = jStat.rows(arr) - 1;
          var res = new Array(nrow);
          for (var i = 0; nrow >= 0; nrow--, i++) {
            res[i] = [ arr[i][nrow] ];
          }
          return res;
        };
        jStat.transpose = function transpose(arr) {
          var obj = [];
          var objArr, rows, cols, j, i;
          if (!isArray(arr[0])) arr = [ arr ];
          rows = arr.length;
          cols = arr[0].length;
          for (i = 0; i < cols; i++) {
            objArr = new Array(rows);
            for (j = 0; j < rows; j++) {
              objArr[j] = arr[j][i];
            }
            obj.push(objArr);
          }
          return obj.length === 1 ? obj[0] : obj;
        };
        jStat.map = function map(arr, func, toAlter) {
          var row, nrow, ncol, res, col;
          if (!isArray(arr[0])) arr = [ arr ];
          nrow = arr.length;
          ncol = arr[0].length;
          res = toAlter ? arr : new Array(nrow);
          for (row = 0; row < nrow; row++) {
            if (!res[row]) res[row] = new Array(ncol);
            for (col = 0; col < ncol; col++) {
              res[row][col] = func(arr[row][col], row, col);
            }
          }
          return res.length === 1 ? res[0] : res;
        };
        jStat.cumreduce = function cumreduce(arr, func, toAlter) {
          var row, nrow, ncol, res, col;
          if (!isArray(arr[0])) arr = [ arr ];
          nrow = arr.length;
          ncol = arr[0].length;
          res = toAlter ? arr : new Array(nrow);
          for (row = 0; row < nrow; row++) {
            if (!res[row]) res[row] = new Array(ncol);
            if (ncol > 0) res[row][0] = arr[row][0];
            for (col = 1; col < ncol; col++) {
              res[row][col] = func(res[row][col - 1], arr[row][col]);
            }
          }
          return res.length === 1 ? res[0] : res;
        };
        jStat.alter = function alter(arr, func) {
          return jStat.map(arr, func, true);
        };
        jStat.create = function create(rows, cols, func) {
          var res = new Array(rows);
          var i, j;
          if (isFunction(cols)) {
            func = cols;
            cols = rows;
          }
          for (i = 0; i < rows; i++) {
            res[i] = new Array(cols);
            for (j = 0; j < cols; j++) {
              res[i][j] = func(i, j);
            }
          }
          return res;
        };
        function retZero() {
          return 0;
        }
        jStat.zeros = function zeros(rows, cols) {
          if (!isNumber(cols)) cols = rows;
          return jStat.create(rows, cols, retZero);
        };
        function retOne() {
          return 1;
        }
        jStat.ones = function ones(rows, cols) {
          if (!isNumber(cols)) cols = rows;
          return jStat.create(rows, cols, retOne);
        };
        jStat.rand = function rand(rows, cols) {
          if (!isNumber(cols)) cols = rows;
          return jStat.create(rows, cols, jStat._random_fn);
        };
        function retIdent(i, j) {
          return i === j ? 1 : 0;
        }
        jStat.identity = function identity(rows, cols) {
          if (!isNumber(cols)) cols = rows;
          return jStat.create(rows, cols, retIdent);
        };
        jStat.symmetric = function symmetric(arr) {
          var size = arr.length;
          var row, col;
          if (arr.length !== arr[0].length) return false;
          for (row = 0; row < size; row++) {
            for (col = 0; col < size; col++) {
              if (arr[col][row] !== arr[row][col]) return false;
            }
          }
          return true;
        };
        jStat.clear = function clear(arr) {
          return jStat.alter(arr, retZero);
        };
        jStat.seq = function seq(min, max, length, func) {
          if (!isFunction(func)) func = false;
          var arr = [];
          var hival = calcRdx(min, max);
          var step = (max * hival - min * hival) / ((length - 1) * hival);
          var current = min;
          var cnt;
          for (cnt = 0; current <= max && cnt < length; cnt++, current = (min * hival + step * hival * cnt) / hival) {
            arr.push(func ? func(current, cnt) : current);
          }
          return arr;
        };
        jStat.arange = function arange(start, end, step) {
          var rl = [];
          var i;
          step = step || 1;
          if (end === undefined$1) {
            end = start;
            start = 0;
          }
          if (start === end || step === 0) {
            return [];
          }
          if (start < end && step < 0) {
            return [];
          }
          if (start > end && step > 0) {
            return [];
          }
          if (step > 0) {
            for (i = start; i < end; i += step) {
              rl.push(i);
            }
          } else {
            for (i = start; i > end; i += step) {
              rl.push(i);
            }
          }
          return rl;
        };
        jStat.slice = function() {
          function _slice(list, start, end, step) {
            var i;
            var rl = [];
            var length = list.length;
            if (start === undefined$1 && end === undefined$1 && step === undefined$1) {
              return jStat.copy(list);
            }
            start = start || 0;
            end = end || list.length;
            start = start >= 0 ? start : length + start;
            end = end >= 0 ? end : length + end;
            step = step || 1;
            if (start === end || step === 0) {
              return [];
            }
            if (start < end && step < 0) {
              return [];
            }
            if (start > end && step > 0) {
              return [];
            }
            if (step > 0) {
              for (i = start; i < end; i += step) {
                rl.push(list[i]);
              }
            } else {
              for (i = start; i > end; i += step) {
                rl.push(list[i]);
              }
            }
            return rl;
          }
          function slice(list, rcSlice) {
            var colSlice, rowSlice;
            rcSlice = rcSlice || {};
            if (isNumber(rcSlice.row)) {
              if (isNumber(rcSlice.col)) return list[rcSlice.row][rcSlice.col];
              var row = jStat.rowa(list, rcSlice.row);
              colSlice = rcSlice.col || {};
              return _slice(row, colSlice.start, colSlice.end, colSlice.step);
            }
            if (isNumber(rcSlice.col)) {
              var col = jStat.cola(list, rcSlice.col);
              rowSlice = rcSlice.row || {};
              return _slice(col, rowSlice.start, rowSlice.end, rowSlice.step);
            }
            rowSlice = rcSlice.row || {};
            colSlice = rcSlice.col || {};
            var rows = _slice(list, rowSlice.start, rowSlice.end, rowSlice.step);
            return rows.map((function(row) {
              return _slice(row, colSlice.start, colSlice.end, colSlice.step);
            }));
          }
          return slice;
        }();
        jStat.sliceAssign = function sliceAssign(A, rcSlice, B) {
          var nl, ml;
          if (isNumber(rcSlice.row)) {
            if (isNumber(rcSlice.col)) return A[rcSlice.row][rcSlice.col] = B;
            rcSlice.col = rcSlice.col || {};
            rcSlice.col.start = rcSlice.col.start || 0;
            rcSlice.col.end = rcSlice.col.end || A[0].length;
            rcSlice.col.step = rcSlice.col.step || 1;
            nl = jStat.arange(rcSlice.col.start, Math.min(A.length, rcSlice.col.end), rcSlice.col.step);
            var m = rcSlice.row;
            nl.forEach((function(n, i) {
              A[m][n] = B[i];
            }));
            return A;
          }
          if (isNumber(rcSlice.col)) {
            rcSlice.row = rcSlice.row || {};
            rcSlice.row.start = rcSlice.row.start || 0;
            rcSlice.row.end = rcSlice.row.end || A.length;
            rcSlice.row.step = rcSlice.row.step || 1;
            ml = jStat.arange(rcSlice.row.start, Math.min(A[0].length, rcSlice.row.end), rcSlice.row.step);
            var n = rcSlice.col;
            ml.forEach((function(m, j) {
              A[m][n] = B[j];
            }));
            return A;
          }
          if (B[0].length === undefined$1) {
            B = [ B ];
          }
          rcSlice.row.start = rcSlice.row.start || 0;
          rcSlice.row.end = rcSlice.row.end || A.length;
          rcSlice.row.step = rcSlice.row.step || 1;
          rcSlice.col.start = rcSlice.col.start || 0;
          rcSlice.col.end = rcSlice.col.end || A[0].length;
          rcSlice.col.step = rcSlice.col.step || 1;
          ml = jStat.arange(rcSlice.row.start, Math.min(A.length, rcSlice.row.end), rcSlice.row.step);
          nl = jStat.arange(rcSlice.col.start, Math.min(A[0].length, rcSlice.col.end), rcSlice.col.step);
          ml.forEach((function(m, i) {
            nl.forEach((function(n, j) {
              A[m][n] = B[i][j];
            }));
          }));
          return A;
        };
        jStat.diagonal = function diagonal(diagArray) {
          var mat = jStat.zeros(diagArray.length, diagArray.length);
          diagArray.forEach((function(t, i) {
            mat[i][i] = t;
          }));
          return mat;
        };
        jStat.copy = function copy(A) {
          return A.map((function(row) {
            if (isNumber(row)) return row;
            return row.map((function(t) {
              return t;
            }));
          }));
        };
        var jProto = jStat.prototype;
        jProto.length = 0;
        jProto.push = Array.prototype.push;
        jProto.sort = Array.prototype.sort;
        jProto.splice = Array.prototype.splice;
        jProto.slice = Array.prototype.slice;
        jProto.toArray = function toArray() {
          return this.length > 1 ? slice.call(this) : slice.call(this)[0];
        };
        jProto.map = function map(func, toAlter) {
          return jStat(jStat.map(this, func, toAlter));
        };
        jProto.cumreduce = function cumreduce(func, toAlter) {
          return jStat(jStat.cumreduce(this, func, toAlter));
        };
        jProto.alter = function alter(func) {
          jStat.alter(this, func);
          return this;
        };
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jProto[passfunc] = function(func) {
                var self = this, results;
                if (func) {
                  setTimeout((function() {
                    func.call(self, jProto[passfunc].call(self));
                  }));
                  return this;
                }
                results = jStat[passfunc](this);
                return isArray(results) ? jStat(results) : results;
              };
            })(funcs[i]);
          }
        })("transpose clear symmetric rows cols dimensions diag antidiag".split(" "));
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jProto[passfunc] = function(index, func) {
                var self = this;
                if (func) {
                  setTimeout((function() {
                    func.call(self, jProto[passfunc].call(self, index));
                  }));
                  return this;
                }
                return jStat(jStat[passfunc](this, index));
              };
            })(funcs[i]);
          }
        })("row col".split(" "));
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jProto[passfunc] = function() {
                return jStat(jStat[passfunc].apply(null, arguments));
              };
            })(funcs[i]);
          }
        })("create zeros ones rand identity".split(" "));
        return jStat;
      }(Math);
      (function(jStat, Math) {
        var isFunction = jStat.utils.isFunction;
        function ascNum(a, b) {
          return a - b;
        }
        function clip(arg, min, max) {
          return Math.max(min, Math.min(arg, max));
        }
        jStat.sum = function sum(arr) {
          var sum = 0;
          var i = arr.length;
          while (--i >= 0) {
            sum += arr[i];
          }
          return sum;
        };
        jStat.sumsqrd = function sumsqrd(arr) {
          var sum = 0;
          var i = arr.length;
          while (--i >= 0) {
            sum += arr[i] * arr[i];
          }
          return sum;
        };
        jStat.sumsqerr = function sumsqerr(arr) {
          var mean = jStat.mean(arr);
          var sum = 0;
          var i = arr.length;
          var tmp;
          while (--i >= 0) {
            tmp = arr[i] - mean;
            sum += tmp * tmp;
          }
          return sum;
        };
        jStat.sumrow = function sumrow(arr) {
          var sum = 0;
          var i = arr.length;
          while (--i >= 0) {
            sum += arr[i];
          }
          return sum;
        };
        jStat.product = function product(arr) {
          var prod = 1;
          var i = arr.length;
          while (--i >= 0) {
            prod *= arr[i];
          }
          return prod;
        };
        jStat.min = function min(arr) {
          var low = arr[0];
          var i = 0;
          while (++i < arr.length) {
            if (arr[i] < low) low = arr[i];
          }
          return low;
        };
        jStat.max = function max(arr) {
          var high = arr[0];
          var i = 0;
          while (++i < arr.length) {
            if (arr[i] > high) high = arr[i];
          }
          return high;
        };
        jStat.unique = function unique(arr) {
          var hash = {}, _arr = [];
          for (var i = 0; i < arr.length; i++) {
            if (!hash[arr[i]]) {
              hash[arr[i]] = true;
              _arr.push(arr[i]);
            }
          }
          return _arr;
        };
        jStat.mean = function mean(arr) {
          return jStat.sum(arr) / arr.length;
        };
        jStat.meansqerr = function meansqerr(arr) {
          return jStat.sumsqerr(arr) / arr.length;
        };
        jStat.geomean = function geomean(arr) {
          var logs = arr.map(Math.log);
          var meanOfLogs = jStat.mean(logs);
          return Math.exp(meanOfLogs);
        };
        jStat.median = function median(arr) {
          var arrlen = arr.length;
          var _arr = arr.slice().sort(ascNum);
          return !(arrlen & 1) ? (_arr[arrlen / 2 - 1] + _arr[arrlen / 2]) / 2 : _arr[arrlen / 2 | 0];
        };
        jStat.cumsum = function cumsum(arr) {
          return jStat.cumreduce(arr, (function(a, b) {
            return a + b;
          }));
        };
        jStat.cumprod = function cumprod(arr) {
          return jStat.cumreduce(arr, (function(a, b) {
            return a * b;
          }));
        };
        jStat.diff = function diff(arr) {
          var diffs = [];
          var arrLen = arr.length;
          var i;
          for (i = 1; i < arrLen; i++) {
            diffs.push(arr[i] - arr[i - 1]);
          }
          return diffs;
        };
        jStat.rank = function(arr) {
          var i;
          var distinctNumbers = [];
          var numberCounts = {};
          for (i = 0; i < arr.length; i++) {
            var number = arr[i];
            if (numberCounts[number]) {
              numberCounts[number]++;
            } else {
              numberCounts[number] = 1;
              distinctNumbers.push(number);
            }
          }
          var sortedDistinctNumbers = distinctNumbers.sort(ascNum);
          var numberRanks = {};
          var currentRank = 1;
          for (i = 0; i < sortedDistinctNumbers.length; i++) {
            var number = sortedDistinctNumbers[i];
            var count = numberCounts[number];
            var first = currentRank;
            var last = currentRank + count - 1;
            var rank = (first + last) / 2;
            numberRanks[number] = rank;
            currentRank += count;
          }
          return arr.map((function(number) {
            return numberRanks[number];
          }));
        };
        jStat.mode = function mode(arr) {
          var arrLen = arr.length;
          var _arr = arr.slice().sort(ascNum);
          var count = 1;
          var maxCount = 0;
          var numMaxCount = 0;
          var mode_arr = [];
          var i;
          for (i = 0; i < arrLen; i++) {
            if (_arr[i] === _arr[i + 1]) {
              count++;
            } else {
              if (count > maxCount) {
                mode_arr = [ _arr[i] ];
                maxCount = count;
                numMaxCount = 0;
              } else if (count === maxCount) {
                mode_arr.push(_arr[i]);
                numMaxCount++;
              }
              count = 1;
            }
          }
          return numMaxCount === 0 ? mode_arr[0] : mode_arr;
        };
        jStat.range = function range(arr) {
          return jStat.max(arr) - jStat.min(arr);
        };
        jStat.variance = function variance(arr, flag) {
          return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
        };
        jStat.pooledvariance = function pooledvariance(arr) {
          var sumsqerr = arr.reduce((function(a, samples) {
            return a + jStat.sumsqerr(samples);
          }), 0);
          var count = arr.reduce((function(a, samples) {
            return a + samples.length;
          }), 0);
          return sumsqerr / (count - arr.length);
        };
        jStat.deviation = function(arr) {
          var mean = jStat.mean(arr);
          var arrlen = arr.length;
          var dev = new Array(arrlen);
          for (var i = 0; i < arrlen; i++) {
            dev[i] = arr[i] - mean;
          }
          return dev;
        };
        jStat.stdev = function stdev(arr, flag) {
          return Math.sqrt(jStat.variance(arr, flag));
        };
        jStat.pooledstdev = function pooledstdev(arr) {
          return Math.sqrt(jStat.pooledvariance(arr));
        };
        jStat.meandev = function meandev(arr) {
          var mean = jStat.mean(arr);
          var a = [];
          for (var i = arr.length - 1; i >= 0; i--) {
            a.push(Math.abs(arr[i] - mean));
          }
          return jStat.mean(a);
        };
        jStat.meddev = function meddev(arr) {
          var median = jStat.median(arr);
          var a = [];
          for (var i = arr.length - 1; i >= 0; i--) {
            a.push(Math.abs(arr[i] - median));
          }
          return jStat.median(a);
        };
        jStat.coeffvar = function coeffvar(arr) {
          return jStat.stdev(arr) / jStat.mean(arr);
        };
        jStat.quartiles = function quartiles(arr) {
          var arrlen = arr.length;
          var _arr = arr.slice().sort(ascNum);
          return [ _arr[Math.round(arrlen / 4) - 1], _arr[Math.round(arrlen / 2) - 1], _arr[Math.round(arrlen * 3 / 4) - 1] ];
        };
        jStat.quantiles = function quantiles(arr, quantilesArray, alphap, betap) {
          var sortedArray = arr.slice().sort(ascNum);
          var quantileVals = [ quantilesArray.length ];
          var n = arr.length;
          var i, p, m, aleph, k, gamma;
          if (typeof alphap === "undefined") alphap = 3 / 8;
          if (typeof betap === "undefined") betap = 3 / 8;
          for (i = 0; i < quantilesArray.length; i++) {
            p = quantilesArray[i];
            m = alphap + p * (1 - alphap - betap);
            aleph = n * p + m;
            k = Math.floor(clip(aleph, 1, n - 1));
            gamma = clip(aleph - k, 0, 1);
            quantileVals[i] = (1 - gamma) * sortedArray[k - 1] + gamma * sortedArray[k];
          }
          return quantileVals;
        };
        jStat.percentile = function percentile(arr, k, exclusive) {
          var _arr = arr.slice().sort(ascNum);
          var realIndex = k * (_arr.length + (exclusive ? 1 : -1)) + (exclusive ? 0 : 1);
          var index = parseInt(realIndex);
          var frac = realIndex - index;
          if (index + 1 < _arr.length) {
            return _arr[index - 1] + frac * (_arr[index] - _arr[index - 1]);
          } else {
            return _arr[index - 1];
          }
        };
        jStat.percentileOfScore = function percentileOfScore(arr, score, kind) {
          var counter = 0;
          var len = arr.length;
          var strict = false;
          var value, i;
          if (kind === "strict") strict = true;
          for (i = 0; i < len; i++) {
            value = arr[i];
            if (strict && value < score || !strict && value <= score) {
              counter++;
            }
          }
          return counter / len;
        };
        jStat.histogram = function histogram(arr, binCnt) {
          binCnt = binCnt || 4;
          var first = jStat.min(arr);
          var binWidth = (jStat.max(arr) - first) / binCnt;
          var len = arr.length;
          var bins = [];
          var i;
          for (i = 0; i < binCnt; i++) {
            bins[i] = 0;
          }
          for (i = 0; i < len; i++) {
            bins[Math.min(Math.floor((arr[i] - first) / binWidth), binCnt - 1)] += 1;
          }
          return bins;
        };
        jStat.covariance = function covariance(arr1, arr2) {
          var u = jStat.mean(arr1);
          var v = jStat.mean(arr2);
          var arr1Len = arr1.length;
          var sq_dev = new Array(arr1Len);
          var i;
          for (i = 0; i < arr1Len; i++) {
            sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);
          }
          return jStat.sum(sq_dev) / (arr1Len - 1);
        };
        jStat.corrcoeff = function corrcoeff(arr1, arr2) {
          return jStat.covariance(arr1, arr2) / jStat.stdev(arr1, 1) / jStat.stdev(arr2, 1);
        };
        jStat.spearmancoeff = function(arr1, arr2) {
          arr1 = jStat.rank(arr1);
          arr2 = jStat.rank(arr2);
          return jStat.corrcoeff(arr1, arr2);
        };
        jStat.stanMoment = function stanMoment(arr, n) {
          var mu = jStat.mean(arr);
          var sigma = jStat.stdev(arr);
          var len = arr.length;
          var skewSum = 0;
          for (var i = 0; i < len; i++) {
            skewSum += Math.pow((arr[i] - mu) / sigma, n);
          }
          return skewSum / arr.length;
        };
        jStat.skewness = function skewness(arr) {
          return jStat.stanMoment(arr, 3);
        };
        jStat.kurtosis = function kurtosis(arr) {
          return jStat.stanMoment(arr, 4) - 3;
        };
        var jProto = jStat.prototype;
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jProto[passfunc] = function(fullbool, func) {
                var arr = [];
                var i = 0;
                var tmpthis = this;
                if (isFunction(fullbool)) {
                  func = fullbool;
                  fullbool = false;
                }
                if (func) {
                  setTimeout((function() {
                    func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
                  }));
                  return this;
                }
                if (this.length > 1) {
                  tmpthis = fullbool === true ? this : this.transpose();
                  for (;i < tmpthis.length; i++) {
                    arr[i] = jStat[passfunc](tmpthis[i]);
                  }
                  return arr;
                }
                return jStat[passfunc](this[0], fullbool);
              };
            })(funcs[i]);
          }
        })("cumsum cumprod".split(" "));
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jProto[passfunc] = function(fullbool, func) {
                var arr = [];
                var i = 0;
                var tmpthis = this;
                if (isFunction(fullbool)) {
                  func = fullbool;
                  fullbool = false;
                }
                if (func) {
                  setTimeout((function() {
                    func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
                  }));
                  return this;
                }
                if (this.length > 1) {
                  if (passfunc !== "sumrow") tmpthis = fullbool === true ? this : this.transpose();
                  for (;i < tmpthis.length; i++) {
                    arr[i] = jStat[passfunc](tmpthis[i]);
                  }
                  return fullbool === true ? jStat[passfunc](jStat.utils.toVector(arr)) : arr;
                }
                return jStat[passfunc](this[0], fullbool);
              };
            })(funcs[i]);
          }
        })(("sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr " + "geomean median diff rank mode range variance deviation stdev meandev " + "meddev coeffvar quartiles histogram skewness kurtosis").split(" "));
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jProto[passfunc] = function() {
                var arr = [];
                var i = 0;
                var tmpthis = this;
                var args = Array.prototype.slice.call(arguments);
                var callbackFunction;
                if (isFunction(args[args.length - 1])) {
                  callbackFunction = args[args.length - 1];
                  var argsToPass = args.slice(0, args.length - 1);
                  setTimeout((function() {
                    callbackFunction.call(tmpthis, jProto[passfunc].apply(tmpthis, argsToPass));
                  }));
                  return this;
                } else {
                  callbackFunction = undefined;
                  var curriedFunction = function curriedFunction(vector) {
                    return jStat[passfunc].apply(tmpthis, [ vector ].concat(args));
                  };
                }
                if (this.length > 1) {
                  tmpthis = tmpthis.transpose();
                  for (;i < tmpthis.length; i++) {
                    arr[i] = curriedFunction(tmpthis[i]);
                  }
                  return arr;
                }
                return curriedFunction(this[0]);
              };
            })(funcs[i]);
          }
        })("quantiles percentileOfScore".split(" "));
      })(jStat, Math);
      (function(jStat, Math) {
        jStat.gammaln = function gammaln(x) {
          var j = 0;
          var cof = [ 76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, .001208650973866179, -5395239384953e-18 ];
          var ser = 1.000000000190015;
          var xx, y, tmp;
          tmp = (y = xx = x) + 5.5;
          tmp -= (xx + .5) * Math.log(tmp);
          for (;j < 6; j++) {
            ser += cof[j] / ++y;
          }
          return Math.log(2.5066282746310007 * ser / xx) - tmp;
        };
        jStat.loggam = function loggam(x) {
          var x0, x2, xp, gl, gl0;
          var k, n;
          var a = [ .08333333333333333, -.002777777777777778, .0007936507936507937, -.0005952380952380952, .0008417508417508418, -.001917526917526918, .00641025641025641, -.02955065359477124, .1796443723688307, -1.3924322169059 ];
          x0 = x;
          n = 0;
          if (x == 1 || x == 2) {
            return 0;
          }
          if (x <= 7) {
            n = Math.floor(7 - x);
            x0 = x + n;
          }
          x2 = 1 / (x0 * x0);
          xp = 2 * Math.PI;
          gl0 = a[9];
          for (k = 8; k >= 0; k--) {
            gl0 *= x2;
            gl0 += a[k];
          }
          gl = gl0 / x0 + .5 * Math.log(xp) + (x0 - .5) * Math.log(x0) - x0;
          if (x <= 7) {
            for (k = 1; k <= n; k++) {
              gl -= Math.log(x0 - 1);
              x0 -= 1;
            }
          }
          return gl;
        };
        jStat.gammafn = function gammafn(x) {
          var p = [ -1.716185138865495, 24.76565080557592, -379.80425647094563, 629.3311553128184, 866.9662027904133, -31451.272968848367, -36144.413418691176, 66456.14382024054 ];
          var q = [ -30.8402300119739, 315.35062697960416, -1015.1563674902192, -3107.771671572311, 22538.11842098015, 4755.846277527881, -134659.9598649693, -115132.2596755535 ];
          var fact = false;
          var n = 0;
          var xden = 0;
          var xnum = 0;
          var y = x;
          var i, z, yi, res;
          if (x > 171.6243769536076) {
            return Infinity;
          }
          if (y <= 0) {
            res = y % 1 + 36e-17;
            if (res) {
              fact = (!(y & 1) ? 1 : -1) * Math.PI / Math.sin(Math.PI * res);
              y = 1 - y;
            } else {
              return Infinity;
            }
          }
          yi = y;
          if (y < 1) {
            z = y++;
          } else {
            z = (y -= n = (y | 0) - 1) - 1;
          }
          for (i = 0; i < 8; ++i) {
            xnum = (xnum + p[i]) * z;
            xden = xden * z + q[i];
          }
          res = xnum / xden + 1;
          if (yi < y) {
            res /= yi;
          } else if (yi > y) {
            for (i = 0; i < n; ++i) {
              res *= y;
              y++;
            }
          }
          if (fact) {
            res = fact / res;
          }
          return res;
        };
        jStat.gammap = function gammap(a, x) {
          return jStat.lowRegGamma(a, x) * jStat.gammafn(a);
        };
        jStat.lowRegGamma = function lowRegGamma(a, x) {
          var aln = jStat.gammaln(a);
          var ap = a;
          var sum = 1 / a;
          var del = sum;
          var b = x + 1 - a;
          var c = 1 / 1e-30;
          var d = 1 / b;
          var h = d;
          var i = 1;
          var ITMAX = -~(Math.log(a >= 1 ? a : 1 / a) * 8.5 + a * .4 + 17);
          var an;
          if (x < 0 || a <= 0) {
            return NaN;
          } else if (x < a + 1) {
            for (;i <= ITMAX; i++) {
              sum += del *= x / ++ap;
            }
            return sum * Math.exp(-x + a * Math.log(x) - aln);
          }
          for (;i <= ITMAX; i++) {
            an = -i * (i - a);
            b += 2;
            d = an * d + b;
            c = b + an / c;
            d = 1 / d;
            h *= d * c;
          }
          return 1 - h * Math.exp(-x + a * Math.log(x) - aln);
        };
        jStat.factorialln = function factorialln(n) {
          return n < 0 ? NaN : jStat.gammaln(n + 1);
        };
        jStat.factorial = function factorial(n) {
          return n < 0 ? NaN : jStat.gammafn(n + 1);
        };
        jStat.combination = function combination(n, m) {
          return n > 170 || m > 170 ? Math.exp(jStat.combinationln(n, m)) : jStat.factorial(n) / jStat.factorial(m) / jStat.factorial(n - m);
        };
        jStat.combinationln = function combinationln(n, m) {
          return jStat.factorialln(n) - jStat.factorialln(m) - jStat.factorialln(n - m);
        };
        jStat.permutation = function permutation(n, m) {
          return jStat.factorial(n) / jStat.factorial(n - m);
        };
        jStat.betafn = function betafn(x, y) {
          if (x <= 0 || y <= 0) return undefined;
          return x + y > 170 ? Math.exp(jStat.betaln(x, y)) : jStat.gammafn(x) * jStat.gammafn(y) / jStat.gammafn(x + y);
        };
        jStat.betaln = function betaln(x, y) {
          return jStat.gammaln(x) + jStat.gammaln(y) - jStat.gammaln(x + y);
        };
        jStat.betacf = function betacf(x, a, b) {
          var fpmin = 1e-30;
          var m = 1;
          var qab = a + b;
          var qap = a + 1;
          var qam = a - 1;
          var c = 1;
          var d = 1 - qab * x / qap;
          var m2, aa, del, h;
          if (Math.abs(d) < fpmin) d = fpmin;
          d = 1 / d;
          h = d;
          for (;m <= 100; m++) {
            m2 = 2 * m;
            aa = m * (b - m) * x / ((qam + m2) * (a + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < fpmin) d = fpmin;
            c = 1 + aa / c;
            if (Math.abs(c) < fpmin) c = fpmin;
            d = 1 / d;
            h *= d * c;
            aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < fpmin) d = fpmin;
            c = 1 + aa / c;
            if (Math.abs(c) < fpmin) c = fpmin;
            d = 1 / d;
            del = d * c;
            h *= del;
            if (Math.abs(del - 1) < 3e-7) break;
          }
          return h;
        };
        jStat.gammapinv = function gammapinv(p, a) {
          var j = 0;
          var a1 = a - 1;
          var EPS = 1e-8;
          var gln = jStat.gammaln(a);
          var x, err, t, u, pp, lna1, afac;
          if (p >= 1) return Math.max(100, a + 100 * Math.sqrt(a));
          if (p <= 0) return 0;
          if (a > 1) {
            lna1 = Math.log(a1);
            afac = Math.exp(a1 * (lna1 - 1) - gln);
            pp = p < .5 ? p : 1 - p;
            t = Math.sqrt(-2 * Math.log(pp));
            x = (2.30753 + t * .27061) / (1 + t * (.99229 + t * .04481)) - t;
            if (p < .5) x = -x;
            x = Math.max(.001, a * Math.pow(1 - 1 / (9 * a) - x / (3 * Math.sqrt(a)), 3));
          } else {
            t = 1 - a * (.253 + a * .12);
            if (p < t) x = Math.pow(p / t, 1 / a); else x = 1 - Math.log(1 - (p - t) / (1 - t));
          }
          for (;j < 12; j++) {
            if (x <= 0) return 0;
            err = jStat.lowRegGamma(a, x) - p;
            if (a > 1) t = afac * Math.exp(-(x - a1) + a1 * (Math.log(x) - lna1)); else t = Math.exp(-x + a1 * Math.log(x) - gln);
            u = err / t;
            x -= t = u / (1 - .5 * Math.min(1, u * ((a - 1) / x - 1)));
            if (x <= 0) x = .5 * (x + t);
            if (Math.abs(t) < EPS * x) break;
          }
          return x;
        };
        jStat.erf = function erf(x) {
          var cof = [ -1.3026537197817094, .6419697923564902, .019476473204185836, -.00956151478680863, -.000946595344482036, .000366839497852761, 42523324806907e-18, -20278578112534e-18, -1624290004647e-18, 130365583558e-17, 1.5626441722e-8, -8.5238095915e-8, 6.529054439e-9, 5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 96467911e-18, 2394038e-18, -6886027e-18, 894487e-18, 313092e-18, -112708e-18, 381e-18, 7106e-18, -1523e-18, -94e-18, 121e-18, -28e-18 ];
          var j = cof.length - 1;
          var isneg = false;
          var d = 0;
          var dd = 0;
          var t, ty, tmp, res;
          if (x < 0) {
            x = -x;
            isneg = true;
          }
          t = 2 / (2 + x);
          ty = 4 * t - 2;
          for (;j > 0; j--) {
            tmp = d;
            d = ty * d - dd + cof[j];
            dd = tmp;
          }
          res = t * Math.exp(-x * x + .5 * (cof[0] + ty * d) - dd);
          return isneg ? res - 1 : 1 - res;
        };
        jStat.erfc = function erfc(x) {
          return 1 - jStat.erf(x);
        };
        jStat.erfcinv = function erfcinv(p) {
          var j = 0;
          var x, err, t, pp;
          if (p >= 2) return -100;
          if (p <= 0) return 100;
          pp = p < 1 ? p : 2 - p;
          t = Math.sqrt(-2 * Math.log(pp / 2));
          x = -.70711 * ((2.30753 + t * .27061) / (1 + t * (.99229 + t * .04481)) - t);
          for (;j < 2; j++) {
            err = jStat.erfc(x) - pp;
            x += err / (1.1283791670955126 * Math.exp(-x * x) - x * err);
          }
          return p < 1 ? x : -x;
        };
        jStat.ibetainv = function ibetainv(p, a, b) {
          var EPS = 1e-8;
          var a1 = a - 1;
          var b1 = b - 1;
          var j = 0;
          var lna, lnb, pp, t, u, err, x, al, h, w, afac;
          if (p <= 0) return 0;
          if (p >= 1) return 1;
          if (a >= 1 && b >= 1) {
            pp = p < .5 ? p : 1 - p;
            t = Math.sqrt(-2 * Math.log(pp));
            x = (2.30753 + t * .27061) / (1 + t * (.99229 + t * .04481)) - t;
            if (p < .5) x = -x;
            al = (x * x - 3) / 6;
            h = 2 / (1 / (2 * a - 1) + 1 / (2 * b - 1));
            w = x * Math.sqrt(al + h) / h - (1 / (2 * b - 1) - 1 / (2 * a - 1)) * (al + 5 / 6 - 2 / (3 * h));
            x = a / (a + b * Math.exp(2 * w));
          } else {
            lna = Math.log(a / (a + b));
            lnb = Math.log(b / (a + b));
            t = Math.exp(a * lna) / a;
            u = Math.exp(b * lnb) / b;
            w = t + u;
            if (p < t / w) x = Math.pow(a * w * p, 1 / a); else x = 1 - Math.pow(b * w * (1 - p), 1 / b);
          }
          afac = -jStat.gammaln(a) - jStat.gammaln(b) + jStat.gammaln(a + b);
          for (;j < 10; j++) {
            if (x === 0 || x === 1) return x;
            err = jStat.ibeta(x, a, b) - p;
            t = Math.exp(a1 * Math.log(x) + b1 * Math.log(1 - x) + afac);
            u = err / t;
            x -= t = u / (1 - .5 * Math.min(1, u * (a1 / x - b1 / (1 - x))));
            if (x <= 0) x = .5 * (x + t);
            if (x >= 1) x = .5 * (x + t + 1);
            if (Math.abs(t) < EPS * x && j > 0) break;
          }
          return x;
        };
        jStat.ibeta = function ibeta(x, a, b) {
          var bt = x === 0 || x === 1 ? 0 : Math.exp(jStat.gammaln(a + b) - jStat.gammaln(a) - jStat.gammaln(b) + a * Math.log(x) + b * Math.log(1 - x));
          if (x < 0 || x > 1) return false;
          if (x < (a + 1) / (a + b + 2)) return bt * jStat.betacf(x, a, b) / a;
          return 1 - bt * jStat.betacf(1 - x, b, a) / b;
        };
        jStat.randn = function randn(n, m) {
          var u, v, x, y, q;
          if (!m) m = n;
          if (n) return jStat.create(n, m, (function() {
            return jStat.randn();
          }));
          do {
            u = jStat._random_fn();
            v = 1.7156 * (jStat._random_fn() - .5);
            x = u - .449871;
            y = Math.abs(v) + .386595;
            q = x * x + y * (.196 * y - .25472 * x);
          } while (q > .27597 && (q > .27846 || v * v > -4 * Math.log(u) * u * u));
          return v / u;
        };
        jStat.randg = function randg(shape, n, m) {
          var oalph = shape;
          var a1, a2, u, v, x, mat;
          if (!m) m = n;
          if (!shape) shape = 1;
          if (n) {
            mat = jStat.zeros(n, m);
            mat.alter((function() {
              return jStat.randg(shape);
            }));
            return mat;
          }
          if (shape < 1) shape += 1;
          a1 = shape - 1 / 3;
          a2 = 1 / Math.sqrt(9 * a1);
          do {
            do {
              x = jStat.randn();
              v = 1 + a2 * x;
            } while (v <= 0);
            v = v * v * v;
            u = jStat._random_fn();
          } while (u > 1 - .331 * Math.pow(x, 4) && Math.log(u) > .5 * x * x + a1 * (1 - v + Math.log(v)));
          if (shape == oalph) return a1 * v;
          do {
            u = jStat._random_fn();
          } while (u === 0);
          return Math.pow(u, 1 / oalph) * a1 * v;
        };
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jStat.fn[passfunc] = function() {
                return jStat(jStat.map(this, (function(value) {
                  return jStat[passfunc](value);
                })));
              };
            })(funcs[i]);
          }
        })("gammaln gammafn factorial factorialln".split(" "));
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jStat.fn[passfunc] = function() {
                return jStat(jStat[passfunc].apply(null, arguments));
              };
            })(funcs[i]);
          }
        })("randn".split(" "));
      })(jStat, Math);
      (function(jStat, Math) {
        (function(list) {
          for (var i = 0; i < list.length; i++) {
            (function(func) {
              jStat[func] = function f(a, b, c) {
                if (!(this instanceof f)) return new f(a, b, c);
                this._a = a;
                this._b = b;
                this._c = c;
                return this;
              };
              jStat.fn[func] = function(a, b, c) {
                var newthis = jStat[func](a, b, c);
                newthis.data = this;
                return newthis;
              };
              jStat[func].prototype.sample = function(arr) {
                var a = this._a;
                var b = this._b;
                var c = this._c;
                if (arr) return jStat.alter(arr, (function() {
                  return jStat[func].sample(a, b, c);
                })); else return jStat[func].sample(a, b, c);
              };
              (function(vals) {
                for (var i = 0; i < vals.length; i++) {
                  (function(fnfunc) {
                    jStat[func].prototype[fnfunc] = function(x) {
                      var a = this._a;
                      var b = this._b;
                      var c = this._c;
                      if (!x && x !== 0) x = this.data;
                      if (typeof x !== "number") {
                        return jStat.fn.map.call(x, (function(x) {
                          return jStat[func][fnfunc](x, a, b, c);
                        }));
                      }
                      return jStat[func][fnfunc](x, a, b, c);
                    };
                  })(vals[i]);
                }
              })("pdf cdf inv".split(" "));
              (function(vals) {
                for (var i = 0; i < vals.length; i++) {
                  (function(fnfunc) {
                    jStat[func].prototype[fnfunc] = function() {
                      return jStat[func][fnfunc](this._a, this._b, this._c);
                    };
                  })(vals[i]);
                }
              })("mean median mode variance".split(" "));
            })(list[i]);
          }
        })(("beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy " + "laplace lognormal noncentralt normal pareto studentt weibull uniform " + "binomial negbin hypgeom poisson triangular tukey arcsine").split(" "));
        jStat.extend(jStat.beta, {
          pdf: function pdf(x, alpha, beta) {
            if (x > 1 || x < 0) return 0;
            if (alpha == 1 && beta == 1) return 1;
            if (alpha < 512 && beta < 512) {
              return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / jStat.betafn(alpha, beta);
            } else {
              return Math.exp((alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x) - jStat.betaln(alpha, beta));
            }
          },
          cdf: function cdf(x, alpha, beta) {
            return x > 1 || x < 0 ? (x > 1) * 1 : jStat.ibeta(x, alpha, beta);
          },
          inv: function inv(x, alpha, beta) {
            return jStat.ibetainv(x, alpha, beta);
          },
          mean: function mean(alpha, beta) {
            return alpha / (alpha + beta);
          },
          median: function median(alpha, beta) {
            return jStat.ibetainv(.5, alpha, beta);
          },
          mode: function mode(alpha, beta) {
            return (alpha - 1) / (alpha + beta - 2);
          },
          sample: function sample(alpha, beta) {
            var u = jStat.randg(alpha);
            return u / (u + jStat.randg(beta));
          },
          variance: function variance(alpha, beta) {
            return alpha * beta / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
          }
        });
        jStat.extend(jStat.centralF, {
          pdf: function pdf(x, df1, df2) {
            var p, q, f;
            if (x < 0) return 0;
            if (df1 <= 2) {
              if (x === 0 && df1 < 2) {
                return Infinity;
              }
              if (x === 0 && df1 === 2) {
                return 1;
              }
              return 1 / jStat.betafn(df1 / 2, df2 / 2) * Math.pow(df1 / df2, df1 / 2) * Math.pow(x, df1 / 2 - 1) * Math.pow(1 + df1 / df2 * x, -(df1 + df2) / 2);
            }
            p = df1 * x / (df2 + x * df1);
            q = df2 / (df2 + x * df1);
            f = df1 * q / 2;
            return f * jStat.binomial.pdf((df1 - 2) / 2, (df1 + df2 - 2) / 2, p);
          },
          cdf: function cdf(x, df1, df2) {
            if (x < 0) return 0;
            return jStat.ibeta(df1 * x / (df1 * x + df2), df1 / 2, df2 / 2);
          },
          inv: function inv(x, df1, df2) {
            return df2 / (df1 * (1 / jStat.ibetainv(x, df1 / 2, df2 / 2) - 1));
          },
          mean: function mean(df1, df2) {
            return df2 > 2 ? df2 / (df2 - 2) : undefined;
          },
          mode: function mode(df1, df2) {
            return df1 > 2 ? df2 * (df1 - 2) / (df1 * (df2 + 2)) : undefined;
          },
          sample: function sample(df1, df2) {
            var x1 = jStat.randg(df1 / 2) * 2;
            var x2 = jStat.randg(df2 / 2) * 2;
            return x1 / df1 / (x2 / df2);
          },
          variance: function variance(df1, df2) {
            if (df2 <= 4) return undefined;
            return 2 * df2 * df2 * (df1 + df2 - 2) / (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4));
          }
        });
        jStat.extend(jStat.cauchy, {
          pdf: function pdf(x, local, scale) {
            if (scale < 0) {
              return 0;
            }
            return scale / (Math.pow(x - local, 2) + Math.pow(scale, 2)) / Math.PI;
          },
          cdf: function cdf(x, local, scale) {
            return Math.atan((x - local) / scale) / Math.PI + .5;
          },
          inv: function inv(p, local, scale) {
            return local + scale * Math.tan(Math.PI * (p - .5));
          },
          median: function median(local) {
            return local;
          },
          mode: function mode(local) {
            return local;
          },
          sample: function sample(local, scale) {
            return jStat.randn() * Math.sqrt(1 / (2 * jStat.randg(.5))) * scale + local;
          }
        });
        jStat.extend(jStat.chisquare, {
          pdf: function pdf(x, dof) {
            if (x < 0) return 0;
            return x === 0 && dof === 2 ? .5 : Math.exp((dof / 2 - 1) * Math.log(x) - x / 2 - dof / 2 * Math.log(2) - jStat.gammaln(dof / 2));
          },
          cdf: function cdf(x, dof) {
            if (x < 0) return 0;
            return jStat.lowRegGamma(dof / 2, x / 2);
          },
          inv: function inv(p, dof) {
            return 2 * jStat.gammapinv(p, .5 * dof);
          },
          mean: function mean(dof) {
            return dof;
          },
          median: function median(dof) {
            return dof * Math.pow(1 - 2 / (9 * dof), 3);
          },
          mode: function mode(dof) {
            return dof - 2 > 0 ? dof - 2 : 0;
          },
          sample: function sample(dof) {
            return jStat.randg(dof / 2) * 2;
          },
          variance: function variance(dof) {
            return 2 * dof;
          }
        });
        jStat.extend(jStat.exponential, {
          pdf: function pdf(x, rate) {
            return x < 0 ? 0 : rate * Math.exp(-rate * x);
          },
          cdf: function cdf(x, rate) {
            return x < 0 ? 0 : 1 - Math.exp(-rate * x);
          },
          inv: function inv(p, rate) {
            return -Math.log(1 - p) / rate;
          },
          mean: function mean(rate) {
            return 1 / rate;
          },
          median: function median(rate) {
            return 1 / rate * Math.log(2);
          },
          mode: function mode() {
            return 0;
          },
          sample: function sample(rate) {
            return -1 / rate * Math.log(jStat._random_fn());
          },
          variance: function variance(rate) {
            return Math.pow(rate, -2);
          }
        });
        jStat.extend(jStat.gamma, {
          pdf: function pdf(x, shape, scale) {
            if (x < 0) return 0;
            return x === 0 && shape === 1 ? 1 / scale : Math.exp((shape - 1) * Math.log(x) - x / scale - jStat.gammaln(shape) - shape * Math.log(scale));
          },
          cdf: function cdf(x, shape, scale) {
            if (x < 0) return 0;
            return jStat.lowRegGamma(shape, x / scale);
          },
          inv: function inv(p, shape, scale) {
            return jStat.gammapinv(p, shape) * scale;
          },
          mean: function mean(shape, scale) {
            return shape * scale;
          },
          mode: function mode(shape, scale) {
            if (shape > 1) return (shape - 1) * scale;
            return undefined;
          },
          sample: function sample(shape, scale) {
            return jStat.randg(shape) * scale;
          },
          variance: function variance(shape, scale) {
            return shape * scale * scale;
          }
        });
        jStat.extend(jStat.invgamma, {
          pdf: function pdf(x, shape, scale) {
            if (x <= 0) return 0;
            return Math.exp(-(shape + 1) * Math.log(x) - scale / x - jStat.gammaln(shape) + shape * Math.log(scale));
          },
          cdf: function cdf(x, shape, scale) {
            if (x <= 0) return 0;
            return 1 - jStat.lowRegGamma(shape, scale / x);
          },
          inv: function inv(p, shape, scale) {
            return scale / jStat.gammapinv(1 - p, shape);
          },
          mean: function mean(shape, scale) {
            return shape > 1 ? scale / (shape - 1) : undefined;
          },
          mode: function mode(shape, scale) {
            return scale / (shape + 1);
          },
          sample: function sample(shape, scale) {
            return scale / jStat.randg(shape);
          },
          variance: function variance(shape, scale) {
            if (shape <= 2) return undefined;
            return scale * scale / ((shape - 1) * (shape - 1) * (shape - 2));
          }
        });
        jStat.extend(jStat.kumaraswamy, {
          pdf: function pdf(x, alpha, beta) {
            if (x === 0 && alpha === 1) return beta; else if (x === 1 && beta === 1) return alpha;
            return Math.exp(Math.log(alpha) + Math.log(beta) + (alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - Math.pow(x, alpha)));
          },
          cdf: function cdf(x, alpha, beta) {
            if (x < 0) return 0; else if (x > 1) return 1;
            return 1 - Math.pow(1 - Math.pow(x, alpha), beta);
          },
          inv: function inv(p, alpha, beta) {
            return Math.pow(1 - Math.pow(1 - p, 1 / beta), 1 / alpha);
          },
          mean: function mean(alpha, beta) {
            return beta * jStat.gammafn(1 + 1 / alpha) * jStat.gammafn(beta) / jStat.gammafn(1 + 1 / alpha + beta);
          },
          median: function median(alpha, beta) {
            return Math.pow(1 - Math.pow(2, -1 / beta), 1 / alpha);
          },
          mode: function mode(alpha, beta) {
            if (!(alpha >= 1 && beta >= 1 && alpha !== 1 && beta !== 1)) return undefined;
            return Math.pow((alpha - 1) / (alpha * beta - 1), 1 / alpha);
          },
          variance: function variance() {
            throw new Error("variance not yet implemented");
          }
        });
        jStat.extend(jStat.lognormal, {
          pdf: function pdf(x, mu, sigma) {
            if (x <= 0) return 0;
            return Math.exp(-Math.log(x) - .5 * Math.log(2 * Math.PI) - Math.log(sigma) - Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma));
          },
          cdf: function cdf(x, mu, sigma) {
            if (x < 0) return 0;
            return .5 + .5 * jStat.erf((Math.log(x) - mu) / Math.sqrt(2 * sigma * sigma));
          },
          inv: function inv(p, mu, sigma) {
            return Math.exp(-1.4142135623730951 * sigma * jStat.erfcinv(2 * p) + mu);
          },
          mean: function mean(mu, sigma) {
            return Math.exp(mu + sigma * sigma / 2);
          },
          median: function median(mu) {
            return Math.exp(mu);
          },
          mode: function mode(mu, sigma) {
            return Math.exp(mu - sigma * sigma);
          },
          sample: function sample(mu, sigma) {
            return Math.exp(jStat.randn() * sigma + mu);
          },
          variance: function variance(mu, sigma) {
            return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
          }
        });
        jStat.extend(jStat.noncentralt, {
          pdf: function pdf(x, dof, ncp) {
            var tol = 1e-14;
            if (Math.abs(ncp) < tol) return jStat.studentt.pdf(x, dof);
            if (Math.abs(x) < tol) {
              return Math.exp(jStat.gammaln((dof + 1) / 2) - ncp * ncp / 2 - .5 * Math.log(Math.PI * dof) - jStat.gammaln(dof / 2));
            }
            return dof / x * (jStat.noncentralt.cdf(x * Math.sqrt(1 + 2 / dof), dof + 2, ncp) - jStat.noncentralt.cdf(x, dof, ncp));
          },
          cdf: function cdf(x, dof, ncp) {
            var tol = 1e-14;
            var min_iterations = 200;
            if (Math.abs(ncp) < tol) return jStat.studentt.cdf(x, dof);
            var flip = false;
            if (x < 0) {
              flip = true;
              ncp = -ncp;
            }
            var prob = jStat.normal.cdf(-ncp, 0, 1);
            var value = tol + 1;
            var lastvalue = value;
            var y = x * x / (x * x + dof);
            var j = 0;
            var p = Math.exp(-ncp * ncp / 2);
            var q = Math.exp(-ncp * ncp / 2 - .5 * Math.log(2) - jStat.gammaln(3 / 2)) * ncp;
            while (j < min_iterations || lastvalue > tol || value > tol) {
              lastvalue = value;
              if (j > 0) {
                p *= ncp * ncp / (2 * j);
                q *= ncp * ncp / (2 * (j + 1 / 2));
              }
              value = p * jStat.beta.cdf(y, j + .5, dof / 2) + q * jStat.beta.cdf(y, j + 1, dof / 2);
              prob += .5 * value;
              j++;
            }
            return flip ? 1 - prob : prob;
          }
        });
        jStat.extend(jStat.normal, {
          pdf: function pdf(x, mean, std) {
            return Math.exp(-.5 * Math.log(2 * Math.PI) - Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std));
          },
          cdf: function cdf(x, mean, std) {
            return .5 * (1 + jStat.erf((x - mean) / Math.sqrt(2 * std * std)));
          },
          inv: function inv(p, mean, std) {
            return -1.4142135623730951 * std * jStat.erfcinv(2 * p) + mean;
          },
          mean: function mean(_mean) {
            return _mean;
          },
          median: function median(mean) {
            return mean;
          },
          mode: function mode(mean) {
            return mean;
          },
          sample: function sample(mean, std) {
            return jStat.randn() * std + mean;
          },
          variance: function variance(mean, std) {
            return std * std;
          }
        });
        jStat.extend(jStat.pareto, {
          pdf: function pdf(x, scale, shape) {
            if (x < scale) return 0;
            return shape * Math.pow(scale, shape) / Math.pow(x, shape + 1);
          },
          cdf: function cdf(x, scale, shape) {
            if (x < scale) return 0;
            return 1 - Math.pow(scale / x, shape);
          },
          inv: function inv(p, scale, shape) {
            return scale / Math.pow(1 - p, 1 / shape);
          },
          mean: function mean(scale, shape) {
            if (shape <= 1) return undefined;
            return shape * Math.pow(scale, shape) / (shape - 1);
          },
          median: function median(scale, shape) {
            return scale * (shape * Math.SQRT2);
          },
          mode: function mode(scale) {
            return scale;
          },
          variance: function variance(scale, shape) {
            if (shape <= 2) return undefined;
            return scale * scale * shape / (Math.pow(shape - 1, 2) * (shape - 2));
          }
        });
        jStat.extend(jStat.studentt, {
          pdf: function pdf(x, dof) {
            dof = dof > 1e100 ? 1e100 : dof;
            return 1 / (Math.sqrt(dof) * jStat.betafn(.5, dof / 2)) * Math.pow(1 + x * x / dof, -((dof + 1) / 2));
          },
          cdf: function cdf(x, dof) {
            var dof2 = dof / 2;
            return jStat.ibeta((x + Math.sqrt(x * x + dof)) / (2 * Math.sqrt(x * x + dof)), dof2, dof2);
          },
          inv: function inv(p, dof) {
            var x = jStat.ibetainv(2 * Math.min(p, 1 - p), .5 * dof, .5);
            x = Math.sqrt(dof * (1 - x) / x);
            return p > .5 ? x : -x;
          },
          mean: function mean(dof) {
            return dof > 1 ? 0 : undefined;
          },
          median: function median() {
            return 0;
          },
          mode: function mode() {
            return 0;
          },
          sample: function sample(dof) {
            return jStat.randn() * Math.sqrt(dof / (2 * jStat.randg(dof / 2)));
          },
          variance: function variance(dof) {
            return dof > 2 ? dof / (dof - 2) : dof > 1 ? Infinity : undefined;
          }
        });
        jStat.extend(jStat.weibull, {
          pdf: function pdf(x, scale, shape) {
            if (x < 0 || scale < 0 || shape < 0) return 0;
            return shape / scale * Math.pow(x / scale, shape - 1) * Math.exp(-Math.pow(x / scale, shape));
          },
          cdf: function cdf(x, scale, shape) {
            return x < 0 ? 0 : 1 - Math.exp(-Math.pow(x / scale, shape));
          },
          inv: function inv(p, scale, shape) {
            return scale * Math.pow(-Math.log(1 - p), 1 / shape);
          },
          mean: function mean(scale, shape) {
            return scale * jStat.gammafn(1 + 1 / shape);
          },
          median: function median(scale, shape) {
            return scale * Math.pow(Math.log(2), 1 / shape);
          },
          mode: function mode(scale, shape) {
            if (shape <= 1) return 0;
            return scale * Math.pow((shape - 1) / shape, 1 / shape);
          },
          sample: function sample(scale, shape) {
            return scale * Math.pow(-Math.log(jStat._random_fn()), 1 / shape);
          },
          variance: function variance(scale, shape) {
            return scale * scale * jStat.gammafn(1 + 2 / shape) - Math.pow(jStat.weibull.mean(scale, shape), 2);
          }
        });
        jStat.extend(jStat.uniform, {
          pdf: function pdf(x, a, b) {
            return x < a || x > b ? 0 : 1 / (b - a);
          },
          cdf: function cdf(x, a, b) {
            if (x < a) return 0; else if (x < b) return (x - a) / (b - a);
            return 1;
          },
          inv: function inv(p, a, b) {
            return a + p * (b - a);
          },
          mean: function mean(a, b) {
            return .5 * (a + b);
          },
          median: function median(a, b) {
            return jStat.mean(a, b);
          },
          mode: function mode() {
            throw new Error("mode is not yet implemented");
          },
          sample: function sample(a, b) {
            return a / 2 + b / 2 + (b / 2 - a / 2) * (2 * jStat._random_fn() - 1);
          },
          variance: function variance(a, b) {
            return Math.pow(b - a, 2) / 12;
          }
        });
        function betinc(x, a, b, eps) {
          var a0 = 0;
          var b0 = 1;
          var a1 = 1;
          var b1 = 1;
          var m9 = 0;
          var a2 = 0;
          var c9;
          while (Math.abs((a1 - a2) / a1) > eps) {
            a2 = a1;
            c9 = -(a + m9) * (a + b + m9) * x / (a + 2 * m9) / (a + 2 * m9 + 1);
            a0 = a1 + c9 * a0;
            b0 = b1 + c9 * b0;
            m9 = m9 + 1;
            c9 = m9 * (b - m9) * x / (a + 2 * m9 - 1) / (a + 2 * m9);
            a1 = a0 + c9 * a1;
            b1 = b0 + c9 * b1;
            a0 = a0 / b1;
            b0 = b0 / b1;
            a1 = a1 / b1;
            b1 = 1;
          }
          return a1 / a;
        }
        jStat.extend(jStat.binomial, {
          pdf: function pdf(k, n, p) {
            return p === 0 || p === 1 ? n * p === k ? 1 : 0 : jStat.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
          },
          cdf: function cdf(x, n, p) {
            var betacdf;
            var eps = 1e-10;
            if (x < 0) return 0;
            if (x >= n) return 1;
            if (p < 0 || p > 1 || n <= 0) return NaN;
            x = Math.floor(x);
            var z = p;
            var a = x + 1;
            var b = n - x;
            var s = a + b;
            var bt = Math.exp(jStat.gammaln(s) - jStat.gammaln(b) - jStat.gammaln(a) + a * Math.log(z) + b * Math.log(1 - z));
            if (z < (a + 1) / (s + 2)) betacdf = bt * betinc(z, a, b, eps); else betacdf = 1 - bt * betinc(1 - z, b, a, eps);
            return Math.round((1 - betacdf) * (1 / eps)) / (1 / eps);
          }
        });
        jStat.extend(jStat.negbin, {
          pdf: function pdf(k, r, p) {
            if (k !== k >>> 0) return false;
            if (k < 0) return 0;
            return jStat.combination(k + r - 1, r - 1) * Math.pow(1 - p, k) * Math.pow(p, r);
          },
          cdf: function cdf(x, r, p) {
            var sum = 0, k = 0;
            if (x < 0) return 0;
            for (;k <= x; k++) {
              sum += jStat.negbin.pdf(k, r, p);
            }
            return sum;
          }
        });
        jStat.extend(jStat.hypgeom, {
          pdf: function pdf(k, N, m, n) {
            if (k !== k | 0) {
              return false;
            } else if (k < 0 || k < m - (N - n)) {
              return 0;
            } else if (k > n || k > m) {
              return 0;
            } else if (m * 2 > N) {
              if (n * 2 > N) {
                return jStat.hypgeom.pdf(N - m - n + k, N, N - m, N - n);
              } else {
                return jStat.hypgeom.pdf(n - k, N, N - m, n);
              }
            } else if (n * 2 > N) {
              return jStat.hypgeom.pdf(m - k, N, m, N - n);
            } else if (m < n) {
              return jStat.hypgeom.pdf(k, N, n, m);
            } else {
              var scaledPDF = 1;
              var samplesDone = 0;
              for (var i = 0; i < k; i++) {
                while (scaledPDF > 1 && samplesDone < n) {
                  scaledPDF *= 1 - m / (N - samplesDone);
                  samplesDone++;
                }
                scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));
              }
              for (;samplesDone < n; samplesDone++) {
                scaledPDF *= 1 - m / (N - samplesDone);
              }
              return Math.min(1, Math.max(0, scaledPDF));
            }
          },
          cdf: function cdf(x, N, m, n) {
            if (x < 0 || x < m - (N - n)) {
              return 0;
            } else if (x >= n || x >= m) {
              return 1;
            } else if (m * 2 > N) {
              if (n * 2 > N) {
                return jStat.hypgeom.cdf(N - m - n + x, N, N - m, N - n);
              } else {
                return 1 - jStat.hypgeom.cdf(n - x - 1, N, N - m, n);
              }
            } else if (n * 2 > N) {
              return 1 - jStat.hypgeom.cdf(m - x - 1, N, m, N - n);
            } else if (m < n) {
              return jStat.hypgeom.cdf(x, N, n, m);
            } else {
              var scaledCDF = 1;
              var scaledPDF = 1;
              var samplesDone = 0;
              for (var i = 0; i < x; i++) {
                while (scaledCDF > 1 && samplesDone < n) {
                  var factor = 1 - m / (N - samplesDone);
                  scaledPDF *= factor;
                  scaledCDF *= factor;
                  samplesDone++;
                }
                scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));
                scaledCDF += scaledPDF;
              }
              for (;samplesDone < n; samplesDone++) {
                scaledCDF *= 1 - m / (N - samplesDone);
              }
              return Math.min(1, Math.max(0, scaledCDF));
            }
          }
        });
        jStat.extend(jStat.poisson, {
          pdf: function pdf(k, l) {
            if (l < 0 || k % 1 !== 0 || k < 0) {
              return 0;
            }
            return Math.pow(l, k) * Math.exp(-l) / jStat.factorial(k);
          },
          cdf: function cdf(x, l) {
            var sumarr = [], k = 0;
            if (x < 0) return 0;
            for (;k <= x; k++) {
              sumarr.push(jStat.poisson.pdf(k, l));
            }
            return jStat.sum(sumarr);
          },
          mean: function mean(l) {
            return l;
          },
          variance: function variance(l) {
            return l;
          },
          sampleSmall: function sampleSmall(l) {
            var p = 1, k = 0, L = Math.exp(-l);
            do {
              k++;
              p *= jStat._random_fn();
            } while (p > L);
            return k - 1;
          },
          sampleLarge: function sampleLarge(l) {
            var lam = l;
            var k;
            var U, V, slam, loglam, a, b, invalpha, vr, us;
            slam = Math.sqrt(lam);
            loglam = Math.log(lam);
            b = .931 + 2.53 * slam;
            a = -.059 + .02483 * b;
            invalpha = 1.1239 + 1.1328 / (b - 3.4);
            vr = .9277 - 3.6224 / (b - 2);
            while (1) {
              U = Math.random() - .5;
              V = Math.random();
              us = .5 - Math.abs(U);
              k = Math.floor((2 * a / us + b) * U + lam + .43);
              if (us >= .07 && V <= vr) {
                return k;
              }
              if (k < 0 || us < .013 && V > us) {
                continue;
              }
              if (Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b) <= -lam + k * loglam - jStat.loggam(k + 1)) {
                return k;
              }
            }
          },
          sample: function sample(l) {
            if (l < 10) return this.sampleSmall(l); else return this.sampleLarge(l);
          }
        });
        jStat.extend(jStat.triangular, {
          pdf: function pdf(x, a, b, c) {
            if (b <= a || c < a || c > b) {
              return NaN;
            } else {
              if (x < a || x > b) {
                return 0;
              } else if (x < c) {
                return 2 * (x - a) / ((b - a) * (c - a));
              } else if (x === c) {
                return 2 / (b - a);
              } else {
                return 2 * (b - x) / ((b - a) * (b - c));
              }
            }
          },
          cdf: function cdf(x, a, b, c) {
            if (b <= a || c < a || c > b) return NaN;
            if (x <= a) return 0; else if (x >= b) return 1;
            if (x <= c) return Math.pow(x - a, 2) / ((b - a) * (c - a)); else return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
          },
          inv: function inv(p, a, b, c) {
            if (b <= a || c < a || c > b) {
              return NaN;
            } else {
              if (p <= (c - a) / (b - a)) {
                return a + (b - a) * Math.sqrt(p * ((c - a) / (b - a)));
              } else {
                return a + (b - a) * (1 - Math.sqrt((1 - p) * (1 - (c - a) / (b - a))));
              }
            }
          },
          mean: function mean(a, b, c) {
            return (a + b + c) / 3;
          },
          median: function median(a, b, c) {
            if (c <= (a + b) / 2) {
              return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
            } else if (c > (a + b) / 2) {
              return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
            }
          },
          mode: function mode(a, b, c) {
            return c;
          },
          sample: function sample(a, b, c) {
            var u = jStat._random_fn();
            if (u < (c - a) / (b - a)) return a + Math.sqrt(u * (b - a) * (c - a));
            return b - Math.sqrt((1 - u) * (b - a) * (b - c));
          },
          variance: function variance(a, b, c) {
            return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
          }
        });
        jStat.extend(jStat.arcsine, {
          pdf: function pdf(x, a, b) {
            if (b <= a) return NaN;
            return x <= a || x >= b ? 0 : 2 / Math.PI * Math.pow(Math.pow(b - a, 2) - Math.pow(2 * x - a - b, 2), -.5);
          },
          cdf: function cdf(x, a, b) {
            if (x < a) return 0; else if (x < b) return 2 / Math.PI * Math.asin(Math.sqrt((x - a) / (b - a)));
            return 1;
          },
          inv: function inv(p, a, b) {
            return a + (.5 - .5 * Math.cos(Math.PI * p)) * (b - a);
          },
          mean: function mean(a, b) {
            if (b <= a) return NaN;
            return (a + b) / 2;
          },
          median: function median(a, b) {
            if (b <= a) return NaN;
            return (a + b) / 2;
          },
          mode: function mode() {
            throw new Error("mode is not yet implemented");
          },
          sample: function sample(a, b) {
            return (a + b) / 2 + (b - a) / 2 * Math.sin(2 * Math.PI * jStat.uniform.sample(0, 1));
          },
          variance: function variance(a, b) {
            if (b <= a) return NaN;
            return Math.pow(b - a, 2) / 8;
          }
        });
        function laplaceSign(x) {
          return x / Math.abs(x);
        }
        jStat.extend(jStat.laplace, {
          pdf: function pdf(x, mu, b) {
            return b <= 0 ? 0 : Math.exp(-Math.abs(x - mu) / b) / (2 * b);
          },
          cdf: function cdf(x, mu, b) {
            if (b <= 0) {
              return 0;
            }
            if (x < mu) {
              return .5 * Math.exp((x - mu) / b);
            } else {
              return 1 - .5 * Math.exp(-(x - mu) / b);
            }
          },
          mean: function mean(mu) {
            return mu;
          },
          median: function median(mu) {
            return mu;
          },
          mode: function mode(mu) {
            return mu;
          },
          variance: function variance(mu, b) {
            return 2 * b * b;
          },
          sample: function sample(mu, b) {
            var u = jStat._random_fn() - .5;
            return mu - b * laplaceSign(u) * Math.log(1 - 2 * Math.abs(u));
          }
        });
        function tukeyWprob(w, rr, cc) {
          var nleg = 12;
          var ihalf = 6;
          var C1 = -30;
          var C2 = -50;
          var C3 = 60;
          var bb = 8;
          var wlar = 3;
          var wincr1 = 2;
          var wincr2 = 3;
          var xleg = [ .9815606342467192, .9041172563704749, .7699026741943047, .5873179542866175, .3678314989981802, .1252334085114689 ];
          var aleg = [ .04717533638651183, .10693932599531843, .16007832854334622, .20316742672306592, .2334925365383548, .24914704581340277 ];
          var qsqz = w * .5;
          if (qsqz >= bb) return 1;
          var pr_w = 2 * jStat.normal.cdf(qsqz, 0, 1, 1, 0) - 1;
          if (pr_w >= Math.exp(C2 / cc)) pr_w = Math.pow(pr_w, cc); else pr_w = 0;
          var wincr;
          if (w > wlar) wincr = wincr1; else wincr = wincr2;
          var blb = qsqz;
          var binc = (bb - qsqz) / wincr;
          var bub = blb + binc;
          var einsum = 0;
          var cc1 = cc - 1;
          for (var wi = 1; wi <= wincr; wi++) {
            var elsum = 0;
            var a = .5 * (bub + blb);
            var b = .5 * (bub - blb);
            for (var jj = 1; jj <= nleg; jj++) {
              var j, xx;
              if (ihalf < jj) {
                j = nleg - jj + 1;
                xx = xleg[j - 1];
              } else {
                j = jj;
                xx = -xleg[j - 1];
              }
              var c = b * xx;
              var ac = a + c;
              var qexpo = ac * ac;
              if (qexpo > C3) break;
              var pplus = 2 * jStat.normal.cdf(ac, 0, 1, 1, 0);
              var pminus = 2 * jStat.normal.cdf(ac, w, 1, 1, 0);
              var rinsum = pplus * .5 - pminus * .5;
              if (rinsum >= Math.exp(C1 / cc1)) {
                rinsum = aleg[j - 1] * Math.exp(-(.5 * qexpo)) * Math.pow(rinsum, cc1);
                elsum += rinsum;
              }
            }
            elsum *= 2 * b * cc / Math.sqrt(2 * Math.PI);
            einsum += elsum;
            blb = bub;
            bub += binc;
          }
          pr_w += einsum;
          if (pr_w <= Math.exp(C1 / rr)) return 0;
          pr_w = Math.pow(pr_w, rr);
          if (pr_w >= 1) return 1;
          return pr_w;
        }
        function tukeyQinv(p, c, v) {
          var p0 = .322232421088;
          var q0 = .099348462606;
          var p1 = -1;
          var q1 = .588581570495;
          var p2 = -.342242088547;
          var q2 = .531103462366;
          var p3 = -.204231210125;
          var q3 = .10353775285;
          var p4 = -453642210148e-16;
          var q4 = .0038560700634;
          var c1 = .8832;
          var c2 = .2368;
          var c3 = 1.214;
          var c4 = 1.208;
          var c5 = 1.4142;
          var vmax = 120;
          var ps = .5 - .5 * p;
          var yi = Math.sqrt(Math.log(1 / (ps * ps)));
          var t = yi + ((((yi * p4 + p3) * yi + p2) * yi + p1) * yi + p0) / ((((yi * q4 + q3) * yi + q2) * yi + q1) * yi + q0);
          if (v < vmax) t += (t * t * t + t) / v / 4;
          var q = c1 - c2 * t;
          if (v < vmax) q += -c3 / v + c4 * t / v;
          return t * (q * Math.log(c - 1) + c5);
        }
        jStat.extend(jStat.tukey, {
          cdf: function cdf(q, nmeans, df) {
            var rr = 1;
            var cc = nmeans;
            var nlegq = 16;
            var ihalfq = 8;
            var eps1 = -30;
            var eps2 = 1e-14;
            var dhaf = 100;
            var dquar = 800;
            var deigh = 5e3;
            var dlarg = 25e3;
            var ulen1 = 1;
            var ulen2 = .5;
            var ulen3 = .25;
            var ulen4 = .125;
            var xlegq = [ .9894009349916499, .9445750230732326, .8656312023878318, .755404408355003, .6178762444026438, .45801677765722737, .2816035507792589, .09501250983763744 ];
            var alegq = [ .027152459411754096, .062253523938647894, .09515851168249279, .12462897125553388, .14959598881657674, .16915651939500254, .18260341504492358, .1894506104550685 ];
            if (q <= 0) return 0;
            if (df < 2 || rr < 1 || cc < 2) return NaN;
            if (!Number.isFinite(q)) return 1;
            if (df > dlarg) return tukeyWprob(q, rr, cc);
            var f2 = df * .5;
            var f2lf = f2 * Math.log(df) - df * Math.log(2) - jStat.gammaln(f2);
            var f21 = f2 - 1;
            var ff4 = df * .25;
            var ulen;
            if (df <= dhaf) ulen = ulen1; else if (df <= dquar) ulen = ulen2; else if (df <= deigh) ulen = ulen3; else ulen = ulen4;
            f2lf += Math.log(ulen);
            var ans = 0;
            for (var i = 1; i <= 50; i++) {
              var otsum = 0;
              var twa1 = (2 * i - 1) * ulen;
              for (var jj = 1; jj <= nlegq; jj++) {
                var j, t1;
                if (ihalfq < jj) {
                  j = jj - ihalfq - 1;
                  t1 = f2lf + f21 * Math.log(twa1 + xlegq[j] * ulen) - (xlegq[j] * ulen + twa1) * ff4;
                } else {
                  j = jj - 1;
                  t1 = f2lf + f21 * Math.log(twa1 - xlegq[j] * ulen) + (xlegq[j] * ulen - twa1) * ff4;
                }
                var qsqz;
                if (t1 >= eps1) {
                  if (ihalfq < jj) {
                    qsqz = q * Math.sqrt((xlegq[j] * ulen + twa1) * .5);
                  } else {
                    qsqz = q * Math.sqrt((-(xlegq[j] * ulen) + twa1) * .5);
                  }
                  var wprb = tukeyWprob(qsqz, rr, cc);
                  var rotsum = wprb * alegq[j] * Math.exp(t1);
                  otsum += rotsum;
                }
              }
              if (i * ulen >= 1 && otsum <= eps2) break;
              ans += otsum;
            }
            if (otsum > eps2) {
              throw new Error("tukey.cdf failed to converge");
            }
            if (ans > 1) ans = 1;
            return ans;
          },
          inv: function inv(p, nmeans, df) {
            var rr = 1;
            var cc = nmeans;
            var eps = 1e-4;
            var maxiter = 50;
            if (df < 2 || rr < 1 || cc < 2) return NaN;
            if (p < 0 || p > 1) return NaN;
            if (p === 0) return 0;
            if (p === 1) return Infinity;
            var x0 = tukeyQinv(p, cc, df);
            var valx0 = jStat.tukey.cdf(x0, nmeans, df) - p;
            var x1;
            if (valx0 > 0) x1 = Math.max(0, x0 - 1); else x1 = x0 + 1;
            var valx1 = jStat.tukey.cdf(x1, nmeans, df) - p;
            var ans;
            for (var iter = 1; iter < maxiter; iter++) {
              ans = x1 - valx1 * (x1 - x0) / (valx1 - valx0);
              valx0 = valx1;
              x0 = x1;
              if (ans < 0) {
                ans = 0;
                valx1 = -p;
              }
              valx1 = jStat.tukey.cdf(ans, nmeans, df) - p;
              x1 = ans;
              var xabs = Math.abs(x1 - x0);
              if (xabs < eps) return ans;
            }
            throw new Error("tukey.inv failed to converge");
          }
        });
      })(jStat, Math);
      (function(jStat, Math) {
        var push = Array.prototype.push;
        var isArray = jStat.utils.isArray;
        function isUsable(arg) {
          return isArray(arg) || arg instanceof jStat;
        }
        jStat.extend({
          add: function add(arr, arg) {
            if (isUsable(arg)) {
              if (!isUsable(arg[0])) arg = [ arg ];
              return jStat.map(arr, (function(value, row, col) {
                return value + arg[row][col];
              }));
            }
            return jStat.map(arr, (function(value) {
              return value + arg;
            }));
          },
          subtract: function subtract(arr, arg) {
            if (isUsable(arg)) {
              if (!isUsable(arg[0])) arg = [ arg ];
              return jStat.map(arr, (function(value, row, col) {
                return value - arg[row][col] || 0;
              }));
            }
            return jStat.map(arr, (function(value) {
              return value - arg;
            }));
          },
          divide: function divide(arr, arg) {
            if (isUsable(arg)) {
              if (!isUsable(arg[0])) arg = [ arg ];
              return jStat.multiply(arr, jStat.inv(arg));
            }
            return jStat.map(arr, (function(value) {
              return value / arg;
            }));
          },
          multiply: function multiply(arr, arg) {
            var row, col, nrescols, sum, nrow, ncol, res, rescols;
            if (arr.length === undefined && arg.length === undefined) {
              return arr * arg;
            }
            nrow = arr.length, ncol = arr[0].length, res = jStat.zeros(nrow, nrescols = isUsable(arg) ? arg[0].length : ncol), 
            rescols = 0;
            if (isUsable(arg)) {
              for (;rescols < nrescols; rescols++) {
                for (row = 0; row < nrow; row++) {
                  sum = 0;
                  for (col = 0; col < ncol; col++) {
                    sum += arr[row][col] * arg[col][rescols];
                  }
                  res[row][rescols] = sum;
                }
              }
              return nrow === 1 && rescols === 1 ? res[0][0] : res;
            }
            return jStat.map(arr, (function(value) {
              return value * arg;
            }));
          },
          outer: function outer(A, B) {
            return jStat.multiply(A.map((function(t) {
              return [ t ];
            })), [ B ]);
          },
          dot: function dot(arr, arg) {
            if (!isUsable(arr[0])) arr = [ arr ];
            if (!isUsable(arg[0])) arg = [ arg ];
            var left = arr[0].length === 1 && arr.length !== 1 ? jStat.transpose(arr) : arr, right = arg[0].length === 1 && arg.length !== 1 ? jStat.transpose(arg) : arg, res = [], row = 0, nrow = left.length, ncol = left[0].length, sum, col;
            for (;row < nrow; row++) {
              res[row] = [];
              sum = 0;
              for (col = 0; col < ncol; col++) {
                sum += left[row][col] * right[row][col];
              }
              res[row] = sum;
            }
            return res.length === 1 ? res[0] : res;
          },
          pow: function pow(arr, arg) {
            return jStat.map(arr, (function(value) {
              return Math.pow(value, arg);
            }));
          },
          exp: function exp(arr) {
            return jStat.map(arr, (function(value) {
              return Math.exp(value);
            }));
          },
          log: function exp(arr) {
            return jStat.map(arr, (function(value) {
              return Math.log(value);
            }));
          },
          abs: function abs(arr) {
            return jStat.map(arr, (function(value) {
              return Math.abs(value);
            }));
          },
          norm: function norm(arr, p) {
            var nnorm = 0, i = 0;
            if (isNaN(p)) p = 2;
            if (isUsable(arr[0])) arr = arr[0];
            for (;i < arr.length; i++) {
              nnorm += Math.pow(Math.abs(arr[i]), p);
            }
            return Math.pow(nnorm, 1 / p);
          },
          angle: function angle(arr, arg) {
            return Math.acos(jStat.dot(arr, arg) / (jStat.norm(arr) * jStat.norm(arg)));
          },
          aug: function aug(a, b) {
            var newarr = [];
            var i;
            for (i = 0; i < a.length; i++) {
              newarr.push(a[i].slice());
            }
            for (i = 0; i < newarr.length; i++) {
              push.apply(newarr[i], b[i]);
            }
            return newarr;
          },
          inv: function inv(a) {
            var rows = a.length;
            var cols = a[0].length;
            var b = jStat.identity(rows, cols);
            var c = jStat.gauss_jordan(a, b);
            var result = [];
            var i = 0;
            var j;
            for (;i < rows; i++) {
              result[i] = [];
              for (j = cols; j < c[0].length; j++) {
                result[i][j - cols] = c[i][j];
              }
            }
            return result;
          },
          det: function det(a) {
            if (a.length === 2) {
              return a[0][0] * a[1][1] - a[0][1] * a[1][0];
            }
            var determinant = 0;
            for (var i = 0; i < a.length; i++) {
              var submatrix = [];
              for (var row = 1; row < a.length; row++) {
                submatrix[row - 1] = [];
                for (var col = 0; col < a.length; col++) {
                  if (col < i) {
                    submatrix[row - 1][col] = a[row][col];
                  } else if (col > i) {
                    submatrix[row - 1][col - 1] = a[row][col];
                  }
                }
              }
              var sign = i % 2 ? -1 : 1;
              determinant += det(submatrix) * a[0][i] * sign;
            }
            return determinant;
          },
          gauss_elimination: function gauss_elimination(a, b) {
            var i = 0, j = 0, n = a.length, m = a[0].length, factor = 1, sum = 0, x = [], maug, pivot, temp, k;
            a = jStat.aug(a, b);
            maug = a[0].length;
            for (i = 0; i < n; i++) {
              pivot = a[i][i];
              j = i;
              for (k = i + 1; k < m; k++) {
                if (pivot < Math.abs(a[k][i])) {
                  pivot = a[k][i];
                  j = k;
                }
              }
              if (j != i) {
                for (k = 0; k < maug; k++) {
                  temp = a[i][k];
                  a[i][k] = a[j][k];
                  a[j][k] = temp;
                }
              }
              for (j = i + 1; j < n; j++) {
                factor = a[j][i] / a[i][i];
                for (k = i; k < maug; k++) {
                  a[j][k] = a[j][k] - factor * a[i][k];
                }
              }
            }
            for (i = n - 1; i >= 0; i--) {
              sum = 0;
              for (j = i + 1; j <= n - 1; j++) {
                sum = sum + x[j] * a[i][j];
              }
              x[i] = (a[i][maug - 1] - sum) / a[i][i];
            }
            return x;
          },
          gauss_jordan: function gauss_jordan(a, b) {
            var m = jStat.aug(a, b);
            var h = m.length;
            var w = m[0].length;
            var c = 0;
            var x, y, y2;
            for (y = 0; y < h; y++) {
              var maxrow = y;
              for (y2 = y + 1; y2 < h; y2++) {
                if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y])) maxrow = y2;
              }
              var tmp = m[y];
              m[y] = m[maxrow];
              m[maxrow] = tmp;
              for (y2 = y + 1; y2 < h; y2++) {
                c = m[y2][y] / m[y][y];
                for (x = y; x < w; x++) {
                  m[y2][x] -= m[y][x] * c;
                }
              }
            }
            for (y = h - 1; y >= 0; y--) {
              c = m[y][y];
              for (y2 = 0; y2 < y; y2++) {
                for (x = w - 1; x > y - 1; x--) {
                  m[y2][x] -= m[y][x] * m[y2][y] / c;
                }
              }
              m[y][y] /= c;
              for (x = h; x < w; x++) {
                m[y][x] /= c;
              }
            }
            return m;
          },
          triaUpSolve: function triaUpSolve(A, b) {
            var size = A[0].length;
            var x = jStat.zeros(1, size)[0];
            var parts;
            var matrix_mode = false;
            if (b[0].length != undefined) {
              b = b.map((function(i) {
                return i[0];
              }));
              matrix_mode = true;
            }
            jStat.arange(size - 1, -1, -1).forEach((function(i) {
              parts = jStat.arange(i + 1, size).map((function(j) {
                return x[j] * A[i][j];
              }));
              x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
            }));
            if (matrix_mode) return x.map((function(i) {
              return [ i ];
            }));
            return x;
          },
          triaLowSolve: function triaLowSolve(A, b) {
            var size = A[0].length;
            var x = jStat.zeros(1, size)[0];
            var parts;
            var matrix_mode = false;
            if (b[0].length != undefined) {
              b = b.map((function(i) {
                return i[0];
              }));
              matrix_mode = true;
            }
            jStat.arange(size).forEach((function(i) {
              parts = jStat.arange(i).map((function(j) {
                return A[i][j] * x[j];
              }));
              x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
            }));
            if (matrix_mode) return x.map((function(i) {
              return [ i ];
            }));
            return x;
          },
          lu: function lu(A) {
            var size = A.length;
            var L = jStat.identity(size);
            var R = jStat.zeros(A.length, A[0].length);
            var parts;
            jStat.arange(size).forEach((function(t) {
              R[0][t] = A[0][t];
            }));
            jStat.arange(1, size).forEach((function(l) {
              jStat.arange(l).forEach((function(i) {
                parts = jStat.arange(i).map((function(jj) {
                  return L[l][jj] * R[jj][i];
                }));
                L[l][i] = (A[l][i] - jStat.sum(parts)) / R[i][i];
              }));
              jStat.arange(l, size).forEach((function(j) {
                parts = jStat.arange(l).map((function(jj) {
                  return L[l][jj] * R[jj][j];
                }));
                R[l][j] = A[parts.length][j] - jStat.sum(parts);
              }));
            }));
            return [ L, R ];
          },
          cholesky: function cholesky(A) {
            var size = A.length;
            var T = jStat.zeros(A.length, A[0].length);
            var parts;
            jStat.arange(size).forEach((function(i) {
              parts = jStat.arange(i).map((function(t) {
                return Math.pow(T[i][t], 2);
              }));
              T[i][i] = Math.sqrt(A[i][i] - jStat.sum(parts));
              jStat.arange(i + 1, size).forEach((function(j) {
                parts = jStat.arange(i).map((function(t) {
                  return T[i][t] * T[j][t];
                }));
                T[j][i] = (A[i][j] - jStat.sum(parts)) / T[i][i];
              }));
            }));
            return T;
          },
          gauss_jacobi: function gauss_jacobi(a, b, x, r) {
            var i = 0;
            var j = 0;
            var n = a.length;
            var l = [];
            var u = [];
            var d = [];
            var xv, c, h, xk;
            for (;i < n; i++) {
              l[i] = [];
              u[i] = [];
              d[i] = [];
              for (j = 0; j < n; j++) {
                if (i > j) {
                  l[i][j] = a[i][j];
                  u[i][j] = d[i][j] = 0;
                } else if (i < j) {
                  u[i][j] = a[i][j];
                  l[i][j] = d[i][j] = 0;
                } else {
                  d[i][j] = a[i][j];
                  l[i][j] = u[i][j] = 0;
                }
              }
            }
            h = jStat.multiply(jStat.multiply(jStat.inv(d), jStat.add(l, u)), -1);
            c = jStat.multiply(jStat.inv(d), b);
            xv = x;
            xk = jStat.add(jStat.multiply(h, x), c);
            i = 2;
            while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
              xv = xk;
              xk = jStat.add(jStat.multiply(h, xv), c);
              i++;
            }
            return xk;
          },
          gauss_seidel: function gauss_seidel(a, b, x, r) {
            var i = 0;
            var n = a.length;
            var l = [];
            var u = [];
            var d = [];
            var j, xv, c, h, xk;
            for (;i < n; i++) {
              l[i] = [];
              u[i] = [];
              d[i] = [];
              for (j = 0; j < n; j++) {
                if (i > j) {
                  l[i][j] = a[i][j];
                  u[i][j] = d[i][j] = 0;
                } else if (i < j) {
                  u[i][j] = a[i][j];
                  l[i][j] = d[i][j] = 0;
                } else {
                  d[i][j] = a[i][j];
                  l[i][j] = u[i][j] = 0;
                }
              }
            }
            h = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, l)), u), -1);
            c = jStat.multiply(jStat.inv(jStat.add(d, l)), b);
            xv = x;
            xk = jStat.add(jStat.multiply(h, x), c);
            i = 2;
            while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
              xv = xk;
              xk = jStat.add(jStat.multiply(h, xv), c);
              i = i + 1;
            }
            return xk;
          },
          SOR: function SOR(a, b, x, r, w) {
            var i = 0;
            var n = a.length;
            var l = [];
            var u = [];
            var d = [];
            var j, xv, c, h, xk;
            for (;i < n; i++) {
              l[i] = [];
              u[i] = [];
              d[i] = [];
              for (j = 0; j < n; j++) {
                if (i > j) {
                  l[i][j] = a[i][j];
                  u[i][j] = d[i][j] = 0;
                } else if (i < j) {
                  u[i][j] = a[i][j];
                  l[i][j] = d[i][j] = 0;
                } else {
                  d[i][j] = a[i][j];
                  l[i][j] = u[i][j] = 0;
                }
              }
            }
            h = jStat.multiply(jStat.inv(jStat.add(d, jStat.multiply(l, w))), jStat.subtract(jStat.multiply(d, 1 - w), jStat.multiply(u, w)));
            c = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, jStat.multiply(l, w))), b), w);
            xv = x;
            xk = jStat.add(jStat.multiply(h, x), c);
            i = 2;
            while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
              xv = xk;
              xk = jStat.add(jStat.multiply(h, xv), c);
              i++;
            }
            return xk;
          },
          householder: function householder(a) {
            var m = a.length;
            var n = a[0].length;
            var i = 0;
            var w = [];
            var p = [];
            var alpha, r, k, j, factor;
            for (;i < m - 1; i++) {
              alpha = 0;
              for (j = i + 1; j < n; j++) {
                alpha += a[j][i] * a[j][i];
              }
              factor = a[i + 1][i] > 0 ? -1 : 1;
              alpha = factor * Math.sqrt(alpha);
              r = Math.sqrt((alpha * alpha - a[i + 1][i] * alpha) / 2);
              w = jStat.zeros(m, 1);
              w[i + 1][0] = (a[i + 1][i] - alpha) / (2 * r);
              for (k = i + 2; k < m; k++) {
                w[k][0] = a[k][i] / (2 * r);
              }
              p = jStat.subtract(jStat.identity(m, n), jStat.multiply(jStat.multiply(w, jStat.transpose(w)), 2));
              a = jStat.multiply(p, jStat.multiply(a, p));
            }
            return a;
          },
          QR: function() {
            var sum = jStat.sum;
            var range = jStat.arange;
            function qr2(x) {
              var n = x.length;
              var p = x[0].length;
              var r = jStat.zeros(p, p);
              x = jStat.copy(x);
              var i, j, k;
              for (j = 0; j < p; j++) {
                r[j][j] = Math.sqrt(sum(range(n).map((function(i) {
                  return x[i][j] * x[i][j];
                }))));
                for (i = 0; i < n; i++) {
                  x[i][j] = x[i][j] / r[j][j];
                }
                for (k = j + 1; k < p; k++) {
                  r[j][k] = sum(range(n).map((function(i) {
                    return x[i][j] * x[i][k];
                  })));
                  for (i = 0; i < n; i++) {
                    x[i][k] = x[i][k] - x[i][j] * r[j][k];
                  }
                }
              }
              return [ x, r ];
            }
            return qr2;
          }(),
          lstsq: function() {
            function R_I(A) {
              A = jStat.copy(A);
              var size = A.length;
              var I = jStat.identity(size);
              jStat.arange(size - 1, -1, -1).forEach((function(i) {
                jStat.sliceAssign(I, {
                  row: i
                }, jStat.divide(jStat.slice(I, {
                  row: i
                }), A[i][i]));
                jStat.sliceAssign(A, {
                  row: i
                }, jStat.divide(jStat.slice(A, {
                  row: i
                }), A[i][i]));
                jStat.arange(i).forEach((function(j) {
                  var c = jStat.multiply(A[j][i], -1);
                  var Aj = jStat.slice(A, {
                    row: j
                  });
                  var cAi = jStat.multiply(jStat.slice(A, {
                    row: i
                  }), c);
                  jStat.sliceAssign(A, {
                    row: j
                  }, jStat.add(Aj, cAi));
                  var Ij = jStat.slice(I, {
                    row: j
                  });
                  var cIi = jStat.multiply(jStat.slice(I, {
                    row: i
                  }), c);
                  jStat.sliceAssign(I, {
                    row: j
                  }, jStat.add(Ij, cIi));
                }));
              }));
              return I;
            }
            function qr_solve(A, b) {
              var array_mode = false;
              if (b[0].length === undefined) {
                b = b.map((function(x) {
                  return [ x ];
                }));
                array_mode = true;
              }
              var QR = jStat.QR(A);
              var Q = QR[0];
              var R = QR[1];
              var attrs = A[0].length;
              var Q1 = jStat.slice(Q, {
                col: {
                  end: attrs
                }
              });
              var R1 = jStat.slice(R, {
                row: {
                  end: attrs
                }
              });
              var RI = R_I(R1);
              var Q2 = jStat.transpose(Q1);
              if (Q2[0].length === undefined) {
                Q2 = [ Q2 ];
              }
              var x = jStat.multiply(jStat.multiply(RI, Q2), b);
              if (x.length === undefined) {
                x = [ [ x ] ];
              }
              if (array_mode) return x.map((function(i) {
                return i[0];
              }));
              return x;
            }
            return qr_solve;
          }(),
          jacobi: function jacobi(a) {
            var condition = 1;
            var n = a.length;
            var e = jStat.identity(n, n);
            var ev = [];
            var b, i, j, p, q, maxim, theta, s;
            while (condition === 1) {
              maxim = a[0][1];
              p = 0;
              q = 1;
              for (i = 0; i < n; i++) {
                for (j = 0; j < n; j++) {
                  if (i != j) {
                    if (maxim < Math.abs(a[i][j])) {
                      maxim = Math.abs(a[i][j]);
                      p = i;
                      q = j;
                    }
                  }
                }
              }
              if (a[p][p] === a[q][q]) theta = a[p][q] > 0 ? Math.PI / 4 : -Math.PI / 4; else theta = Math.atan(2 * a[p][q] / (a[p][p] - a[q][q])) / 2;
              s = jStat.identity(n, n);
              s[p][p] = Math.cos(theta);
              s[p][q] = -Math.sin(theta);
              s[q][p] = Math.sin(theta);
              s[q][q] = Math.cos(theta);
              e = jStat.multiply(e, s);
              b = jStat.multiply(jStat.multiply(jStat.inv(s), a), s);
              a = b;
              condition = 0;
              for (i = 1; i < n; i++) {
                for (j = 1; j < n; j++) {
                  if (i != j && Math.abs(a[i][j]) > .001) {
                    condition = 1;
                  }
                }
              }
            }
            for (i = 0; i < n; i++) {
              ev.push(a[i][i]);
            }
            return [ e, ev ];
          },
          rungekutta: function rungekutta(f, h, p, t_j, u_j, order) {
            var k1, k2, u_j1, k3, k4;
            if (order === 2) {
              while (t_j <= p) {
                k1 = h * f(t_j, u_j);
                k2 = h * f(t_j + h, u_j + k1);
                u_j1 = u_j + (k1 + k2) / 2;
                u_j = u_j1;
                t_j = t_j + h;
              }
            }
            if (order === 4) {
              while (t_j <= p) {
                k1 = h * f(t_j, u_j);
                k2 = h * f(t_j + h / 2, u_j + k1 / 2);
                k3 = h * f(t_j + h / 2, u_j + k2 / 2);
                k4 = h * f(t_j + h, u_j + k3);
                u_j1 = u_j + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
                u_j = u_j1;
                t_j = t_j + h;
              }
            }
            return u_j;
          },
          romberg: function romberg(f, a, b, order) {
            var i = 0;
            var h = (b - a) / 2;
            var x = [];
            var h1 = [];
            var g = [];
            var m, a1, j, k, I;
            while (i < order / 2) {
              I = f(a);
              for (j = a, k = 0; j <= b; j = j + h, k++) {
                x[k] = j;
              }
              m = x.length;
              for (j = 1; j < m - 1; j++) {
                I += (j % 2 !== 0 ? 4 : 2) * f(x[j]);
              }
              I = h / 3 * (I + f(b));
              g[i] = I;
              h /= 2;
              i++;
            }
            a1 = g.length;
            m = 1;
            while (a1 !== 1) {
              for (j = 0; j < a1 - 1; j++) {
                h1[j] = (Math.pow(4, m) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
              }
              a1 = h1.length;
              g = h1;
              h1 = [];
              m++;
            }
            return g;
          },
          richardson: function richardson(X, f, x, h) {
            function pos(X, x) {
              var i = 0;
              var n = X.length;
              var p;
              for (;i < n; i++) {
                if (X[i] === x) p = i;
              }
              return p;
            }
            var h_min = Math.abs(x - X[pos(X, x) + 1]);
            var i = 0;
            var g = [];
            var h1 = [];
            var y1, y2, m, a, j;
            while (h >= h_min) {
              y1 = pos(X, x + h);
              y2 = pos(X, x);
              g[i] = (f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / (h * h);
              h /= 2;
              i++;
            }
            a = g.length;
            m = 1;
            while (a != 1) {
              for (j = 0; j < a - 1; j++) {
                h1[j] = (Math.pow(4, m) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
              }
              a = h1.length;
              g = h1;
              h1 = [];
              m++;
            }
            return g;
          },
          simpson: function simpson(f, a, b, n) {
            var h = (b - a) / n;
            var I = f(a);
            var x = [];
            var j = a;
            var k = 0;
            var i = 1;
            var m;
            for (;j <= b; j = j + h, k++) {
              x[k] = j;
            }
            m = x.length;
            for (;i < m - 1; i++) {
              I += (i % 2 !== 0 ? 4 : 2) * f(x[i]);
            }
            return h / 3 * (I + f(b));
          },
          hermite: function hermite(X, F, dF, value) {
            var n = X.length;
            var p = 0;
            var i = 0;
            var l = [];
            var dl = [];
            var A = [];
            var B = [];
            var j;
            for (;i < n; i++) {
              l[i] = 1;
              for (j = 0; j < n; j++) {
                if (i != j) l[i] *= (value - X[j]) / (X[i] - X[j]);
              }
              dl[i] = 0;
              for (j = 0; j < n; j++) {
                if (i != j) dl[i] += 1 / (X[i] - X[j]);
              }
              A[i] = (1 - 2 * (value - X[i]) * dl[i]) * (l[i] * l[i]);
              B[i] = (value - X[i]) * (l[i] * l[i]);
              p += A[i] * F[i] + B[i] * dF[i];
            }
            return p;
          },
          lagrange: function lagrange(X, F, value) {
            var p = 0;
            var i = 0;
            var j, l;
            var n = X.length;
            for (;i < n; i++) {
              l = F[i];
              for (j = 0; j < n; j++) {
                if (i != j) l *= (value - X[j]) / (X[i] - X[j]);
              }
              p += l;
            }
            return p;
          },
          cubic_spline: function cubic_spline(X, F, value) {
            var n = X.length;
            var i = 0, j;
            var A = [];
            var B = [];
            var alpha = [];
            var c = [];
            var h = [];
            var b = [];
            var d = [];
            for (;i < n - 1; i++) {
              h[i] = X[i + 1] - X[i];
            }
            alpha[0] = 0;
            for (i = 1; i < n - 1; i++) {
              alpha[i] = 3 / h[i] * (F[i + 1] - F[i]) - 3 / h[i - 1] * (F[i] - F[i - 1]);
            }
            for (i = 1; i < n - 1; i++) {
              A[i] = [];
              B[i] = [];
              A[i][i - 1] = h[i - 1];
              A[i][i] = 2 * (h[i - 1] + h[i]);
              A[i][i + 1] = h[i];
              B[i][0] = alpha[i];
            }
            c = jStat.multiply(jStat.inv(A), B);
            for (j = 0; j < n - 1; j++) {
              b[j] = (F[j + 1] - F[j]) / h[j] - h[j] * (c[j + 1][0] + 2 * c[j][0]) / 3;
              d[j] = (c[j + 1][0] - c[j][0]) / (3 * h[j]);
            }
            for (j = 0; j < n; j++) {
              if (X[j] > value) break;
            }
            j -= 1;
            return F[j] + (value - X[j]) * b[j] + jStat.sq(value - X[j]) * c[j] + (value - X[j]) * jStat.sq(value - X[j]) * d[j];
          },
          gauss_quadrature: function gauss_quadrature() {
            throw new Error("gauss_quadrature not yet implemented");
          },
          PCA: function PCA(X) {
            var m = X.length;
            var n = X[0].length;
            var i = 0;
            var j, temp1;
            var u = [];
            var D = [];
            var result = [];
            var temp2 = [];
            var Y = [];
            var Bt = [];
            var B = [];
            var C = [];
            var V = [];
            var Vt = [];
            for (i = 0; i < m; i++) {
              u[i] = jStat.sum(X[i]) / n;
            }
            for (i = 0; i < n; i++) {
              B[i] = [];
              for (j = 0; j < m; j++) {
                B[i][j] = X[j][i] - u[j];
              }
            }
            B = jStat.transpose(B);
            for (i = 0; i < m; i++) {
              C[i] = [];
              for (j = 0; j < m; j++) {
                C[i][j] = jStat.dot([ B[i] ], [ B[j] ]) / (n - 1);
              }
            }
            result = jStat.jacobi(C);
            V = result[0];
            D = result[1];
            Vt = jStat.transpose(V);
            for (i = 0; i < D.length; i++) {
              for (j = i; j < D.length; j++) {
                if (D[i] < D[j]) {
                  temp1 = D[i];
                  D[i] = D[j];
                  D[j] = temp1;
                  temp2 = Vt[i];
                  Vt[i] = Vt[j];
                  Vt[j] = temp2;
                }
              }
            }
            Bt = jStat.transpose(B);
            for (i = 0; i < m; i++) {
              Y[i] = [];
              for (j = 0; j < Bt.length; j++) {
                Y[i][j] = jStat.dot([ Vt[i] ], [ Bt[j] ]);
              }
            }
            return [ X, D, Vt, Y ];
          }
        });
        (function(funcs) {
          for (var i = 0; i < funcs.length; i++) {
            (function(passfunc) {
              jStat.fn[passfunc] = function(arg, func) {
                var tmpthis = this;
                if (func) {
                  setTimeout((function() {
                    func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
                  }), 15);
                  return this;
                }
                if (typeof jStat[passfunc](this, arg) === "number") return jStat[passfunc](this, arg); else return jStat(jStat[passfunc](this, arg));
              };
            })(funcs[i]);
          }
        })("add divide multiply subtract dot pow exp log abs norm angle".split(" "));
      })(jStat, Math);
      (function(jStat, Math) {
        var slice = [].slice;
        var isNumber = jStat.utils.isNumber;
        var isArray = jStat.utils.isArray;
        jStat.extend({
          zscore: function zscore() {
            var args = slice.call(arguments);
            if (isNumber(args[1])) {
              return (args[0] - args[1]) / args[2];
            }
            return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
          },
          ztest: function ztest() {
            var args = slice.call(arguments);
            var z;
            if (isArray(args[1])) {
              z = jStat.zscore(args[0], args[1], args[3]);
              return args[2] === 1 ? jStat.normal.cdf(-Math.abs(z), 0, 1) : jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
            } else {
              if (args.length > 2) {
                z = jStat.zscore(args[0], args[1], args[2]);
                return args[3] === 1 ? jStat.normal.cdf(-Math.abs(z), 0, 1) : jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
              } else {
                z = args[0];
                return args[1] === 1 ? jStat.normal.cdf(-Math.abs(z), 0, 1) : jStat.normal.cdf(-Math.abs(z), 0, 1) * 2;
              }
            }
          }
        });
        jStat.extend(jStat.fn, {
          zscore: function zscore(value, flag) {
            return (value - this.mean()) / this.stdev(flag);
          },
          ztest: function ztest(value, sides, flag) {
            var zscore = Math.abs(this.zscore(value, flag));
            return sides === 1 ? jStat.normal.cdf(-zscore, 0, 1) : jStat.normal.cdf(-zscore, 0, 1) * 2;
          }
        });
        jStat.extend({
          tscore: function tscore() {
            var args = slice.call(arguments);
            return args.length === 4 ? (args[0] - args[1]) / (args[2] / Math.sqrt(args[3])) : (args[0] - jStat.mean(args[1])) / (jStat.stdev(args[1], true) / Math.sqrt(args[1].length));
          },
          ttest: function ttest() {
            var args = slice.call(arguments);
            var tscore;
            if (args.length === 5) {
              tscore = Math.abs(jStat.tscore(args[0], args[1], args[2], args[3]));
              return args[4] === 1 ? jStat.studentt.cdf(-tscore, args[3] - 1) : jStat.studentt.cdf(-tscore, args[3] - 1) * 2;
            }
            if (isNumber(args[1])) {
              tscore = Math.abs(args[0]);
              return args[2] == 1 ? jStat.studentt.cdf(-tscore, args[1] - 1) : jStat.studentt.cdf(-tscore, args[1] - 1) * 2;
            }
            tscore = Math.abs(jStat.tscore(args[0], args[1]));
            return args[2] == 1 ? jStat.studentt.cdf(-tscore, args[1].length - 1) : jStat.studentt.cdf(-tscore, args[1].length - 1) * 2;
          }
        });
        jStat.extend(jStat.fn, {
          tscore: function tscore(value) {
            return (value - this.mean()) / (this.stdev(true) / Math.sqrt(this.cols()));
          },
          ttest: function ttest(value, sides) {
            return sides === 1 ? 1 - jStat.studentt.cdf(Math.abs(this.tscore(value)), this.cols() - 1) : jStat.studentt.cdf(-Math.abs(this.tscore(value)), this.cols() - 1) * 2;
          }
        });
        jStat.extend({
          anovafscore: function anovafscore() {
            var args = slice.call(arguments), expVar, sample, sampMean, sampSampMean, tmpargs, unexpVar, i, j;
            if (args.length === 1) {
              tmpargs = new Array(args[0].length);
              for (i = 0; i < args[0].length; i++) {
                tmpargs[i] = args[0][i];
              }
              args = tmpargs;
            }
            sample = new Array;
            for (i = 0; i < args.length; i++) {
              sample = sample.concat(args[i]);
            }
            sampMean = jStat.mean(sample);
            expVar = 0;
            for (i = 0; i < args.length; i++) {
              expVar = expVar + args[i].length * Math.pow(jStat.mean(args[i]) - sampMean, 2);
            }
            expVar /= args.length - 1;
            unexpVar = 0;
            for (i = 0; i < args.length; i++) {
              sampSampMean = jStat.mean(args[i]);
              for (j = 0; j < args[i].length; j++) {
                unexpVar += Math.pow(args[i][j] - sampSampMean, 2);
              }
            }
            unexpVar /= sample.length - args.length;
            return expVar / unexpVar;
          },
          anovaftest: function anovaftest() {
            var args = slice.call(arguments), df1, df2, n, i;
            if (isNumber(args[0])) {
              return 1 - jStat.centralF.cdf(args[0], args[1], args[2]);
            }
            var anovafscore = jStat.anovafscore(args);
            df1 = args.length - 1;
            n = 0;
            for (i = 0; i < args.length; i++) {
              n = n + args[i].length;
            }
            df2 = n - df1 - 1;
            return 1 - jStat.centralF.cdf(anovafscore, df1, df2);
          },
          ftest: function ftest(fscore, df1, df2) {
            return 1 - jStat.centralF.cdf(fscore, df1, df2);
          }
        });
        jStat.extend(jStat.fn, {
          anovafscore: function anovafscore() {
            return jStat.anovafscore(this.toArray());
          },
          anovaftes: function anovaftes() {
            var n = 0;
            var i;
            for (i = 0; i < this.length; i++) {
              n = n + this[i].length;
            }
            return jStat.ftest(this.anovafscore(), this.length - 1, n - this.length);
          }
        });
        jStat.extend({
          qscore: function qscore() {
            var args = slice.call(arguments);
            var mean1, mean2, n1, n2, sd;
            if (isNumber(args[0])) {
              mean1 = args[0];
              mean2 = args[1];
              n1 = args[2];
              n2 = args[3];
              sd = args[4];
            } else {
              mean1 = jStat.mean(args[0]);
              mean2 = jStat.mean(args[1]);
              n1 = args[0].length;
              n2 = args[1].length;
              sd = args[2];
            }
            return Math.abs(mean1 - mean2) / (sd * Math.sqrt((1 / n1 + 1 / n2) / 2));
          },
          qtest: function qtest() {
            var args = slice.call(arguments);
            var qscore;
            if (args.length === 3) {
              qscore = args[0];
              args = args.slice(1);
            } else if (args.length === 7) {
              qscore = jStat.qscore(args[0], args[1], args[2], args[3], args[4]);
              args = args.slice(5);
            } else {
              qscore = jStat.qscore(args[0], args[1], args[2]);
              args = args.slice(3);
            }
            var n = args[0];
            var k = args[1];
            return 1 - jStat.tukey.cdf(qscore, k, n - k);
          },
          tukeyhsd: function tukeyhsd(arrays) {
            var sd = jStat.pooledstdev(arrays);
            var means = arrays.map((function(arr) {
              return jStat.mean(arr);
            }));
            var n = arrays.reduce((function(n, arr) {
              return n + arr.length;
            }), 0);
            var results = [];
            for (var i = 0; i < arrays.length; ++i) {
              for (var j = i + 1; j < arrays.length; ++j) {
                var p = jStat.qtest(means[i], means[j], arrays[i].length, arrays[j].length, sd, n, arrays.length);
                results.push([ [ i, j ], p ]);
              }
            }
            return results;
          }
        });
        jStat.extend({
          normalci: function normalci() {
            var args = slice.call(arguments), ans = new Array(2), change;
            if (args.length === 4) {
              change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) * args[2] / Math.sqrt(args[3]));
            } else {
              change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) * jStat.stdev(args[2]) / Math.sqrt(args[2].length));
            }
            ans[0] = args[0] - change;
            ans[1] = args[0] + change;
            return ans;
          },
          tci: function tci() {
            var args = slice.call(arguments), ans = new Array(2), change;
            if (args.length === 4) {
              change = Math.abs(jStat.studentt.inv(args[1] / 2, args[3] - 1) * args[2] / Math.sqrt(args[3]));
            } else {
              change = Math.abs(jStat.studentt.inv(args[1] / 2, args[2].length - 1) * jStat.stdev(args[2], true) / Math.sqrt(args[2].length));
            }
            ans[0] = args[0] - change;
            ans[1] = args[0] + change;
            return ans;
          },
          significant: function significant(pvalue, alpha) {
            return pvalue < alpha;
          }
        });
        jStat.extend(jStat.fn, {
          normalci: function normalci(value, alpha) {
            return jStat.normalci(value, alpha, this.toArray());
          },
          tci: function tci(value, alpha) {
            return jStat.tci(value, alpha, this.toArray());
          }
        });
        function differenceOfProportions(p1, n1, p2, n2) {
          if (p1 > 1 || p2 > 1 || p1 <= 0 || p2 <= 0) {
            throw new Error("Proportions should be greater than 0 and less than 1");
          }
          var pooled = (p1 * n1 + p2 * n2) / (n1 + n2);
          var se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
          return (p1 - p2) / se;
        }
        jStat.extend(jStat.fn, {
          oneSidedDifferenceOfProportions: function oneSidedDifferenceOfProportions(p1, n1, p2, n2) {
            var z = differenceOfProportions(p1, n1, p2, n2);
            return jStat.ztest(z, 1);
          },
          twoSidedDifferenceOfProportions: function twoSidedDifferenceOfProportions(p1, n1, p2, n2) {
            var z = differenceOfProportions(p1, n1, p2, n2);
            return jStat.ztest(z, 2);
          }
        });
      })(jStat, Math);
      jStat.models = function() {
        function sub_regress(exog) {
          var var_count = exog[0].length;
          var modelList = jStat.arange(var_count).map((function(endog_index) {
            var exog_index = jStat.arange(var_count).filter((function(i) {
              return i !== endog_index;
            }));
            return ols(jStat.col(exog, endog_index).map((function(x) {
              return x[0];
            })), jStat.col(exog, exog_index));
          }));
          return modelList;
        }
        function ols(endog, exog) {
          var nobs = endog.length;
          var df_model = exog[0].length - 1;
          var df_resid = nobs - df_model - 1;
          var coef = jStat.lstsq(exog, endog);
          var predict = jStat.multiply(exog, coef.map((function(x) {
            return [ x ];
          }))).map((function(p) {
            return p[0];
          }));
          var resid = jStat.subtract(endog, predict);
          var ybar = jStat.mean(endog);
          var SSE = jStat.sum(predict.map((function(f) {
            return Math.pow(f - ybar, 2);
          })));
          var SSR = jStat.sum(endog.map((function(y, i) {
            return Math.pow(y - predict[i], 2);
          })));
          var SST = SSE + SSR;
          var R2 = SSE / SST;
          return {
            exog: exog,
            endog: endog,
            nobs: nobs,
            df_model: df_model,
            df_resid: df_resid,
            coef: coef,
            predict: predict,
            resid: resid,
            ybar: ybar,
            SST: SST,
            SSE: SSE,
            SSR: SSR,
            R2: R2
          };
        }
        function t_test(model) {
          var subModelList = sub_regress(model.exog);
          var sigmaHat = Math.sqrt(model.SSR / model.df_resid);
          var seBetaHat = subModelList.map((function(mod) {
            var SST = mod.SST;
            var R2 = mod.R2;
            return sigmaHat / Math.sqrt(SST * (1 - R2));
          }));
          var tStatistic = model.coef.map((function(coef, i) {
            return (coef - 0) / seBetaHat[i];
          }));
          var pValue = tStatistic.map((function(t) {
            var leftppf = jStat.studentt.cdf(t, model.df_resid);
            return (leftppf > .5 ? 1 - leftppf : leftppf) * 2;
          }));
          var c = jStat.studentt.inv(.975, model.df_resid);
          var interval95 = model.coef.map((function(coef, i) {
            var d = c * seBetaHat[i];
            return [ coef - d, coef + d ];
          }));
          return {
            se: seBetaHat,
            t: tStatistic,
            p: pValue,
            sigmaHat: sigmaHat,
            interval95: interval95
          };
        }
        function F_test(model) {
          var F_statistic = model.R2 / model.df_model / ((1 - model.R2) / model.df_resid);
          var fcdf = function fcdf(x, n1, n2) {
            return jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2);
          };
          var pvalue = 1 - fcdf(F_statistic, model.df_model, model.df_resid);
          return {
            F_statistic: F_statistic,
            pvalue: pvalue
          };
        }
        function ols_wrap(endog, exog) {
          var model = ols(endog, exog);
          var ttest = t_test(model);
          var ftest = F_test(model);
          var adjust_R2 = 1 - (1 - model.R2) * ((model.nobs - 1) / model.df_resid);
          model.t = ttest;
          model.f = ftest;
          model.adjust_R2 = adjust_R2;
          return model;
        }
        return {
          ols: ols_wrap
        };
      }();
      jStat.extend({
        buildxmatrix: function buildxmatrix() {
          var matrixRows = new Array(arguments.length);
          for (var i = 0; i < arguments.length; i++) {
            var array = [ 1 ];
            matrixRows[i] = array.concat(arguments[i]);
          }
          return jStat(matrixRows);
        },
        builddxmatrix: function builddxmatrix() {
          var matrixRows = new Array(arguments[0].length);
          for (var i = 0; i < arguments[0].length; i++) {
            var array = [ 1 ];
            matrixRows[i] = array.concat(arguments[0][i]);
          }
          return jStat(matrixRows);
        },
        buildjxmatrix: function buildjxmatrix(jMat) {
          var pass = new Array(jMat.length);
          for (var i = 0; i < jMat.length; i++) {
            pass[i] = jMat[i];
          }
          return jStat.builddxmatrix(pass);
        },
        buildymatrix: function buildymatrix(array) {
          return jStat(array).transpose();
        },
        buildjymatrix: function buildjymatrix(jMat) {
          return jMat.transpose();
        },
        matrixmult: function matrixmult(A, B) {
          var i, j, k, result, sum;
          if (A.cols() == B.rows()) {
            if (B.rows() > 1) {
              result = [];
              for (i = 0; i < A.rows(); i++) {
                result[i] = [];
                for (j = 0; j < B.cols(); j++) {
                  sum = 0;
                  for (k = 0; k < A.cols(); k++) {
                    sum += A.toArray()[i][k] * B.toArray()[k][j];
                  }
                  result[i][j] = sum;
                }
              }
              return jStat(result);
            }
            result = [];
            for (i = 0; i < A.rows(); i++) {
              result[i] = [];
              for (j = 0; j < B.cols(); j++) {
                sum = 0;
                for (k = 0; k < A.cols(); k++) {
                  sum += A.toArray()[i][k] * B.toArray()[j];
                }
                result[i][j] = sum;
              }
            }
            return jStat(result);
          }
        },
        regress: function regress(jMatX, jMatY) {
          var innerinv = jStat.xtranspxinv(jMatX);
          var xtransp = jMatX.transpose();
          var next = jStat.matrixmult(jStat(innerinv), xtransp);
          return jStat.matrixmult(next, jMatY);
        },
        regresst: function regresst(jMatX, jMatY, sides) {
          var beta = jStat.regress(jMatX, jMatY);
          var compile = {};
          compile.anova = {};
          var jMatYBar = jStat.jMatYBar(jMatX, beta);
          compile.yBar = jMatYBar;
          var yAverage = jMatY.mean();
          compile.anova.residuals = jStat.residuals(jMatY, jMatYBar);
          compile.anova.ssr = jStat.ssr(jMatYBar, yAverage);
          compile.anova.msr = compile.anova.ssr / (jMatX[0].length - 1);
          compile.anova.sse = jStat.sse(jMatY, jMatYBar);
          compile.anova.mse = compile.anova.sse / (jMatY.length - (jMatX[0].length - 1) - 1);
          compile.anova.sst = jStat.sst(jMatY, yAverage);
          compile.anova.mst = compile.anova.sst / (jMatY.length - 1);
          compile.anova.r2 = 1 - compile.anova.sse / compile.anova.sst;
          if (compile.anova.r2 < 0) compile.anova.r2 = 0;
          compile.anova.fratio = compile.anova.msr / compile.anova.mse;
          compile.anova.pvalue = jStat.anovaftest(compile.anova.fratio, jMatX[0].length - 1, jMatY.length - (jMatX[0].length - 1) - 1);
          compile.anova.rmse = Math.sqrt(compile.anova.mse);
          compile.anova.r2adj = 1 - compile.anova.mse / compile.anova.mst;
          if (compile.anova.r2adj < 0) compile.anova.r2adj = 0;
          compile.stats = new Array(jMatX[0].length);
          var covar = jStat.xtranspxinv(jMatX);
          var sds, ts, ps;
          for (var i = 0; i < beta.length; i++) {
            sds = Math.sqrt(compile.anova.mse * Math.abs(covar[i][i]));
            ts = Math.abs(beta[i] / sds);
            ps = jStat.ttest(ts, jMatY.length - jMatX[0].length - 1, sides);
            compile.stats[i] = [ beta[i], sds, ts, ps ];
          }
          compile.regress = beta;
          return compile;
        },
        xtranspx: function xtranspx(jMatX) {
          return jStat.matrixmult(jMatX.transpose(), jMatX);
        },
        xtranspxinv: function xtranspxinv(jMatX) {
          var inner = jStat.matrixmult(jMatX.transpose(), jMatX);
          var innerinv = jStat.inv(inner);
          return innerinv;
        },
        jMatYBar: function jMatYBar(jMatX, beta) {
          var yBar = jStat.matrixmult(jMatX, beta);
          return new jStat(yBar);
        },
        residuals: function residuals(jMatY, jMatYBar) {
          return jStat.matrixsubtract(jMatY, jMatYBar);
        },
        ssr: function ssr(jMatYBar, yAverage) {
          var ssr = 0;
          for (var i = 0; i < jMatYBar.length; i++) {
            ssr += Math.pow(jMatYBar[i] - yAverage, 2);
          }
          return ssr;
        },
        sse: function sse(jMatY, jMatYBar) {
          var sse = 0;
          for (var i = 0; i < jMatY.length; i++) {
            sse += Math.pow(jMatY[i] - jMatYBar[i], 2);
          }
          return sse;
        },
        sst: function sst(jMatY, yAverage) {
          var sst = 0;
          for (var i = 0; i < jMatY.length; i++) {
            sst += Math.pow(jMatY[i] - yAverage, 2);
          }
          return sst;
        },
        matrixsubtract: function matrixsubtract(A, B) {
          var ans = new Array(A.length);
          for (var i = 0; i < A.length; i++) {
            ans[i] = new Array(A[i].length);
            for (var j = 0; j < A[i].length; j++) {
              ans[i][j] = A[i][j] - B[i][j];
            }
          }
          return jStat(ans);
        }
      });
      jStat.jStat = jStat;
      return jStat;
    }));
  })(jstat);
  var jStat = jstat.exports;
  var defaultOperator = "=";
  var validSymbols = [ ">", ">=", "<", "<=", "=", "<>" ];
  var _TOKEN_TYPE_OPERATOR = "operator";
  var _TOKEN_TYPE_LITERAL = "literal";
  var SUPPORTED_TOKENS = [ _TOKEN_TYPE_OPERATOR, _TOKEN_TYPE_LITERAL ];
  var TOKEN_TYPE_OPERATOR = _TOKEN_TYPE_OPERATOR;
  var TOKEN_TYPE_LITERAL = _TOKEN_TYPE_LITERAL;
  function createToken(value, type) {
    if (SUPPORTED_TOKENS.indexOf(type) === -1) {
      throw new Error("Unsupported token type: " + type);
    }
    return {
      value: value,
      type: type
    };
  }
  function castValueToCorrectType(value) {
    if (typeof value !== "string") {
      return value;
    }
    if (/^\d+(\.\d+)?$/.test(value)) {
      value = value.indexOf(".") === -1 ? parseInt(value, 10) : parseFloat(value);
    }
    return value;
  }
  function tokenizeExpression(expression) {
    var expressionLength = expression.length;
    var tokens = [];
    var cursorIndex = 0;
    var processedValue = "";
    var processedSymbol = "";
    while (cursorIndex < expressionLength) {
      var _char = expression.charAt(cursorIndex);
      switch (_char) {
       case ">":
       case "<":
       case "=":
        processedSymbol = processedSymbol + _char;
        if (processedValue.length > 0) {
          tokens.push(processedValue);
          processedValue = "";
        }
        break;

       default:
        if (processedSymbol.length > 0) {
          tokens.push(processedSymbol);
          processedSymbol = "";
        }
        processedValue = processedValue + _char;
        break;
      }
      cursorIndex++;
    }
    if (processedValue.length > 0) {
      tokens.push(processedValue);
    }
    if (processedSymbol.length > 0) {
      tokens.push(processedSymbol);
    }
    return tokens;
  }
  function analyzeTokens(tokens) {
    var literalValue = "";
    var analyzedTokens = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
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
    return analyzedTokens;
  }
  function computeExpression(tokens) {
    var values = [];
    var operator;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      switch (token.type) {
       case TOKEN_TYPE_OPERATOR:
        operator = token.value;
        break;

       case TOKEN_TYPE_LITERAL:
        values.push(token.value);
        break;
      }
    }
    return evaluate(values, operator);
  }
  function evaluate(values, operator) {
    var result = false;
    switch (operator) {
     case ">":
      result = values[0] > values[1];
      break;

     case ">=":
      result = values[0] >= values[1];
      break;

     case "<":
      result = values[0] < values[1];
      break;

     case "<=":
      result = values[0] <= values[1];
      break;

     case "=":
      result = values[0] == values[1];
      break;

     case "<>":
      result = values[0] != values[1];
      break;
    }
    return result;
  }
  function parse(expression) {
    return analyzeTokens(tokenizeExpression(expression));
  }
  var compute = computeExpression;
  function CELL() {
    throw new Error("CELL is not implemented");
  }
  var ERROR = {};
  ERROR.TYPE = function(error_val) {
    switch (error_val) {
     case nil:
      return 1;

     case div0:
      return 2;

     case value:
      return 3;

     case ref:
      return 4;

     case name:
      return 5;

     case num:
      return 6;

     case na:
      return 7;

     case data:
      return 8;
    }
    return na;
  };
  function INFO() {
    throw new Error("INFO is not implemented");
  }
  function ISBLANK(value) {
    return value === null;
  }
  function ISBINARY(number) {
    return /^[01]{1,10}$/.test(number);
  }
  function ISERR(value$1) {
    return [ value, ref, div0, num, name, nil ].indexOf(value$1) >= 0 || typeof value$1 === "number" && (isNaN(value$1) || !isFinite(value$1));
  }
  function ISERROR(value$1) {
    return ISERR(value$1) || value$1 === na || (value$1 === null || value$1 === void 0 ? void 0 : value$1.message) === value.message || (value$1 === null || value$1 === void 0 ? void 0 : value$1.message) === calc.message;
  }
  function ISEVEN(number) {
    return !(Math.floor(Math.abs(number)) & 1);
  }
  function ISFORMULA() {
    throw new Error("ISFORMULA is not implemented");
  }
  function ISLOGICAL(value) {
    return value === true || value === false;
  }
  function ISNA(value) {
    return value === na;
  }
  function ISNONTEXT(value) {
    return typeof value !== "string";
  }
  function ISNUMBER(value) {
    return typeof value === "number" && !isNaN(value) && isFinite(value);
  }
  function ISODD(value) {
    return !!(Math.floor(Math.abs(value)) & 1);
  }
  function ISREF() {
    throw new Error("ISREF is not implemented");
  }
  function ISTEXT(value) {
    return typeof value === "string";
  }
  function N(value) {
    if (ISNUMBER(value)) {
      return value;
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    if (value === true) {
      return 1;
    }
    if (value === false) {
      return 0;
    }
    if (ISERROR(value)) {
      return value;
    }
    return 0;
  }
  function NA() {
    return na;
  }
  function SHEET() {
    throw new Error("SHEET is not implemented");
  }
  function SHEETS() {
    throw new Error("SHEETS is not implemented");
  }
  function TYPE(value) {
    if (ISNUMBER(value)) {
      return 1;
    }
    if (ISTEXT(value)) {
      return 2;
    }
    if (ISLOGICAL(value)) {
      return 4;
    }
    if (ISERROR(value)) {
      return 16;
    }
    if (Array.isArray(value)) {
      return 64;
    }
  }
  function CHOOSE() {
    if (arguments.length < 2) {
      return na;
    }
    var index = arguments[0];
    if (index < 1 || index > 254) {
      return value;
    }
    if (arguments.length < index + 1) {
      return value;
    }
    return arguments[index];
  }
  function COLUMN(reference, index) {
    if (arguments.length !== 2) {
      return na;
    }
    if (index < 0) {
      return num;
    }
    if (!(reference instanceof Array) || typeof index !== "number") {
      return value;
    }
    if (reference.length === 0) {
      return undefined;
    }
    return jStat.col(reference, index);
  }
  function COLUMNS(array) {
    if (arguments.length !== 1) {
      return na;
    }
    if (!(array instanceof Array)) {
      return value;
    }
    if (array.length === 0) {
      return 0;
    }
    return jStat.cols(array);
  }
  function HLOOKUP(lookup_value, table_array, row_index_num, range_lookup) {
    return VLOOKUP(lookup_value, transpose(table_array), row_index_num, range_lookup);
  }
  function INDEX(array, row_num, column_num) {
    var someError = anyError(array, row_num, column_num);
    if (someError) {
      return someError;
    }
    if (!Array.isArray(array)) {
      return value;
    }
    var isOneDimensionRange = array.length > 0 && !Array.isArray(array[0]);
    if (isOneDimensionRange && !column_num) {
      column_num = row_num;
      row_num = 1;
    } else {
      column_num = column_num || 1;
      row_num = row_num || 1;
    }
    if (column_num < 0 || row_num < 0) {
      return value;
    }
    if (isOneDimensionRange && row_num === 1 && column_num <= array.length) {
      return array[column_num - 1];
    } else if (row_num <= array.length && column_num <= array[row_num - 1].length) {
      return array[row_num - 1][column_num - 1];
    }
    return ref;
  }
  function LOOKUP(lookup_value, array, result_array) {
    array = flatten(array);
    result_array = result_array ? flatten(result_array) : array;
    var isNumberLookup = typeof lookup_value === "number";
    var result = na;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === lookup_value) {
        return result_array[i];
      } else if (isNumberLookup && array[i] <= lookup_value || typeof array[i] === "string" && array[i].localeCompare(lookup_value) < 0) {
        result = result_array[i];
      } else if (isNumberLookup && array[i] > lookup_value) {
        return result;
      }
    }
    return result;
  }
  function MATCH(lookup_value, lookup_array, match_type) {
    if (!lookup_value && !lookup_array) {
      return na;
    }
    if (arguments.length === 2) {
      match_type = 1;
    }
    lookup_array = flatten(lookup_array);
    if (!(lookup_array instanceof Array)) {
      return na;
    }
    if (match_type !== -1 && match_type !== 0 && match_type !== 1) {
      return na;
    }
    var index;
    var indexValue;
    for (var idx = 0; idx < lookup_array.length; idx++) {
      if (match_type === 1) {
        if (lookup_array[idx] === lookup_value) {
          return idx + 1;
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
        if (typeof lookup_value === "string" && typeof lookup_array[idx] === "string") {
          var lookupValueStr = lookup_value.toLowerCase().replace(/\?/g, ".").replace(/\*/g, ".*").replace(/~/g, "\\");
          var regex = new RegExp("^" + lookupValueStr + "$");
          if (regex.test(lookup_array[idx].toLowerCase()) || lookup_array[idx] === lookup_value) {
            return idx + 1;
          }
        } else {
          if (lookup_array[idx] === lookup_value) {
            return idx + 1;
          }
        }
      } else if (match_type === -1) {
        if (lookup_array[idx] === lookup_value) {
          return idx + 1;
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
    return index || na;
  }
  function ROWS(array) {
    if (arguments.length !== 1) {
      return na;
    }
    if (!(array instanceof Array)) {
      return value;
    }
    if (array.length === 0) {
      return 0;
    }
    return jStat.rows(array);
  }
  function TRANSPOSE(array) {
    if (!array) {
      return na;
    }
    return jStat.transpose(array);
  }
  function UNIQUE() {
    var result = [];
    for (var i = 0; i < arguments.length; ++i) {
      var hasElement = false;
      var element = arguments[i];
      for (var j = 0; j < result.length; ++j) {
        hasElement = result[j] === element;
        if (hasElement) {
          break;
        }
      }
      if (!hasElement) {
        result.push(element);
      }
    }
    return result;
  }
  function VLOOKUP(lookup_value, table_array, col_index_num, range_lookup) {
    if (!table_array || !col_index_num) {
      return na;
    }
    range_lookup = !(range_lookup === 0 || range_lookup === false);
    var result = na;
    var isNumberLookup = typeof lookup_value === "number";
    var exactMatchOnly = false;
    for (var i = 0; i < table_array.length; i++) {
      var row = table_array[i];
      if (row[0] === lookup_value) {
        result = col_index_num < row.length + 1 ? row[col_index_num - 1] : ref;
        break;
      } else if (!exactMatchOnly && (isNumberLookup && range_lookup && row[0] <= lookup_value || range_lookup && typeof row[0] === "string" && row[0].localeCompare(lookup_value) < 0)) {
        result = col_index_num < row.length + 1 ? row[col_index_num - 1] : ref;
      }
      if (isNumberLookup && row[0] > lookup_value) {
        exactMatchOnly = true;
      }
    }
    return result;
  }
  function SORT(array, sort_index, sort_order, by_col) {
    if (!array) {
      return na;
    }
    if (!(array instanceof Array)) {
      return na;
    }
    if (array.length === 0) {
      return na;
    }
    for (var i = 0; i < array.length; i++) {
      if (!(array[i] instanceof Array)) {
        return na;
      }
      if (array[i].length === 0) {
        return na;
      }
      if (array[i].length !== array[0].length) {
        return na;
      }
    }
    var arrayWidth = array[0].length;
    var arrayHeight = array.length;
    if (by_col == null) {
      by_col = "FALSE";
    }
    var byCol = parseBool(by_col);
    if (typeof byCol !== "boolean") {
      return addEmptyValuesToArray([ [ value ] ], arrayWidth, arrayHeight);
    }
    if (sort_index == null) {
      sort_index = 1;
    }
    if (typeof sort_index !== "number") {
      return addEmptyValuesToArray([ [ value ] ], arrayWidth, arrayHeight);
    }
    if (sort_index < 1) {
      return addEmptyValuesToArray([ [ value ] ], arrayWidth, arrayHeight);
    }
    if (byCol && sort_index > arrayHeight) {
      return addEmptyValuesToArray([ [ value ] ], arrayWidth, arrayHeight);
    }
    if (!byCol && sort_index > arrayWidth) {
      return addEmptyValuesToArray([ [ value ] ], arrayWidth, arrayHeight);
    }
    if (sort_order == null) {
      sort_order = 1;
    }
    if (sort_order !== 1 && sort_order !== -1) {
      return addEmptyValuesToArray([ [ value ] ], arrayWidth, arrayHeight);
    }
    var result = [];
    if (byCol) {
      var columns = [];
      for (var _i6 = 0; _i6 < arrayWidth; _i6++) {
        var column = [];
        for (var j = 0; j < arrayHeight; j++) {
          column.push(array[j][_i6]);
        }
        columns.push(column);
      }
      var sortedColumns = columns.sort((function(a, b) {
        var _a$toString, _a, _b$toString, _b;
        var aVal = (_a$toString = (_a = a[sort_index - 1]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _a$toString !== void 0 ? _a$toString : "";
        var bVal = (_b$toString = (_b = b[sort_index - 1]) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _b$toString !== void 0 ? _b$toString : "";
        if (aVal < bVal) {
          return -1 * sort_order;
        }
        if (aVal > bVal) {
          return 1 * sort_order;
        }
        return 0;
      }));
      for (var _i7 = 0; _i7 < arrayHeight; _i7++) {
        var row = [];
        for (var _j2 = 0; _j2 < arrayWidth; _j2++) {
          row.push(sortedColumns[_j2][_i7]);
        }
        result.push(row);
      }
    } else {
      result = array.sort((function(a, b) {
        var _a$toString2, _a2, _b$toString2, _b2;
        var aVal = (_a$toString2 = (_a2 = a[sort_index - 1]) === null || _a2 === void 0 ? void 0 : _a2.toString()) !== null && _a$toString2 !== void 0 ? _a$toString2 : "";
        var bVal = (_b$toString2 = (_b2 = b[sort_index - 1]) === null || _b2 === void 0 ? void 0 : _b2.toString()) !== null && _b$toString2 !== void 0 ? _b$toString2 : "";
        if (aVal < bVal) {
          return -1 * sort_order;
        }
        if (aVal > bVal) {
          return 1 * sort_order;
        }
        return 0;
      }));
    }
    for (var _i8 = 0; _i8 < result.length; _i8++) {
      for (var _j3 = 0; _j3 < result[_i8].length; _j3++) {
        if (result[_i8][_j3] === "") {
          result[_i8][_j3] = 0;
        }
      }
    }
    return result;
  }
  function FILTER(array, include, if_empty) {
    if (!array || !include) {
      return na;
    }
    if (!(array instanceof Array)) {
      return na;
    }
    if (!(include instanceof Array)) {
      return na;
    }
    if (array.length === 0) {
      return na;
    }
    if (include.length === 0) {
      return na;
    }
    for (var i = 0; i < array.length; i++) {
      if (!(array[i] instanceof Array)) {
        return na;
      }
      if (array[i].length === 0) {
        return na;
      }
      if (array[i].length !== array[0].length) {
        return na;
      }
    }
    for (var _i9 = 0; _i9 < include.length; _i9++) {
      if (!(include[_i9] instanceof Array)) {
        return na;
      }
      if (include[_i9].length === 0) {
        return na;
      }
      if (include[_i9].length !== include[0].length) {
        return na;
      }
    }
    var arrayWidth = array[0].length;
    var arrayHeight = array.length;
    var includeWidth = include[0].length;
    var includeHeight = include.length;
    if (arrayWidth !== includeWidth && arrayHeight !== includeHeight) {
      return na;
    }
    if (arrayHeight > 1 && arrayWidth > 1 && (arrayWidth === includeWidth && includeHeight !== 1 || arrayHeight === includeHeight && includeWidth !== 1)) {
      return na;
    }
    if (arrayHeight > 1 && arrayWidth === 1 && (includeWidth !== 1 || includeHeight !== 1 && includeHeight !== arrayHeight)) {
      return na;
    }
    var result = [];
    for (var _i10 = 0; _i10 < arrayHeight; _i10++) {
      var row = [];
      for (var j = 0; j < arrayWidth; j++) {
        var _ref, _include$_i10$j, _include$_i, _include$, _include$_i2;
        var _value = (_ref = (_include$_i10$j = (_include$_i = include[_i10]) === null || _include$_i === void 0 ? void 0 : _include$_i[j]) !== null && _include$_i10$j !== void 0 ? _include$_i10$j : (_include$ = include[0]) === null || _include$ === void 0 ? void 0 : _include$[j]) !== null && _ref !== void 0 ? _ref : (_include$_i2 = include[_i10]) === null || _include$_i2 === void 0 ? void 0 : _include$_i2[0];
        var bool = parseBool(_value);
        if (bool === true) row.push(array[_i10][j]); else if (bool instanceof Error) return addEmptyValuesToArray([ [ bool ] ], arrayWidth, arrayHeight);
      }
      if (row.length > 0) result.push(row);
    }
    if (result.length === 0) {
      if (if_empty != null) {
        return addEmptyValuesToArray([ [ if_empty ] ], arrayWidth, arrayHeight);
      }
      return addEmptyValuesToArray([ [ calc ] ], arrayWidth, arrayHeight);
    }
    return addEmptyValuesToArray(result, arrayWidth, arrayHeight);
  }
  var xMatchSearch = function xMatchSearch(_ref2) {
    var lookup_value = _ref2.lookup_value, lookup_array = _ref2.lookup_array, match_mode = _ref2.match_mode, matchedIndex = _ref2.matchedIndex, matchedIndexValue = _ref2.matchedIndexValue, idx = _ref2.idx, _ref2$isBinarySearchA = _ref2.isBinarySearchAscending, isBinarySearchAscending = _ref2$isBinarySearchA === void 0 ? undefined : _ref2$isBinarySearchA, _ref2$binarySearchHig = _ref2.binarySearchHigh, binarySearchHigh = _ref2$binarySearchHig === void 0 ? undefined : _ref2$binarySearchHig, _ref2$binarySearchLow = _ref2.binarySearchLow, binarySearchLow = _ref2$binarySearchLow === void 0 ? undefined : _ref2$binarySearchLow;
    var isBinarySearch = isBinarySearchAscending != null && binarySearchHigh != null && binarySearchLow != null;
    if (match_mode === 1) {
      if (lookup_array[idx] === lookup_value) {
        return {
          newMatchedIndex: idx + 1,
          isExactMatch: true,
          newMatchedIndexValue: matchedIndexValue,
          binarySearchHigh: binarySearchHigh,
          binarySearchLow: binarySearchLow
        };
      } else if (lookup_array[idx] > lookup_value) {
        if (!matchedIndexValue) {
          matchedIndex = idx + 1;
          matchedIndexValue = lookup_array[idx];
        } else if (lookup_array[idx] < matchedIndexValue) {
          matchedIndex = idx + 1;
          matchedIndexValue = lookup_array[idx];
        }
        if (isBinarySearch) {
          if (isBinarySearchAscending) binarySearchHigh = idx - 1; else binarySearchLow = idx + 1;
        }
      } else if (isBinarySearch) {
        if (isBinarySearchAscending) binarySearchLow = idx + 1; else binarySearchHigh = idx - 1;
      }
    } else if (match_mode === 0) {
      if (lookup_array[idx] === lookup_value) {
        return {
          newMatchedIndex: idx + 1,
          isExactMatch: true,
          newMatchedIndexValue: matchedIndexValue,
          binarySearchHigh: binarySearchHigh,
          binarySearchLow: binarySearchLow
        };
      } else if (isBinarySearch) {
        if (lookup_array[idx] > lookup_value) {
          if (isBinarySearchAscending) binarySearchHigh = idx - 1; else binarySearchLow = idx + 1;
        } else {
          if (isBinarySearchAscending) binarySearchLow = idx + 1; else binarySearchHigh = idx - 1;
        }
      }
    } else if (match_mode === -1) {
      if (lookup_array[idx] === lookup_value) {
        return {
          newMatchedIndex: idx + 1,
          isExactMatch: true,
          newMatchedIndexValue: matchedIndexValue,
          binarySearchHigh: binarySearchHigh,
          binarySearchLow: binarySearchLow
        };
      } else if (lookup_array[idx] < lookup_value) {
        if (!matchedIndexValue) {
          matchedIndex = idx + 1;
          matchedIndexValue = lookup_array[idx];
        } else if (lookup_array[idx] > matchedIndexValue) {
          matchedIndex = idx + 1;
          matchedIndexValue = lookup_array[idx];
        }
        if (isBinarySearch) {
          if (isBinarySearchAscending) binarySearchLow = idx + 1; else binarySearchHigh = idx - 1;
        }
      } else if (isBinarySearch) {
        if (isBinarySearchAscending) binarySearchHigh = idx - 1; else binarySearchLow = idx + 1;
      }
    } else if (match_mode === 2) {
      if (typeof lookup_value === "string") {
        var lookupValueStr = lookup_value.toLowerCase().replace(/\?/g, ".").replace(/\*/g, ".*").replace(/~/g, "\\");
        var regex = new RegExp("^" + lookupValueStr + "$");
        if (regex.test(lookup_array[idx].toLowerCase()) || lookup_array[idx] === lookup_value) {
          return {
            newMatchedIndex: idx + 1,
            isExactMatch: true,
            newMatchedIndexValue: matchedIndexValue,
            binarySearchHigh: binarySearchHigh,
            binarySearchLow: binarySearchLow
          };
        }
      } else {
        if (lookup_array[idx] === lookup_value) {
          return {
            newMatchedIndex: idx + 1,
            isExactMatch: true,
            newMatchedIndexValue: matchedIndexValue,
            binarySearchHigh: binarySearchHigh,
            binarySearchLow: binarySearchLow
          };
        }
      }
      if (isBinarySearch) {
        if (lookup_array[idx] > lookup_value) {
          if (isBinarySearchAscending) binarySearchHigh = idx - 1; else binarySearchLow = idx + 1;
        } else {
          if (isBinarySearchAscending) binarySearchLow = idx + 1; else binarySearchHigh = idx - 1;
        }
      }
    }
    return {
      newMatchedIndex: matchedIndex,
      isExactMatch: false,
      newMatchedIndexValue: matchedIndexValue,
      binarySearchHigh: binarySearchHigh,
      binarySearchLow: binarySearchLow
    };
  };
  function XMATCH(lookup_value, lookup_array, match_mode, search_mode) {
    if (!lookup_value && !lookup_array) {
      return na;
    }
    if (arguments.length === 2) {
      match_mode = 0;
      search_mode = 1;
    }
    if (arguments.length === 3) {
      search_mode = 1;
    }
    if (!(lookup_array instanceof Array)) {
      return na;
    }
    lookup_array = flatten(lookup_array);
    if (match_mode !== -1 && match_mode !== 0 && match_mode !== 1 && match_mode !== 2) {
      return na;
    }
    if (search_mode !== -2 && search_mode !== -1 && search_mode !== 1 && search_mode !== 2) {
      return na;
    }
    var matchedIndex;
    var matchedIndexValue;
    if (search_mode === 1) {
      for (var idx = 0; idx < lookup_array.length; idx++) {
        var _xMatchSearch = xMatchSearch({
          lookup_value: lookup_value,
          lookup_array: lookup_array,
          match_mode: match_mode,
          matchedIndex: matchedIndex,
          matchedIndexValue: matchedIndexValue,
          idx: idx
        }), newMatchedIndex = _xMatchSearch.newMatchedIndex, newMatchedIndexValue = _xMatchSearch.newMatchedIndexValue, isExactMatch = _xMatchSearch.isExactMatch;
        matchedIndex = newMatchedIndex;
        matchedIndexValue = newMatchedIndexValue;
        if (isExactMatch || idx === lookup_array.length - 1 && matchedIndex) {
          return matchedIndex;
        }
      }
    } else if (search_mode === -1) {
      for (var _idx = lookup_array.length - 1; _idx >= 0; _idx--) {
        var _xMatchSearch2 = xMatchSearch({
          lookup_value: lookup_value,
          lookup_array: lookup_array,
          match_mode: match_mode,
          matchedIndex: matchedIndex,
          matchedIndexValue: matchedIndexValue,
          idx: _idx
        }), _newMatchedIndex = _xMatchSearch2.newMatchedIndex, _newMatchedIndexValue = _xMatchSearch2.newMatchedIndexValue, _isExactMatch = _xMatchSearch2.isExactMatch;
        matchedIndex = _newMatchedIndex;
        matchedIndexValue = _newMatchedIndexValue;
        if (_isExactMatch || _idx === 0 && matchedIndex) return matchedIndex;
      }
    } else if (search_mode === 2) {
      var low = 0;
      var high = lookup_array.length - 1;
      var mid;
      while (low <= high) {
        mid = Math.floor((low + high) / 2);
        var _xMatchSearch3 = xMatchSearch({
          lookup_value: lookup_value,
          lookup_array: lookup_array,
          match_mode: match_mode,
          matchedIndex: matchedIndex,
          matchedIndexValue: matchedIndexValue,
          idx: mid,
          isBinarySearchAscending: true,
          binarySearchLow: low,
          binarySearchHigh: high
        }), _newMatchedIndex2 = _xMatchSearch3.newMatchedIndex, _newMatchedIndexValue2 = _xMatchSearch3.newMatchedIndexValue, _isExactMatch2 = _xMatchSearch3.isExactMatch, binarySearchHigh = _xMatchSearch3.binarySearchHigh, binarySearchLow = _xMatchSearch3.binarySearchLow;
        matchedIndex = _newMatchedIndex2;
        matchedIndexValue = _newMatchedIndexValue2;
        low = binarySearchLow;
        high = binarySearchHigh;
        if (_isExactMatch2) return matchedIndex;
      }
    } else if (search_mode === -2) {
      var _low = 0;
      var _high = lookup_array.length - 1;
      var _mid;
      while (_low <= _high) {
        _mid = Math.floor((_low + _high) / 2);
        var _xMatchSearch4 = xMatchSearch({
          lookup_value: lookup_value,
          lookup_array: lookup_array,
          match_mode: match_mode,
          matchedIndex: matchedIndex,
          matchedIndexValue: matchedIndexValue,
          idx: _mid,
          isBinarySearchAscending: false,
          binarySearchLow: _low,
          binarySearchHigh: _high
        }), _newMatchedIndex3 = _xMatchSearch4.newMatchedIndex, _newMatchedIndexValue3 = _xMatchSearch4.newMatchedIndexValue, _isExactMatch3 = _xMatchSearch4.isExactMatch, _binarySearchHigh = _xMatchSearch4.binarySearchHigh, _binarySearchLow = _xMatchSearch4.binarySearchLow;
        matchedIndex = _newMatchedIndex3;
        matchedIndexValue = _newMatchedIndexValue3;
        _low = _binarySearchLow;
        _high = _binarySearchHigh;
        if (_isExactMatch3) return matchedIndex;
      }
    }
    return matchedIndex || na;
  }
  var SQRT2PI = 2.5066282746310002;
  function AVEDEV() {
    var flatArguments = flatten(arguments);
    var flatArgumentsDefined = flatArguments.filter(isDefined);
    if (flatArgumentsDefined.length === 0) {
      return num;
    }
    var range = parseNumberArray(flatArgumentsDefined);
    if (range instanceof Error) {
      return range;
    }
    return jStat.sum(jStat(range).subtract(jStat.mean(range)).abs()[0]) / range.length;
  }
  function AVERAGE() {
    var flatArguments = flatten(arguments);
    var flatArgumentsDefined = flatArguments.filter(isDefined);
    if (flatArgumentsDefined.length === 0) {
      return div0;
    }
    var someError = anyError.apply(undefined, flatArgumentsDefined);
    if (someError) {
      return someError;
    }
    var range = numbers(flatArgumentsDefined);
    var n = range.length;
    var sum = 0;
    var count = 0;
    var result;
    for (var i = 0; i < n; i++) {
      sum += range[i];
      count += 1;
    }
    result = sum / count;
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function AVERAGEA() {
    var flatArguments = flatten(arguments);
    var flatArgumentsDefined = flatArguments.filter(isDefined);
    if (flatArgumentsDefined.length === 0) {
      return div0;
    }
    var someError = anyError.apply(undefined, flatArgumentsDefined);
    if (someError) {
      return someError;
    }
    var range = flatArgumentsDefined;
    var n = range.length;
    var sum = 0;
    var count = 0;
    var result;
    for (var i = 0; i < n; i++) {
      var el = range[i];
      if (typeof el === "number") {
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
    return result;
  }
  function AVERAGEIF(range, criteria, average_range) {
    if (arguments.length <= 1) {
      return na;
    }
    average_range = average_range || range;
    var flatAverageRange = flatten(average_range);
    var flatAverageRangeDefined = flatAverageRange.filter(isDefined);
    average_range = parseNumberArray(flatAverageRangeDefined);
    range = flatten(range);
    if (average_range instanceof Error) {
      return average_range;
    }
    var average_count = 0;
    var result = 0;
    var isWildcard = criteria === void 0 || criteria === "*";
    var tokenizedCriteria = isWildcard ? null : parse(criteria + "");
    for (var i = 0; i < range.length; i++) {
      var _value2 = range[i];
      if (isWildcard) {
        result += average_range[i];
        average_count++;
      } else {
        var tokens = [ createToken(_value2, TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
        if (compute(tokens)) {
          result += average_range[i];
          average_count++;
        }
      }
    }
    return result / average_count;
  }
  function AVERAGEIFS() {
    var args = argsToArray(arguments);
    var criteriaLength = (args.length - 1) / 2;
    var range = flatten(args[0]);
    var count = 0;
    var result = 0;
    for (var i = 0; i < range.length; i++) {
      var isMeetCondition = false;
      for (var j = 0; j < criteriaLength; j++) {
        var _value3 = args[2 * j + 1][i];
        var criteria = args[2 * j + 2];
        var isWildcard = criteria === void 0 || criteria === "*";
        var computedResult = false;
        if (isWildcard) {
          computedResult = true;
        } else {
          var tokenizedCriteria = parse(criteria + "");
          var tokens = [ createToken(_value3, TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
          computedResult = compute(tokens);
        }
        if (!computedResult) {
          isMeetCondition = false;
          break;
        }
        isMeetCondition = true;
      }
      if (isMeetCondition) {
        result += range[i];
        count++;
      }
    }
    var average = result / count;
    return isNaN(average) ? 0 : average;
  }
  var BETA = {};
  BETA.DIST = function(x, alpha, beta, cumulative, a, b) {
    if (arguments.length < 4) {
      return value;
    }
    a = a === undefined ? 0 : a;
    b = b === undefined ? 1 : b;
    x = parseNumber(x);
    alpha = parseNumber(alpha);
    beta = parseNumber(beta);
    a = parseNumber(a);
    b = parseNumber(b);
    if (anyIsError(x, alpha, beta, a, b)) {
      return value;
    }
    x = (x - a) / (b - a);
    return cumulative ? jStat.beta.cdf(x, alpha, beta) : jStat.beta.pdf(x, alpha, beta);
  };
  BETA.INV = function(probability, alpha, beta, a, b) {
    a = a === undefined ? 0 : a;
    b = b === undefined ? 1 : b;
    probability = parseNumber(probability);
    alpha = parseNumber(alpha);
    beta = parseNumber(beta);
    a = parseNumber(a);
    b = parseNumber(b);
    if (anyIsError(probability, alpha, beta, a, b)) {
      return value;
    }
    return jStat.beta.inv(probability, alpha, beta) * (b - a) + a;
  };
  var BINOM = {};
  BINOM.DIST = function(number_s, trials, probability_s, cumulative) {
    number_s = parseNumber(number_s);
    trials = parseNumber(trials);
    probability_s = parseNumber(probability_s);
    cumulative = parseNumber(cumulative);
    if (anyIsError(number_s, trials, probability_s, cumulative)) {
      return value;
    }
    return cumulative ? jStat.binomial.cdf(number_s, trials, probability_s) : jStat.binomial.pdf(number_s, trials, probability_s);
  };
  BINOM.DIST.RANGE = function(trials, probability_s, number_s, number_s2) {
    number_s2 = number_s2 === undefined ? number_s : number_s2;
    trials = parseNumber(trials);
    probability_s = parseNumber(probability_s);
    number_s = parseNumber(number_s);
    number_s2 = parseNumber(number_s2);
    if (anyIsError(trials, probability_s, number_s, number_s2)) {
      return value;
    }
    var result = 0;
    for (var i = number_s; i <= number_s2; i++) {
      result += COMBIN(trials, i) * Math.pow(probability_s, i) * Math.pow(1 - probability_s, trials - i);
    }
    return result;
  };
  BINOM.INV = function(trials, probability_s, alpha) {
    trials = parseNumber(trials);
    probability_s = parseNumber(probability_s);
    alpha = parseNumber(alpha);
    if (anyIsError(trials, probability_s, alpha)) {
      return value;
    }
    var x = 0;
    while (x <= trials) {
      if (jStat.binomial.cdf(x, trials, probability_s) >= alpha) {
        return x;
      }
      x++;
    }
  };
  var CHISQ = {};
  CHISQ.DIST = function(x, deg_freedom, cumulative) {
    x = parseNumber(x);
    deg_freedom = parseNumber(deg_freedom);
    if (anyIsError(x, deg_freedom)) {
      return value;
    }
    return cumulative ? jStat.chisquare.cdf(x, deg_freedom) : jStat.chisquare.pdf(x, deg_freedom);
  };
  CHISQ.DIST.RT = function(x, deg_freedom) {
    if (!x | !deg_freedom) {
      return na;
    }
    if (x < 1 || deg_freedom > Math.pow(10, 10)) {
      return num;
    }
    if (typeof x !== "number" || typeof deg_freedom !== "number") {
      return value;
    }
    return 1 - jStat.chisquare.cdf(x, deg_freedom);
  };
  CHISQ.INV = function(probability, deg_freedom) {
    probability = parseNumber(probability);
    deg_freedom = parseNumber(deg_freedom);
    if (anyIsError(probability, deg_freedom)) {
      return value;
    }
    return jStat.chisquare.inv(probability, deg_freedom);
  };
  CHISQ.INV.RT = function(probability, deg_freedom) {
    if (!probability | !deg_freedom) {
      return na;
    }
    if (probability < 0 || probability > 1 || deg_freedom < 1 || deg_freedom > Math.pow(10, 10)) {
      return num;
    }
    if (typeof probability !== "number" || typeof deg_freedom !== "number") {
      return value;
    }
    return jStat.chisquare.inv(1 - probability, deg_freedom);
  };
  CHISQ.TEST = function(actual_range, expected_range) {
    if (arguments.length !== 2) {
      return na;
    }
    if (!(actual_range instanceof Array) || !(expected_range instanceof Array)) {
      return value;
    }
    if (actual_range.length !== expected_range.length) {
      return value;
    }
    if (actual_range[0] && expected_range[0] && actual_range[0].length !== expected_range[0].length) {
      return value;
    }
    var row = actual_range.length;
    var tmp, i, j;
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
    var col = actual_range[0].length;
    var dof = col === 1 ? row - 1 : (row - 1) * (col - 1);
    var xsqr = 0;
    var Pi = Math.PI;
    for (i = 0; i < row; i++) {
      for (j = 0; j < col; j++) {
        xsqr += Math.pow(actual_range[i][j] - expected_range[i][j], 2) / expected_range[i][j];
      }
    }
    function ChiSq(xsqr, dof) {
      var p = Math.exp(-.5 * xsqr);
      if (dof % 2 === 1) {
        p = p * Math.sqrt(2 * xsqr / Pi);
      }
      var k = dof;
      while (k >= 2) {
        p = p * xsqr / k;
        k = k - 2;
      }
      var t = p;
      var a = dof;
      while (t > 1e-10 * p) {
        a = a + 2;
        t = t * xsqr / a;
        p = p + t;
      }
      return 1 - p;
    }
    return Math.round(ChiSq(xsqr, dof) * 1e6) / 1e6;
  };
  var CONFIDENCE = {};
  CONFIDENCE.NORM = function(alpha, standard_dev, size) {
    alpha = parseNumber(alpha);
    standard_dev = parseNumber(standard_dev);
    size = parseNumber(size);
    if (anyIsError(alpha, standard_dev, size)) {
      return value;
    }
    return jStat.normalci(1, alpha, standard_dev, size)[1] - 1;
  };
  CONFIDENCE.T = function(alpha, standard_dev, size) {
    alpha = parseNumber(alpha);
    standard_dev = parseNumber(standard_dev);
    size = parseNumber(size);
    if (anyIsError(alpha, standard_dev, size)) {
      return value;
    }
    return jStat.tci(1, alpha, standard_dev, size)[1] - 1;
  };
  function CORREL(array1, array2) {
    array1 = parseNumberArray(flatten(array1));
    array2 = parseNumberArray(flatten(array2));
    if (anyIsError(array1, array2)) {
      return value;
    }
    return jStat.corrcoeff(array1, array2);
  }
  function COUNT() {
    var flatArguments = flatten(arguments);
    return numbers(flatArguments).length;
  }
  function COUNTA() {
    var flatArguments = flatten(arguments);
    return flatArguments.length - COUNTBLANK(flatArguments);
  }
  function COUNTIN(range, value) {
    var result = 0;
    range = flatten(range);
    for (var i = 0; i < range.length; i++) {
      if (range[i] === value) {
        result++;
      }
    }
    return result;
  }
  function COUNTBLANK() {
    var range = flatten(arguments);
    var blanks = 0;
    var element;
    for (var i = 0; i < range.length; i++) {
      element = range[i];
      if (element === undefined || element === null || element === "") {
        blanks++;
      }
    }
    return blanks;
  }
  function COUNTIF(range, criteria) {
    range = flatten(range);
    var isWildcard = criteria === void 0 || criteria === "*";
    if (isWildcard) {
      return range.length;
    }
    var matches = 0;
    var tokenizedCriteria = parse(criteria + "");
    for (var i = 0; i < range.length; i++) {
      var _value4 = range[i];
      var tokens = [ createToken(_value4, TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
      if (compute(tokens)) {
        matches++;
      }
    }
    return matches;
  }
  function COUNTIFS() {
    var args = argsToArray(arguments);
    var results = new Array(flatten(args[0]).length);
    for (var i = 0; i < results.length; i++) {
      results[i] = true;
    }
    for (var _i11 = 0; _i11 < args.length; _i11 += 2) {
      var range = flatten(args[_i11]);
      var criteria = args[_i11 + 1];
      var isWildcard = criteria === void 0 || criteria === "*";
      if (!isWildcard) {
        var tokenizedCriteria = parse(criteria + "");
        for (var j = 0; j < range.length; j++) {
          var _value5 = range[j];
          var tokens = [ createToken(_value5, TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
          results[j] = results[j] && compute(tokens);
        }
      }
    }
    var result = 0;
    for (var _i12 = 0; _i12 < results.length; _i12++) {
      if (results[_i12]) {
        result++;
      }
    }
    return result;
  }
  function COUNTUNIQUE() {
    return UNIQUE.apply(null, flatten(arguments)).length;
  }
  var COVARIANCE = {};
  COVARIANCE.P = function(array1, array2) {
    array1 = parseNumberArray(flatten(array1));
    array2 = parseNumberArray(flatten(array2));
    if (anyIsError(array1, array2)) {
      return value;
    }
    var mean1 = jStat.mean(array1);
    var mean2 = jStat.mean(array2);
    var result = 0;
    var n = array1.length;
    for (var i = 0; i < n; i++) {
      result += (array1[i] - mean1) * (array2[i] - mean2);
    }
    return result / n;
  };
  COVARIANCE.S = function(array1, array2) {
    array1 = parseNumberArray(flatten(array1));
    array2 = parseNumberArray(flatten(array2));
    if (anyIsError(array1, array2)) {
      return value;
    }
    return jStat.covariance(array1, array2);
  };
  function DEVSQ() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var mean = jStat.mean(range);
    var result = 0;
    for (var i = 0; i < range.length; i++) {
      result += Math.pow(range[i] - mean, 2);
    }
    return result;
  }
  var EXPON = {};
  EXPON.DIST = function(x, lambda, cumulative) {
    x = parseNumber(x);
    lambda = parseNumber(lambda);
    if (anyIsError(x, lambda)) {
      return value;
    }
    return cumulative ? jStat.exponential.cdf(x, lambda) : jStat.exponential.pdf(x, lambda);
  };
  var F = {};
  F.DIST = function(x, deg_freedom1, deg_freedom2, cumulative) {
    x = parseNumber(x);
    deg_freedom1 = parseNumber(deg_freedom1);
    deg_freedom2 = parseNumber(deg_freedom2);
    if (anyIsError(x, deg_freedom1, deg_freedom2)) {
      return value;
    }
    return cumulative ? jStat.centralF.cdf(x, deg_freedom1, deg_freedom2) : jStat.centralF.pdf(x, deg_freedom1, deg_freedom2);
  };
  F.DIST.RT = function(x, deg_freedom1, deg_freedom2) {
    if (arguments.length !== 3) {
      return na;
    }
    if (x < 0 || deg_freedom1 < 1 || deg_freedom2 < 1) {
      return num;
    }
    if (typeof x !== "number" || typeof deg_freedom1 !== "number" || typeof deg_freedom2 !== "number") {
      return value;
    }
    return 1 - jStat.centralF.cdf(x, deg_freedom1, deg_freedom2);
  };
  F.INV = function(probability, deg_freedom1, deg_freedom2) {
    probability = parseNumber(probability);
    deg_freedom1 = parseNumber(deg_freedom1);
    deg_freedom2 = parseNumber(deg_freedom2);
    if (anyIsError(probability, deg_freedom1, deg_freedom2)) {
      return value;
    }
    if (probability <= 0 || probability > 1) {
      return num;
    }
    return jStat.centralF.inv(probability, deg_freedom1, deg_freedom2);
  };
  F.INV.RT = function(probability, deg_freedom1, deg_freedom2) {
    if (arguments.length !== 3) {
      return na;
    }
    if (probability < 0 || probability > 1 || deg_freedom1 < 1 || deg_freedom1 > Math.pow(10, 10) || deg_freedom2 < 1 || deg_freedom2 > Math.pow(10, 10)) {
      return num;
    }
    if (typeof probability !== "number" || typeof deg_freedom1 !== "number" || typeof deg_freedom2 !== "number") {
      return value;
    }
    return jStat.centralF.inv(1 - probability, deg_freedom1, deg_freedom2);
  };
  F.TEST = function(array1, array2) {
    if (!array1 || !array2) {
      return na;
    }
    if (!(array1 instanceof Array) || !(array2 instanceof Array)) {
      return na;
    }
    if (array1.length < 2 || array2.length < 2) {
      return div0;
    }
    var sumOfSquares = function sumOfSquares(values, x1) {
      var sum = 0;
      for (var i = 0; i < values.length; i++) {
        sum += Math.pow(values[i] - x1, 2);
      }
      return sum;
    };
    var x1 = SUM(array1) / array1.length;
    var x2 = SUM(array2) / array2.length;
    var sum1 = sumOfSquares(array1, x1) / (array1.length - 1);
    var sum2 = sumOfSquares(array2, x2) / (array2.length - 1);
    return sum1 / sum2;
  };
  function FISHER(x) {
    x = parseNumber(x);
    if (x instanceof Error) {
      return x;
    }
    return Math.log((1 + x) / (1 - x)) / 2;
  }
  function FISHERINV(y) {
    y = parseNumber(y);
    if (y instanceof Error) {
      return y;
    }
    var e2y = Math.exp(2 * y);
    return (e2y - 1) / (e2y + 1);
  }
  function FORECAST(x, known_ys, known_xs) {
    x = parseNumber(x);
    known_ys = parseNumberArray(flatten(known_ys));
    known_xs = parseNumberArray(flatten(known_xs));
    if (anyIsError(x, known_ys, known_xs)) {
      return value;
    }
    var xmean = jStat.mean(known_xs);
    var ymean = jStat.mean(known_ys);
    var n = known_xs.length;
    var num = 0;
    var den = 0;
    for (var i = 0; i < n; i++) {
      num += (known_xs[i] - xmean) * (known_ys[i] - ymean);
      den += Math.pow(known_xs[i] - xmean, 2);
    }
    var b = num / den;
    var a = ymean - b * xmean;
    return a + b * x;
  }
  function FREQUENCY(data_array, bins_array) {
    data_array = parseNumberArray(flatten(data_array));
    bins_array = parseNumberArray(flatten(bins_array));
    if (anyIsError(data_array, bins_array)) {
      return value;
    }
    var n = data_array.length;
    var b = bins_array.length;
    var r = [];
    for (var i = 0; i <= b; i++) {
      r[i] = 0;
      for (var j = 0; j < n; j++) {
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
    return r;
  }
  function GAMMA(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return num;
    }
    if (parseInt(number, 10) === number && number < 0) {
      return num;
    }
    return jStat.gammafn(number);
  }
  GAMMA.DIST = function(value$1, alpha, beta, cumulative) {
    if (arguments.length !== 4) {
      return na;
    }
    if (value$1 < 0 || alpha <= 0 || beta <= 0) {
      return value;
    }
    if (typeof value$1 !== "number" || typeof alpha !== "number" || typeof beta !== "number") {
      return value;
    }
    return cumulative ? jStat.gamma.cdf(value$1, alpha, beta, true) : jStat.gamma.pdf(value$1, alpha, beta, false);
  };
  GAMMA.INV = function(probability, alpha, beta) {
    if (arguments.length !== 3) {
      return na;
    }
    if (probability < 0 || probability > 1 || alpha <= 0 || beta <= 0) {
      return num;
    }
    if (typeof probability !== "number" || typeof alpha !== "number" || typeof beta !== "number") {
      return value;
    }
    return jStat.gamma.inv(probability, alpha, beta);
  };
  function GAMMALN(x) {
    x = parseNumber(x);
    if (x instanceof Error) {
      return x;
    }
    return jStat.gammaln(x);
  }
  GAMMALN.PRECISE = function(x) {
    if (arguments.length !== 1) {
      return na;
    }
    if (x <= 0) {
      return num;
    }
    if (typeof x !== "number") {
      return value;
    }
    return jStat.gammaln(x);
  };
  function GAUSS(z) {
    z = parseNumber(z);
    if (z instanceof Error) {
      return z;
    }
    return jStat.normal.cdf(z, 0, 1) - .5;
  }
  function GEOMEAN() {
    var args = parseNumberArray(flatten(arguments));
    if (args instanceof Error) {
      return args;
    }
    return jStat.geomean(args);
  }
  function GROWTH(known_y, known_x, new_x, use_const) {
    known_y = parseNumberArray(known_y);
    if (known_y instanceof Error) {
      return known_y;
    }
    var i;
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
      return value;
    }
    if (use_const === undefined) {
      use_const = true;
    }
    var n = known_y.length;
    var avg_x = 0;
    var avg_y = 0;
    var avg_xy = 0;
    var avg_xx = 0;
    for (i = 0; i < n; i++) {
      var x = known_x[i];
      var y = Math.log(known_y[i]);
      avg_x += x;
      avg_y += y;
      avg_xy += x * y;
      avg_xx += x * x;
    }
    avg_x /= n;
    avg_y /= n;
    avg_xy /= n;
    avg_xx /= n;
    var beta;
    var alpha;
    if (use_const) {
      beta = (avg_xy - avg_x * avg_y) / (avg_xx - avg_x * avg_x);
      alpha = avg_y - beta * avg_x;
    } else {
      beta = avg_xy / avg_xx;
      alpha = 0;
    }
    var new_y = [];
    for (i = 0; i < new_x.length; i++) {
      new_y.push(Math.exp(alpha + beta * new_x[i]));
    }
    return new_y;
  }
  function HARMEAN() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var n = range.length;
    var den = 0;
    for (var i = 0; i < n; i++) {
      den += 1 / range[i];
    }
    return n / den;
  }
  var HYPGEOM = {};
  HYPGEOM.DIST = function(sample_s, number_sample, population_s, number_pop, cumulative) {
    sample_s = parseNumber(sample_s);
    number_sample = parseNumber(number_sample);
    population_s = parseNumber(population_s);
    number_pop = parseNumber(number_pop);
    if (anyIsError(sample_s, number_sample, population_s, number_pop)) {
      return value;
    }
    function pdf(x, n, M, N) {
      return COMBIN(M, x) * COMBIN(N - M, n - x) / COMBIN(N, n);
    }
    function cdf(x, n, M, N) {
      var result = 0;
      for (var i = 0; i <= x; i++) {
        result += pdf(i, n, M, N);
      }
      return result;
    }
    return cumulative ? cdf(sample_s, number_sample, population_s, number_pop) : pdf(sample_s, number_sample, population_s, number_pop);
  };
  function INTERCEPT(known_y, known_x) {
    known_y = parseNumberArray(known_y);
    known_x = parseNumberArray(known_x);
    if (anyIsError(known_y, known_x)) {
      return value;
    }
    if (known_y.length !== known_x.length) {
      return na;
    }
    return FORECAST(0, known_y, known_x);
  }
  function KURT() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var mean = jStat.mean(range);
    var n = range.length;
    var sigma = 0;
    for (var i = 0; i < n; i++) {
      sigma += Math.pow(range[i] - mean, 4);
    }
    sigma = sigma / Math.pow(jStat.stdev(range, true), 4);
    return n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) * sigma - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
  }
  function LARGE(array, k) {
    array = parseNumberArray(flatten(array));
    k = parseNumber(k);
    if (anyIsError(array, k)) {
      return array;
    }
    if (k < 0 || array.length < k) {
      return value;
    }
    return array.sort((function(a, b) {
      return b - a;
    }))[k - 1];
  }
  function LINEST(known_y, known_x) {
    known_y = parseNumberArray(flatten(known_y));
    known_x = parseNumberArray(flatten(known_x));
    if (anyIsError(known_y, known_x)) {
      return value;
    }
    var ymean = jStat.mean(known_y);
    var xmean = jStat.mean(known_x);
    var n = known_x.length;
    var num = 0;
    var den = 0;
    for (var i = 0; i < n; i++) {
      num += (known_x[i] - xmean) * (known_y[i] - ymean);
      den += Math.pow(known_x[i] - xmean, 2);
    }
    var m = num / den;
    var b = ymean - m * xmean;
    return [ m, b ];
  }
  function LOGEST(known_y, known_x) {
    known_y = parseNumberArray(flatten(known_y));
    known_x = parseNumberArray(flatten(known_x));
    if (anyIsError(known_y, known_x)) {
      return value;
    }
    if (known_y.length !== known_x.length) {
      return value;
    }
    for (var i = 0; i < known_y.length; i++) {
      known_y[i] = Math.log(known_y[i]);
    }
    var result = LINEST(known_y, known_x);
    result[0] = Math.round(Math.exp(result[0]) * 1e6) / 1e6;
    result[1] = Math.round(Math.exp(result[1]) * 1e6) / 1e6;
    return result;
  }
  var LOGNORM = {};
  LOGNORM.DIST = function(x, mean, standard_dev, cumulative) {
    x = parseNumber(x);
    mean = parseNumber(mean);
    standard_dev = parseNumber(standard_dev);
    if (anyIsError(x, mean, standard_dev)) {
      return value;
    }
    return cumulative ? jStat.lognormal.cdf(x, mean, standard_dev) : jStat.lognormal.pdf(x, mean, standard_dev);
  };
  LOGNORM.INV = function(probability, mean, standard_dev) {
    probability = parseNumber(probability);
    mean = parseNumber(mean);
    standard_dev = parseNumber(standard_dev);
    if (anyIsError(probability, mean, standard_dev)) {
      return value;
    }
    return jStat.lognormal.inv(probability, mean, standard_dev);
  };
  function MAX() {
    var flatArguments = flatten(arguments);
    var someError = anyError.apply(undefined, flatArguments);
    if (someError) {
      return someError;
    }
    var range = numbers(flatArguments);
    return range.length === 0 ? 0 : Math.max.apply(Math, range);
  }
  function MAXA() {
    var flatArguments = flatten(arguments);
    var someError = anyError.apply(undefined, flatArguments);
    if (someError) {
      return someError;
    }
    var range = arrayValuesToNumbers(flatArguments);
    range = range.map((function(value) {
      return value === undefined || value === null ? 0 : value;
    }));
    return range.length === 0 ? 0 : Math.max.apply(Math, range);
  }
  function MEDIAN() {
    var flatArguments = flatten(arguments);
    var someError = anyError.apply(undefined, flatArguments);
    if (someError) {
      return someError;
    }
    var range = arrayValuesToNumbers(flatArguments);
    var result = jStat.median(range);
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function MIN() {
    var flatArguments = flatten(arguments);
    var someError = anyError.apply(undefined, flatArguments);
    if (someError) {
      return someError;
    }
    var range = numbers(flatArguments);
    return range.length === 0 ? 0 : Math.min.apply(Math, range);
  }
  function MINA() {
    var flatArguments = flatten(arguments);
    var someError = anyError.apply(undefined, flatArguments);
    if (someError) {
      return someError;
    }
    var range = arrayValuesToNumbers(flatArguments);
    range = range.map((function(value) {
      return value === undefined || value === null ? 0 : value;
    }));
    return range.length === 0 ? 0 : Math.min.apply(Math, range);
  }
  var MODE = {};
  MODE.MULT = function() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var n = range.length;
    var count = {};
    var maxItems = [];
    var max = 0;
    var currentItem;
    for (var i = 0; i < n; i++) {
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
    return maxItems;
  };
  MODE.SNGL = function() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    return MODE.MULT(range).sort((function(a, b) {
      return a - b;
    }))[0];
  };
  var NEGBINOM = {};
  NEGBINOM.DIST = function(number_f, number_s, probability_s, cumulative) {
    number_f = parseNumber(number_f);
    number_s = parseNumber(number_s);
    probability_s = parseNumber(probability_s);
    if (anyIsError(number_f, number_s, probability_s)) {
      return value;
    }
    return cumulative ? jStat.negbin.cdf(number_f, number_s, probability_s) : jStat.negbin.pdf(number_f, number_s, probability_s);
  };
  var NORM = {};
  NORM.DIST = function(x, mean, standard_dev, cumulative) {
    x = parseNumber(x);
    mean = parseNumber(mean);
    standard_dev = parseNumber(standard_dev);
    if (anyIsError(x, mean, standard_dev)) {
      return value;
    }
    if (standard_dev <= 0) {
      return num;
    }
    return cumulative ? jStat.normal.cdf(x, mean, standard_dev) : jStat.normal.pdf(x, mean, standard_dev);
  };
  NORM.INV = function(probability, mean, standard_dev) {
    probability = parseNumber(probability);
    mean = parseNumber(mean);
    standard_dev = parseNumber(standard_dev);
    if (anyIsError(probability, mean, standard_dev)) {
      return value;
    }
    return jStat.normal.inv(probability, mean, standard_dev);
  };
  NORM.S = {};
  NORM.S.DIST = function(z, cumulative) {
    z = parseNumber(z);
    if (z instanceof Error) {
      return value;
    }
    return cumulative ? jStat.normal.cdf(z, 0, 1) : jStat.normal.pdf(z, 0, 1);
  };
  NORM.S.INV = function(probability) {
    probability = parseNumber(probability);
    if (probability instanceof Error) {
      return value;
    }
    return jStat.normal.inv(probability, 0, 1);
  };
  function PEARSON(array1, array2) {
    array2 = parseNumberArray(flatten(array2));
    array1 = parseNumberArray(flatten(array1));
    if (anyIsError(array2, array1)) {
      return value;
    }
    var xmean = jStat.mean(array1);
    var ymean = jStat.mean(array2);
    var n = array1.length;
    var num = 0;
    var den1 = 0;
    var den2 = 0;
    for (var i = 0; i < n; i++) {
      num += (array1[i] - xmean) * (array2[i] - ymean);
      den1 += Math.pow(array1[i] - xmean, 2);
      den2 += Math.pow(array2[i] - ymean, 2);
    }
    return num / Math.sqrt(den1 * den2);
  }
  var PERCENTILE = {};
  PERCENTILE.EXC = function(array, k) {
    array = parseNumberArray(flatten(array));
    k = parseNumber(k);
    if (anyIsError(array, k)) {
      return value;
    }
    array = array.sort((function(a, b) {
      return a - b;
    }));
    var n = array.length;
    if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
      return num;
    }
    var l = k * (n + 1) - 1;
    var fl = Math.floor(l);
    return cleanFloat(l === fl ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
  };
  PERCENTILE.INC = function(array, k) {
    array = parseNumberArray(flatten(array));
    k = parseNumber(k);
    if (anyIsError(array, k)) {
      return value;
    }
    array = array.sort((function(a, b) {
      return a - b;
    }));
    var n = array.length;
    var l = k * (n - 1);
    var fl = Math.floor(l);
    return cleanFloat(l === fl ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
  };
  var PERCENTRANK = {};
  PERCENTRANK.EXC = function(array, x, significance) {
    significance = significance === undefined ? 3 : significance;
    array = parseNumberArray(flatten(array));
    x = parseNumber(x);
    significance = parseNumber(significance);
    if (anyIsError(array, x, significance)) {
      return value;
    }
    array = array.sort((function(a, b) {
      return a - b;
    }));
    var uniques = UNIQUE.apply(null, array);
    var n = array.length;
    var m = uniques.length;
    var power = Math.pow(10, significance);
    var result = 0;
    var match = false;
    var i = 0;
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
    return Math.floor(result * power) / power;
  };
  PERCENTRANK.INC = function(array, x, significance) {
    significance = significance === undefined ? 3 : significance;
    array = parseNumberArray(flatten(array));
    x = parseNumber(x);
    significance = parseNumber(significance);
    if (anyIsError(array, x, significance)) {
      return value;
    }
    array = array.sort((function(a, b) {
      return a - b;
    }));
    var uniques = UNIQUE.apply(null, array);
    var n = array.length;
    var m = uniques.length;
    var power = Math.pow(10, significance);
    var result = 0;
    var match = false;
    var i = 0;
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
    return Math.floor(result * power) / power;
  };
  function PERMUT(number, number_chosen) {
    number = parseNumber(number);
    number_chosen = parseNumber(number_chosen);
    if (anyIsError(number, number_chosen)) {
      return value;
    }
    return FACT(number) / FACT(number - number_chosen);
  }
  function PERMUTATIONA(number, number_chosen) {
    number = parseNumber(number);
    number_chosen = parseNumber(number_chosen);
    if (anyIsError(number, number_chosen)) {
      return value;
    }
    return Math.pow(number, number_chosen);
  }
  function PHI(x) {
    x = parseNumber(x);
    if (x instanceof Error) {
      return value;
    }
    return Math.exp(-.5 * x * x) / SQRT2PI;
  }
  var POISSON = {};
  POISSON.DIST = function(x, mean, cumulative) {
    x = parseNumber(x);
    mean = parseNumber(mean);
    if (anyIsError(x, mean)) {
      return value;
    }
    return cumulative ? jStat.poisson.cdf(x, mean) : jStat.poisson.pdf(x, mean);
  };
  function PROB(x_range, prob_range, lower_limit, upper_limit) {
    if (lower_limit === undefined) {
      return 0;
    }
    upper_limit = upper_limit === undefined ? lower_limit : upper_limit;
    x_range = parseNumberArray(flatten(x_range));
    prob_range = parseNumberArray(flatten(prob_range));
    lower_limit = parseNumber(lower_limit);
    upper_limit = parseNumber(upper_limit);
    if (anyIsError(x_range, prob_range, lower_limit, upper_limit)) {
      return value;
    }
    if (lower_limit === upper_limit) {
      return x_range.indexOf(lower_limit) >= 0 ? prob_range[x_range.indexOf(lower_limit)] : 0;
    }
    var sorted = x_range.sort((function(a, b) {
      return a - b;
    }));
    var n = sorted.length;
    var result = 0;
    for (var i = 0; i < n; i++) {
      if (sorted[i] >= lower_limit && sorted[i] <= upper_limit) {
        result += prob_range[x_range.indexOf(sorted[i])];
      }
    }
    return result;
  }
  var QUARTILE = {};
  QUARTILE.EXC = function(range, quart) {
    range = parseNumberArray(flatten(range));
    quart = parseNumber(quart);
    if (anyIsError(range, quart)) {
      return value;
    }
    switch (quart) {
     case 1:
      return PERCENTILE.EXC(range, .25);

     case 2:
      return PERCENTILE.EXC(range, .5);

     case 3:
      return PERCENTILE.EXC(range, .75);

     default:
      return num;
    }
  };
  QUARTILE.INC = function(range, quart) {
    range = parseNumberArray(flatten(range));
    quart = parseNumber(quart);
    if (anyIsError(range, quart)) {
      return value;
    }
    switch (quart) {
     case 1:
      return PERCENTILE.INC(range, .25);

     case 2:
      return PERCENTILE.INC(range, .5);

     case 3:
      return PERCENTILE.INC(range, .75);

     default:
      return num;
    }
  };
  var RANK = {};
  RANK.AVG = function(number, ref, order) {
    number = parseNumber(number);
    ref = parseNumberArray(flatten(ref));
    if (anyIsError(number, ref)) {
      return value;
    }
    ref = flatten(ref);
    order = order || false;
    var sort = order ? function(a, b) {
      return a - b;
    } : function(a, b) {
      return b - a;
    };
    ref = ref.sort(sort);
    var length = ref.length;
    var count = 0;
    for (var i = 0; i < length; i++) {
      if (ref[i] === number) {
        count++;
      }
    }
    return count > 1 ? (2 * ref.indexOf(number) + count + 1) / 2 : ref.indexOf(number) + 1;
  };
  RANK.EQ = function(number, ref, order) {
    number = parseNumber(number);
    ref = parseNumberArray(flatten(ref));
    if (anyIsError(number, ref)) {
      return value;
    }
    order = order || false;
    var sort = order ? function(a, b) {
      return a - b;
    } : function(a, b) {
      return b - a;
    };
    ref = ref.sort(sort);
    return ref.indexOf(number) + 1;
  };
  function ROW(reference, index) {
    if (arguments.length !== 2) {
      return na;
    }
    if (index < 0) {
      return num;
    }
    if (!(reference instanceof Array) || typeof index !== "number") {
      return value;
    }
    if (reference.length === 0) {
      return undefined;
    }
    return jStat.row(reference, index);
  }
  function RSQ(known_y, known_x) {
    known_y = parseNumberArray(flatten(known_y));
    known_x = parseNumberArray(flatten(known_x));
    if (anyIsError(known_y, known_x)) {
      return value;
    }
    return Math.pow(PEARSON(known_y, known_x), 2);
  }
  function SKEW() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var mean = jStat.mean(range);
    var n = range.length;
    var sigma = 0;
    for (var i = 0; i < n; i++) {
      sigma += Math.pow(range[i] - mean, 3);
    }
    return n * sigma / ((n - 1) * (n - 2) * Math.pow(jStat.stdev(range, true), 3));
  }
  SKEW.P = function() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var mean = jStat.mean(range);
    var n = range.length;
    var m2 = 0;
    var m3 = 0;
    for (var i = 0; i < n; i++) {
      m3 += Math.pow(range[i] - mean, 3);
      m2 += Math.pow(range[i] - mean, 2);
    }
    m3 = m3 / n;
    m2 = m2 / n;
    return m3 / Math.pow(m2, 3 / 2);
  };
  function SLOPE(known_y, known_x) {
    known_y = parseNumberArray(flatten(known_y));
    known_x = parseNumberArray(flatten(known_x));
    if (anyIsError(known_y, known_x)) {
      return value;
    }
    var xmean = jStat.mean(known_x);
    var ymean = jStat.mean(known_y);
    var n = known_x.length;
    var num = 0;
    var den = 0;
    for (var i = 0; i < n; i++) {
      num += (known_x[i] - xmean) * (known_y[i] - ymean);
      den += Math.pow(known_x[i] - xmean, 2);
    }
    return num / den;
  }
  function SMALL(array, k) {
    array = parseNumberArray(flatten(array));
    k = parseNumber(k);
    if (anyIsError(array, k)) {
      return array;
    }
    return array.sort((function(a, b) {
      return a - b;
    }))[k - 1];
  }
  function STANDARDIZE(x, mean, standard_dev) {
    x = parseNumber(x);
    mean = parseNumber(mean);
    standard_dev = parseNumber(standard_dev);
    if (anyIsError(x, mean, standard_dev)) {
      return value;
    }
    return (x - mean) / standard_dev;
  }
  var STDEV = {};
  STDEV.P = function() {
    var v = VAR.P.apply(this, arguments);
    var result = Math.sqrt(v);
    if (isNaN(result)) {
      result = num;
    }
    return result;
  };
  STDEV.S = function() {
    var v = VAR.S.apply(this, arguments);
    var result = Math.sqrt(v);
    return result;
  };
  function STDEVA() {
    var v = VARA.apply(this, arguments);
    var result = Math.sqrt(v);
    return result;
  }
  function STDEVPA() {
    var v = VARPA.apply(this, arguments);
    var result = Math.sqrt(v);
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function STEYX(known_y, known_x) {
    known_y = parseNumberArray(flatten(known_y));
    known_x = parseNumberArray(flatten(known_x));
    if (anyIsError(known_y, known_x)) {
      return value;
    }
    var xmean = jStat.mean(known_x);
    var ymean = jStat.mean(known_y);
    var n = known_x.length;
    var lft = 0;
    var num = 0;
    var den = 0;
    for (var i = 0; i < n; i++) {
      lft += Math.pow(known_y[i] - ymean, 2);
      num += (known_x[i] - xmean) * (known_y[i] - ymean);
      den += Math.pow(known_x[i] - xmean, 2);
    }
    return Math.sqrt((lft - num * num / den) / (n - 2));
  }
  var T$1 = {};
  T$1.DIST = function(x, deg_freedom, cumulative) {
    if (cumulative !== 1 && cumulative !== 2) {
      return num;
    }
    return cumulative === 1 ? T$1.DIST.RT(x, deg_freedom) : T$1.DIST["2T"](x, deg_freedom);
  };
  T$1.DIST["2T"] = function(x, deg_freedom) {
    if (arguments.length !== 2) {
      return na;
    }
    if (x < 0 || deg_freedom < 1) {
      return num;
    }
    if (typeof x !== "number" || typeof deg_freedom !== "number") {
      return value;
    }
    return (1 - jStat.studentt.cdf(x, deg_freedom)) * 2;
  };
  T$1.DIST.RT = function(x, deg_freedom) {
    if (arguments.length !== 2) {
      return na;
    }
    if (x < 0 || deg_freedom < 1) {
      return num;
    }
    if (typeof x !== "number" || typeof deg_freedom !== "number") {
      return value;
    }
    return 1 - jStat.studentt.cdf(x, deg_freedom);
  };
  T$1.INV = function(probability, deg_freedom) {
    probability = parseNumber(probability);
    deg_freedom = parseNumber(deg_freedom);
    if (anyIsError(probability, deg_freedom)) {
      return value;
    }
    return jStat.studentt.inv(probability, deg_freedom);
  };
  T$1.INV["2T"] = function(probability, deg_freedom) {
    probability = parseNumber(probability);
    deg_freedom = parseNumber(deg_freedom);
    if (probability <= 0 || probability > 1 || deg_freedom < 1) {
      return num;
    }
    if (anyIsError(probability, deg_freedom)) {
      return value;
    }
    return Math.abs(jStat.studentt.inv(probability / 2, deg_freedom));
  };
  T$1.TEST = function(array1, array2) {
    array1 = parseNumberArray(flatten(array1));
    array2 = parseNumberArray(flatten(array2));
    if (anyIsError(array1, array2)) {
      return value;
    }
    var mean_x = jStat.mean(array1);
    var mean_y = jStat.mean(array2);
    var s_x = 0;
    var s_y = 0;
    var i;
    for (i = 0; i < array1.length; i++) {
      s_x += Math.pow(array1[i] - mean_x, 2);
    }
    for (i = 0; i < array2.length; i++) {
      s_y += Math.pow(array2[i] - mean_y, 2);
    }
    s_x = s_x / (array1.length - 1);
    s_y = s_y / (array2.length - 1);
    var t = Math.abs(mean_x - mean_y) / Math.sqrt(s_x / array1.length + s_y / array2.length);
    return T$1.DIST["2T"](t, array1.length + array2.length - 2);
  };
  function TREND(known_ys, known_xs, new_xs) {
    known_ys = parseNumberArray(flatten(known_ys));
    known_xs = parseNumberArray(flatten(known_xs));
    new_xs = parseNumberArray(flatten(new_xs));
    if (anyIsError(known_ys, known_xs, new_xs)) {
      return value;
    }
    var linest = LINEST(known_ys, known_xs);
    var m = linest[0];
    var b = linest[1];
    var result = [];
    new_xs.forEach((function(x) {
      result.push(m * x + b);
    }));
    return result;
  }
  function TRIMMEAN(range, percent) {
    range = parseNumberArray(flatten(range));
    percent = parseNumber(percent);
    if (anyIsError(range, percent)) {
      return value;
    }
    var trim = FLOOR(range.length * percent, 2) / 2;
    return jStat.mean(initial(rest(range.sort((function(a, b) {
      return a - b;
    })), trim), trim));
  }
  var VAR = {};
  VAR.P = function() {
    var range = numbers(flatten(arguments));
    var n = range.length;
    var sigma = 0;
    var mean = AVERAGE(range);
    var result;
    for (var i = 0; i < n; i++) {
      sigma += Math.pow(range[i] - mean, 2);
    }
    result = sigma / n;
    if (isNaN(result)) {
      result = num;
    }
    return result;
  };
  VAR.S = function() {
    var range = numbers(flatten(arguments));
    var n = range.length;
    var sigma = 0;
    var mean = AVERAGE(range);
    for (var i = 0; i < n; i++) {
      sigma += Math.pow(range[i] - mean, 2);
    }
    return sigma / (n - 1);
  };
  function VARA() {
    var range = flatten(arguments);
    var n = range.length;
    var sigma = 0;
    var count = 0;
    var mean = AVERAGEA(range);
    for (var i = 0; i < n; i++) {
      var el = range[i];
      if (typeof el === "number") {
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
    return sigma / (count - 1);
  }
  function VARPA() {
    var range = flatten(arguments);
    var n = range.length;
    var sigma = 0;
    var count = 0;
    var mean = AVERAGEA(range);
    var result;
    for (var i = 0; i < n; i++) {
      var el = range[i];
      if (typeof el === "number") {
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
    return result;
  }
  var WEIBULL = {};
  WEIBULL.DIST = function(x, alpha, beta, cumulative) {
    x = parseNumber(x);
    alpha = parseNumber(alpha);
    beta = parseNumber(beta);
    if (anyIsError(x, alpha, beta)) {
      return value;
    }
    return cumulative ? 1 - Math.exp(-Math.pow(x / beta, alpha)) : Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha / Math.pow(beta, alpha);
  };
  var Z = {};
  Z.TEST = function(array, x, sigma) {
    array = parseNumberArray(flatten(array));
    x = parseNumber(x);
    if (anyIsError(array, x)) {
      return value;
    }
    sigma = sigma || STDEV.S(array);
    var n = array.length;
    return 1 - NORM.S.DIST((AVERAGE(array) - x) / (sigma / Math.sqrt(n)), true);
  };
  function ABS(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = Math.abs(number);
    return result;
  }
  function ACOS(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = Math.acos(number);
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function ACOSH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = Math.log(number + Math.sqrt(number * number - 1));
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function ACOT(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = Math.atan(1 / number);
    return result;
  }
  function ACOTH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = .5 * Math.log((number + 1) / (number - 1));
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function AGGREGATE(function_num, options, ref1, ref2) {
    function_num = parseNumber(function_num);
    options = parseNumber(function_num);
    if (anyIsError(function_num, options)) {
      return value;
    }
    switch (function_num) {
     case 1:
      return AVERAGE(ref1);

     case 2:
      return COUNT(ref1);

     case 3:
      return COUNTA(ref1);

     case 4:
      return MAX(ref1);

     case 5:
      return MIN(ref1);

     case 6:
      return PRODUCT(ref1);

     case 7:
      return STDEV.S(ref1);

     case 8:
      return STDEV.P(ref1);

     case 9:
      return SUM(ref1);

     case 10:
      return VAR.S(ref1);

     case 11:
      return VAR.P(ref1);

     case 12:
      return MEDIAN(ref1);

     case 13:
      return MODE.SNGL(ref1);

     case 14:
      return LARGE(ref1, ref2);

     case 15:
      return SMALL(ref1, ref2);

     case 16:
      return PERCENTILE.INC(ref1, ref2);

     case 17:
      return QUARTILE.INC(ref1, ref2);

     case 18:
      return PERCENTILE.EXC(ref1, ref2);

     case 19:
      return QUARTILE.EXC(ref1, ref2);
    }
  }
  function ARABIC(text) {
    if (text === undefined || text === null) {
      return 0;
    }
    if (text instanceof Error) {
      return text;
    }
    if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
      return value;
    }
    var r = 0;
    text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, (function(i) {
      r += {
        M: 1e3,
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
    }));
    return r;
  }
  function ASIN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = Math.asin(number);
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function ASINH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.log(number + Math.sqrt(number * number + 1));
  }
  function ATAN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.atan(number);
  }
  function ATAN2(x_num, y_num) {
    x_num = parseNumber(x_num);
    y_num = parseNumber(y_num);
    var anyError$1 = anyError(x_num, y_num);
    if (anyError$1) {
      return anyError$1;
    }
    return Math.atan2(x_num, y_num);
  }
  function ATANH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var result = Math.log((1 + number) / (1 - number)) / 2;
    if (isNaN(result)) {
      result = num;
    }
    return result;
  }
  function BASE$1(number, radix, min_length) {
    number = parseNumber(number);
    radix = parseNumber(radix);
    min_length = parseNumber(min_length);
    var anyError$1 = anyError(number, radix, min_length);
    if (anyError$1) {
      return anyError$1;
    }
    if (radix === 0) {
      return num;
    }
    var result = number.toString(radix);
    return new Array(Math.max(min_length + 1 - result.length, 0)).join("0") + result;
  }
  function CEILING(number, significance, mode) {
    number = parseNumber(number);
    significance = parseNumber(significance);
    mode = parseNumber(mode);
    var anyError$1 = anyError(number, significance, mode);
    if (anyError$1) {
      return anyError$1;
    }
    if (significance === 0) {
      return 0;
    }
    significance = Math.abs(significance);
    var precision = -Math.floor(Math.log(significance) / Math.log(10));
    if (number >= 0) {
      return ROUND(Math.ceil(number / significance) * significance, precision);
    } else {
      if (mode === 0) {
        return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
      } else {
        return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
      }
    }
  }
  CEILING.MATH = CEILING;
  CEILING.PRECISE = CEILING;
  function COMBIN(number, number_chosen) {
    number = parseNumber(number);
    number_chosen = parseNumber(number_chosen);
    var anyError$1 = anyError(number, number_chosen);
    if (anyError$1) {
      return anyError$1;
    }
    if (number < number_chosen) {
      return num;
    }
    return FACT(number) / (FACT(number_chosen) * FACT(number - number_chosen));
  }
  function COMBINA(number, number_chosen) {
    number = parseNumber(number);
    number_chosen = parseNumber(number_chosen);
    var anyError$1 = anyError(number, number_chosen);
    if (anyError$1) {
      return anyError$1;
    }
    if (number < number_chosen) {
      return num;
    }
    return number === 0 && number_chosen === 0 ? 1 : COMBIN(number + number_chosen - 1, number - 1);
  }
  function COS(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.cos(number);
  }
  function COSH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return (Math.exp(number) + Math.exp(-number)) / 2;
  }
  function COT(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return div0;
    }
    return 1 / Math.tan(number);
  }
  function COTH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return div0;
    }
    var e2 = Math.exp(2 * number);
    return (e2 + 1) / (e2 - 1);
  }
  function CSC(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return div0;
    }
    return 1 / Math.sin(number);
  }
  function CSCH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return div0;
    }
    return 2 / (Math.exp(number) - Math.exp(-number));
  }
  function DECIMAL(text, radix) {
    if (arguments.length < 1) {
      return value;
    }
    text = parseNumber(text);
    radix = parseNumber(radix);
    var anyError$1 = anyError(text, radix);
    if (anyError$1) {
      return anyError$1;
    }
    if (radix === 0) {
      return num;
    }
    return parseInt(text, radix);
  }
  function DEGREES(angle) {
    angle = parseNumber(angle);
    if (angle instanceof Error) {
      return angle;
    }
    return angle * 180 / Math.PI;
  }
  function EVEN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return CEILING(number, -2, -1);
  }
  function EXP(number) {
    if (arguments.length < 1) {
      return na;
    }
    if (arguments.length > 1) {
      return error;
    }
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    number = Math.exp(number);
    return number;
  }
  var MEMOIZED_FACT = [];
  function FACT(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var n = Math.floor(number);
    if (n === 0 || n === 1) {
      return 1;
    } else if (MEMOIZED_FACT[n] > 0) {
      return MEMOIZED_FACT[n];
    } else {
      MEMOIZED_FACT[n] = FACT(n - 1) * n;
      return MEMOIZED_FACT[n];
    }
  }
  function FACTDOUBLE(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var n = Math.floor(number);
    return n <= 0 ? 1 : n * FACTDOUBLE(n - 2);
  }
  function FLOOR(number, significance) {
    number = parseNumber(number);
    significance = parseNumber(significance);
    var anyError$1 = anyError(number, significance);
    if (anyError$1) {
      return anyError$1;
    }
    if (significance === 0) {
      return 0;
    }
    if (!(number >= 0 && significance > 0) && !(number <= 0 && significance < 0)) {
      return num;
    }
    significance = Math.abs(significance);
    var precision = -Math.floor(Math.log(significance) / Math.log(10));
    return number >= 0 ? ROUND(Math.floor(number / significance) * significance, precision) : -ROUND(Math.ceil(Math.abs(number) / significance), precision);
  }
  FLOOR.MATH = function(number, significance, mode) {
    if (significance instanceof Error) {
      return significance;
    }
    significance = significance === undefined ? 0 : significance;
    number = parseNumber(number);
    significance = parseNumber(significance);
    mode = parseNumber(mode);
    var anyError$1 = anyError(number, significance, mode);
    if (anyError$1) {
      return anyError$1;
    }
    if (significance === 0) {
      return 0;
    }
    significance = significance ? Math.abs(significance) : 1;
    var precision = -Math.floor(Math.log(significance) / Math.log(10));
    if (number >= 0) {
      return ROUND(Math.floor(number / significance) * significance, precision);
    } else if (mode === 0 || mode === undefined) {
      return -ROUND(Math.ceil(Math.abs(number) / significance) * significance, precision);
    }
    return -ROUND(Math.floor(Math.abs(number) / significance) * significance, precision);
  };
  FLOOR.PRECISE = FLOOR["MATH"];
  function GCD() {
    var range = parseNumberArray(flatten(arguments));
    if (range instanceof Error) {
      return range;
    }
    var n = range.length;
    var r0 = range[0];
    var x = r0 < 0 ? -r0 : r0;
    for (var i = 1; i < n; i++) {
      var ri = range[i];
      var y = ri < 0 ? -ri : ri;
      while (x && y) {
        if (x > y) {
          x %= y;
        } else {
          y %= x;
        }
      }
      x += y;
    }
    return x;
  }
  function INT(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.floor(number);
  }
  var ISO = {
    CEILING: CEILING
  };
  function LCM() {
    var o = parseNumberArray(flatten(arguments));
    if (o instanceof Error) {
      return o;
    }
    for (var i, j, n, d, r = 1; (n = o.pop()) !== undefined; ) {
      if (n === 0) {
        return 0;
      }
      while (n > 1) {
        if (n % 2) {
          for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2) {}
          d = i <= j ? i : n;
        } else {
          d = 2;
        }
        for (n /= d, r *= d, i = o.length; i; o[--i] % d === 0 && (o[i] /= d) === 1 && o.splice(i, 1)) {}
      }
    }
    return r;
  }
  function LN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return num;
    }
    return Math.log(number);
  }
  function LN10$1() {
    return Math.log(10);
  }
  function LN2() {
    return Math.log(2);
  }
  function LOG10E() {
    return Math.LOG10E;
  }
  function LOG2E() {
    return Math.LOG2E;
  }
  function LOG(number, base) {
    number = parseNumber(number);
    base = parseNumber(base);
    var anyError$1 = anyError(number, base);
    if (anyError$1) {
      return anyError$1;
    }
    if (number === 0 || base === 0) {
      return num;
    }
    return Math.log(number) / Math.log(base);
  }
  function LOG10(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number === 0) {
      return num;
    }
    return Math.log(number) / Math.log(10);
  }
  function MOD(number, divisor) {
    number = parseNumber(number);
    divisor = parseNumber(divisor);
    var anyError$1 = anyError(number, divisor);
    if (anyError$1) {
      return anyError$1;
    }
    if (divisor === 0) {
      return div0;
    }
    var modulus = Math.abs(number % divisor);
    modulus = number < 0 ? divisor - modulus : modulus;
    return divisor > 0 ? modulus : -modulus;
  }
  function MROUND(number, multiple) {
    number = parseNumber(number);
    multiple = parseNumber(multiple);
    var anyError$1 = anyError(number, multiple);
    if (anyError$1) {
      return anyError$1;
    }
    if (number * multiple === 0) {
      return 0;
    }
    if (number * multiple < 0) {
      return num;
    }
    return Math.round(number / multiple) * multiple;
  }
  function MULTINOMIAL() {
    var args = parseNumberArray(flatten(arguments));
    if (args instanceof Error) {
      return args;
    }
    var sum = 0;
    var divisor = 1;
    for (var i = 0; i < args.length; i++) {
      sum += args[i];
      divisor *= FACT(args[i]);
    }
    return FACT(sum) / divisor;
  }
  function ODD(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var temp = Math.ceil(Math.abs(number));
    temp = temp & 1 ? temp : temp + 1;
    return number >= 0 ? temp : -temp;
  }
  function PI$1() {
    return Math.PI;
  }
  function E() {
    return Math.E;
  }
  function POWER(number, power) {
    number = parseNumber(number);
    power = parseNumber(power);
    var anyError$1 = anyError(number, power);
    if (anyError$1) {
      return anyError$1;
    }
    if (number === 0 && power === 0) {
      return num;
    }
    var result = Math.pow(number, power);
    if (isNaN(result)) {
      return num;
    }
    return result;
  }
  function PRODUCT() {
    var flatArguments = flatten(arguments);
    var flatArgumentsDefined = flatArguments.filter((function(arg) {
      return arg !== undefined && arg !== null;
    }));
    if (flatArgumentsDefined.length === 0) {
      return 0;
    }
    var args = parseNumberArray(flatArgumentsDefined);
    if (args instanceof Error) {
      return args;
    }
    var result = 1;
    for (var i = 0; i < args.length; i++) {
      result *= args[i];
    }
    return result;
  }
  function QUOTIENT(numerator, denominator) {
    numerator = parseNumber(numerator);
    denominator = parseNumber(denominator);
    var anyError$1 = anyError(numerator, denominator);
    if (anyError$1) {
      return anyError$1;
    }
    return parseInt(numerator / denominator, 10);
  }
  function RADIANS(angle) {
    angle = parseNumber(angle);
    if (angle instanceof Error) {
      return angle;
    }
    return angle * Math.PI / 180;
  }
  function RAND() {
    return Math.random();
  }
  function RANDBETWEEN(bottom, top) {
    bottom = parseNumber(bottom);
    top = parseNumber(top);
    var anyError$1 = anyError(bottom, top);
    if (anyError$1) {
      return anyError$1;
    }
    return bottom + Math.ceil((top - bottom + 1) * Math.random()) - 1;
  }
  function ROMAN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var digits = String(number).split("");
    var key = [ "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX" ];
    var roman = "";
    var i = 3;
    while (i--) {
      roman = (key[+digits.pop() + i * 10] || "") + roman;
    }
    return new Array(+digits.join("") + 1).join("M") + roman;
  }
  function ROUND(number, num_digits) {
    number = parseNumber(number);
    num_digits = parseNumber(num_digits);
    var anyError$1 = anyError(number, num_digits);
    if (anyError$1) {
      return anyError$1;
    }
    return Number(Math.round(Number(number + "e" + num_digits)) + "e" + num_digits * -1);
  }
  function ROUNDDOWN(number, num_digits) {
    number = parseNumber(number);
    num_digits = parseNumber(num_digits);
    var anyError$1 = anyError(number, num_digits);
    if (anyError$1) {
      return anyError$1;
    }
    var sign = number > 0 ? 1 : -1;
    return sign * Math.floor(Math.abs(number) * Math.pow(10, num_digits)) / Math.pow(10, num_digits);
  }
  function ROUNDUP(number, num_digits) {
    number = parseNumber(number);
    num_digits = parseNumber(num_digits);
    var anyError$1 = anyError(number, num_digits);
    if (anyError$1) {
      return anyError$1;
    }
    var sign = number > 0 ? 1 : -1;
    return sign * Math.ceil(Math.abs(number) * Math.pow(10, num_digits)) / Math.pow(10, num_digits);
  }
  function SEC(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return 1 / Math.cos(number);
  }
  function SECH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return 2 / (Math.exp(number) + Math.exp(-number));
  }
  function SERIESSUM(x, n, m, coefficients) {
    x = parseNumber(x);
    n = parseNumber(n);
    m = parseNumber(m);
    coefficients = parseNumberArray(coefficients);
    if (anyIsError(x, n, m, coefficients)) {
      return value;
    }
    var result = coefficients[0] * Math.pow(x, n);
    for (var i = 1; i < coefficients.length; i++) {
      result += coefficients[i] * Math.pow(x, n + i * m);
    }
    return result;
  }
  function SIGN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number < 0) {
      return -1;
    } else if (number === 0) {
      return 0;
    } else {
      return 1;
    }
  }
  function SIN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.sin(number);
  }
  function SINH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return (Math.exp(number) - Math.exp(-number)) / 2;
  }
  function SQRT(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (number < 0) {
      return num;
    }
    return Math.sqrt(number);
  }
  function SQRTPI(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.sqrt(number * Math.PI);
  }
  function SQRT1_2() {
    return 1 / Math.sqrt(2);
  }
  function SQRT2() {
    return Math.sqrt(2);
  }
  function SUBTOTAL(function_num, ref1) {
    function_num = parseNumber(function_num);
    if (function_num instanceof Error) {
      return function_num;
    }
    switch (function_num) {
     case 1:
      return AVERAGE(ref1);

     case 2:
      return COUNT(ref1);

     case 3:
      return COUNTA(ref1);

     case 4:
      return MAX(ref1);

     case 5:
      return MIN(ref1);

     case 6:
      return PRODUCT(ref1);

     case 7:
      return STDEV.S(ref1);

     case 8:
      return STDEV.P(ref1);

     case 9:
      return SUM(ref1);

     case 10:
      return VAR.S(ref1);

     case 11:
      return VAR.P(ref1);

     case 101:
      return AVERAGE(ref1);

     case 102:
      return COUNT(ref1);

     case 103:
      return COUNTA(ref1);

     case 104:
      return MAX(ref1);

     case 105:
      return MIN(ref1);

     case 106:
      return PRODUCT(ref1);

     case 107:
      return STDEV.S(ref1);

     case 108:
      return STDEV.P(ref1);

     case 109:
      return SUM(ref1);

     case 110:
      return VAR.S(ref1);

     case 111:
      return VAR.P(ref1);
    }
  }
  function ADD(num1, num2) {
    if (arguments.length !== 2) {
      return na;
    }
    num1 = parseNumber(num1);
    num2 = parseNumber(num2);
    var anyError$1 = anyError(num1, num2);
    if (anyError$1) {
      return anyError$1;
    }
    return num1 + num2;
  }
  function MINUS(num1, num2) {
    if (arguments.length !== 2) {
      return na;
    }
    num1 = parseNumber(num1);
    num2 = parseNumber(num2);
    var anyError$1 = anyError(num1, num2);
    if (anyError$1) {
      return anyError$1;
    }
    return num1 - num2;
  }
  function DIVIDE(dividend, divisor) {
    if (arguments.length !== 2) {
      return na;
    }
    dividend = parseNumber(dividend);
    divisor = parseNumber(divisor);
    var anyError$1 = anyError(dividend, divisor);
    if (anyError$1) {
      return anyError$1;
    }
    if (divisor === 0) {
      return div0;
    }
    return dividend / divisor;
  }
  function MULTIPLY(factor1, factor2) {
    if (arguments.length !== 2) {
      return na;
    }
    factor1 = parseNumber(factor1);
    factor2 = parseNumber(factor2);
    var anyError$1 = anyError(factor1, factor2);
    if (anyError$1) {
      return anyError$1;
    }
    return factor1 * factor2;
  }
  function GT(num1, num2) {
    if (arguments.length !== 2) {
      return na;
    }
    if (num1 instanceof Error) {
      return num1;
    }
    if (num2 instanceof Error) {
      return num2;
    }
    if (anyIsString(num1, num2)) {
      num1 = parseString(num1);
      num2 = parseString(num2);
    } else {
      num1 = parseNumber(num1);
      num2 = parseNumber(num2);
    }
    var anyError$1 = anyError(num1, num2);
    if (anyError$1) {
      return anyError$1;
    }
    return num1 > num2;
  }
  function GTE(num1, num2) {
    if (arguments.length !== 2) {
      return na;
    }
    if (anyIsString(num1, num2)) {
      num1 = parseString(num1);
      num2 = parseString(num2);
    } else {
      num1 = parseNumber(num1);
      num2 = parseNumber(num2);
    }
    var anyError$1 = anyError(num1, num2);
    if (anyError$1) {
      return anyError$1;
    }
    return num1 >= num2;
  }
  function LT(num1, num2) {
    if (arguments.length !== 2) {
      return na;
    }
    if (anyIsString(num1, num2)) {
      num1 = parseString(num1);
      num2 = parseString(num2);
    } else {
      num1 = parseNumber(num1);
      num2 = parseNumber(num2);
    }
    var anyError$1 = anyError(num1, num2);
    if (anyError$1) {
      return anyError$1;
    }
    return num1 < num2;
  }
  function LTE(num1, num2) {
    if (arguments.length !== 2) {
      return na;
    }
    if (anyIsString(num1, num2)) {
      num1 = parseString(num1);
      num2 = parseString(num2);
    } else {
      num1 = parseNumber(num1);
      num2 = parseNumber(num2);
    }
    var anyError$1 = anyError(num1, num2);
    if (anyError$1) {
      return anyError$1;
    }
    return num1 <= num2;
  }
  function EQ(value1, value2) {
    if (arguments.length !== 2) {
      return na;
    }
    if (value1 instanceof Error) {
      return value1;
    }
    if (value2 instanceof Error) {
      return value2;
    }
    if (value1 === null) {
      value1 = undefined;
    }
    if (value2 === null) {
      value2 = undefined;
    }
    return value1 === value2;
  }
  function NE(value1, value2) {
    if (arguments.length !== 2) {
      return na;
    }
    if (value1 instanceof Error) {
      return value1;
    }
    if (value2 instanceof Error) {
      return value2;
    }
    if (value1 === null) {
      value1 = undefined;
    }
    if (value2 === null) {
      value2 = undefined;
    }
    return value1 !== value2;
  }
  function POW(base, exponent) {
    if (arguments.length !== 2) {
      return na;
    }
    return POWER(base, exponent);
  }
  function SUM() {
    var result = 0;
    arrayEach(argsToArray(arguments), (function(value) {
      if (result instanceof Error) {
        return false;
      } else if (value instanceof Error) {
        result = value;
      } else if (typeof value === "number") {
        result += value;
      } else if (typeof value === "string") {
        var parsed = parseFloat(value);
        !isNaN(parsed) && (result += parsed);
      } else if (Array.isArray(value)) {
        var inner_result = SUM.apply(null, value);
        if (inner_result instanceof Error) {
          result = inner_result;
        } else {
          result += inner_result;
        }
      }
    }));
    return result;
  }
  function SUMIF(range, criteria, sum_range) {
    range = flatten(range);
    sum_range = sum_range ? flatten(sum_range) : range;
    if (range instanceof Error) {
      return range;
    }
    if (criteria === undefined || criteria === null || criteria instanceof Error) {
      return 0;
    }
    var result = 0;
    var isWildcard = criteria === "*";
    var tokenizedCriteria = isWildcard ? null : parse(criteria + "");
    for (var i = 0; i < range.length; i++) {
      var _value6 = range[i];
      var sumValue = sum_range[i];
      if (isWildcard) {
        result += _value6;
      } else {
        var tokens = [ createToken(_value6, TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
        result += compute(tokens) ? sumValue : 0;
      }
    }
    return result;
  }
  function SUMIFS() {
    var args = argsToArray(arguments);
    var range = parseNumberArray(flatten(args.shift()));
    if (range instanceof Error) {
      return range;
    }
    var criterias = args;
    var criteriaLength = criterias.length / 2;
    for (var i = 0; i < criteriaLength; i++) {
      criterias[i * 2] = flatten(criterias[i * 2]);
    }
    var result = 0;
    for (var _i13 = 0; _i13 < range.length; _i13++) {
      var isMeetCondition = false;
      for (var j = 0; j < criteriaLength; j++) {
        var valueToTest = criterias[j * 2][_i13];
        var criteria = criterias[j * 2 + 1];
        var isWildcard = criteria === void 0 || criteria === "*";
        var computedResult = false;
        if (isWildcard) {
          computedResult = true;
        } else {
          var tokenizedCriteria = parse(criteria + "");
          var tokens = [ createToken(valueToTest, TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
          computedResult = compute(tokens);
        }
        if (!computedResult) {
          isMeetCondition = false;
          break;
        }
        isMeetCondition = true;
      }
      if (isMeetCondition) {
        result += range[_i13];
      }
    }
    return result;
  }
  function SUMPRODUCT() {
    if (!arguments || arguments.length === 0) {
      return value;
    }
    var arrays = arguments.length + 1;
    var result = 0;
    var product;
    var k;
    var _i;
    var _ij;
    for (var i = 0; i < arguments[0].length; i++) {
      if (!(arguments[0][i] instanceof Array)) {
        product = 1;
        for (k = 1; k < arrays; k++) {
          var _i_arg = arguments[k - 1][i];
          if (_i_arg instanceof Error) {
            return _i_arg;
          }
          _i = parseNumber(_i_arg);
          if (_i instanceof Error) {
            return _i;
          }
          product *= _i;
        }
        result += product;
      } else {
        for (var j = 0; j < arguments[0][i].length; j++) {
          product = 1;
          for (k = 1; k < arrays; k++) {
            var _ij_arg = arguments[k - 1][i][j];
            if (_ij_arg instanceof Error) {
              return _ij_arg;
            }
            _ij = parseNumber(_ij_arg);
            if (_ij instanceof Error) {
              return _ij;
            }
            product *= _ij;
          }
          result += product;
        }
      }
    }
    return result;
  }
  function SUMSQ() {
    var numbers = parseNumberArray(flatten(arguments));
    if (numbers instanceof Error) {
      return numbers;
    }
    var result = 0;
    var length = numbers.length;
    for (var i = 0; i < length; i++) {
      result += ISNUMBER(numbers[i]) ? numbers[i] * numbers[i] : 0;
    }
    return result;
  }
  function SUMX2MY2(array_x, array_y) {
    array_x = parseNumberArray(flatten(array_x));
    array_y = parseNumberArray(flatten(array_y));
    if (anyIsError(array_x, array_y)) {
      return value;
    }
    var result = 0;
    for (var i = 0; i < array_x.length; i++) {
      result += array_x[i] * array_x[i] - array_y[i] * array_y[i];
    }
    return result;
  }
  function SUMX2PY2(array_x, array_y) {
    array_x = parseNumberArray(flatten(array_x));
    array_y = parseNumberArray(flatten(array_y));
    if (anyIsError(array_x, array_y)) {
      return value;
    }
    var result = 0;
    array_x = parseNumberArray(flatten(array_x));
    array_y = parseNumberArray(flatten(array_y));
    for (var i = 0; i < array_x.length; i++) {
      result += array_x[i] * array_x[i] + array_y[i] * array_y[i];
    }
    return result;
  }
  function SUMXMY2(array_x, array_y) {
    array_x = parseNumberArray(flatten(array_x));
    array_y = parseNumberArray(flatten(array_y));
    if (anyIsError(array_x, array_y)) {
      return value;
    }
    var result = 0;
    array_x = flatten(array_x);
    array_y = flatten(array_y);
    for (var i = 0; i < array_x.length; i++) {
      result += Math.pow(array_x[i] - array_y[i], 2);
    }
    return result;
  }
  function TAN(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    return Math.tan(number);
  }
  function TANH(number) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var e2 = Math.exp(2 * number);
    return (e2 - 1) / (e2 + 1);
  }
  function TRUNC(number, num_digits) {
    number = parseNumber(number);
    num_digits = parseNumber(num_digits);
    var anyError$1 = anyError(number, num_digits);
    if (anyError$1) {
      return anyError$1;
    }
    var sign = number > 0 ? 1 : -1;
    return sign * Math.floor(Math.abs(number) * Math.pow(10, num_digits)) / Math.pow(10, num_digits);
  }
  /*!
   *  decimal.js v10.4.3
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   */  var EXP_LIMIT = 9e15, MAX_DIGITS = 1e9, NUMERALS = "0123456789abcdef", LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", DEFAULTS = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -EXP_LIMIT,
    maxE: EXP_LIMIT,
    crypto: false
  }, inexact, quadrant, external = true, decimalError = "[DecimalError] ", invalidArgument = decimalError + "Invalid argument: ", precisionLimitExceeded = decimalError + "Precision limit exceeded", cryptoUnavailable = decimalError + "crypto unavailable", tag = "[object Decimal]", mathfloor = Math.floor, mathpow = Math.pow, isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, BASE = 1e7, LOG_BASE = 7, MAX_SAFE_INTEGER = 9007199254740991, LN10_PRECISION = LN10.length - 1, PI_PRECISION = PI.length - 1, P = {
    toStringTag: tag
  };
  P.absoluteValue = P.abs = function() {
    var x = new this.constructor(this);
    if (x.s < 0) x.s = 1;
    return finalise(x);
  };
  P.ceil = function() {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };
  P.clampedTo = P.clamp = function(min, max) {
    var k, x = this, Ctor = x.constructor;
    min = new Ctor(min);
    max = new Ctor(max);
    if (!min.s || !max.s) return new Ctor(NaN);
    if (min.gt(max)) throw Error(invalidArgument + max);
    k = x.cmp(min);
    return k < 0 ? min : x.cmp(max) > 0 ? max : new Ctor(x);
  };
  P.comparedTo = P.cmp = function(y) {
    var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }
    if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
    if (xs !== ys) return xs;
    if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
    xdL = xd.length;
    ydL = yd.length;
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };
  P.cosine = P.cos = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.d) return new Ctor(NaN);
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
  P.cubeRoot = P.cbrt = function() {
    var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    external = false;
    s = x.s * mathpow(x.s * x, 1 / 3);
    if (!s || Math.abs(s) == 1 / 0) {
      n = digitsToString(x.d);
      e = x.e;
      if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
      s = mathpow(n, 1 / 3);
      e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
      if (s == 1 / 0) {
        n = "5e" + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e;
      }
      r = new Ctor(n);
      r.s = x.s;
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for (;;) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x);
      r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);
        if (n == "9999" || !rep && n == "4999") {
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
          if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
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
  P.decimalPlaces = P.dp = function() {
    var w, d = this.d, n = NaN;
    if (d) {
      w = d.length - 1;
      n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
      w = d[w];
      if (w) for (;w % 10 == 0; w /= 10) {
        n--;
      }
      if (n < 0) n = 0;
    }
    return n;
  };
  P.dividedBy = P.div = function(y) {
    return divide(this, new this.constructor(y));
  };
  P.dividedToIntegerBy = P.divToInt = function(y) {
    var x = this, Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
  };
  P.equals = P.eq = function(y) {
    return this.cmp(y) === 0;
  };
  P.floor = function() {
    return finalise(new this.constructor(this), this.e + 1, 3);
  };
  P.greaterThan = P.gt = function(y) {
    return this.cmp(y) > 0;
  };
  P.greaterThanOrEqualTo = P.gte = function(y) {
    var k = this.cmp(y);
    return k == 1 || k === 0;
  };
  P.hyperbolicCosine = P.cosh = function() {
    var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
    if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero()) return one;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      n = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      n = "2.3283064365386962890625e-10";
    }
    x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
    var cosh2_x, i = k, d8 = new Ctor(8);
    for (;i--; ) {
      cosh2_x = x.times(x);
      x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }
    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.hyperbolicSine = P.sinh = function() {
    var k, pr, rm, len, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 3) {
      x = taylorSeries(Ctor, 2, x, x, true);
    } else {
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;
      x = x.times(1 / tinyPow(5, k));
      x = taylorSeries(Ctor, 2, x, x, true);
      var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
      for (;k--; ) {
        sinh2_x = x.times(x);
        x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(x, pr, rm, true);
  };
  P.hyperbolicTangent = P.tanh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite()) return new Ctor(x.s);
    if (x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;
    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };
  P.inverseCosine = P.acos = function() {
    var halfPi, x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
    if (k !== -1) {
      return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
    }
    if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(.5);
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(.5);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return halfPi.minus(x);
  };
  P.inverseHyperbolicCosine = P.acosh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
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
  P.inverseHyperbolicSine = P.asinh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
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
  P.inverseHyperbolicTangent = P.atanh = function() {
    var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
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
    return x.times(.5);
  };
  P.inverseSine = P.asin = function() {
    var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
    if (x.isZero()) return new Ctor(x);
    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (k !== -1) {
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(.5);
        halfPi.s = x.s;
        return halfPi;
      }
      return new Ctor(NaN);
    }
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(2);
  };
  P.inverseTangent = P.atan = function() {
    var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
    if (!x.isFinite()) {
      if (!x.s) return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(.5);
        r.s = x.s;
        return r;
      }
    } else if (x.isZero()) {
      return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(.25);
      r.s = x.s;
      return r;
    }
    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;
    k = Math.min(28, wpr / LOG_BASE + 2 | 0);
    for (i = k; i; --i) {
      x = x.div(x.times(x).plus(1).sqrt().plus(1));
    }
    external = false;
    j = Math.ceil(wpr / LOG_BASE);
    n = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;
    for (;i !== -1; ) {
      px = px.times(x2);
      t = r.minus(px.div(n += 2));
      px = px.times(x2);
      r = t.plus(px.div(n += 2));
      if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--; ) {
      }
    }
    if (k) r = r.times(2 << k - 1);
    external = true;
    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
  };
  P.isFinite = function() {
    return !!this.d;
  };
  P.isInteger = P.isInt = function() {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = P.isNeg = function() {
    return this.s < 0;
  };
  P.isPositive = P.isPos = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.d && this.d[0] === 0;
  };
  P.lessThan = P.lt = function(y) {
    return this.cmp(y) < 0;
  };
  P.lessThanOrEqualTo = P.lte = function(y) {
    return this.cmp(y) < 1;
  };
  P.logarithm = P.log = function(base) {
    var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
    if (base == null) {
      base = new Ctor(10);
      isBase10 = true;
    } else {
      base = new Ctor(base);
      d = base.d;
      if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
      isBase10 = base.eq(10);
    }
    d = arg.d;
    if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
      return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
    }
    if (isBase10) {
      if (d.length > 1) {
        inf = true;
      } else {
        for (k = d[0]; k % 10 === 0; ) {
          k /= 10;
        }
        inf = k !== 1;
      }
    }
    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
    r = divide(num, denominator, sd, 1);
    if (checkRoundingDigits(r.d, k = pr, rm)) {
      do {
        sd += 10;
        num = naturalLogarithm(arg, sd);
        denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
        r = divide(num, denominator, sd, 1);
        if (!inf) {
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
  P.minus = P.sub = function(y) {
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.d) {
      if (!x.s || !y.s) y = new Ctor(NaN); else if (x.d) y.s = -y.s; else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
      return y;
    }
    if (x.s != y.s) {
      y.s = -y.s;
      return x.plus(y);
    }
    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (yd[0]) y.s = -y.s; else if (xd[0]) y = new Ctor(x); else return new Ctor(rm === 3 ? -0 : 0);
      return external ? finalise(y, pr, rm) : y;
    }
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);
    xd = xd.slice();
    k = xe - e;
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
      i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
      if (k > i) {
        k = i;
        d.length = 1;
      }
      d.reverse();
      for (i = k; i--; ) {
        d.push(0);
      }
      d.reverse();
    } else {
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
    for (i = yd.length - len; i > 0; --i) {
      xd[len++] = 0;
    }
    for (i = yd.length; i > k; ) {
      if (xd[--i] < yd[i]) {
        for (j = i; j && xd[--j] === 0; ) {
          xd[j] = BASE - 1;
        }
        --xd[j];
        xd[i] += BASE;
      }
      xd[i] -= yd[i];
    }
    for (;xd[--len] === 0; ) {
      xd.pop();
    }
    for (;xd[0] === 0; xd.shift()) {
      --e;
    }
    if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
    y.d = xd;
    y.e = getBase10Exponent(xd, e);
    return external ? finalise(y, pr, rm) : y;
  };
  P.modulo = P.mod = function(y) {
    var q, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
    if (!y.d || x.d && !x.d[0]) {
      return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }
    external = false;
    if (Ctor.modulo == 9) {
      q = divide(x, y.abs(), 0, 3, 1);
      q.s *= y.s;
    } else {
      q = divide(x, y, 0, Ctor.modulo, 1);
    }
    q = q.times(y);
    external = true;
    return x.minus(q);
  };
  P.naturalExponential = P.exp = function() {
    return naturalExponential(this);
  };
  P.naturalLogarithm = P.ln = function() {
    return naturalLogarithm(this);
  };
  P.negated = P.neg = function() {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
  };
  P.plus = P.add = function(y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.d) {
      if (!x.s || !y.s) y = new Ctor(NaN); else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
      return y;
    }
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }
    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
      if (!yd[0]) y = new Ctor(x);
      return external ? finalise(y, pr, rm) : y;
    }
    k = mathfloor(x.e / LOG_BASE);
    e = mathfloor(y.e / LOG_BASE);
    xd = xd.slice();
    i = k - e;
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
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;
      if (i > len) {
        i = len;
        d.length = 1;
      }
      d.reverse();
      for (;i--; ) {
        d.push(0);
      }
      d.reverse();
    }
    len = xd.length;
    i = yd.length;
    if (len - i < 0) {
      i = len;
      d = yd;
      yd = xd;
      xd = d;
    }
    for (carry = 0; i; ) {
      carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
      xd[i] %= BASE;
    }
    if (carry) {
      xd.unshift(carry);
      ++e;
    }
    for (len = xd.length; xd[--len] == 0; ) {
      xd.pop();
    }
    y.d = xd;
    y.e = getBase10Exponent(xd, e);
    return external ? finalise(y, pr, rm) : y;
  };
  P.precision = P.sd = function(z) {
    var k, x = this;
    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
    if (x.d) {
      k = getPrecision(x.d);
      if (z && x.e + 1 > k) k = x.e + 1;
    } else {
      k = NaN;
    }
    return k;
  };
  P.round = function() {
    var x = this, Ctor = x.constructor;
    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
  };
  P.sine = P.sin = function() {
    var pr, rm, x = this, Ctor = x.constructor;
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
  P.squareRoot = P.sqrt = function() {
    var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }
    external = false;
    s = Math.sqrt(+x);
    if (s == 0 || s == 1 / 0) {
      n = digitsToString(d);
      if ((n.length + e) % 2 == 0) n += "0";
      s = Math.sqrt(n);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n = "5e" + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e;
      }
      r = new Ctor(n);
    } else {
      r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for (;;) {
      t = r;
      r = t.plus(divide(x, t, sd + 2, 1)).times(.5);
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);
        if (n == "9999" || !rep && n == "4999") {
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
          if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
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
  P.tangent = P.tan = function() {
    var pr, rm, x = this, Ctor = x.constructor;
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
  P.times = P.mul = function(y) {
    var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
    y.s *= x.s;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
    }
    e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }
    r = [];
    rL = xdL + ydL;
    for (i = rL; i--; ) {
      r.push(0);
    }
    for (i = ydL; --i >= 0; ) {
      carry = 0;
      for (k = xdL + i; k > i; ) {
        t = r[k] + yd[i] * xd[k - i - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }
      r[k] = (r[k] + carry) % BASE | 0;
    }
    for (;!r[--rL]; ) {
      r.pop();
    }
    if (carry) ++e; else r.shift();
    y.d = r;
    y.e = getBase10Exponent(r, e);
    return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
  };
  P.toBinary = function(sd, rm) {
    return toStringBinary(this, 2, sd, rm);
  };
  P.toDecimalPlaces = P.toDP = function(dp, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (dp === void 0) return x;
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding; else checkInt32(rm, 0, 8);
    return finalise(x, dp + x.e + 1, rm);
  };
  P.toExponential = function(dp, rm) {
    var str, x = this, Ctor = x.constructor;
    if (dp === void 0) {
      str = finiteToString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding; else checkInt32(rm, 0, 8);
      x = finalise(new Ctor(x), dp + 1, rm);
      str = finiteToString(x, true, dp + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toFixed = function(dp, rm) {
    var str, y, x = this, Ctor = x.constructor;
    if (dp === void 0) {
      str = finiteToString(x);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding; else checkInt32(rm, 0, 8);
      y = finalise(new Ctor(x), dp + x.e + 1, rm);
      str = finiteToString(y, false, dp + y.e + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toFraction = function(maxD) {
    var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
    if (!xd) return new Ctor(x);
    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);
    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x.e - 1;
    k = e % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
    if (maxD == null) {
      maxD = e > 0 ? d : n1;
    } else {
      n = new Ctor(maxD);
      if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
      maxD = n.gt(d) ? e > 0 ? d : n1 : n;
    }
    external = false;
    n = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;
    for (;;) {
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
    r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [ n1, d1 ] : [ n0, d0 ];
    Ctor.precision = pr;
    external = true;
    return r;
  };
  P.toHexadecimal = P.toHex = function(sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };
  P.toNearest = function(y, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (y == null) {
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
      if (!x.d) return y.s ? x : y;
      if (!y.d) {
        if (y.s) y.s = x.s;
        return y;
      }
    }
    if (y.d[0]) {
      external = false;
      x = divide(x, y, 0, rm, 1).times(y);
      external = true;
      finalise(x);
    } else {
      y.s = x.s;
      x = y;
    }
    return x;
  };
  P.toNumber = function() {
    return +this;
  };
  P.toOctal = function(sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };
  P.toPower = P.pow = function(y) {
    var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
    if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
    x = new Ctor(x);
    if (x.eq(1)) return x;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (y.eq(1)) return finalise(x, pr, rm);
    e = mathfloor(y.e / LOG_BASE);
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x, k, pr);
      return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }
    s = x.s;
    if (s < 0) {
      if (e < y.d.length - 1) return new Ctor(NaN);
      if ((y.d[e] & 1) == 0) s = 1;
      if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
        x.s = s;
        return x;
      }
    }
    k = mathpow(+x, yn);
    e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
    external = false;
    Ctor.rounding = x.s = 1;
    k = Math.min(12, (e + "").length);
    r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
    if (r.d) {
      r = finalise(r, pr + 5, 1);
      if (checkRoundingDigits(r.d, pr, rm)) {
        e = pr + 10;
        r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
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
  P.toPrecision = function(sd, rm) {
    var str, x = this, Ctor = x.constructor;
    if (sd === void 0) {
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding; else checkInt32(rm, 0, 8);
      x = finalise(new Ctor(x), sd, rm);
      str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.toSignificantDigits = P.toSD = function(sd, rm) {
    var x = this, Ctor = x.constructor;
    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding; else checkInt32(rm, 0, 8);
    }
    return finalise(new Ctor(x), sd, rm);
  };
  P.toString = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() && !x.isZero() ? "-" + str : str;
  };
  P.truncated = P.trunc = function() {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };
  P.valueOf = P.toJSON = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() ? "-" + str : str;
  };
  function digitsToString(d) {
    var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
    if (indexOfLastWord > 0) {
      str += w;
      for (i = 1; i < indexOfLastWord; i++) {
        ws = d[i] + "";
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
        str += ws;
      }
      w = d[i];
      ws = w + "";
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
    } else if (w === 0) {
      return "0";
    }
    for (;w % 10 === 0; ) {
      w /= 10;
    }
    return str + w;
  }
  function checkInt32(i, min, max) {
    if (i !== ~~i || i < min || i > max) {
      throw Error(invalidArgument + i);
    }
  }
  function checkRoundingDigits(d, i, rm, repeating) {
    var di, k, r, rd;
    for (k = d[0]; k >= 10; k /= 10) {
      --i;
    }
    if (--i < 0) {
      i += LOG_BASE;
      di = 0;
    } else {
      di = Math.ceil((i + 1) / LOG_BASE);
      i %= LOG_BASE;
    }
    k = mathpow(10, LOG_BASE - i);
    rd = d[di] % k | 0;
    if (repeating == null) {
      if (i < 3) {
        if (i == 0) rd = rd / 100 | 0; else if (i == 1) rd = rd / 10 | 0;
        r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
      } else {
        r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
      }
    } else {
      if (i < 4) {
        if (i == 0) rd = rd / 1e3 | 0; else if (i == 1) rd = rd / 100 | 0; else if (i == 2) rd = rd / 10 | 0;
        r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
      } else {
        r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
      }
    }
    return r;
  }
  function convertBase(str, baseIn, baseOut) {
    var j, arr = [ 0 ], arrL, i = 0, strL = str.length;
    for (;i < strL; ) {
      for (arrL = arr.length; arrL--; ) {
        arr[arrL] *= baseIn;
      }
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
  function cosine(Ctor, x) {
    var k, len, y;
    if (x.isZero()) return x;
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      y = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      y = "2.3283064365386962890625e-10";
    }
    Ctor.precision += k;
    x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
    for (var i = k; i--; ) {
      var cos2x = x.times(x);
      x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }
    Ctor.precision -= k;
    return x;
  }
  var divide = function() {
    function multiplyInteger(x, k, base) {
      var temp, carry = 0, i = x.length;
      for (x = x.slice(); i--; ) {
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
      for (;aL--; ) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }
      for (;!a[0] && a.length > 1; ) {
        a.shift();
      }
    }
    return function(x, y, pr, rm, dp, base) {
      var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
      if (!xd || !xd[0] || !yd || !yd[0]) {
        return new Ctor(!x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
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
      for (i = 0; yd[i] == (xd[i] || 0); i++) {
      }
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
        sd = sd / logBase + 2 | 0;
        i = 0;
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;
          for (;(i < xL || k) && sd--; i++) {
            t = k * base + (xd[i] || 0);
            qd[i] = t / yd | 0;
            k = t % yd | 0;
          }
          more = k || i < xL;
        } else {
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
          for (;remL < yL; ) {
            rem[remL++] = 0;
          }
          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];
          if (yd[1] >= base / 2) ++yd0;
          do {
            k = 0;
            cmp = compare(yd, rem, yL, remL);
            if (cmp < 0) {
              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
              k = rem0 / yd0 | 0;
              if (k > 1) {
                if (k >= base) k = base - 1;
                prod = multiplyInteger(yd, k, base);
                prodL = prod.length;
                remL = rem.length;
                cmp = compare(prod, rem, prodL, remL);
                if (cmp == 1) {
                  k--;
                  subtract(prod, yL < prodL ? yz : yd, prodL, base);
                }
              } else {
                if (k == 0) cmp = k = 1;
                prod = yd.slice();
              }
              prodL = prod.length;
              if (prodL < remL) prod.unshift(0);
              subtract(rem, prod, remL, base);
              if (cmp == -1) {
                remL = rem.length;
                cmp = compare(yd, rem, yL, remL);
                if (cmp < 1) {
                  k++;
                  subtract(rem, yL < remL ? yz : yd, remL, base);
                }
              }
              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [ 0 ];
            }
            qd[i++] = k;
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [ xd[xi] ];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] !== void 0) && sd--);
          more = rem[0] !== void 0;
        }
        if (!qd[0]) qd.shift();
      }
      if (logBase == 1) {
        q.e = e;
        inexact = more;
      } else {
        for (i = 1, k = qd[0]; k >= 10; k /= 10) {
          i++;
        }
        q.e = i + e * logBase - 1;
        finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
      }
      return q;
    };
  }();
  function finalise(x, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
    out: if (sd != null) {
      xd = x.d;
      if (!xd) return x;
      for (digits = 1, k = xd[0]; k >= 10; k /= 10) {
        digits++;
      }
      i = sd - digits;
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];
        rd = w / mathpow(10, digits - j - 1) % 10 | 0;
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) {
          if (isTruncated) {
            for (;k++ <= xdi; ) {
              xd.push(0);
            }
            w = rd = 0;
            digits = 1;
            i %= LOG_BASE;
            j = i - LOG_BASE + 1;
          } else {
            break out;
          }
        } else {
          w = k = xd[xdi];
          for (digits = 1; k >= 10; k /= 10) {
            digits++;
          }
          i %= LOG_BASE;
          j = i - LOG_BASE + digits;
          rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
        }
      }
      isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
      roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
      if (sd < 1 || !xd[0]) {
        xd.length = 0;
        if (roundUp) {
          sd -= x.e + 1;
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = -sd || 0;
        } else {
          xd[0] = x.e = 0;
        }
        return x;
      }
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);
        xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
      }
      if (roundUp) {
        for (;;) {
          if (xdi == 0) {
            for (i = 1, j = xd[0]; j >= 10; j /= 10) {
              i++;
            }
            j = xd[0] += k;
            for (k = 1; j >= 10; j /= 10) {
              k++;
            }
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
      for (i = xd.length; xd[--i] === 0; ) {
        xd.pop();
      }
    }
    if (external) {
      if (x.e > Ctor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < Ctor.minE) {
        x.e = 0;
        x.d = [ 0 ];
      }
    }
    return x;
  }
  function finiteToString(x, isExp, sd) {
    if (!x.isFinite()) return nonFiniteToString(x);
    var k, e = x.e, str = digitsToString(x.d), len = str.length;
    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + "." + str.slice(1);
      }
      str = str + (x.e < 0 ? "e" : "e+") + x.e;
    } else if (e < 0) {
      str = "0." + getZeroString(-e - 1) + str;
      if (sd && (k = sd - len) > 0) str += getZeroString(k);
    } else if (e >= len) {
      str += getZeroString(e + 1 - len);
      if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
    } else {
      if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e + 1 === len) str += ".";
        str += getZeroString(k);
      }
    }
    return str;
  }
  function getBase10Exponent(digits, e) {
    var w = digits[0];
    for (e *= LOG_BASE; w >= 10; w /= 10) {
      e++;
    }
    return e;
  }
  function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {
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
    var w = digits.length - 1, len = w * LOG_BASE + 1;
    w = digits[w];
    if (w) {
      for (;w % 10 == 0; w /= 10) {
        len--;
      }
      for (w = digits[0]; w >= 10; w /= 10) {
        len++;
      }
    }
    return len;
  }
  function getZeroString(k) {
    var zs = "";
    for (;k--; ) {
      zs += "0";
    }
    return zs;
  }
  function intPow(Ctor, x, n, pr) {
    var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
    external = false;
    for (;;) {
      if (n % 2) {
        r = r.times(x);
        if (truncate(r.d, k)) isTruncated = true;
      }
      n = mathfloor(n / 2);
      if (n === 0) {
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
  function maxOrMin(Ctor, args, ltgt) {
    var y, x = new Ctor(args[0]), i = 0;
    for (;++i < args.length; ) {
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
  function naturalExponential(x, sd) {
    var denominator, guard, j, pow, sum, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (!x.d || !x.d[0] || x.e > 17) {
      return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }
    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }
    t = new Ctor(.03125);
    while (x.e > -2) {
      x = x.times(t);
      k += 5;
    }
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
        while (j--) {
          sum = finalise(sum.times(sum), wpr, 1);
        }
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
  function naturalLogarithm(y, sd) {
    var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
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
    if (Math.abs(e = x.e) < 15e14) {
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n++;
      }
      e = x.e;
      if (c0 > 1) {
        x = new Ctor("0." + c);
        e++;
      } else {
        x = new Ctor(c0 + "." + c.slice(1));
      }
    } else {
      t = getLn10(Ctor, wpr + 2, pr).times(e + "");
      x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;
      return sd == null ? finalise(x, pr, rm, external = true) : x;
    }
    x1 = x;
    sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
    denominator = 3;
    for (;;) {
      numerator = finalise(numerator.times(x2), wpr, 1);
      t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));
      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        sum = sum.times(2);
        if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
        sum = divide(sum, new Ctor(n), wpr, 1);
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
  function nonFiniteToString(x) {
    return String(x.s * x.s / 0);
  }
  function parseDecimal(x, str) {
    var e, i, len;
    if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
    if ((i = str.search(/e/i)) > 0) {
      if (e < 0) e = i;
      e += +str.slice(i + 1);
      str = str.substring(0, i);
    } else if (e < 0) {
      e = str.length;
    }
    for (i = 0; str.charCodeAt(i) === 48; i++) {
    }
    for (len = str.length; str.charCodeAt(len - 1) === 48; --len) {
    }
    str = str.slice(i, len);
    if (str) {
      len -= i;
      x.e = e = e - i - 1;
      x.d = [];
      i = (e + 1) % LOG_BASE;
      if (e < 0) i += LOG_BASE;
      if (i < len) {
        if (i) x.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len; ) {
          x.d.push(+str.slice(i, i += LOG_BASE));
        }
        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }
      for (;i--; ) {
        str += "0";
      }
      x.d.push(+str);
      if (external) {
        if (x.e > x.constructor.maxE) {
          x.d = null;
          x.e = NaN;
        } else if (x.e < x.constructor.minE) {
          x.e = 0;
          x.d = [ 0 ];
        }
      }
    } else {
      x.e = 0;
      x.d = [ 0 ];
    }
    return x;
  }
  function parseOther(x, str) {
    var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
    if (str.indexOf("_") > -1) {
      str = str.replace(/(\d)_(?=\d)/g, "$1");
      if (isDecimal.test(str)) return parseDecimal(x, str);
    } else if (str === "Infinity" || str === "NaN") {
      if (!+str) x.s = NaN;
      x.e = NaN;
      x.d = null;
      return x;
    }
    if (isHex.test(str)) {
      base = 16;
      str = str.toLowerCase();
    } else if (isBinary.test(str)) {
      base = 2;
    } else if (isOctal.test(str)) {
      base = 8;
    } else {
      throw Error(invalidArgument + str);
    }
    i = str.search(/p/i);
    if (i > 0) {
      p = +str.slice(i + 1);
      str = str.substring(2, i);
    } else {
      str = str.slice(2);
    }
    i = str.indexOf(".");
    isFloat = i >= 0;
    Ctor = x.constructor;
    if (isFloat) {
      str = str.replace(".", "");
      len = str.length;
      i = len - i;
      divisor = intPow(Ctor, new Ctor(base), i, i * 2);
    }
    xd = convertBase(str, base, BASE);
    xe = xd.length - 1;
    for (i = xe; xd[i] === 0; --i) {
      xd.pop();
    }
    if (i < 0) return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;
    if (isFloat) x = divide(x, divisor, len * 4);
    if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
    external = true;
    return x;
  }
  function sine(Ctor, x) {
    var k, len = x.d.length;
    if (len < 3) {
      return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
    }
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x);
    var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (;k--; ) {
      sin2_x = x.times(x);
      x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }
    return x;
  }
  function taylorSeries(Ctor, n, x, y, isHyperbolic) {
    var j, t, u, x2, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
    external = false;
    x2 = x.times(x);
    u = new Ctor(y);
    for (;;) {
      t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
      t = u.plus(y);
      if (t.d[k] !== void 0) {
        for (j = k; t.d[j] === u.d[j] && j--; ) {
        }
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
  function tinyPow(b, e) {
    var n = b;
    while (--e) {
      n *= b;
    }
    return n;
  }
  function toLessThanHalfPi(Ctor, x) {
    var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(.5);
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
      if (x.lte(halfPi)) {
        quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
        return x;
      }
      quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
    }
    return x.minus(pi).abs();
  }
  function toStringBinary(x, baseOut, sd, rm) {
    var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
    if (isExp) {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding; else checkInt32(rm, 0, 8);
    } else {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    }
    if (!x.isFinite()) {
      str = nonFiniteToString(x);
    } else {
      str = finiteToString(x);
      i = str.indexOf(".");
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
      if (i >= 0) {
        str = str.replace(".", "");
        y = new Ctor(1);
        y.e = str.length - i;
        y.d = convertBase(finiteToString(y), 10, base);
        y.e = y.d.length;
      }
      xd = convertBase(str, 10, base);
      e = len = xd.length;
      for (;xd[--len] == 0; ) {
        xd.pop();
      }
      if (!xd[0]) {
        str = isExp ? "0p+0" : "0";
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
        i = xd[sd];
        k = base / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;
        roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
        xd.length = sd;
        if (roundUp) {
          for (;++xd[--sd] > base - 1; ) {
            xd[sd] = 0;
            if (!sd) {
              ++e;
              xd.unshift(1);
            }
          }
        }
        for (len = xd.length; !xd[len - 1]; --len) {
        }
        for (i = 0, str = ""; i < len; i++) {
          str += NUMERALS.charAt(xd[i]);
        }
        if (isExp) {
          if (len > 1) {
            if (baseOut == 16 || baseOut == 8) {
              i = baseOut == 16 ? 4 : 3;
              for (--len; len % i; len++) {
                str += "0";
              }
              xd = convertBase(str, base, baseOut);
              for (len = xd.length; !xd[len - 1]; --len) {
              }
              for (i = 1, str = "1."; i < len; i++) {
                str += NUMERALS.charAt(xd[i]);
              }
            } else {
              str = str.charAt(0) + "." + str.slice(1);
            }
          }
          str = str + (e < 0 ? "p" : "p+") + e;
        } else if (e < 0) {
          for (;++e; ) {
            str = "0" + str;
          }
          str = "0." + str;
        } else {
          if (++e > len) for (e -= len; e--; ) {
            str += "0";
          } else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
        }
      }
      str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
    }
    return x.s < 0 ? "-" + str : str;
  }
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }
  function abs(x) {
    return new this(x).abs();
  }
  function acos(x) {
    return new this(x).acos();
  }
  function acosh(x) {
    return new this(x).acosh();
  }
  function add(x, y) {
    return new this(x).plus(y);
  }
  function asin(x) {
    return new this(x).asin();
  }
  function asinh(x) {
    return new this(x).asinh();
  }
  function atan(x) {
    return new this(x).atan();
  }
  function atanh(x) {
    return new this(x).atanh();
  }
  function atan2(y, x) {
    y = new this(y);
    x = new this(x);
    var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
    if (!y.s || !x.s) {
      r = new this(NaN);
    } else if (!y.d && !x.d) {
      r = getPi(this, wpr, 1).times(x.s > 0 ? .25 : .75);
      r.s = y.s;
    } else if (!x.d || y.isZero()) {
      r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y.s;
    } else if (!y.d || x.isZero()) {
      r = getPi(this, wpr, 1).times(.5);
      r.s = y.s;
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
  function cbrt(x) {
    return new this(x).cbrt();
  }
  function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
  }
  function clamp(x, min, max) {
    return new this(x).clamp(min, max);
  }
  function config(obj) {
    if (!obj || _typeof(obj) !== "object") throw Error(decimalError + "Object expected");
    var i, p, v, useDefaults = obj.defaults === true, ps = [ "precision", 1, MAX_DIGITS, "rounding", 0, 8, "toExpNeg", -EXP_LIMIT, 0, "toExpPos", 0, EXP_LIMIT, "maxE", 0, EXP_LIMIT, "minE", -EXP_LIMIT, 0, "modulo", 0, 9 ];
    for (i = 0; i < ps.length; i += 3) {
      if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
      if ((v = obj[p]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v; else throw Error(invalidArgument + p + ": " + v);
      }
    }
    if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ": " + v);
      }
    }
    return this;
  }
  function cos(x) {
    return new this(x).cos();
  }
  function cosh(x) {
    return new this(x).cosh();
  }
  function clone(obj) {
    var i, p, ps;
    function Decimal(v) {
      var e, i, t, x = this;
      if (!(x instanceof Decimal)) return new Decimal(v);
      x.constructor = Decimal;
      if (isDecimalInstance(v)) {
        x.s = v.s;
        if (external) {
          if (!v.d || v.e > Decimal.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (v.e < Decimal.minE) {
            x.e = 0;
            x.d = [ 0 ];
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
      t = _typeof(v);
      if (t === "number") {
        if (v === 0) {
          x.s = 1 / v < 0 ? -1 : 1;
          x.e = 0;
          x.d = [ 0 ];
          return;
        }
        if (v < 0) {
          v = -v;
          x.s = -1;
        } else {
          x.s = 1;
        }
        if (v === ~~v && v < 1e7) {
          for (e = 0, i = v; i >= 10; i /= 10) {
            e++;
          }
          if (external) {
            if (e > Decimal.maxE) {
              x.e = NaN;
              x.d = null;
            } else if (e < Decimal.minE) {
              x.e = 0;
              x.d = [ 0 ];
            } else {
              x.e = e;
              x.d = [ v ];
            }
          } else {
            x.e = e;
            x.d = [ v ];
          }
          return;
        } else if (v * 0 !== 0) {
          if (!v) x.s = NaN;
          x.e = NaN;
          x.d = null;
          return;
        }
        return parseDecimal(x, v.toString());
      } else if (t !== "string") {
        throw Error(invalidArgument + v);
      }
      if ((i = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
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
    Decimal.acosh = acosh;
    Decimal.add = add;
    Decimal.asin = asin;
    Decimal.asinh = asinh;
    Decimal.atan = atan;
    Decimal.atanh = atanh;
    Decimal.atan2 = atan2;
    Decimal.cbrt = cbrt;
    Decimal.ceil = ceil;
    Decimal.clamp = clamp;
    Decimal.cos = cos;
    Decimal.cosh = cosh;
    Decimal.div = div;
    Decimal.exp = exp;
    Decimal.floor = floor;
    Decimal.hypot = hypot;
    Decimal.ln = ln;
    Decimal.log = log;
    Decimal.log10 = log10;
    Decimal.log2 = log2;
    Decimal.max = max;
    Decimal.min = min;
    Decimal.mod = mod;
    Decimal.mul = mul;
    Decimal.pow = pow;
    Decimal.random = random;
    Decimal.round = round;
    Decimal.sign = sign;
    Decimal.sin = sin;
    Decimal.sinh = sinh;
    Decimal.sqrt = sqrt;
    Decimal.sub = sub;
    Decimal.sum = sum;
    Decimal.tan = tan;
    Decimal.tanh = tanh;
    Decimal.trunc = trunc;
    if (obj === void 0) obj = {};
    if (obj) {
      if (obj.defaults !== true) {
        ps = [ "precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto" ];
        for (i = 0; i < ps.length; ) {
          if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
        }
      }
    }
    Decimal.config(obj);
    return Decimal;
  }
  function div(x, y) {
    return new this(x).div(y);
  }
  function exp(x) {
    return new this(x).exp();
  }
  function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
  }
  function hypot() {
    var i, n, t = new this(0);
    external = false;
    for (i = 0; i < arguments.length; ) {
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
  function isDecimalInstance(obj) {
    return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
  }
  function ln(x) {
    return new this(x).ln();
  }
  function log(x, y) {
    return new this(x).log(y);
  }
  function log2(x) {
    return new this(x).log(2);
  }
  function log10(x) {
    return new this(x).log(10);
  }
  function max() {
    return maxOrMin(this, arguments, "lt");
  }
  function min() {
    return maxOrMin(this, arguments, "gt");
  }
  function mod(x, y) {
    return new this(x).mod(y);
  }
  function mul(x, y) {
    return new this(x).mul(y);
  }
  function pow(x, y) {
    return new this(x).pow(y);
  }
  function random(sd) {
    var d, e, k, n, i = 0, r = new this(1), rd = [];
    if (sd === void 0) sd = this.precision; else checkInt32(sd, 1, MAX_DIGITS);
    k = Math.ceil(sd / LOG_BASE);
    if (!this.crypto) {
      for (;i < k; ) {
        rd[i++] = Math.random() * 1e7 | 0;
      }
    } else if (crypto.getRandomValues) {
      d = crypto.getRandomValues(new Uint32Array(k));
      for (;i < k; ) {
        n = d[i];
        if (n >= 429e7) {
          d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {
          rd[i++] = n % 1e7;
        }
      }
    } else if (crypto.randomBytes) {
      d = crypto.randomBytes(k *= 4);
      for (;i < k; ) {
        n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
        if (n >= 214e7) {
          crypto.randomBytes(4).copy(d, i);
        } else {
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
    if (k && sd) {
      n = mathpow(10, LOG_BASE - sd);
      rd[i] = (k / n | 0) * n;
    }
    for (;rd[i] === 0; i--) {
      rd.pop();
    }
    if (i < 0) {
      e = 0;
      rd = [ 0 ];
    } else {
      e = -1;
      for (;rd[0] === 0; e -= LOG_BASE) {
        rd.shift();
      }
      for (k = 1, n = rd[0]; n >= 10; n /= 10) {
        k++;
      }
      if (k < LOG_BASE) e -= LOG_BASE - k;
    }
    r.e = e;
    r.d = rd;
    return r;
  }
  function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
  }
  function sign(x) {
    x = new this(x);
    return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
  }
  function sin(x) {
    return new this(x).sin();
  }
  function sinh(x) {
    return new this(x).sinh();
  }
  function sqrt(x) {
    return new this(x).sqrt();
  }
  function sub(x, y) {
    return new this(x).sub(y);
  }
  function sum() {
    var i = 0, args = arguments, x = new this(args[i]);
    external = false;
    for (;x.s && ++i < args.length; ) {
      x = x.plus(args[i]);
    }
    external = true;
    return finalise(x, this.precision, this.rounding);
  }
  function tan(x) {
    return new this(x).tan();
  }
  function tanh(x) {
    return new this(x).tanh();
  }
  function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
  }
  P[Symbol["for"]("nodejs.util.inspect.custom")] = P.toString;
  P[Symbol.toStringTag] = "Decimal";
  var Decimal = P.constructor = clone(DEFAULTS);
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);
  function ASC() {
    throw new Error("ASC is not implemented");
  }
  function BAHTTEXT() {
    throw new Error("BAHTTEXT is not implemented");
  }
  function CHAR(number) {
    number = parseNumber(number);
    if (number === 0) {
      return value;
    }
    if (number instanceof Error) {
      return number;
    }
    return String.fromCharCode(number);
  }
  function CLEAN(text) {
    if (anyIsError(text)) {
      return text;
    }
    text = text || "";
    var re = /[\0-\x1F]/g;
    return text.replace(re, "");
  }
  function CODE(text) {
    if (anyIsError(text)) {
      return text;
    }
    text = text || "";
    var result = text.charCodeAt(0);
    if (isNaN(result)) {
      result = value;
    }
    return result;
  }
  function CONCATENATE() {
    var args = flatten(arguments);
    var someError = anyError.apply(undefined, args);
    if (someError) {
      return someError;
    }
    var trueFound = 0;
    while ((trueFound = args.indexOf(true)) > -1) {
      args[trueFound] = "TRUE";
    }
    var falseFound = 0;
    while ((falseFound = args.indexOf(false)) > -1) {
      args[falseFound] = "FALSE";
    }
    return args.join("");
  }
  var CONCAT = CONCATENATE;
  function DBCS() {
    throw new Error("DBCS is not implemented");
  }
  function DOLLAR(number) {
    var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    number = parseNumber(number);
    if (isNaN(number)) {
      return value;
    }
    number = ROUND(number, decimals);
    var options = {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals >= 0 ? decimals : 0,
      maximumFractionDigits: decimals >= 0 ? decimals : 0
    };
    var formattedNumber = number.toLocaleString("en-US", options);
    if (number < 0) {
      return "$(" + formattedNumber.slice(2) + ")";
    }
    return formattedNumber;
  }
  function EXACT(text1, text2) {
    if (arguments.length !== 2) {
      return na;
    }
    var someError = anyError(text1, text2);
    if (someError) {
      return someError;
    }
    text1 = parseString(text1);
    text2 = parseString(text2);
    return text1 === text2;
  }
  function FIND(find_text, within_text, start_num) {
    if (arguments.length < 2) {
      return na;
    }
    find_text = parseString(find_text);
    within_text = parseString(within_text);
    start_num = start_num === undefined ? 0 : start_num;
    var found_index = within_text.indexOf(find_text, start_num - 1);
    if (found_index === -1) {
      return value;
    }
    return found_index + 1;
  }
  function FIXED(number) {
    var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var no_commas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    number = parseNumber(number);
    if (isNaN(number)) {
      return value;
    }
    decimals = parseNumber(decimals);
    if (isNaN(decimals)) {
      return value;
    }
    if (decimals < 0) {
      var factor = Math.pow(10, -decimals);
      number = Math.round(number / factor) * factor;
    } else {
      number = number.toFixed(decimals);
    }
    if (no_commas) {
      number = number.toString().replace(/,/g, "");
    } else {
      var parts = number.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+$)/g, ",");
      number = parts.join(".");
    }
    return number;
  }
  function HTML2TEXT(value) {
    if (anyIsError(value)) {
      return value;
    }
    var result = "";
    if (value) {
      if (value instanceof Array) {
        value.forEach((function(line) {
          if (result !== "") {
            result += "\n";
          }
          result += line.replace(/<(?:.|\n)*?>/gm, "");
        }));
      } else {
        result = value.replace(/<(?:.|\n)*?>/gm, "");
      }
    }
    return result;
  }
  function LEFT(text, num_chars) {
    var someError = anyError(text, num_chars);
    if (someError) {
      return someError;
    }
    text = parseString(text);
    num_chars = num_chars === undefined ? 1 : num_chars;
    num_chars = parseNumber(num_chars);
    if (num_chars instanceof Error || typeof text !== "string") {
      return value;
    }
    return text.substring(0, num_chars);
  }
  function LEN(text) {
    if (arguments.length === 0) {
      return error;
    }
    if (text instanceof Error) {
      return text;
    }
    if (Array.isArray(text)) {
      return value;
    }
    var textAsString = parseString(text);
    return textAsString.length;
  }
  function LOWER(text) {
    if (arguments.length !== 1) {
      return value;
    }
    text = parseString(text);
    if (anyIsError(text)) {
      return text;
    }
    return text.toLowerCase();
  }
  function MID(text, start_num, num_chars) {
    if (start_num === undefined || start_num === null) {
      return value;
    }
    start_num = parseNumber(start_num);
    num_chars = parseNumber(num_chars);
    if (anyIsError(start_num, num_chars) || typeof text !== "string") {
      return num_chars;
    }
    var begin = start_num - 1;
    var end = begin + num_chars;
    return text.substring(begin, end);
  }
  function NUMBERVALUE(text, decimal_separator, group_separator) {
    text = isDefined(text) ? text : "";
    if (typeof text === "number") {
      return text;
    }
    if (typeof text !== "string") {
      return na;
    }
    decimal_separator = typeof decimal_separator === "undefined" ? "." : decimal_separator;
    group_separator = typeof group_separator === "undefined" ? "," : group_separator;
    return Number(text.replace(decimal_separator, ".").replace(group_separator, ""));
  }
  function PRONETIC() {
    throw new Error("PRONETIC is not implemented");
  }
  function PROPER(text) {
    if (anyIsError(text)) {
      return text;
    }
    if (isNaN(text) && typeof text === "number") {
      return value;
    }
    text = parseString(text);
    return text.replace(/\w\S*/g, (function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }));
  }
  function REGEXEXTRACT(text, regular_expression) {
    if (arguments.length < 2) {
      return na;
    }
    var match = text.match(new RegExp(regular_expression));
    return match ? match[match.length > 1 ? match.length - 1 : 0] : null;
  }
  function REGEXMATCH(text, regular_expression, full) {
    if (arguments.length < 2) {
      return na;
    }
    var match = text.match(new RegExp(regular_expression));
    return full ? match : !!match;
  }
  function REGEXREPLACE(text, regular_expression, replacement) {
    if (arguments.length < 3) {
      return na;
    }
    return text.replace(new RegExp(regular_expression), replacement);
  }
  function REPLACE(old_text, num_chars, length, new_text) {
    num_chars = parseNumber(num_chars);
    length = parseNumber(length);
    if (anyIsError(num_chars, length) || typeof old_text !== "string" || typeof new_text !== "string") {
      return value;
    }
    return old_text.substr(0, num_chars - 1) + new_text + old_text.substr(num_chars - 1 + length);
  }
  function REPT(text, number_times) {
    var someError = anyError(text, number_times);
    if (someError) {
      return someError;
    }
    text = parseString(text);
    number_times = parseNumber(number_times);
    if (number_times instanceof Error) {
      return number_times;
    }
    return new Array(number_times + 1).join(text);
  }
  function RIGHT(text, num_chars) {
    var someError = anyError(text, num_chars);
    if (someError) {
      return someError;
    }
    text = parseString(text);
    num_chars = num_chars === undefined ? 1 : num_chars;
    num_chars = parseNumber(num_chars);
    if (num_chars instanceof Error) {
      return num_chars;
    }
    return text.substring(text.length - num_chars);
  }
  function SEARCH(find_text, within_text, start_num) {
    var foundAt;
    if (typeof find_text !== "string" || typeof within_text !== "string") {
      return value;
    }
    start_num = start_num === undefined ? 0 : start_num;
    foundAt = within_text.toLowerCase().indexOf(find_text.toLowerCase(), start_num - 1) + 1;
    return foundAt === 0 ? value : foundAt;
  }
  function SPLIT(text, separator) {
    return text.split(separator);
  }
  function SUBSTITUTE(text, old_text, new_text, instance_num) {
    if (arguments.length < 3) {
      return na;
    }
    if (!text || !old_text) {
      return text;
    } else if (instance_num === undefined) {
      return text.split(old_text).join(new_text);
    } else {
      instance_num = Math.floor(Number(instance_num));
      if (Number.isNaN(instance_num) || instance_num <= 0) {
        return value;
      }
      var index = 0;
      var i = 0;
      while (index > -1 && text.indexOf(old_text, index) > -1) {
        index = text.indexOf(old_text, index + 1);
        i++;
        if (index > -1 && i === instance_num) {
          return text.substring(0, index) + new_text + text.substring(index + old_text.length);
        }
      }
      return text;
    }
  }
  function T(value) {
    if (value instanceof Error) {
      return value;
    }
    return typeof value === "string" ? value : "";
  }
  function handleTextNumbers(value, format_text) {
    var _format_text$split$0$, _format_text$split, _format_text$split$, _format_text$split$$m;
    var result = "";
    var integers = value.toString().split(".")[0] || "";
    var decimals = value.toString().split(".")[1] || "";
    var currentValueIndex = 0;
    var currentIntegerIndex = 0;
    var currentDecimalIndex = 0;
    var isInteger = true;
    var numberOfHashesAndZerosBeforeDecimal = ((_format_text$split$0$ = format_text.split(".")[0].match(/[0|#]/g)) === null || _format_text$split$0$ === void 0 ? void 0 : _format_text$split$0$.length) || 0;
    var numberOfHashesAndZerosAfterDecimal = ((_format_text$split = format_text.split(".")) === null || _format_text$split === void 0 ? void 0 : (_format_text$split$ = _format_text$split[1]) === null || _format_text$split$ === void 0 ? void 0 : (_format_text$split$$m = _format_text$split$.match(/[0|#]/g)) === null || _format_text$split$$m === void 0 ? void 0 : _format_text$split$$m.length) || 0;
    var endOfDecimalIndex = Math.min(decimals.length, numberOfHashesAndZerosAfterDecimal) - 1;
    for (var i = 0; i < format_text.length; i++) {
      if (format_text[i] === "#" || format_text[i] === "0") {
        if (isInteger && currentIntegerIndex < integers.length) {
          if (currentIntegerIndex === 0 && numberOfHashesAndZerosBeforeDecimal < integers.length) {
            var addToIndexes = integers.length - numberOfHashesAndZerosBeforeDecimal + 1;
            var shouldRound = addToIndexes === integers.length && !numberOfHashesAndZerosAfterDecimal;
            if (shouldRound) {
              result += Math.round(value).toString().substring(0, addToIndexes);
            } else {
              result += integers.substring(0, addToIndexes);
            }
            currentValueIndex += addToIndexes;
            currentIntegerIndex += addToIndexes;
          } else {
            var _shouldRound = currentIntegerIndex === integers.length - 1 && !numberOfHashesAndZerosAfterDecimal;
            if (_shouldRound) {
              result += Math.round(value).toString().substr(-1);
            } else {
              result += value.toString()[currentValueIndex];
            }
            currentValueIndex++;
            currentIntegerIndex++;
          }
        } else if (!isInteger && currentDecimalIndex < endOfDecimalIndex + 1) {
          var _shouldRound2 = currentDecimalIndex === endOfDecimalIndex;
          if (_shouldRound2) {
            result += value.toFixed(currentDecimalIndex + 1).toString().substr(-1);
          } else {
            result += value.toString()[currentValueIndex];
          }
          currentValueIndex++;
          currentDecimalIndex++;
        }
      } else if (format_text[i] === ".") {
        isInteger = false;
        if (currentIntegerIndex <= integers.length) {
          result += integers.substring(currentIntegerIndex);
          currentValueIndex = integers.length + 1;
          currentIntegerIndex = integers.length;
        }
        result += ".";
      } else {
        result += format_text[i];
      }
    }
    return result;
  }
  function TEXT(value$1, format_text) {
    if (value$1 === undefined || format_text === undefined) {
      return na;
    }
    value$1 = parseNumber(value$1);
    if (anyIsError(value$1)) {
      return value;
    }
    format_text = parseString(format_text);
    if (anyIsError("FORMAT: ", format_text)) {
      return value;
    }
    var result = "";
    if (format_text === "") {
      result = format_text;
    } else if (format_text.includes("h") || format_text.includes("m") || format_text.includes("s") || format_text.includes("d") || format_text.includes("y") || format_text.includes("A/P") || format_text.includes("AM/PM") || format_text.includes("?/") || format_text.includes("/?") || format_text.includes("E+") || format_text.includes("E-") || format_text.includes("e+") || format_text.includes("e-") || format_text.includes("*") || format_text.includes("_") || format_text.includes(";") || format_text.includes("[") || format_text.includes("]")) {
      throw new Error("TEXT formula not implemented");
    } else if (format_text.includes("%")) {
      if (format_text.length === 1) {
        return format_text;
      }
      var percentage = new Decimal(value$1).times(100).toNumber();
      result = handleTextNumbers(percentage, format_text);
    } else if (format_text.includes("#") || format_text.includes("0")) {
      result = handleTextNumbers(new Decimal(value$1).toNumber(), format_text);
    } else {
      throw new Error("TEXT formula not implemented");
    }
    return result;
  }
  function TEXTJOIN(delimiter, ignore_empty) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    if (typeof ignore_empty !== "boolean") {
      ignore_empty = parseBool(ignore_empty);
    }
    if (arguments.length < 3) {
      return na;
    }
    delimiter = delimiter !== null && delimiter !== undefined ? delimiter : "";
    var flatArgs = flatten(args);
    var textToJoin = ignore_empty ? flatArgs.filter((function(text) {
      return text;
    })) : flatArgs;
    if (Array.isArray(delimiter)) {
      delimiter = flatten(delimiter);
      var chunks = textToJoin.map((function(item) {
        return [ item ];
      }));
      var index = 0;
      for (var i = 0; i < chunks.length - 1; i++) {
        chunks[i].push(delimiter[index]);
        index++;
        if (index === delimiter.length) {
          index = 0;
        }
      }
      textToJoin = flatten(chunks);
      return textToJoin.join("");
    }
    return textToJoin.join(delimiter);
  }
  function TRIM(text) {
    text = parseString(text);
    if (text instanceof Error) {
      return text;
    }
    return text.replace(/\s+/g, " ").trim();
  }
  var UNICHAR = CHAR;
  var UNICODE = CODE;
  function UPPER(text) {
    text = parseString(text);
    if (text instanceof Error) {
      return text;
    }
    return text.toUpperCase();
  }
  function VALUE(text) {
    var anyError$1 = anyError(text);
    if (anyError$1) {
      return anyError$1;
    }
    if (typeof text === "number") {
      return text;
    }
    if (!isDefined(text)) {
      text = "";
    }
    if (typeof text !== "string") {
      return value;
    }
    var isPercent = /(%)$/.test(text) || /^(%)/.test(text);
    text = text.replace(/^[^0-9-]{0,3}/, "");
    text = text.replace(/[^0-9]{0,3}$/, "");
    text = text.replace(/[ ,]/g, "");
    if (text === "") {
      return 0;
    }
    var output = Number(text);
    if (isNaN(output)) {
      return value;
    }
    output = output || 0;
    if (isPercent) {
      output = output * .01;
    }
    return output;
  }
  function isValidBinaryNumber(number) {
    return /^[01]{1,10}$/.test(number);
  }
  function BESSELI(x, n) {
    x = parseNumber(x);
    n = parseNumber(n);
    if (anyIsError(x, n)) {
      return value;
    }
    return bessel.besseli(x, n);
  }
  function BESSELJ(x, n) {
    x = parseNumber(x);
    n = parseNumber(n);
    if (anyIsError(x, n)) {
      return value;
    }
    return bessel.besselj(x, n);
  }
  function BESSELK(x, n) {
    x = parseNumber(x);
    n = parseNumber(n);
    if (anyIsError(x, n)) {
      return value;
    }
    return bessel.besselk(x, n);
  }
  function BESSELY(x, n) {
    x = parseNumber(x);
    n = parseNumber(n);
    if (anyIsError(x, n)) {
      return value;
    }
    return bessel.bessely(x, n);
  }
  function BIN2DEC(number) {
    if (!isValidBinaryNumber(number)) {
      return num;
    }
    var result = parseInt(number, 2);
    var stringified = number.toString();
    if (stringified.length === 10 && stringified.substring(0, 1) === "1") {
      return parseInt(stringified.substring(1), 2) - 512;
    } else {
      return result;
    }
  }
  function BIN2HEX(number, places) {
    if (!isValidBinaryNumber(number)) {
      return num;
    }
    var stringified = number.toString();
    if (stringified.length === 10 && stringified.substring(0, 1) === "1") {
      return (0xfffffffe00 + parseInt(stringified.substring(1), 2)).toString(16);
    }
    var result = parseInt(number, 2).toString(16);
    if (places === undefined) {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function BIN2OCT(number, places) {
    if (!isValidBinaryNumber(number)) {
      return num;
    }
    var stringified = number.toString();
    if (stringified.length === 10 && stringified.substring(0, 1) === "1") {
      return (1073741312 + parseInt(stringified.substring(1), 2)).toString(8);
    }
    var result = parseInt(number, 2).toString(8);
    if (places === undefined) {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function BITAND(number1, number2) {
    number1 = parseNumber(number1);
    number2 = parseNumber(number2);
    if (anyIsError(number1, number2)) {
      return value;
    }
    if (number1 < 0 || number2 < 0) {
      return num;
    }
    if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
      return num;
    }
    if (number1 > 0xffffffffffff || number2 > 0xffffffffffff) {
      return num;
    }
    return number1 & number2;
  }
  function BITLSHIFT(number, shift_amount) {
    number = parseNumber(number);
    shift_amount = parseNumber(shift_amount);
    if (anyIsError(number, shift_amount)) {
      return value;
    }
    if (number < 0) {
      return num;
    }
    if (Math.floor(number) !== number) {
      return num;
    }
    if (number > 0xffffffffffff) {
      return num;
    }
    if (Math.abs(shift_amount) > 53) {
      return num;
    }
    return shift_amount >= 0 ? number << shift_amount : number >> -shift_amount;
  }
  function BITOR(number1, number2) {
    number1 = parseNumber(number1);
    number2 = parseNumber(number2);
    if (anyIsError(number1, number2)) {
      return value;
    }
    if (number1 < 0 || number2 < 0) {
      return num;
    }
    if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
      return num;
    }
    if (number1 > 0xffffffffffff || number2 > 0xffffffffffff) {
      return num;
    }
    return number1 | number2;
  }
  function BITRSHIFT(number, shift_amount) {
    number = parseNumber(number);
    shift_amount = parseNumber(shift_amount);
    if (anyIsError(number, shift_amount)) {
      return value;
    }
    if (number < 0) {
      return num;
    }
    if (Math.floor(number) !== number) {
      return num;
    }
    if (number > 0xffffffffffff) {
      return num;
    }
    if (Math.abs(shift_amount) > 53) {
      return num;
    }
    return shift_amount >= 0 ? number >> shift_amount : number << -shift_amount;
  }
  function BITXOR(number1, number2) {
    number1 = parseNumber(number1);
    number2 = parseNumber(number2);
    if (anyIsError(number1, number2)) {
      return value;
    }
    if (number1 < 0 || number2 < 0) {
      return num;
    }
    if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
      return num;
    }
    if (number1 > 0xffffffffffff || number2 > 0xffffffffffff) {
      return num;
    }
    return number1 ^ number2;
  }
  function COMPLEX(real_num, i_num, suffix) {
    real_num = parseNumber(real_num);
    i_num = parseNumber(i_num);
    if (anyIsError(real_num, i_num)) {
      return real_num;
    }
    suffix = suffix === undefined ? "i" : suffix;
    if (suffix !== "i" && suffix !== "j") {
      return value;
    }
    if (real_num === 0 && i_num === 0) {
      return 0;
    } else if (real_num === 0) {
      return i_num === 1 ? suffix : i_num.toString() + suffix;
    } else if (i_num === 0) {
      return real_num.toString();
    } else {
      var _sign = i_num > 0 ? "+" : "";
      return real_num.toString() + _sign + (i_num === 1 ? suffix : i_num.toString() + suffix);
    }
  }
  function CONVERT(number, from_unit, to_unit) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    var units = [ [ "a.u. of action", "?", null, "action", false, false, 105457168181818e-48 ], [ "a.u. of charge", "e", null, "electric_charge", false, false, 160217653141414e-33 ], [ "a.u. of energy", "Eh", null, "energy", false, false, 435974417757576e-32 ], [ "a.u. of length", "a?", null, "length", false, false, 529177210818182e-25 ], [ "a.u. of mass", "m?", null, "mass", false, false, 910938261616162e-45 ], [ "a.u. of time", "?/Eh", null, "time", false, false, 241888432650516e-31 ], [ "admiralty knot", "admkn", null, "speed", false, true, .514773333 ], [ "ampere", "A", null, "electric_current", true, false, 1 ], [ "ampere per meter", "A/m", null, "magnetic_field_intensity", true, false, 1 ], [ "ångström", "Å", [ "ang" ], "length", false, true, 1e-10 ], [ "are", "ar", null, "area", false, true, 100 ], [ "astronomical unit", "ua", null, "length", false, false, 149597870691667e-25 ], [ "bar", "bar", null, "pressure", false, false, 1e5 ], [ "barn", "b", null, "area", false, false, 1e-28 ], [ "becquerel", "Bq", null, "radioactivity", true, false, 1 ], [ "bit", "bit", [ "b" ], "information", false, true, 1 ], [ "btu", "BTU", [ "btu" ], "energy", false, true, 1055.05585262 ], [ "byte", "byte", null, "information", false, true, 8 ], [ "candela", "cd", null, "luminous_intensity", true, false, 1 ], [ "candela per square metre", "cd/m?", null, "luminance", true, false, 1 ], [ "coulomb", "C", null, "electric_charge", true, false, 1 ], [ "cubic ångström", "ang3", [ "ang^3" ], "volume", false, true, 1e-30 ], [ "cubic foot", "ft3", [ "ft^3" ], "volume", false, true, .028316846592 ], [ "cubic inch", "in3", [ "in^3" ], "volume", false, true, 16387064e-12 ], [ "cubic light-year", "ly3", [ "ly^3" ], "volume", false, true, 846786664623715e-61 ], [ "cubic metre", "m?", null, "volume", true, true, 1 ], [ "cubic mile", "mi3", [ "mi^3" ], "volume", false, true, 4168181825.44058 ], [ "cubic nautical mile", "Nmi3", [ "Nmi^3" ], "volume", false, true, 6352182208 ], [ "cubic Pica", "Pica3", [ "Picapt3", "Pica^3", "Picapt^3" ], "volume", false, true, 7.58660370370369e-8 ], [ "cubic yard", "yd3", [ "yd^3" ], "volume", false, true, .764554857984 ], [ "cup", "cup", null, "volume", false, true, .0002365882365 ], [ "dalton", "Da", [ "u" ], "mass", false, false, 166053886282828e-41 ], [ "day", "d", [ "day" ], "time", false, true, 86400 ], [ "degree", "°", null, "angle", false, false, .0174532925199433 ], [ "degrees Rankine", "Rank", null, "temperature", false, true, .555555555555556 ], [ "dyne", "dyn", [ "dy" ], "force", false, true, 1e-5 ], [ "electronvolt", "eV", [ "ev" ], "energy", false, true, 1.60217656514141 ], [ "ell", "ell", null, "length", false, true, 1.143 ], [ "erg", "erg", [ "e" ], "energy", false, true, 1e-7 ], [ "farad", "F", null, "electric_capacitance", true, false, 1 ], [ "fluid ounce", "oz", null, "volume", false, true, 295735295625e-16 ], [ "foot", "ft", null, "length", false, true, .3048 ], [ "foot-pound", "flb", null, "energy", false, true, 1.3558179483314 ], [ "gal", "Gal", null, "acceleration", false, false, .01 ], [ "gallon", "gal", null, "volume", false, true, .003785411784 ], [ "gauss", "G", [ "ga" ], "magnetic_flux_density", false, true, 1 ], [ "grain", "grain", null, "mass", false, true, 647989e-10 ], [ "gram", "g", null, "mass", false, true, .001 ], [ "gray", "Gy", null, "absorbed_dose", true, false, 1 ], [ "gross registered ton", "GRT", [ "regton" ], "volume", false, true, 2.8316846592 ], [ "hectare", "ha", null, "area", false, true, 1e4 ], [ "henry", "H", null, "inductance", true, false, 1 ], [ "hertz", "Hz", null, "frequency", true, false, 1 ], [ "horsepower", "HP", [ "h" ], "power", false, true, 745.69987158227 ], [ "horsepower-hour", "HPh", [ "hh", "hph" ], "energy", false, true, 2684519.538 ], [ "hour", "h", [ "hr" ], "time", false, true, 3600 ], [ "imperial gallon (U.K.)", "uk_gal", null, "volume", false, true, .00454609 ], [ "imperial hundredweight", "lcwt", [ "uk_cwt", "hweight" ], "mass", false, true, 50.802345 ], [ "imperial quart (U.K)", "uk_qt", null, "volume", false, true, .0011365225 ], [ "imperial ton", "brton", [ "uk_ton", "LTON" ], "mass", false, true, 1016.046909 ], [ "inch", "in", null, "length", false, true, .0254 ], [ "international acre", "uk_acre", null, "area", false, true, 4046.8564224 ], [ "IT calorie", "cal", null, "energy", false, true, 4.1868 ], [ "joule", "J", null, "energy", true, true, 1 ], [ "katal", "kat", null, "catalytic_activity", true, false, 1 ], [ "kelvin", "K", [ "kel" ], "temperature", true, true, 1 ], [ "kilogram", "kg", null, "mass", true, true, 1 ], [ "knot", "kn", null, "speed", false, true, .514444444444444 ], [ "light-year", "ly", null, "length", false, true, 9460730472580800 ], [ "litre", "L", [ "l", "lt" ], "volume", false, true, .001 ], [ "lumen", "lm", null, "luminous_flux", true, false, 1 ], [ "lux", "lx", null, "illuminance", true, false, 1 ], [ "maxwell", "Mx", null, "magnetic_flux", false, false, 1e-18 ], [ "measurement ton", "MTON", null, "volume", false, true, 1.13267386368 ], [ "meter per hour", "m/h", [ "m/hr" ], "speed", false, true, .00027777777777778 ], [ "meter per second", "m/s", [ "m/sec" ], "speed", true, true, 1 ], [ "meter per second squared", "m?s??", null, "acceleration", true, false, 1 ], [ "parsec", "pc", [ "parsec" ], "length", false, true, 0x6da012f958ee1c ], [ "meter squared per second", "m?/s", null, "kinematic_viscosity", true, false, 1 ], [ "metre", "m", null, "length", true, true, 1 ], [ "miles per hour", "mph", null, "speed", false, true, .44704 ], [ "millimetre of mercury", "mmHg", null, "pressure", false, false, 133.322 ], [ "minute", "?", null, "angle", false, false, .000290888208665722 ], [ "minute", "min", [ "mn" ], "time", false, true, 60 ], [ "modern teaspoon", "tspm", null, "volume", false, true, 5e-6 ], [ "mole", "mol", null, "amount_of_substance", true, false, 1 ], [ "morgen", "Morgen", null, "area", false, true, 2500 ], [ "n.u. of action", "?", null, "action", false, false, 105457168181818e-48 ], [ "n.u. of mass", "m?", null, "mass", false, false, 910938261616162e-45 ], [ "n.u. of speed", "c?", null, "speed", false, false, 299792458 ], [ "n.u. of time", "?/(me?c??)", null, "time", false, false, 128808866778687e-35 ], [ "nautical mile", "M", [ "Nmi" ], "length", false, true, 1852 ], [ "newton", "N", null, "force", true, true, 1 ], [ "œrsted", "Oe ", null, "magnetic_field_intensity", false, false, 79.5774715459477 ], [ "ohm", "Ω", null, "electric_resistance", true, false, 1 ], [ "ounce mass", "ozm", null, "mass", false, true, .028349523125 ], [ "pascal", "Pa", null, "pressure", true, false, 1 ], [ "pascal second", "Pa?s", null, "dynamic_viscosity", true, false, 1 ], [ "pferdestärke", "PS", null, "power", false, true, 735.49875 ], [ "phot", "ph", null, "illuminance", false, false, 1e-4 ], [ "pica (1/6 inch)", "pica", null, "length", false, true, .00035277777777778 ], [ "pica (1/72 inch)", "Pica", [ "Picapt" ], "length", false, true, .00423333333333333 ], [ "poise", "P", null, "dynamic_viscosity", false, false, .1 ], [ "pond", "pond", null, "force", false, true, .00980665 ], [ "pound force", "lbf", null, "force", false, true, 4.4482216152605 ], [ "pound mass", "lbm", null, "mass", false, true, .45359237 ], [ "quart", "qt", null, "volume", false, true, .000946352946 ], [ "radian", "rad", null, "angle", true, false, 1 ], [ "second", "?", null, "angle", false, false, 484813681109536e-20 ], [ "second", "s", [ "sec" ], "time", true, true, 1 ], [ "short hundredweight", "cwt", [ "shweight" ], "mass", false, true, 45.359237 ], [ "siemens", "S", null, "electrical_conductance", true, false, 1 ], [ "sievert", "Sv", null, "equivalent_dose", true, false, 1 ], [ "slug", "sg", null, "mass", false, true, 14.59390294 ], [ "square ångström", "ang2", [ "ang^2" ], "area", false, true, 1e-20 ], [ "square foot", "ft2", [ "ft^2" ], "area", false, true, .09290304 ], [ "square inch", "in2", [ "in^2" ], "area", false, true, 64516e-8 ], [ "square light-year", "ly2", [ "ly^2" ], "area", false, true, 895054210748189e17 ], [ "square meter", "m?", null, "area", true, true, 1 ], [ "square mile", "mi2", [ "mi^2" ], "area", false, true, 2589988.110336 ], [ "square nautical mile", "Nmi2", [ "Nmi^2" ], "area", false, true, 3429904 ], [ "square Pica", "Pica2", [ "Picapt2", "Pica^2", "Picapt^2" ], "area", false, true, 1792111111111e-17 ], [ "square yard", "yd2", [ "yd^2" ], "area", false, true, .83612736 ], [ "statute mile", "mi", null, "length", false, true, 1609.344 ], [ "steradian", "sr", null, "solid_angle", true, false, 1 ], [ "stilb", "sb", null, "luminance", false, false, 1e-4 ], [ "stokes", "St", null, "kinematic_viscosity", false, false, 1e-4 ], [ "stone", "stone", null, "mass", false, true, 6.35029318 ], [ "tablespoon", "tbs", null, "volume", false, true, 147868e-10 ], [ "teaspoon", "tsp", null, "volume", false, true, 492892e-11 ], [ "tesla", "T", null, "magnetic_flux_density", true, true, 1 ], [ "thermodynamic calorie", "c", null, "energy", false, true, 4.184 ], [ "ton", "ton", null, "mass", false, true, 907.18474 ], [ "tonne", "t", null, "mass", false, false, 1e3 ], [ "U.K. pint", "uk_pt", null, "volume", false, true, .00056826125 ], [ "U.S. bushel", "bushel", null, "volume", false, true, .03523907 ], [ "U.S. oil barrel", "barrel", null, "volume", false, true, .158987295 ], [ "U.S. pint", "pt", [ "us_pt" ], "volume", false, true, .000473176473 ], [ "U.S. survey mile", "survey_mi", null, "length", false, true, 1609.347219 ], [ "U.S. survey/statute acre", "us_acre", null, "area", false, true, 4046.87261 ], [ "volt", "V", null, "voltage", true, false, 1 ], [ "watt", "W", null, "power", true, true, 1 ], [ "watt-hour", "Wh", [ "wh" ], "energy", false, true, 3600 ], [ "weber", "Wb", null, "magnetic_flux", true, false, 1 ], [ "yard", "yd", null, "length", false, true, .9144 ], [ "year", "yr", null, "time", false, true, 31557600 ] ];
    var binary_prefixes = {
      Yi: [ "yobi", 80, 12089258196146292e8, "Yi", "yotta" ],
      Zi: [ "zebi", 70, 11805916207174113e5, "Zi", "zetta" ],
      Ei: [ "exbi", 60, 0x1000000000000000, "Ei", "exa" ],
      Pi: [ "pebi", 50, 0x4000000000000, "Pi", "peta" ],
      Ti: [ "tebi", 40, 1099511627776, "Ti", "tera" ],
      Gi: [ "gibi", 30, 1073741824, "Gi", "giga" ],
      Mi: [ "mebi", 20, 1048576, "Mi", "mega" ],
      ki: [ "kibi", 10, 1024, "ki", "kilo" ]
    };
    var unit_prefixes = {
      Y: [ "yotta", 1e24, "Y" ],
      Z: [ "zetta", 1e21, "Z" ],
      E: [ "exa", 1e18, "E" ],
      P: [ "peta", 1e15, "P" ],
      T: [ "tera", 1e12, "T" ],
      G: [ "giga", 1e9, "G" ],
      M: [ "mega", 1e6, "M" ],
      k: [ "kilo", 1e3, "k" ],
      h: [ "hecto", 100, "h" ],
      e: [ "dekao", 10, "e" ],
      d: [ "deci", .1, "d" ],
      c: [ "centi", .01, "c" ],
      m: [ "milli", .001, "m" ],
      u: [ "micro", 1e-6, "u" ],
      n: [ "nano", 1e-9, "n" ],
      p: [ "pico", 1e-12, "p" ],
      f: [ "femto", 1e-15, "f" ],
      a: [ "atto", 1e-18, "a" ],
      z: [ "zepto", 1e-21, "z" ],
      y: [ "yocto", 1e-24, "y" ]
    };
    var from = null;
    var to = null;
    var base_from_unit = from_unit;
    var base_to_unit = to_unit;
    var from_multiplier = 1;
    var to_multiplier = 1;
    var alt;
    for (var i = 0; i < units.length; i++) {
      alt = units[i][2] === null ? [] : units[i][2];
      if (units[i][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
        from = units[i];
      }
      if (units[i][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
        to = units[i];
      }
    }
    if (from === null) {
      var from_binary_prefix = binary_prefixes[from_unit.substring(0, 2)];
      var from_unit_prefix = unit_prefixes[from_unit.substring(0, 1)];
      if (from_unit.substring(0, 2) === "da") {
        from_unit_prefix = [ "dekao", 10, "da" ];
      }
      if (from_binary_prefix) {
        from_multiplier = from_binary_prefix[2];
        base_from_unit = from_unit.substring(2);
      } else if (from_unit_prefix) {
        from_multiplier = from_unit_prefix[1];
        base_from_unit = from_unit.substring(from_unit_prefix[2].length);
      }
      for (var j = 0; j < units.length; j++) {
        alt = units[j][2] === null ? [] : units[j][2];
        if (units[j][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
          from = units[j];
        }
      }
    }
    if (to === null) {
      var to_binary_prefix = binary_prefixes[to_unit.substring(0, 2)];
      var to_unit_prefix = unit_prefixes[to_unit.substring(0, 1)];
      if (to_unit.substring(0, 2) === "da") {
        to_unit_prefix = [ "dekao", 10, "da" ];
      }
      if (to_binary_prefix) {
        to_multiplier = to_binary_prefix[2];
        base_to_unit = to_unit.substring(2);
      } else if (to_unit_prefix) {
        to_multiplier = to_unit_prefix[1];
        base_to_unit = to_unit.substring(to_unit_prefix[2].length);
      }
      for (var k = 0; k < units.length; k++) {
        alt = units[k][2] === null ? [] : units[k][2];
        if (units[k][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
          to = units[k];
        }
      }
    }
    if (from === null || to === null) {
      return na;
    }
    if (from[3] !== to[3]) {
      return na;
    }
    return number * from[6] * from_multiplier / (to[6] * to_multiplier);
  }
  function DEC2BIN(number, places) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (!/^-?[0-9]{1,3}$/.test(number) || number < -512 || number > 511) {
      return num;
    }
    if (number < 0) {
      return "1" + REPT("0", 9 - (512 + number).toString(2).length) + (512 + number).toString(2);
    }
    var result = parseInt(number, 10).toString(2);
    if (typeof places === "undefined") {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function DEC2HEX(number, places) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (!/^-?[0-9]{1,12}$/.test(number) || number < -549755813888 || number > 549755813887) {
      return num;
    }
    if (number < 0) {
      return (1099511627776 + number).toString(16);
    }
    var result = parseInt(number, 10).toString(16);
    if (typeof places === "undefined") {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function DEC2OCT(number, places) {
    number = parseNumber(number);
    if (number instanceof Error) {
      return number;
    }
    if (!/^-?[0-9]{1,9}$/.test(number) || number < -536870912 || number > 536870911) {
      return num;
    }
    if (number < 0) {
      return (1073741824 + number).toString(8);
    }
    var result = parseInt(number, 10).toString(8);
    if (typeof places === "undefined") {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function DELTA(number1, number2) {
    number2 = number2 === undefined ? 0 : number2;
    number1 = parseNumber(number1);
    number2 = parseNumber(number2);
    if (anyIsError(number1, number2)) {
      return value;
    }
    return number1 === number2 ? 1 : 0;
  }
  function ERF(lower_limit, upper_limit) {
    upper_limit = upper_limit === undefined ? 0 : upper_limit;
    lower_limit = parseNumber(lower_limit);
    upper_limit = parseNumber(upper_limit);
    if (anyIsError(lower_limit, upper_limit)) {
      return value;
    }
    return jStat.erf(lower_limit);
  }
  ERF.PRECISE = function() {
    throw new Error("ERF.PRECISE is not implemented");
  };
  function ERFC(x) {
    if (isNaN(x)) {
      return value;
    }
    return jStat.erfc(x);
  }
  ERFC.PRECISE = function() {
    throw new Error("ERFC.PRECISE is not implemented");
  };
  function GESTEP(number, step) {
    step = step || 0;
    number = parseNumber(number);
    if (anyIsError(step, number)) {
      return number;
    }
    return number >= step ? 1 : 0;
  }
  function HEX2BIN(number, places) {
    if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
      return num;
    }
    var negative = !!(number.length === 10 && number.substring(0, 1).toLowerCase() === "f");
    var decimal = negative ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);
    if (decimal < -512 || decimal > 511) {
      return num;
    }
    if (negative) {
      return "1" + REPT("0", 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2);
    }
    var result = decimal.toString(2);
    if (places === undefined) {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function HEX2DEC(number) {
    if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
      return num;
    }
    var decimal = parseInt(number, 16);
    return decimal >= 549755813888 ? decimal - 1099511627776 : decimal;
  }
  function HEX2OCT(number, places) {
    if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
      return num;
    }
    var decimal = parseInt(number, 16);
    if (decimal > 536870911 && decimal < 0xffe0000000) {
      return num;
    }
    if (decimal >= 0xffe0000000) {
      return (decimal - 0xffc0000000).toString(8);
    }
    var result = decimal.toString(8);
    if (places === undefined) {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function IMABS(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
  function IMAGINARY(inumber) {
    if (inumber === undefined || inumber === true || inumber === false) {
      return value;
    }
    if (inumber === 0 || inumber === "0") {
      return 0;
    }
    if ([ "i", "j" ].indexOf(inumber) >= 0) {
      return 1;
    }
    inumber = inumber + "";
    inumber = inumber.replace("+i", "+1i").replace("-i", "-1i").replace("+j", "+1j").replace("-j", "-1j");
    var plus = inumber.indexOf("+");
    var minus = inumber.indexOf("-");
    if (plus === 0) {
      plus = inumber.indexOf("+", 1);
    }
    if (minus === 0) {
      minus = inumber.indexOf("-", 1);
    }
    var last = inumber.substring(inumber.length - 1, inumber.length);
    var unit = last === "i" || last === "j";
    if (plus >= 0 || minus >= 0) {
      if (!unit) {
        return num;
      }
      if (plus >= 0) {
        return isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1)) ? num : Number(inumber.substring(plus + 1, inumber.length - 1));
      } else {
        return isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1)) ? num : -Number(inumber.substring(minus + 1, inumber.length - 1));
      }
    } else {
      if (unit) {
        return isNaN(inumber.substring(0, inumber.length - 1)) ? num : inumber.substring(0, inumber.length - 1);
      } else {
        return isNaN(inumber) ? num : 0;
      }
    }
  }
  function IMARGUMENT(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    if (x === 0 && y === 0) {
      return div0;
    }
    if (x === 0 && y > 0) {
      return Math.PI / 2;
    }
    if (x === 0 && y < 0) {
      return -Math.PI / 2;
    }
    if (y === 0 && x > 0) {
      return 0;
    }
    if (y === 0 && x < 0) {
      return -Math.PI;
    }
    if (x > 0) {
      return Math.atan(y / x);
    } else if (x < 0 && y >= 0) {
      return Math.atan(y / x) + Math.PI;
    } else {
      return Math.atan(y / x) - Math.PI;
    }
  }
  function IMCONJUGATE(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return y !== 0 ? COMPLEX(x, -y, unit) : inumber;
  }
  function IMCOS(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.cos(x) * (Math.exp(y) + Math.exp(-y)) / 2, -Math.sin(x) * (Math.exp(y) - Math.exp(-y)) / 2, unit);
  }
  function IMCOSH(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.cos(y) * (Math.exp(x) + Math.exp(-x)) / 2, Math.sin(y) * (Math.exp(x) - Math.exp(-x)) / 2, unit);
  }
  function IMCOT(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    return IMDIV(IMCOS(inumber), IMSIN(inumber));
  }
  function IMDIV(inumber1, inumber2) {
    var a = IMREAL(inumber1);
    var b = IMAGINARY(inumber1);
    var c = IMREAL(inumber2);
    var d = IMAGINARY(inumber2);
    if (anyIsError(a, b, c, d)) {
      return value;
    }
    var unit1 = inumber1.substring(inumber1.length - 1);
    var unit2 = inumber2.substring(inumber2.length - 1);
    var unit = "i";
    if (unit1 === "j") {
      unit = "j";
    } else if (unit2 === "j") {
      unit = "j";
    }
    if (c === 0 && d === 0) {
      return num;
    }
    var den = c * c + d * d;
    return COMPLEX((a * c + b * d) / den, (b * c - a * d) / den, unit);
  }
  function IMEXP(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    var e = Math.exp(x);
    return COMPLEX(e * Math.cos(y), e * Math.sin(y), unit);
  }
  function IMLN(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.log(Math.sqrt(x * x + y * y)), Math.atan(y / x), unit);
  }
  function IMLOG10(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(10), Math.atan(y / x) / Math.log(10), unit);
  }
  function IMLOG2(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(2), Math.atan(y / x) / Math.log(2), unit);
  }
  function IMPOWER(inumber, number) {
    number = parseNumber(number);
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(number, x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    var p = Math.pow(IMABS(inumber), number);
    var t = IMARGUMENT(inumber);
    return COMPLEX(p * Math.cos(number * t), p * Math.sin(number * t), unit);
  }
  function IMPRODUCT() {
    var result = arguments[0];
    if (!arguments.length) {
      return value;
    }
    for (var i = 1; i < arguments.length; i++) {
      var a = IMREAL(result);
      var b = IMAGINARY(result);
      var c = IMREAL(arguments[i]);
      var d = IMAGINARY(arguments[i]);
      if (anyIsError(a, b, c, d)) {
        return value;
      }
      result = COMPLEX(a * c - b * d, a * d + b * c);
    }
    return result;
  }
  function IMREAL(inumber) {
    if (inumber === undefined || inumber === true || inumber === false) {
      return value;
    }
    if (inumber === 0 || inumber === "0") {
      return 0;
    }
    if ([ "i", "+i", "1i", "+1i", "-i", "-1i", "j", "+j", "1j", "+1j", "-j", "-1j" ].indexOf(inumber) >= 0) {
      return 0;
    }
    inumber = inumber + "";
    var plus = inumber.indexOf("+");
    var minus = inumber.indexOf("-");
    if (plus === 0) {
      plus = inumber.indexOf("+", 1);
    }
    if (minus === 0) {
      minus = inumber.indexOf("-", 1);
    }
    var last = inumber.substring(inumber.length - 1, inumber.length);
    var unit = last === "i" || last === "j";
    if (plus >= 0 || minus >= 0) {
      if (!unit) {
        return num;
      }
      if (plus >= 0) {
        return isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1)) ? num : Number(inumber.substring(0, plus));
      } else {
        return isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1)) ? num : Number(inumber.substring(0, minus));
      }
    } else {
      if (unit) {
        return isNaN(inumber.substring(0, inumber.length - 1)) ? num : 0;
      } else {
        return isNaN(inumber) ? num : inumber;
      }
    }
  }
  function IMSEC(inumber) {
    if (inumber === true || inumber === false) {
      return value;
    }
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    return IMDIV("1", IMCOS(inumber));
  }
  function IMSECH(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    return IMDIV("1", IMCOSH(inumber));
  }
  function IMSIN(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.sin(x) * (Math.exp(y) + Math.exp(-y)) / 2, Math.cos(x) * (Math.exp(y) - Math.exp(-y)) / 2, unit);
  }
  function IMSINH(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    return COMPLEX(Math.cos(y) * (Math.exp(x) - Math.exp(-x)) / 2, Math.sin(y) * (Math.exp(x) + Math.exp(-x)) / 2, unit);
  }
  function IMSQRT(inumber) {
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    var unit = inumber.substring(inumber.length - 1);
    unit = unit === "i" || unit === "j" ? unit : "i";
    var s = Math.sqrt(IMABS(inumber));
    var t = IMARGUMENT(inumber);
    return COMPLEX(s * Math.cos(t / 2), s * Math.sin(t / 2), unit);
  }
  function IMCSC(inumber) {
    if (inumber === true || inumber === false) {
      return value;
    }
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return num;
    }
    return IMDIV("1", IMSIN(inumber));
  }
  function IMCSCH(inumber) {
    if (inumber === true || inumber === false) {
      return value;
    }
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return num;
    }
    return IMDIV("1", IMSINH(inumber));
  }
  function IMSUB(inumber1, inumber2) {
    var a = IMREAL(inumber1);
    var b = IMAGINARY(inumber1);
    var c = IMREAL(inumber2);
    var d = IMAGINARY(inumber2);
    if (anyIsError(a, b, c, d)) {
      return value;
    }
    var unit1 = inumber1.substring(inumber1.length - 1);
    var unit2 = inumber2.substring(inumber2.length - 1);
    var unit = "i";
    if (unit1 === "j") {
      unit = "j";
    } else if (unit2 === "j") {
      unit = "j";
    }
    return COMPLEX(a - c, b - d, unit);
  }
  function IMSUM() {
    if (!arguments.length) {
      return value;
    }
    var args = flatten(arguments);
    var result = args[0];
    for (var i = 1; i < args.length; i++) {
      var a = IMREAL(result);
      var b = IMAGINARY(result);
      var c = IMREAL(args[i]);
      var d = IMAGINARY(args[i]);
      if (anyIsError(a, b, c, d)) {
        return value;
      }
      result = COMPLEX(a + c, b + d);
    }
    return result;
  }
  function IMTAN(inumber) {
    if (inumber === true || inumber === false) {
      return value;
    }
    var x = IMREAL(inumber);
    var y = IMAGINARY(inumber);
    if (anyIsError(x, y)) {
      return value;
    }
    return IMDIV(IMSIN(inumber), IMCOS(inumber));
  }
  function OCT2BIN(number, places) {
    if (!/^[0-7]{1,10}$/.test(number)) {
      return num;
    }
    var negative = !!(number.length === 10 && number.substring(0, 1) === "7");
    var decimal = negative ? parseInt(number, 8) - 1073741824 : parseInt(number, 8);
    if (decimal < -512 || decimal > 511) {
      return num;
    }
    if (negative) {
      return "1" + REPT("0", 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2);
    }
    var result = decimal.toString(2);
    if (typeof places === "undefined") {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  function OCT2DEC(number) {
    if (!/^[0-7]{1,10}$/.test(number)) {
      return num;
    }
    var decimal = parseInt(number, 8);
    return decimal >= 536870912 ? decimal - 1073741824 : decimal;
  }
  function OCT2HEX(number, places) {
    if (!/^[0-7]{1,10}$/.test(number)) {
      return num;
    }
    var decimal = parseInt(number, 8);
    if (decimal >= 536870912) {
      return "ff" + (decimal + 3221225472).toString(16);
    }
    var result = decimal.toString(16);
    if (places === undefined) {
      return result;
    } else {
      if (isNaN(places)) {
        return value;
      }
      if (places < 0) {
        return num;
      }
      places = Math.floor(places);
      return places >= result.length ? REPT("0", places - result.length) + result : num;
    }
  }
  var BETADIST = BETA.DIST;
  var BETAINV = BETA.INV;
  var BINOMDIST = BINOM.DIST;
  var CEILINGMATH = CEILING.MATH;
  var CEILINGPRECISE = CEILING.PRECISE;
  var CHIDIST = CHISQ.DIST;
  var CHIDISTRT = CHISQ.DIST.RT;
  var CHIINV = CHISQ.INV;
  var CHIINVRT = CHISQ.INV.RT;
  var CHITEST = CHISQ.TEST;
  var COVAR = COVARIANCE.P;
  var COVARIANCEP = COVARIANCE.P;
  var COVARIANCES = COVARIANCE.S;
  var CRITBINOM = BINOM.INV;
  var ERFCPRECISE = ERFC.PRECISE;
  var ERFPRECISE = ERF.PRECISE;
  var EXPONDIST = EXPON.DIST;
  var FDIST = F.DIST;
  var FDISTRT = F.DIST.RT;
  var FINV = F.INV;
  var FINVRT = F.INV.RT;
  var FLOORMATH = FLOOR.MATH;
  var FLOORPRECISE = FLOOR.PRECISE;
  var FTEST = F.TEST;
  var GAMMADIST = GAMMA.DIST;
  var GAMMAINV = GAMMA.INV;
  var GAMMALNPRECISE = GAMMALN.PRECISE;
  var HYPGEOMDIST = HYPGEOM.DIST;
  var LOGINV = LOGNORM.INV;
  var LOGNORMDIST = LOGNORM.DIST;
  var LOGNORMINV = LOGNORM.INV;
  var MODEMULT = MODE.MULT;
  var MODESNGL = MODE.SNGL;
  var NEGBINOMDIST = NEGBINOM.DIST;
  var NETWORKDAYSINTL = NETWORKDAYS.INTL;
  var NORMDIST = NORM.DIST;
  var NORMINV = NORM.INV;
  var NORMSDIST = NORM.S.DIST;
  var NORMSINV = NORM.S.INV;
  var PERCENTILEEXC = PERCENTILE.EXC;
  var PERCENTILEINC = PERCENTILE.INC;
  var PERCENTRANKEXC = PERCENTRANK.EXC;
  var PERCENTRANKINC = PERCENTRANK.INC;
  var POISSONDIST = POISSON.DIST;
  var QUARTILEEXC = QUARTILE.EXC;
  var QUARTILEINC = QUARTILE.INC;
  var RANKAVG = RANK.AVG;
  var RANKEQ = RANK.EQ;
  var SKEWP = SKEW.P;
  var STDEVP = STDEV.P;
  var STDEVS = STDEV.S;
  var TDIST = T$1.DIST;
  var TDISTRT = T$1.DIST.RT;
  var TINV = T$1.INV;
  var TTEST = T$1.TEST;
  var VARP = VAR.P;
  var VARS = VAR.S;
  var WEIBULLDIST = WEIBULL.DIST;
  var WORKDAYINTL = WORKDAY.INTL;
  var ZTEST = Z.TEST;
  function compact(array) {
    var result = [];
    arrayEach(array, (function(value) {
      if (value) {
        result.push(value);
      }
    }));
    return result;
  }
  function FINDFIELD(database, title) {
    var index = null;
    arrayEach(database, (function(value, i) {
      if (value[0] === title) {
        index = i;
        return false;
      }
    }));
    if (index == null) {
      return value;
    }
    return index;
  }
  function findResultIndex(database, criterias) {
    var matches = {};
    for (var i = 1; i < database[0].length; ++i) {
      matches[i] = true;
    }
    var maxCriteriaLength = criterias[0].length;
    for (var _i14 = 1; _i14 < criterias.length; ++_i14) {
      if (criterias[_i14].length > maxCriteriaLength) {
        maxCriteriaLength = criterias[_i14].length;
      }
    }
    for (var k = 1; k < database.length; ++k) {
      for (var l = 1; l < database[k].length; ++l) {
        var currentCriteriaResult = false;
        var hasMatchingCriteria = false;
        for (var j = 0; j < criterias.length; ++j) {
          var criteria = criterias[j];
          if (criteria.length < maxCriteriaLength) {
            continue;
          }
          var criteriaField = criteria[0];
          if (database[k][0] !== criteriaField) {
            continue;
          }
          hasMatchingCriteria = true;
          for (var p = 1; p < criteria.length; ++p) {
            if (!currentCriteriaResult) {
              var isWildcard = criteria[p] === void 0 || criteria[p] === "*";
              if (isWildcard) {
                currentCriteriaResult = true;
              } else {
                var tokenizedCriteria = parse(criteria[p] + "");
                var tokens = [ createToken(database[k][l], TOKEN_TYPE_LITERAL) ].concat(tokenizedCriteria);
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
    var result = [];
    for (var n = 0; n < database[0].length; ++n) {
      if (matches[n]) {
        result.push(n - 1);
      }
    }
    return result;
  }
  function DAVERAGE(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var sum = 0;
    arrayEach(resultIndexes, (function(value) {
      sum += targetFields[value];
    }));
    return resultIndexes.length === 0 ? div0 : sum / resultIndexes.length;
  }
  function DCOUNT(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    return COUNT(targetValues);
  }
  function DCOUNTA(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    return COUNTA(targetValues);
  }
  function DGET(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    if (resultIndexes.length === 0) {
      return value;
    }
    if (resultIndexes.length > 1) {
      return num;
    }
    return targetFields[resultIndexes[0]];
  }
  function DMAX(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var maxValue = targetFields[resultIndexes[0]];
    arrayEach(resultIndexes, (function(value) {
      if (maxValue < targetFields[value]) {
        maxValue = targetFields[value];
      }
    }));
    return maxValue;
  }
  function DMIN(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var minValue = targetFields[resultIndexes[0]];
    arrayEach(resultIndexes, (function(value) {
      if (minValue > targetFields[value]) {
        minValue = targetFields[value];
      }
    }));
    return minValue;
  }
  function DPRODUCT(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    targetValues = compact(targetValues);
    var result = 1;
    arrayEach(targetValues, (function(value) {
      result *= value;
    }));
    return result;
  }
  function DSTDEV(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    targetValues = compact(targetValues);
    return STDEV.S(targetValues);
  }
  function DSTDEVP(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    targetValues = compact(targetValues);
    return STDEV.P(targetValues);
  }
  function DSUM(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    return SUM(targetValues);
  }
  function DVAR(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    return VAR.S(targetValues);
  }
  function DVARP(database, field, criteria) {
    if (isNaN(field) && typeof field !== "string") {
      return value;
    }
    var resultIndexes = findResultIndex(database, criteria);
    var targetFields = [];
    if (typeof field === "string") {
      var index = FINDFIELD(database, field);
      targetFields = rest(database[index]);
    } else {
      targetFields = rest(database[field]);
    }
    var targetValues = [];
    arrayEach(resultIndexes, (function(value) {
      targetValues.push(targetFields[value]);
    }));
    return VAR.P(targetValues);
  }
  function validDate(d) {
    return d && d.getTime && !isNaN(d.getTime());
  }
  function ensureDate(d) {
    return d instanceof Date ? d : new Date(d);
  }
  function ACCRINT(issue, first_interest, settlement, rate, par, frequency, basis) {
    issue = ensureDate(issue);
    first_interest = ensureDate(first_interest);
    settlement = ensureDate(settlement);
    if (!validDate(issue) || !validDate(first_interest) || !validDate(settlement)) {
      return value;
    }
    if (rate <= 0 || par <= 0) {
      return num;
    }
    if ([ 1, 2, 4 ].indexOf(frequency) === -1) {
      return num;
    }
    if ([ 0, 1, 2, 3, 4 ].indexOf(basis) === -1) {
      return num;
    }
    if (settlement <= issue) {
      return num;
    }
    par = par || 0;
    basis = basis || 0;
    return par * rate * YEARFRAC(issue, settlement, basis);
  }
  function ACCRINTM() {
    throw new Error("ACCRINTM is not implemented");
  }
  function AMORDEGRC() {
    throw new Error("AMORDEGRC is not implemented");
  }
  function AMORLINC() {
    throw new Error("AMORLINC is not implemented");
  }
  function COUPDAYBS() {
    throw new Error("COUPDAYBS is not implemented");
  }
  function COUPDAYS() {
    throw new Error("COUPDAYS is not implemented");
  }
  function COUPDAYSNC() {
    throw new Error("COUPDAYSNC is not implemented");
  }
  function COUPNCD() {
    throw new Error("COUPNCD is not implemented");
  }
  function COUPNUM() {
    throw new Error("COUPNUM is not implemented");
  }
  function COUPPCD() {
    throw new Error("COUPPCD is not implemented");
  }
  function CUMIPMT(rate, nper, pv, start_period, end_period, type) {
    rate = parseNumber(rate);
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    if (anyIsError(rate, nper, pv)) {
      return value;
    }
    if (rate <= 0 || nper <= 0 || pv <= 0) {
      return num;
    }
    if (start_period < 1 || end_period < 1 || start_period > end_period) {
      return num;
    }
    if (type !== 0 && type !== 1) {
      return num;
    }
    var payment = PMT(rate, nper, pv, 0, type);
    var interest = 0;
    if (start_period === 1) {
      if (type === 0) {
        interest = -pv;
      }
      start_period++;
    }
    for (var i = start_period; i <= end_period; i++) {
      interest += type === 1 ? FV(rate, i - 2, payment, pv, 1) - payment : FV(rate, i - 1, payment, pv, 0);
    }
    interest *= rate;
    return interest;
  }
  function CUMPRINC(rate, nper, pv, start_period, end, type) {
    rate = parseNumber(rate);
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    if (anyIsError(rate, nper, pv)) {
      return value;
    }
    if (rate <= 0 || nper <= 0 || pv <= 0) {
      return num;
    }
    if (start_period < 1 || end < 1 || start_period > end) {
      return num;
    }
    if (type !== 0 && type !== 1) {
      return num;
    }
    var payment = PMT(rate, nper, pv, 0, type);
    var principal = 0;
    if (start_period === 1) {
      principal = type === 0 ? payment + pv * rate : payment;
      start_period++;
    }
    for (var i = start_period; i <= end; i++) {
      principal += type > 0 ? payment - (FV(rate, i - 2, payment, pv, 1) - payment) * rate : payment - FV(rate, i - 1, payment, pv, 0) * rate;
    }
    return principal;
  }
  function DB(cost, salvage, life, period, month) {
    month = month === undefined ? 12 : month;
    cost = parseNumber(cost);
    salvage = parseNumber(salvage);
    life = parseNumber(life);
    period = parseNumber(period);
    month = parseNumber(month);
    if (anyIsError(cost, salvage, life, period, month)) {
      return value;
    }
    if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
      return num;
    }
    if ([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].indexOf(month) === -1) {
      return num;
    }
    if (period > life) {
      return num;
    }
    if (salvage >= cost) {
      return 0;
    }
    var rate = (1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);
    var initial = cost * rate * month / 12;
    var total = initial;
    var current = 0;
    var ceiling = period === life ? life - 1 : period;
    for (var i = 2; i <= ceiling; i++) {
      current = (cost - total) * rate;
      total += current;
    }
    if (period === 1) {
      return initial;
    } else if (period === life) {
      return (cost - total) * rate;
    } else {
      return current;
    }
  }
  function DDB(cost, salvage, life, period, factor) {
    factor = factor === undefined ? 2 : factor;
    cost = parseNumber(cost);
    salvage = parseNumber(salvage);
    life = parseNumber(life);
    period = parseNumber(period);
    factor = parseNumber(factor);
    if (anyIsError(cost, salvage, life, period, factor)) {
      return value;
    }
    if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
      return num;
    }
    if (period > life) {
      return num;
    }
    if (salvage >= cost) {
      return 0;
    }
    var total = 0;
    var current = 0;
    for (var i = 1; i <= period; i++) {
      current = Math.min((cost - total) * (factor / life), cost - salvage - total);
      total += current;
    }
    return current;
  }
  function DISC() {
    throw new Error("DISC is not implemented");
  }
  function DOLLARDE(fractional_dollar, fraction) {
    fractional_dollar = parseNumber(fractional_dollar);
    fraction = parseNumber(fraction);
    if (anyIsError(fractional_dollar, fraction)) {
      return value;
    }
    if (fraction < 0) {
      return num;
    }
    if (fraction >= 0 && fraction < 1) {
      return div0;
    }
    fraction = parseInt(fraction, 10);
    var result = parseInt(fractional_dollar, 10);
    result += fractional_dollar % 1 * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10)) / fraction;
    var power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
    result = Math.round(result * power) / power;
    return result;
  }
  function DOLLARFR(decimal_dollar, fraction) {
    decimal_dollar = parseNumber(decimal_dollar);
    fraction = parseNumber(fraction);
    if (anyIsError(decimal_dollar, fraction)) {
      return value;
    }
    if (fraction < 0) {
      return num;
    }
    if (fraction >= 0 && fraction < 1) {
      return div0;
    }
    fraction = parseInt(fraction, 10);
    var result = parseInt(decimal_dollar, 10);
    result += decimal_dollar % 1 * Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) * fraction;
    return result;
  }
  function DURATION() {
    throw new Error("DURATION is not implemented");
  }
  function EFFECT(nominal_rate, npery) {
    nominal_rate = parseNumber(nominal_rate);
    npery = parseNumber(npery);
    if (anyIsError(nominal_rate, npery)) {
      return value;
    }
    if (nominal_rate <= 0 || npery < 1) {
      return num;
    }
    npery = parseInt(npery, 10);
    return Math.pow(1 + nominal_rate / npery, npery) - 1;
  }
  function FV(rate, nper, payment, value$1, type) {
    value$1 = value$1 || 0;
    type = type || 0;
    rate = parseNumber(rate);
    nper = parseNumber(nper);
    payment = parseNumber(payment);
    value$1 = parseNumber(value$1);
    type = parseNumber(type);
    if (anyIsError(rate, nper, payment, value$1, type)) {
      return value;
    }
    var result;
    if (rate === 0) {
      result = value$1 + payment * nper;
    } else {
      var term = Math.pow(1 + rate, nper);
      result = type === 1 ? value$1 * term + payment * (1 + rate) * (term - 1) / rate : value$1 * term + payment * (term - 1) / rate;
    }
    return -result;
  }
  function FVSCHEDULE(principal, schedule) {
    principal = parseNumber(principal);
    schedule = parseNumberArray(flatten(schedule));
    if (anyIsError(principal, schedule)) {
      return value;
    }
    var n = schedule.length;
    var future = principal;
    for (var i = 0; i < n; i++) {
      future *= 1 + schedule[i];
    }
    return future;
  }
  function INTRATE() {
    throw new Error("INTRATE is not implemented");
  }
  function IPMT(rate, per, nper, pv, fv, type) {
    fv = fv || 0;
    type = type || 0;
    rate = parseNumber(rate);
    per = parseNumber(per);
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    type = parseNumber(type);
    if (anyIsError(rate, per, nper, pv, fv, type)) {
      return value;
    }
    var payment = PMT(rate, nper, pv, fv, type);
    var interest = per === 1 ? type === 1 ? 0 : -pv : type === 1 ? FV(rate, per - 2, payment, pv, 1) - payment : FV(rate, per - 1, payment, pv, 0);
    return interest * rate;
  }
  function IRR(values, guess) {
    guess = guess || 0;
    values = parseNumberArray(flatten(values));
    guess = parseNumber(guess);
    if (anyIsError(values, guess)) {
      return value;
    }
    var irrResult = function irrResult(values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      for (var i = 1; i < values.length; i++) {
        result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
      }
      return result;
    };
    var irrResultDeriv = function irrResultDeriv(values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      for (var i = 1; i < values.length; i++) {
        var frac = (dates[i] - dates[0]) / 365;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      return result;
    };
    var dates = [];
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
      dates[i] = i === 0 ? 0 : dates[i - 1] + 365;
      if (values[i] > 0) {
        positive = true;
      }
      if (values[i] < 0) {
        negative = true;
      }
    }
    if (!positive || !negative) {
      return num;
    }
    guess = guess === undefined ? .1 : guess;
    var resultRate = guess;
    var epsMax = 1e-10;
    var newRate, epsRate, resultValue;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop);
    return resultRate;
  }
  function ISPMT(rate, per, nper, pv) {
    rate = parseNumber(rate);
    per = parseNumber(per);
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    if (anyIsError(rate, per, nper, pv)) {
      return value;
    }
    return pv * rate * (per / nper - 1);
  }
  function MDURATION() {
    throw new Error("MDURATION is not implemented");
  }
  function MIRR(values, finance_rate, reinvest_rate) {
    values = parseNumberArray(flatten(values));
    finance_rate = parseNumber(finance_rate);
    reinvest_rate = parseNumber(reinvest_rate);
    if (anyIsError(values, finance_rate, reinvest_rate)) {
      return value;
    }
    var n = values.length;
    var payments = [];
    var incomes = [];
    for (var i = 0; i < n; i++) {
      if (values[i] < 0) {
        payments.push(values[i]);
      } else {
        incomes.push(values[i]);
      }
    }
    var num = -NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
    var den = NPV(finance_rate, payments) * (1 + finance_rate);
    return Math.pow(num / den, 1 / (n - 1)) - 1;
  }
  function NOMINAL(effect_rate, npery) {
    effect_rate = parseNumber(effect_rate);
    npery = parseNumber(npery);
    if (anyIsError(effect_rate, npery)) {
      return value;
    }
    if (effect_rate <= 0 || npery < 1) {
      return num;
    }
    npery = parseInt(npery, 10);
    return (Math.pow(effect_rate + 1, 1 / npery) - 1) * npery;
  }
  function NPER(rate, pmt, pv, fv, type) {
    type = type === undefined ? 0 : type;
    fv = fv === undefined ? 0 : fv;
    rate = parseNumber(rate);
    pmt = parseNumber(pmt);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    type = parseNumber(type);
    if (anyIsError(rate, pmt, pv, fv, type)) {
      return value;
    }
    if (rate === 0) {
      return -(pv + fv) / pmt;
    } else {
      var _num = pmt * (1 + rate * type) - fv * rate;
      var den = pv * rate + pmt * (1 + rate * type);
      return Math.log(_num / den) / Math.log(1 + rate);
    }
  }
  function NPV() {
    var args = parseNumberArray(flatten(arguments));
    if (args instanceof Error) {
      return args;
    }
    var rate = args[0];
    var value = 0;
    for (var j = 1; j < args.length; j++) {
      value += args[j] / Math.pow(1 + rate, j);
    }
    return value;
  }
  function ODDFPRICE() {
    throw new Error("ODDFPRICE is not implemented");
  }
  function ODDFYIELD() {
    throw new Error("ODDFYIELD is not implemented");
  }
  function ODDLPRICE() {
    throw new Error("ODDLPRICE is not implemented");
  }
  function ODDLYIELD() {
    throw new Error("ODDLYIELD is not implemented");
  }
  function PDURATION(rate, pv, fv) {
    rate = parseNumber(rate);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    if (anyIsError(rate, pv, fv)) {
      return value;
    }
    if (rate <= 0) {
      return num;
    }
    return (Math.log(fv) - Math.log(pv)) / Math.log(1 + rate);
  }
  function PMT(rate, nper, pv, fv, type) {
    fv = fv || 0;
    type = type || 0;
    rate = parseNumber(rate);
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    type = parseNumber(type);
    if (anyIsError(rate, nper, pv, fv, type)) {
      return value;
    }
    var result;
    if (rate === 0) {
      result = (pv + fv) / nper;
    } else {
      var term = Math.pow(1 + rate, nper);
      result = type === 1 ? (fv * rate / (term - 1) + pv * rate / (1 - 1 / term)) / (1 + rate) : fv * rate / (term - 1) + pv * rate / (1 - 1 / term);
    }
    return -result;
  }
  function PPMT(rate, per, nper, pv, fv, type) {
    fv = fv || 0;
    type = type || 0;
    rate = parseNumber(rate);
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    type = parseNumber(type);
    if (anyIsError(rate, nper, pv, fv, type)) {
      return value;
    }
    return PMT(rate, nper, pv, fv, type) - IPMT(rate, per, nper, pv, fv, type);
  }
  function PRICE() {
    throw new Error("PRICE is not implemented");
  }
  function PRICEDISC() {
    throw new Error("PRICEDISC is not implemented");
  }
  function PRICEMAT() {
    throw new Error("PRICEMAT is not implemented");
  }
  function PV(rate, per, pmt, fv, type) {
    fv = fv || 0;
    type = type || 0;
    rate = parseNumber(rate);
    per = parseNumber(per);
    pmt = parseNumber(pmt);
    fv = parseNumber(fv);
    type = parseNumber(type);
    if (anyIsError(rate, per, pmt, fv, type)) {
      return value;
    }
    return rate === 0 ? -pmt * per - fv : ((1 - Math.pow(1 + rate, per)) / rate * pmt * (1 + rate * type) - fv) / Math.pow(1 + rate, per);
  }
  function RATE(nper, pmt, pv, fv, type, guess) {
    guess = guess === undefined ? .01 : guess;
    fv = fv === undefined ? 0 : fv;
    type = type === undefined ? 0 : type;
    nper = parseNumber(nper);
    pmt = parseNumber(pmt);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    type = parseNumber(type);
    guess = parseNumber(guess);
    if (anyIsError(nper, pmt, pv, fv, type, guess)) {
      return value;
    }
    var epsMax = 1e-10;
    var iterMax = 20;
    var rate = guess;
    type = type ? 1 : 0;
    for (var i = 0; i < iterMax; i++) {
      if (rate <= -1) {
        return num;
      }
      var y = void 0, f = void 0;
      if (Math.abs(rate) < epsMax) {
        y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
      } else {
        f = Math.pow(1 + rate, nper);
        y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
      }
      if (Math.abs(y) < epsMax) {
        return rate;
      }
      var dy = void 0;
      if (Math.abs(rate) < epsMax) {
        dy = pv * nper + pmt * type * nper;
      } else {
        f = Math.pow(1 + rate, nper);
        var df = nper * Math.pow(1 + rate, nper - 1);
        dy = pv * df + pmt * (1 / rate + type) * df + pmt * (-1 / (rate * rate)) * (f - 1);
      }
      rate -= y / dy;
    }
    return rate;
  }
  function RECEIVED() {
    throw new Error("RECEIVED is not implemented");
  }
  function RRI(nper, pv, fv) {
    nper = parseNumber(nper);
    pv = parseNumber(pv);
    fv = parseNumber(fv);
    if (anyIsError(nper, pv, fv)) {
      return value;
    }
    if (nper === 0 || pv === 0) {
      return num;
    }
    return Math.pow(fv / pv, 1 / nper) - 1;
  }
  function SLN(cost, salvage, life) {
    cost = parseNumber(cost);
    salvage = parseNumber(salvage);
    life = parseNumber(life);
    if (anyIsError(cost, salvage, life)) {
      return value;
    }
    if (life === 0) {
      return num;
    }
    return (cost - salvage) / life;
  }
  function SYD(cost, salvage, life, per) {
    cost = parseNumber(cost);
    salvage = parseNumber(salvage);
    life = parseNumber(life);
    per = parseNumber(per);
    if (anyIsError(cost, salvage, life, per)) {
      return value;
    }
    if (life === 0) {
      return num;
    }
    if (per < 1 || per > life) {
      return num;
    }
    per = parseInt(per, 10);
    return (cost - salvage) * (life - per + 1) * 2 / (life * (life + 1));
  }
  function TBILLEQ(settlement, maturity, discount) {
    settlement = parseDate(settlement);
    maturity = parseDate(maturity);
    discount = parseNumber(discount);
    if (anyIsError(settlement, maturity, discount)) {
      return value;
    }
    if (discount <= 0) {
      return num;
    }
    if (settlement > maturity) {
      return num;
    }
    if (maturity - settlement > 365 * 24 * 60 * 60 * 1e3) {
      return num;
    }
    return 365 * discount / (360 - discount * DAYS360(settlement, maturity, false));
  }
  function TBILLPRICE(settlement, maturity, discount) {
    settlement = parseDate(settlement);
    maturity = parseDate(maturity);
    discount = parseNumber(discount);
    if (anyIsError(settlement, maturity, discount)) {
      return value;
    }
    if (discount <= 0) {
      return num;
    }
    if (settlement > maturity) {
      return num;
    }
    if (maturity - settlement > 365 * 24 * 60 * 60 * 1e3) {
      return num;
    }
    return 100 * (1 - discount * DAYS360(settlement, maturity, false) / 360);
  }
  function TBILLYIELD(settlement, maturity, pr) {
    settlement = parseDate(settlement);
    maturity = parseDate(maturity);
    pr = parseNumber(pr);
    if (anyIsError(settlement, maturity, pr)) {
      return value;
    }
    if (pr <= 0) {
      return num;
    }
    if (settlement > maturity) {
      return num;
    }
    if (maturity - settlement > 365 * 24 * 60 * 60 * 1e3) {
      return num;
    }
    return (100 - pr) * 360 / (pr * DAYS360(settlement, maturity, false));
  }
  function VDB() {
    throw new Error("VDB is not implemented");
  }
  function XIRR(values, dates, guess) {
    values = parseNumberArray(flatten(values));
    dates = parseDateArray(flatten(dates));
    guess = parseNumber(guess);
    if (anyIsError(values, dates, guess)) {
      return value;
    }
    var irrResult = function irrResult(values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      for (var i = 1; i < values.length; i++) {
        result += values[i] / Math.pow(r, DAYS(dates[i], dates[0]) / 365);
      }
      return result;
    };
    var irrResultDeriv = function irrResultDeriv(values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      for (var i = 1; i < values.length; i++) {
        var frac = DAYS(dates[i], dates[0]) / 365;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      return result;
    };
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
      if (values[i] > 0) {
        positive = true;
      }
      if (values[i] < 0) {
        negative = true;
      }
    }
    if (!positive || !negative) {
      return num;
    }
    guess = guess || .1;
    var resultRate = guess;
    var epsMax = 1e-10;
    var newRate, epsRate, resultValue;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop);
    return resultRate;
  }
  function XNPV(rate, values, dates) {
    rate = parseNumber(rate);
    values = parseNumberArray(flatten(values));
    dates = parseDateArray(flatten(dates));
    if (anyIsError(rate, values, dates)) {
      return value;
    }
    var result = 0;
    for (var i = 0; i < values.length; i++) {
      result += values[i] / Math.pow(1 + rate, DAYS(dates[i], dates[0]) / 365);
    }
    return result;
  }
  function YIELD() {
    throw new Error("YIELD is not implemented");
  }
  function YIELDDISC() {
    throw new Error("YIELDDISC is not implemented");
  }
  function YIELDMAT() {
    throw new Error("YIELDMAT is not implemented");
  }
  function AND() {
    var args = flatten(arguments);
    var result = value;
    for (var i = 0; i < args.length; i++) {
      if (args[i] instanceof Error) {
        return args[i];
      }
      if (args[i] === undefined || args[i] === null || typeof args[i] === "string") {
        continue;
      }
      if (result === value) {
        result = true;
      }
      if (!args[i]) {
        result = false;
      }
    }
    return result;
  }
  function FALSE() {
    return false;
  }
  function IF(logical_test, value_if_true, value_if_false) {
    if (logical_test instanceof Error) {
      return logical_test;
    }
    value_if_true = arguments.length >= 2 ? value_if_true : true;
    if (value_if_true === undefined || value_if_true === null) {
      value_if_true = 0;
    }
    value_if_false = arguments.length === 3 ? value_if_false : false;
    if (value_if_false === undefined || value_if_false === null) {
      value_if_false = 0;
    }
    return logical_test ? value_if_true : value_if_false;
  }
  function IFS() {
    for (var i = 0; i < arguments.length / 2; i++) {
      if (arguments[i * 2]) {
        return arguments[i * 2 + 1];
      }
    }
    return na;
  }
  function IFERROR(value, value_if_error) {
    if (ISERROR(value)) {
      return value_if_error;
    }
    return value;
  }
  function IFNA(value, value_if_na) {
    return value === na ? value_if_na : value;
  }
  function NOT(logical) {
    if (typeof logical === "string") {
      return value;
    }
    if (logical instanceof Error) {
      return logical;
    }
    return !logical;
  }
  function OR() {
    var args = flatten(arguments);
    var result = value;
    for (var i = 0; i < args.length; i++) {
      if (args[i] instanceof Error) {
        return args[i];
      }
      if (args[i] === undefined || args[i] === null || typeof args[i] === "string") {
        continue;
      }
      if (result === value) {
        result = false;
      }
      if (args[i]) {
        result = true;
      }
    }
    return result;
  }
  function TRUE() {
    return true;
  }
  function XOR() {
    var args = flatten(arguments);
    var result = value;
    for (var i = 0; i < args.length; i++) {
      if (args[i] instanceof Error) {
        return args[i];
      }
      if (args[i] === undefined || args[i] === null || typeof args[i] === "string") {
        continue;
      }
      if (result === value) {
        result = 0;
      }
      if (args[i]) {
        result++;
      }
    }
    if (result === value) {
      return result;
    }
    return !!(Math.floor(Math.abs(result)) & 1);
  }
  function SWITCH() {
    var result;
    if (arguments.length > 0) {
      var targetValue = arguments[0];
      var argc = arguments.length - 1;
      var switchCount = Math.floor(argc / 2);
      var switchSatisfied = false;
      var hasDefaultClause = argc % 2 !== 0;
      var defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];
      if (switchCount) {
        for (var index = 0; index < switchCount; index++) {
          if (targetValue === arguments[index * 2 + 1]) {
            result = arguments[index * 2 + 2];
            switchSatisfied = true;
            break;
          }
        }
      }
      if (!switchSatisfied) {
        result = hasDefaultClause ? defaultClause : na;
      }
    } else {
      result = value;
    }
    return result;
  }
  var FLATTEN = flatten;
  function ARGS2ARRAY() {
    return Array.prototype.slice.call(arguments, 0);
  }
  function REFERENCE(context, reference) {
    if (!arguments.length) {
      return error;
    }
    try {
      var path = reference.split(".");
      var result = context;
      for (var i = 0; i < path.length; ++i) {
        var step = path[i];
        if (step[step.length - 1] === "]") {
          var opening = step.indexOf("[");
          var index = step.substring(opening + 1, step.length - 1);
          result = result[step.substring(0, opening)][index];
        } else {
          result = result[step];
        }
      }
      return result;
    } catch (error) {}
  }
  function JOIN(array, separator) {
    return array.join(separator);
  }
  function NUMBERS() {
    var possibleNumbers = flatten(arguments);
    return possibleNumbers.filter((function(el) {
      return typeof el === "number";
    }));
  }
  function SINGLE(value) {
    if (value instanceof Array) {
      for (var i = 0; i < value.length; i++) {
        if (!(value[i] instanceof Array)) {
          return na;
        }
        if (value[i].length === 0) {
          return na;
        }
        if (value[i].length !== value[0].length) {
          return na;
        }
      }
      return value[0][0];
    }
    return value;
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
