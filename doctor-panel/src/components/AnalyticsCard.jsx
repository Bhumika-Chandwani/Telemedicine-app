import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function AnalyticsCard({ stats }) {
  const data = [
    { name: "Attended", value: stats.attended },
    { name: "Missed", value: stats.missed },
  ];

  const COLORS = ["#0d9488", "#d1fae5"];

  const total = stats.attended + stats.missed;
  const percentage = total
    ? Math.round((stats.attended / total) * 100)
    : 0;

  return (
    <div
      className="
        karla-font
        w-[400px]
        bg-teal-50/40
        border border-teal-500/30
        rounded-2xl
        p-6
        shadow-sm
      "
    >
      {/* Title */}
      <h2 className="text-lg text-center text-black mb-6">
        Monthly Activity Analysis
      </h2>

      {/* Chart Section (Top) */}
      <div className="flex justify-center mb-6">
        <div className="w-[200px] h-[200px] relative">

          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl text-black">
              {percentage}%
            </p>
          </div>

        </div>
      </div>

      {/* Stats Section (Below Chart) */}
      <div className="flex flex-col gap-3 text-sm">

        <StatRow label="Avg / Day" value={`${stats.avgPerDay} patients`} />
        <StatRow label="Avg / Month" value={`${stats.avgPerMonth} patients`} />
        <StatRow label="Total Hours" value={`${stats.hoursSpent} hrs`} />
        <StatRow label="Growth" value={`${stats.growth}% ↑`} />

      </div>

    </div>
  );
}


/* Reusable Row */
function StatRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-black/5 pb-2">
      <span className="font-medium text-black">{label}</span>
      <span className="text-black/80">{value}</span>
    </div>
  );
}
