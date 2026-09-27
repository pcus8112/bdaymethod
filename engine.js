/* Gregorian arithmetic only. Weekday numbers follow BDAY: Sun=1 ... Sat=7. */
(function (root) {
  'use strict';
  const mod = (n, m = 7) => ((n % m) + m) % m;
  const leap = y => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const daysInMonth = (y, m) => [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] || 0;
  function valid(y, m, d) {
    return [y,m,d].every(Number.isInteger) && y >= 1 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
  }
  const normalize = n => mod(n - 1) + 1;
  const centuryAnchor = y => [3, 1, 6, 4][mod(Math.floor(y / 100), 4)];
  const reference = (y, m) => [leap(y) ? 4 : 3, leap(y) ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12][m - 1];
  function details(y, m, d) {
    if (!valid(y, m, d)) throw new RangeError('Invalid Gregorian date');
    const a = y % 100, q = Math.floor(a / 4), contribution = mod(a + q);
    const x = centuryAnchor(y), z = normalize(x + contribution), anchor = reference(y, m);
    const offset = d - anchor, remainder = mod(offset);
    return {year:y, month:m, day:d, a, q, contribution, x, z, anchor, offset, remainder, weekday:normalize(z + remainder), leap:leap(y)};
  }
  const weekday = (y,m,d) => details(y,m,d).weekday;
  const randomInt = (min,max) => Math.floor(Math.random() * (max - min + 1)) + min;
  function randomDate(min=1700,max=2199) {
    const year=randomInt(min,max), month=randomInt(1,12);
    return {year,month,day:randomInt(1,daysInMonth(year,month))};
  }
  const api = Object.freeze({mod,leap,daysInMonth,valid,normalize,centuryAnchor,reference,details,weekday,randomDate,randomInt});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BdayMath = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
