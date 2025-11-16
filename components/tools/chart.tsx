"use client";

import { cn } from "@/lib/utils";
import {
  ChartCandlestick,
  LoaderCircle,
  ChartColumnBig,
  ChartPie,
  ChartArea,
  ChartLine,
} from "lucide-react";
import { memo, useMemo } from "react";
import { ToolUIPart } from "ai";
import {
  Bar,
  BarChart,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { MessageSkeleton } from "@/components/chat-message-area/message-loading-skeleton";

const analyzeData = (data: any[]) => {
  if (!data || data.length === 0) return { categoryKey: "", numericKeys: [] };

  const firstItem = data[0];
  const keys = Object.keys(firstItem);

  const categoryKey =
    keys.find((key) => typeof firstItem[key] === "string") || keys[0];

  const numericKeys = keys.filter(
    (key) => key !== categoryKey && typeof firstItem[key] === "number"
  );

  return { categoryKey, numericKeys };
};

const COLORS = [
  "#d6d3d1",
  "#a8a29e",
  "#78716c",
  "#57534e",
  "#44403c",
  "#292524",
  "#1c1917",
  "#0c0a09",
  //"#2563eb", // blue
  //"#60a5fa", // light blue
  //"#f97316", // orange
  //"#10b981", // green
  //"#8b5cf6", // purple
  //"#ec4899", // pink
  //"#f59e0b", // amber
  //"#14b8a6", // teal
];

const PureChart = (props: any) => {
  const { tool }: { tool: ToolUIPart } = props;

  const { categoryKey, numericKeys } = useMemo(() => {
    if (tool.input?.data) {
      return analyzeData(tool.input.data);
    }
    return { categoryKey: "", numericKeys: [] };
  }, [tool.input?.data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    numericKeys.forEach((key, index) => {
      config[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [numericKeys]);

  return (
    <div
      className={cn(
        "flex flex-col max-w-full px-4 py-3 gap-2 m-2",
        "border border-stone-300 rounded-md bg-neutral-100"
      )}
    >
      <div className="flex flex-row text-stone-500 items-center gap-2">
        {tool?.state !== "output-available" ? (
          <LoaderCircle size={16} className="!animate-spin !opacity-100" />
        ) : (
          <>
            {tool.input.type === "bar" ? (
              <ChartColumnBig size={16} />
            ) : tool.input.type === "line" ? (
              <ChartLine size={16} />
            ) : tool.input.type === "area" ? (
              <ChartArea size={16} />
            ) : tool.input.type === "pie" ? (
              <ChartPie size={16} />
            ) : null}
          </>
        )}
        <span className="font-medium">{tool.input?.title || "CHART"}</span>
      </div>
      <>
        {(() => {
          switch (tool.state) {
            case "input-streaming":
              return <MessageSkeleton />;
            case "input-available":
            case "output-available":
              return (
                <>
                  {tool.input?.description && (
                    <p className="text-sm text-stone-600">
                      {tool.input.description}
                    </p>
                  )}
                  <div
                    className={cn(
                      "flex flex-col justify-center overflow-hidden transition-all w-full h-full" //min-h-[300px]
                    )}
                  >
                    <ChartContainer
                      config={chartConfig}
                      className="h-full w-full"
                    >
                      {/* BAR CHART */}
                      {tool.input?.type === "bar" && (
                        <BarChart accessibilityLayer data={tool.input?.data}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey={categoryKey}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                              typeof value === "string" && value.length > 10
                                ? value.slice(0, 10) + "..."
                                : value
                            }
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          {numericKeys.map((key, index) => (
                            <Bar
                              key={key}
                              dataKey={key}
                              fill={
                                chartConfig[key]?.color ||
                                COLORS[index % COLORS.length]
                              }
                              radius={[4, 4, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      )}

                      {/* LINE CHART */}
                      {tool.input?.type === "line" && (
                        <LineChart accessibilityLayer data={tool.input?.data}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey={categoryKey}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                              typeof value === "string" && value.length > 10
                                ? value.slice(0, 10) + "..."
                                : value
                            }
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          {numericKeys.map((key, index) => (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              stroke={
                                chartConfig[key]?.color ||
                                COLORS[index % COLORS.length]
                              }
                              strokeWidth={2}
                              dot={false}
                            />
                          ))}
                        </LineChart>
                      )}

                      {/* AREA CHART */}
                      {tool.input?.type === "area" && (
                        <AreaChart accessibilityLayer data={tool.input?.data}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey={categoryKey}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                              typeof value === "string" && value.length > 10
                                ? value.slice(0, 10) + "..."
                                : value
                            }
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          {numericKeys.map((key, index) => (
                            <Area
                              key={key}
                              type="monotone"
                              dataKey={key}
                              fill={
                                chartConfig[key]?.color ||
                                COLORS[index % COLORS.length]
                              }
                              stroke={
                                chartConfig[key]?.color ||
                                COLORS[index % COLORS.length]
                              }
                              fillOpacity={0.4}
                              stackId="1"
                            />
                          ))}
                        </AreaChart>
                      )}

                      {/* PIE CHART */}
                      {tool.input?.type === "pie" && (
                        <PieChart>
                          <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={tool.input?.data}
                            dataKey={numericKeys[0]} // Use first numeric key for pie
                            nameKey={categoryKey}
                            cx="50%"
                            cy="50%"
                            //outerRadius={80}
                            label={(entry) => entry[categoryKey]}
                          >
                            {tool.input?.data?.map(
                              (entry: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                      )}
                    </ChartContainer>
                  </div>
                </>
              );
            default:
              return <></>;
          }
        })()}
      </>
    </div>
  );
};

export const Chart = memo(PureChart);
