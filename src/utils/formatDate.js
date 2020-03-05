import {
  isValid,
  isPast,
  format,
  differenceInMinutes,
  isToday,
  isYesterday,
  isTomorrow
} from "date-fns";

export default function formatDate(date, mode) {
  let template = "";
  switch (mode) {
    case "date-time":
      template = "LLL d, hh:mm aaaa";
      break;

    case "date":
      template = "LLL d";
      break;

    case "date-year":
      template = "LLL d, yyyy";
      break;

    case "date-time-year":
      template = "LLL d, yyyy hh:mm aaaa";
      break;

    default:
      template = "LLL d, yyyy hh:mm aaaa";
      break;
  }

  if (isValid(date)) {
    const minutes = differenceInMinutes(Date.now(), date);

    if (isPast(date) && minutes < 1) return "just now";
    if (isPast(date) && minutes < 59) return `${minutes}m`;

    return isToday(date)
      ? `Today, ${format(date, "hh:mm aaaa")}`
      : isYesterday(date)
      ? `Yesterday, ${format(date, "hh:mm aaaa")}`
      : isTomorrow(date)
      ? `Tomorrow, ${format(date, "hh:mm aaaa")}`
      : format(date, template);
  }
}
