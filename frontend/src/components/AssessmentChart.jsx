import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import "../styles/assessmentChart.css";

export default function AssessmentChart({ data, testTitle = "" }) {
  if (!data || data.length === 0) return <div>No data</div>;

  const values = data.map((d) => Number(d.value));
  const min = Math.min(...values);
  const max = Math.max(...values);

  const reverseTests = ["100 Meter", "1600 Meter", "Gola Fek", "Shot Put"];
  const isReverse = reverseTests.some((name) =>
    testTitle.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 1, left: 1, bottom: 10 }}
        >
          <XAxis dataKey="date" />
          <YAxis
            domain={isReverse ? [max, min] : [min, max]}
            reversed={isReverse}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
