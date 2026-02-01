import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartDataItem } from "@/types/election";
import { getShortPartyName } from "@/hooks/useElectionData";
import { useLanguage } from "@/context/LanguageContext";

interface PartyBarChartProps {
  data: Record<string, number>;
  title?: string;
  titleNp?: string;
  maxItems?: number;
}

const CHART_COLORS = [
  "hsl(215, 55%, 35%)",
  "hsl(350, 55%, 50%)",
  "hsl(160, 50%, 45%)",
  "hsl(35, 70%, 55%)",
  "hsl(270, 40%, 55%)",
  "hsl(190, 55%, 45%)",
  "hsl(25, 65%, 50%)",
  "hsl(200, 15%, 50%)",
];

export function PartyBarChart({
  data,
  title = "Candidates by Party",
  titleNp = "पार्टी अनुसार उम्मेदवार",
  maxItems = 7,
}: PartyBarChartProps) {
  const { language } = useLanguage();
  const chartData: ChartDataItem[] = useMemo(() => {
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        shortName: getShortPartyName(name),
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, maxItems);
  }, [data, maxItems]);

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
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              dataKey="shortName"
              type="category"
              width={70}
              tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string, props: any) => [
                language === "en"
                  ? `${value.toLocaleString()} candidates`
                  : `${value.toLocaleString()} उम्मेदवार`,
                props.payload.name,
              ]}
              labelFormatter={() => ""}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
