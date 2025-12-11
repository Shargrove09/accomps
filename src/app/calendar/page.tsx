import AccomplishmentsCalendar from "@/components/accomplishments-calendar";
import { db } from "@/lib/db";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const accomplishments = await db.accomplishment.findMany();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Accomplishments Calendar</h1>
      <AccomplishmentsCalendar accomplishments={accomplishments} />
    </div>
  );
}
