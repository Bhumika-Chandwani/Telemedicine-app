import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function AnalyticsCard({ stats, loading = false }) {
  if (loading || !stats) {
    return (
      <div className="karla-font w-[400px] bg-teal-50/40 border border-teal-500/30 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-5 bg-teal-200/50 rounded w-1/2 mx-auto mb-6" />
        <div className="w-[180px] h-[180px] rounded-full bg-teal-200/30 mx-auto mb-6" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-teal-100/50 rounded mb-3" />
        ))}
      </div>
    );
  }

  const attended = stats.completed || 0;
  const missed = stats.cancelled || 0;
  const data = [
    { name: "Attended", value: attended || 1 },
    { name: "Missed", value: missed },
  ];
  const COLORS = ["#0d9488", "#d1fae5"];
  const total = attended + missed;
  const percentage = stats.attendanceRate ?? (total > 0 ? Math.round((attended / total) * 100) : 0);

  return (
    <div className="karla-font w-[400px] bg-teal-50/40 border border-teal-500/30 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg text-center text-black mb-6">Monthly Activity Analysis</h2>

      <div className="flex justify-center mb-6">
        <div className="w-[200px] h-[200px] relative">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} innerRadius={60} outerRadius={90} dataKey="value" startAngle={90} endAngle={-270}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl text-black">{percentage}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <StatRow label="Avg / Day" value={`${stats.avgPerDay ?? 0} patients`} />
        <StatRow label="Avg / Month" value={`${stats.avgPerMonth ?? 0} patients`} />
        <StatRow label="Total Hours" value={`${stats.hoursSpent ?? 0} hrs`} />
        <StatRow label="Growth" value={`${stats.growth >= 0 ? "+" : ""}${stats.growth ?? 0}%`} />
        <StatRow label="Completed" value={`${attended} sessions`} />
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-black/5 pb-2">
      <span className="font-medium text-black">{label}</span>
      <span className="text-black/80">{value}</span>
    </div>
  );
}
