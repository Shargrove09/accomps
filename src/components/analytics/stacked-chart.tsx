"use client";

import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type StackCategory = { id: string; name: string; color: string | null };
/** `label` and `href`, plus one `c_<categoryId>` count per stack category. */
export type StackPoint = Record<string, string | number>;

const safe = (c: string | null) => (/^#[0-9a-f]{6}$/i.test(c ?? "") ? c! : "#6B7280");

export default function StackedChart({ data, categories }: { data: StackPoint[]; categories: StackCategory[] }) {
  const router = useRouter();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke="#6c6c99" strokeOpacity={0.3} />
        <XAxis dataKey="label" tick={{ fill: "#9c9cc2", fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis allowDecimals={false} tick={{ fill: "#9c9cc2", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "#4b4b77", fillOpacity: 0.3 }}
          contentStyle={{ background: "#1e1e2f", border: "1px solid #6c6c99", borderRadius: 6, color: "#d8d8e4" }}
          labelStyle={{ color: "#d8d8e4" }}
        />
        <Legend wrapperStyle={{ color: "#9c9cc2", fontSize: 12 }} />
        {categories.map((c) => (
          <Bar
            key={c.id}
            dataKey={`c_${c.id}`}
            name={c.name}
            stackId="cats"
            fill={safe(c.color)}
            isAnimationActive={false}
            className="cursor-pointer"
            onClick={(d: { payload?: StackPoint }) => typeof d.payload?.href === "string" && router.push(d.payload.href)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
