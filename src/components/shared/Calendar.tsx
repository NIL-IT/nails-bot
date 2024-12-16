import * as React from "react";
import { Calendar } from "../ui/Calendar";

export function CalendarDemo({ setIsCalendar }) {
  const options = {
    month: "long",
    year: "numeric",
    day: "numeric",
    weekday: "long",
    timezone: "UTC",
  };
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  console.log(date.toLocaleString("ru", options));
  return (
    <Calendar
      setIsCalendar={setIsCalendar}
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow"
    />
  );
}
