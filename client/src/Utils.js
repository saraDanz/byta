export const getCurrentViewMonthAndYear = () => {
  let today = new Date();
  if (today.getDate() >= 20)
    return { month: today.getMonth(), year: today.getFullYear() };
  let month = today.getMonth() - 1;
  let year = today.getFullYear();
  if (month == 0) {
    month = 12;
    year--;
  }

  return { month, year };
}
