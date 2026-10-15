import { CalendarView } from "@/components/calendar/calendar-view";
import { db } from "@/lib/db";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const entries = await db.accomplishment.findMany({
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { date: "desc" },
  });

  return <CalendarView entries={entries} />;
}
