import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataItem } from "@/types/election";
import { useLanguage } from "@/context/LanguageContext";

interface QualificationPieChartProps {
  data: Record<string, number>;
  title?: string;
  titleNp?: string;
}

const CHART_COLORS = [
  "hsl(215, 55%, 35%)",
  "hsl(350, 55%, 50%)",
  "hsl(160, 50%, 45%)",
  "hsl(35, 70%, 55%)",
  "hsl(270, 40%, 55%)",
  "hsl(190, 55%, 45%)",
  "hsl(25, 65%, 50%)",
];

export function QualificationPieChart({
  data,
  title = "Qualification Distribution",
  titleNp = "शैक्षिक योग्यता",
}: QualificationPieChartProps) {
  const { language } = useLanguage();
  const chartData: ChartDataItem[] = useMemo(() => {
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const total = chartData.reduce((acc, item) => acc + item.value, 0);
  const displayTitle = language === "en" ? title : titleNp;

  return (
    <div className="chart-container h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{displayTitle}</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                language === "en"
                  ? `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`
                  : `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                language === "en" ? "Candidates" : "उम्मेदवार",
              ]}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: "11px", paddingLeft: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
