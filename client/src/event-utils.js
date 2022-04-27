
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    teacherId: "624d4ed9bc1d81e3e89ad480",
    courseId: "624d51ef90f2e16ca1dcf0e5",

    fromTime: "4:30",
    toTime: "5:30",
    numHours: 7,
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    teacherId: "624d4ed9bc1d81e3e89ad480",
    courseId: "624d51ef90f2e16ca1dcf0e5",

    fromTime: "4:30",
    toTime: "1:30",
    numHours: 4,
    start: new Date(2022, 3,17,4,30)
    // start: todayStr + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}
