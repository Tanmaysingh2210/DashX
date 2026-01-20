export const getUserDate = timezone => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone
  }).format(new Date()); // YYYY-MM-DD
};


export const getUserYesterdayDate = timezone => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(now);
  const dateObj = {};
  parts.forEach(p => (dateObj[p.type] = p.value));

  const date = new Date(
    `${dateObj.year}-${dateObj.month}-${dateObj.day}`
  );
  date.setDate(date.getDate() - 1);

  return date.toISOString().slice(0, 10);
};