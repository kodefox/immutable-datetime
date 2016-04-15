/* @flow */
const {describe, it} = global;
import expect from 'expect';
import DateTime from '../DateTime';

describe('DateTime', () => {
  it('should parse a date string', () => {
    let date = DateTime.fromString('2016-01-10T12:03:49Z');
    expect(date.toNumber()).toBe(1452427429000);
    expect(date.toString()).toBe('2016-01-10T12:03:49Z');
    expect(date.toDateString()).toBe('2016-01-10');
    date = DateTime.fromDateString('2016-01-10');
    expect(date.toNumber()).toBe(1452384000000);
    expect(date.toString()).toBe('2016-01-10T00:00:00Z');
    expect(date.toDateString()).toBe('2016-01-10');
  });

  it('should discard milliseconds', () => {
    let date;
    date = DateTime.fromString('2016-01-10T12:03:49.501Z');
    expect(date.toNumber()).toBe(1452427429000);
    expect(date.toString()).toBe('2016-01-10T12:03:49Z');
    date = DateTime.fromNumber(1452427429001);
    expect(date.toNumber()).toBe(1452427429000);
    date = DateTime.fromNumber(1452427429999);
    expect(date.toNumber()).toBe(1452427429000);
    date = DateTime.fromNumber(-31536000999);
    expect(date.toNumber()).toBe(-31536000000);
    date = DateTime.fromNumber(-31536000001);
    expect(date.toNumber()).toBe(-31536000000);
  });

  it('should implicitly cast using valueOf and toString', () => {
    let date;
    date = DateTime.fromString('2016-01-10T12:03:49Z');
    expect(+date).toBe(1452427429000);
    expect(String(date)).toBe('2016-01-10T12:03:49Z');
    // $FlowIgnore - Ignore this so we can test string casting.
    expect('' + date).toBe('1452427429000');
    // $FlowIgnore - Number compare should implicitly call `valueOf()`
    expect(date > 1452427428999).toBe(true);
    // $FlowIgnore - Number compare should implicitly call `valueOf()`
    expect(date < 1452427429001).toBe(true);
  });

  it('should throw with invalid date string', () => {
    let invalidDate = '2016-01-10T12:03:49';
    expect(() => DateTime.fromString(invalidDate)).toThrow();
    invalidDate = '2016-01-1';
    expect(() => DateTime.fromString(invalidDate)).toThrow();
  });

  it('should add months', () => {
    let date = DateTime.fromDateString('2015-12-31');
    expect(date.addMonths(2).toDateString()).toBe('2016-02-29');
    date = DateTime.fromDateString('2015-12-31');
    expect(date.addMonths(3).toDateString()).toBe('2016-03-31');
    date = DateTime.fromDateString('2015-12-31');
    expect(date.addMonths(4).toDateString()).toBe('2016-04-30');
    date = DateTime.fromDateString('2016-01-08');
    expect(date.addMonths(-1).toDateString()).toBe('2015-12-08');
    date = DateTime.fromDateString('2016-02-08');
    expect(date.addMonths(-15).toDateString()).toBe('2014-11-08');
  });

  it('should add days', () => {
    let date = DateTime.fromDateString('2016-02-29');
    expect(date.addDays(1).toDateString()).toBe('2016-03-01');
    date = DateTime.fromString('2015-07-01T23:59:00Z');
    expect(date.addDays(-1).toString()).toBe('2015-06-30T23:59:00Z');
  });

  it('should add hours', () => {
    let date = DateTime.fromString('2016-02-29T00:00:00Z');
    let newDate = date.addHours(1);
    expect(newDate).toNotBe(date);
    expect(newDate.toString()).toBe('2016-02-29T01:00:00Z');
    date = DateTime.fromString('2016-02-29T23:00:00Z');
    expect(date.addHours(1).toDateString()).toBe('2016-03-01');
  });

  it('should add minutes', () => {
    let date = DateTime.fromString('2016-02-29T00:00:00Z');
    let newDate = date.addMinutes(60);
    expect(newDate).toNotBe(date);
    expect(newDate.toString()).toBe('2016-02-29T01:00:00Z');
    date = DateTime.fromString('2016-02-29T23:00:00Z');
    expect(date.addMinutes(60).toDateString()).toBe('2016-03-01');
  });

  it('should add seconds', () => {
    let date = DateTime.fromString('2016-02-29T00:00:00Z');
    let newDate = date.addSeconds(121);
    expect(newDate).toNotBe(date);
    expect(newDate.toString()).toBe('2016-02-29T00:02:01Z');
    date = DateTime.fromString('2016-12-31T23:59:50Z');
    expect(date.addSeconds(11).toString()).toBe('2017-01-01T00:00:01Z');
  });

  it('should compare', () => {
    let date = DateTime.fromString('2016-02-29T00:00:00Z');
    let newDate = date.addHours(1).addHours(-1);
    expect(newDate).toNotBe(date);
    expect(newDate.isEqualTo(date)).toBe(true);
    newDate = date.addHours(1);
    expect(newDate.isEqualTo(date)).toBe(false);
    expect(newDate.isLessThan(date)).toBe(false);
    expect(newDate.isGreaterThan(date)).toBe(true);
  });

  it('should create from parts', () => {
    let date = DateTime.fromParts(2016, 1, 29, 0, 0, 0);
    expect(date.toString()).toBe('2016-02-29T00:00:00Z');
    date = DateTime.fromDateParts(2016, 1, 29);
    expect(date.toDateString()).toBe('2016-02-29');
  });

  it('should get parts', () => {
    let date = DateTime.fromString('2016-02-29T03:21:08Z');
    let newDate = DateTime.fromParts(
      date.getYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    );
    expect(newDate.getDay()).toBe(1);
    expect(newDate.isEqualTo(date)).toBe(true);
    expect(newDate.toString()).toBe('2016-02-29T03:21:08Z');
    newDate = DateTime.fromDateParts(
      date.getYear(),
      date.getMonth(),
      date.getDate(),
    );
    expect(newDate.isLessThan(date)).toBe(true);
    expect(newDate.toString()).toBe('2016-02-29T00:00:00Z');
  });
});
