type DateInput = string | number | Date;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatDate(input: DateInput, pattern: string): string {
  const date = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(date.getTime())) return "";

  const day = pad(date.getDate());
  const monthIndex = date.getMonth();
  const monthShort = MONTHS_SHORT[monthIndex];
  const monthLong = MONTHS_LONG[monthIndex];
  const year = date.getFullYear();
  const weekday = DAYS_LONG[date.getDay()];

  switch (pattern) {
    case "MMM":
      return monthShort;
    case "dd MMM":
      return `${day} ${monthShort}`;
    case "dd MMM yyyy":
      return `${day} ${monthShort} ${year}`;
    case "dd MMMM yyyy":
      return `${day} ${monthLong} ${year}`;
    case "EEEE, dd MMMM yyyy":
      return `${weekday}, ${day} ${monthLong} ${year}`;
    case "hh:mm a":
      return date.toLocaleTimeString("en-UG", { hour: "numeric", minute: "2-digit" });
    default:
      return date.toLocaleDateString("en-GB");
  }
}
