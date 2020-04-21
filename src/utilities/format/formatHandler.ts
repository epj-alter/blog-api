export function formatQueryError(error: any) {
  return error.severity + ' CODE ' + error.code + ' ' + error.type + ' ' + error.message;
}

export function formatDateToSQL(date) {
  let month = '' + date.getMonth();
  let day = '' + date.getDate();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [day, month, date.getFullYear()].join('.');
}

export function formateDateToLocale(date) {
  const options = { year: 'numeric', month: 'long', day: '2-digit' };
  return date.toLocaleDateString(undefined, options);
}
