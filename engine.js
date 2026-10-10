/* Gregorian calendar. BDAY numbering: Sunday = 1, Saturday = 7. */
(function (root) {
  'use strict';
  const mod = (n, m = 7) => ((n % m) + m) % m;
  const normalize = n => mod(n - 1) + 1;
  const leap = y => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const daysInMonth = (y, m) => [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1] || 0;
  const validYear = y => Number.isInteger(y) && y >= 1 && y <= 9999;
  const valid = (y, m, d) => validYear(y) && Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(d) && d >= 1 && d <= daysInMonth(y, m);
  const centuryAnchor = y => [3, 1, 6, 4][mod(Math.floor(y / 100), 4)];
  const reference = (y, m) => [leap(y) ? 4 : 3, leap(y) ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12][m - 1];
  function yearDetails(year) {
    if (!validYear(year)) throw new RangeError('Invalid Gregorian year');
    const a = year % 100, removed = Math.floor(a / 28) * 28, reduced = a - removed;
    const q = Math.floor(reduced / 4), sum = reduced + q, contribution = mod(sum);
    const x = centuryAnchor(year), z = normalize(x + contribution);
    return { year, a, removed, reduced, q, sum, contribution, x, z, leap: leap(year) };
  }
  function details(year, month, day) {
    if (!valid(year, month, day)) throw new RangeError('Invalid Gregorian date');
    const annual = yearDetails(year), anchor = reference(year, month), offset = day - anchor;
    return { ...annual, month, day, anchor, offset, remainder: mod(offset), weekday: normalize(annual.z + offset) };
  }
  const weekday = (y, m, d) => details(y, m, d).weekday;
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  function randomDate(min = 1700, max = 2199) {
    if (!validYear(min) || !validYear(max) || min > max) throw new RangeError('Invalid year range');
    const year = randomInt(min, max), month = randomInt(1, 12);
    return { year, month, day: randomInt(1, daysInMonth(year, month)) };
  }
  const api = Object.freeze({ mod, normalize, leap, daysInMonth, validYear, valid, centuryAnchor, reference, yearDetails, details, weekday, randomInt, randomDate });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BdayMath = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
