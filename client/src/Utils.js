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
export const isDateEqualsCurrentViewYearAndMonth = (date) => {
  let { year, month } = getCurrentViewMonthAndYear();
  return year == date.getFullYear() && month == date.getMonth();

}
export const isDateBeforeCurrentViewYearAndMonth = (date) => {
  let { year, month } = getCurrentViewMonthAndYear();
  return year > date.getFullYear() || year == date.getFullYear() && month > date.getMonth();

}
export const convertToTime = (time) => {
  let d = new Date("1-1-1900 " + time);
  d.setMonth(new Date().getMonth());
  d.setFullYear(new Date().getFullYear());
  d.setDate(new Date().getDate())
  return d;
}

export const dateStringToTimeString = (date) => {
  let d = new Date(date);
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0")

}
export const shortStr = (str, len = 8) => {
  let res = str.slice(0, len);
  let words = str.split(" ");
  if (words.length > 1 && words[0] + " " + words[1] < 10)
    res = words[0] + " " + words[1];
  if (res.length < str.length)
    res += "...";
  return res;
}
export const getDayByNumber = (num) => {
  return String.fromCharCode(1488 + num);
}
export const calculateLessons = (fromTime, toTime) => {
  console.log(fromTime)
  let fullHours = toTime.getHours() - fromTime.getHours();
  let minutes = fullHours * 60 + toTime.getMinutes() - fromTime.getMinutes();
  let breakes = Math.floor(minutes / 135);
  return ((minutes - breakes * 15) / 45).toFixed(2);
}
export const countTravelingDays = (reportsArr) => {
  //Nחשב את מספר הימים הפרונטליים אבל לא בודק מה קורה כאשר ישנם מספר שיעורים באותו יום
  return reportsArr.filter(item => item.type == "פרונטלי").length;
}