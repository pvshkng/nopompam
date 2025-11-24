"use client";

import {
  ClientTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/charts/tooltip";
import { AnimatedArea } from "@/components/charts/animated-area";
import {
  scaleTime,
  scaleLinear,
  line as d3line,
  max,
  area as d3area,
  curveMonotoneX,
} from "d3";
import { convertTimeSeriesData } from "./time-series-converter";
import { memo } from "react";

function PureAreaChartGradient() {
  const formattedData = convertTimeSeriesData() || [];
  let data = formattedData.map((d) => ({ ...d, date: new Date(d.date) }));
  let xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 100]);

  let yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  let line = d3line<(typeof data)[number]>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveMonotoneX);

  let area = d3area<(typeof data)[number]>()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.value))
    .curve(curveMonotoneX);

  let areaPath = area(data) ?? undefined;

  let d = line(data);

  if (!d) {
    return null;
  }

  return (
    <div className="relative h-72 w-full">
      <div
        className="absolute inset-0
        h-full
        w-full
        overflow-visible"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <path
            d={areaPath}
            className="text-blue-200"
            fill="url(#outlinedAreaGradient)"
          />
          <defs>
            <linearGradient
              id="outlinedAreaGradient"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                className="text-blue-500/50 dark:text-blue-500/20"
                stopColor="currentColor"
              />
              <stop
                offset="100%"
                className="text-blue-50/5 dark:text-blue-900/5"
                stopColor="currentColor"
              />
            </linearGradient>
          </defs>
          <path
            d={d}
            fill="none"
            className="text-blue-400 dark:text-blue-600"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((d, index) => (
            <ClientTooltip key={index}>
              <TooltipTrigger>
                <g className="group/tooltip">
                  <line
                    x1={xScale(d.date)}
                    y1={0}
                    x2={xScale(d.date)}
                    y2={100}
                    stroke="currentColor"
                    strokeWidth={1}
                    className="opacity-0 group-hover/tooltip:opacity-100 text-zinc-300 dark:text-zinc-700 transition-opacity"
                    vectorEffect="non-scaling-stroke"
                    style={{ pointerEvents: "none" }}
                  />
                  <rect
                    x={(() => {
                      const prevX =
                        index > 0
                          ? xScale(data[index - 1].date)
                          : xScale(d.date);
                      return (prevX + xScale(d.date)) / 2;
                    })()}
                    y={0}
                    width={(() => {
                      const prevX =
                        index > 0
                          ? xScale(data[index - 1].date)
                          : xScale(d.date);
                      const nextX =
                        index < data.length - 1
                          ? xScale(data[index + 1].date)
                          : xScale(d.date);
                      const leftBound = (prevX + xScale(d.date)) / 2;
                      const rightBound = (xScale(d.date) + nextX) / 2;
                      return rightBound - leftBound;
                    })()}
                    height={100}
                    fill="transparent"
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  {d.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  })}
                </div>
                <div className="text-gray-500 text-sm">
                  {d.value.toLocaleString("en-US")}
                </div>
              </TooltipContent>
            </ClientTooltip>
          ))}
        </svg>

      </div>
      {yScale
        .ticks(8)
        .map(yScale.tickFormat(8, "d"))
        .map((value, i) => {
          if (i < 1) return;
          return (
            <div
              key={i}
              style={{
                top: `${yScale(+value)}%`,
                right: "3%",
              }}
              className="absolute text-xs tabular-nums text-zinc-400 -translate-y-1/2"
            >
              {value}
            </div>
          );
        })}
    </div>
  );
}

export const AreaChartGradient = memo(PureAreaChartGradient);
