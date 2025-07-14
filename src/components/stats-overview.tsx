import { db } from "@/lib/db";
import { TrendingUp, Calendar, Tag, Award } from "lucide-react";

export async function StatsOverview() {
  const [totalAccomplishments, thisWeekCount, totalCategories, totalTags] =
    await Promise.all([
      db.accomplishment.count(),
      db.accomplishment.count({
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
      db.category.count(),
      db.tag.count(),
    ]);

  const stats = [
    {
      label: "Total Accomplishments",
      value: totalAccomplishments,
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-kimberly",
    },
    {
      label: "This Week",
      value: thisWeekCount,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-kimberly",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-kimberly",
    },
    {
      label: "Tags",
      value: totalTags,
      icon: Tag,
      color: "text-orange-600",
      bgColor: "bg-kimberly",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-kimberly rounded-lg shadow-sm border p-6 text-center border-mischka"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${stat.bgColor}`}
            >
              <Icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
