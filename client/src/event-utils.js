
let eventGuid = 0
let todayStr = new Date("2022-07-10T22:00:00.000Z").toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
let d = new Date();
let tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    teacherId: "624d4ed9bc1d81e3e89ad480",
    courseId: "624d51ef90f2e16ca1dcf0e5",

    fromTime: "4:30",
    toTime: "5:30",
    numHours: 7,
    start: "2022-07-00T22:00:00.000Z"
  },
  {
    id: createEventId(),
    title: 'Timed event',
    teacherId: "624d4ed9bc1d81e3e89ad480",
    courseId: "624d51ef90f2e16ca1dcf0e5",

    fromTime: "4:30",
    toTime: "1:30",
    numHours: 4,
    start: tomorrow
    // start: todayStr + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    teacherId: "624d4ed9bc1d81e3e89ad480",
    courseId: "624d51ef90f2e16ca1dcf0e5",

    fromTime: "4:30",
    toTime: "1:30",
    numHours: 4,
    start: new Date(2022, 7, 18, 4, 30)
    // start: todayStr + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}
