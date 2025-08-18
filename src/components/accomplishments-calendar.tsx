"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Accomplishment } from "@prisma/client";
import { useState } from "react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface AccomplishmentsCalendarProps {
  accomplishments: Accomplishment[];
}

export default function AccomplishmentsCalendar({
  accomplishments,
}: AccomplishmentsCalendarProps) {
  const [date, setDate] = useState(new Date());

  const events = accomplishments.map((accomplishment) => ({
    title: accomplishment.title,
    start: new Date(accomplishment.date),
    end: new Date(accomplishment.date),
    allDay: true,
    resource: accomplishment,
  }));

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
      />
    </div>
  );
}
