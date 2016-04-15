/* @flow */

const SECRET_KEY = {_: 'secret'};
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;

const JSON_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/;
const JSON_DATE_ONLY = /^\d{4}-\d{2}-\d{2}/;

export default class DateTime {
  _dateTime: Date;

  constructor(secretKey: Object, value: number) {
    if (secretKey !== SECRET_KEY) {
      throw new Error("Don't construct `DateTime` directly. Use a static method like `DateTime.fromString()`.");
    }
    let isNaN = (value !== value); // eslint-disable-line no-self-compare
    let date = new Date(isNaN ? 0 : truncateMilliseconds(value));
    // This helps with console.log.
    Object.defineProperty(date, 'toString', {value: date.toUTCString});
    this._dateTime = date;
  }

  static now(): DateTime {
    return new DateTime(SECRET_KEY, Date.now());
  }

  static fromNumber(milliseconds: number): DateTime {
    return new DateTime(SECRET_KEY, milliseconds);
  }

  static fromParts(year: number, month: number, day: number, hours: number, minutes: number, seconds: number): DateTime {
    return new DateTime(SECRET_KEY, Date.UTC(year, month, day, hours, minutes, seconds));
  }

  static fromDateParts(year: number, month: number, day: number): DateTime {
    return new DateTime(SECRET_KEY, Date.UTC(year, month, day));
  }

  static fromString(dateString: string): DateTime {
    if (!JSON_DATE_TIME.test(dateString)) {
      throw new Error('Unable to parse date: ' + dateString);
    }
    return new DateTime(SECRET_KEY, Date.parse(dateString));
  }

  static fromDateString(dateString: string): DateTime {
    if (!JSON_DATE_ONLY.test(dateString)) {
      throw new Error('Unable to parse date: ' + dateString);
    }
    return new DateTime(SECRET_KEY, Date.parse(dateString + 'T00:00:00Z'));
  }

  // 2016-01-10T12:03:49Z
  toString(): string {
    return this._dateTime.toISOString().slice(0, 19) + 'Z';
  }

  // 2016-01-10
  toDateString(): string {
    return this._dateTime.toISOString().slice(0, 10);
  }

  // 2016-01-10T12:03:49.000Z
  toJSON(): string {
    return this._dateTime.toISOString();
  }

  inspect(): string {
    return this._dateTime.toUTCString();
  }

  toNumber(): number {
    return this._dateTime.valueOf();
  }

  // This is used implicitly when comparing such as: `date1 < date2`.
  valueOf(): number {
    return this._dateTime.valueOf();
  }

  // This returns the day of the month.
  getDate(): number {
    return this._dateTime.getUTCDate();
  }

  // This returns the day of the week.
  getDay(): number {
    return this._dateTime.getUTCDay();
  }

  getMonth(): number {
    return this._dateTime.getUTCMonth();
  }

  getYear(): number {
    return this._dateTime.getUTCFullYear();
  }

  getHours(): number {
    return this._dateTime.getUTCHours();
  }

  getMinutes(): number {
    return this._dateTime.getUTCMinutes();
  }

  getSeconds(): number {
    return this._dateTime.getUTCSeconds();
  }

  addMonths(num: number): DateTime {
    let newMonth = this.getMonth() + num;
    let yearsToAdd = truncate(newMonth / 12);
    newMonth = newMonth % 12;
    if (newMonth < 0) {
      newMonth = 12 + newMonth;
      yearsToAdd -= 1;
    }
    let newYear = this.getYear() + yearsToAdd;
    let newDate = DateTime.fromParts(
      newYear,
      newMonth,
      this.getDate(),
      this.getHours(),
      this.getMinutes(),
      this.getSeconds(),
    );
    // If the new date has a month we don't expect then the day must have
    // caused an overflow (like 31st Feb) which increased the month.
    while (newDate.getMonth() !== newMonth) {
      newDate = newDate.addDays(-1);
    }
    return newDate;
  }

  addDays(num: number): DateTime {
    let newValue = this._dateTime.valueOf() + (ONE_DAY * num);
    return new DateTime(SECRET_KEY, newValue);
  }

  addHours(num: number): DateTime {
    let newValue = this._dateTime.valueOf() + (ONE_HOUR * num);
    return new DateTime(SECRET_KEY, newValue);
  }

  addMinutes(num: number): DateTime {
    let newValue = this._dateTime.valueOf() + (ONE_MINUTE * num);
    return new DateTime(SECRET_KEY, newValue);
  }

  addSeconds(num: number): DateTime {
    let newValue = this._dateTime.valueOf() + (ONE_SECOND * num);
    return new DateTime(SECRET_KEY, newValue);
  }

  isEqualTo(otherDate: DateTime): boolean {
    return (this.toNumber() === otherDate.toNumber());
  }

  isLessThan(otherDate: DateTime): boolean {
    return (this.toNumber() < otherDate.toNumber());
  }

  isGreaterThan(otherDate: DateTime): boolean {
    return (this.toNumber() > otherDate.toNumber());
  }
}

function truncateMilliseconds(num: number) {
  return truncate(num / 1000) * 1000;
}

function truncate(num: number) {
  return (num > 0) ? Math.floor(num) : Math.ceil(num);
}
