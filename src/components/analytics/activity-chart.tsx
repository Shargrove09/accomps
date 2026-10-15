"use client";

import { useRouter } from "next/navigation";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ActivityPoint = { label: string; count: number; prev: number; avg: number | null; href: string };

export default function ActivityChart({ data, avgLabel }: { data: ActivityPoint[]; avgLabel: string }) {
  const router = useRouter();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke="#6c6c99" strokeOpacity={0.3} />
        <XAxis dataKey="label" tick={{ fill: "#9c9cc2", fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis
          allowDecimals={false}
          domain={[0, (max: number) => Math.max(3, max)]}
          tick={{ fill: "#9c9cc2", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "#4b4b77", fillOpacity: 0.3 }}
          contentStyle={{ background: "#1e1e2f", border: "1px solid #6c6c99", borderRadius: 6, color: "#d8d8e4" }}
          labelStyle={{ color: "#d8d8e4" }}
        />
        <Bar
          dataKey="count"
          name="Accomplishments"
          fill="#8f9bff"
          radius={[3, 3, 0, 0]}
          isAnimationActive={false}
          className="cursor-pointer"
          onClick={(d: { payload?: ActivityPoint }) => d.payload?.href && router.push(d.payload.href)}
        />
        <Line dataKey="avg" name={avgLabel} type="monotone" stroke="#d8d8e4" strokeWidth={2} dot={false} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
