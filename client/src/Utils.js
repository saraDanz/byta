export const getCurrentViewMonthAndYear = () => {
  let today = new Date();
  if (today.getDate() >= 7)
    return { month: today.getMonth(), year: today.getFullYear() };
  let month = today.getMonth() - 1;
  let year = today.getFullYear();
  if (month == 0) {
    month = 12;
    year--;
  }

  return { month, year };
}
export const convertToTime = (time) => {
  let d = new Date("1-1-1900 " + time);
  d.setMonth(new Date().getMonth());
  d.setFullYear(new Date().getFullYear());
  d.setDate(new Date().getDate())
  return d;
}
export const DateStringToTimeString = (date) => {
  let d = new Date(date);
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0")

}