import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";

interface ProvinceChartProps {
  data: Record<string, number>;
  title?: string;
  titleNp?: string;
}

export function ProvinceChart({
  data,
  title = "Candidates by Province",
  titleNp = "प्रदेश अनुसार उम्मेदवार",
}: ProvinceChartProps) {
  const { language } = useLanguage();
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        shortName: name.replace(" प्रदेश", "").slice(0, 10),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const displayTitle = language === "en" ? title : titleNp;

  return (
    <div className="chart-container h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{displayTitle}</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [
                language === "en" ? `${value.toLocaleString()} candidates` : `${value.toLocaleString()} उम्मेदवार`,
                ""
              ]}
              labelFormatter={(label: string, payload: any[]) => 
                payload[0]?.payload?.name || label
              }
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
