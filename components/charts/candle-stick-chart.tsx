import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max, min } from "d3";

// Sample OHLC data (Open, High, Low, Close)
const data = [
  { date: "2/7 03:30 PM", open: 129.2, high: 129.5, low: 129.0, close: 129.3 },
  { date: "2/7 04:10 PM", open: 129.3, high: 129.6, low: 128.9, close: 128.8 },
  { date: "2/7 04:50 PM", open: 128.8, high: 129.1, low: 128.5, close: 129.0 },
  { date: "2/7 05:30 PM", open: 129.0, high: 129.3, low: 128.7, close: 128.9 },
  { date: "2/7 06:10 PM", open: 128.9, high: 129.2, low: 128.6, close: 129.1 },
  { date: "2/10 02:40 PM", open: 129.8, high: 130.4, low: 129.6, close: 130.1 },
  { date: "2/10 03:20 PM", open: 130.1, high: 133.2, low: 129.9, close: 132.8 },
  { date: "2/10 04:00 PM", open: 132.8, high: 133.1, low: 132.5, close: 132.9 },
  { date: "2/10 06:00 PM", open: 132.9, high: 133.4, low: 132.6, close: 133.1 },
];

export function CandlestickChart(props: any) {
  const { d } = props;

  // Scales
  const xScale = scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, 100])
    .padding(0.2);

  const allPrices = data.flatMap((d) => [d.open, d.high, d.low, d.close]);
  const yScale = scaleLinear()
    .domain([min(allPrices) ?? 0, max(allPrices) ?? 0])
    .range([100, 0]); // Inverted for price chart

  return (
    <div
      className="relative w-full h-96 rounded-sm bg-white border border-stone-200 !p-5"
      /* style={
        {
          "--marginTop": "20px",
          "--marginRight": "60px",
          "--marginBottom": "60px",
          "--marginLeft": "60px",
        } as CSSProperties
      } */
    >
      {/* Chart Area */}
      <div
        className="absolute inset-0 z-10 !p-5"
        /* style={{
          top: "var(--marginTop)",
          right: "var(--marginRight)",
          bottom: "var(--marginBottom)",
          left: "var(--marginLeft)",
        }} */
      >
        {/* Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-300/40 dark:text-gray-600/40"
              />
            </pattern>
          </defs>

          {/* Horizontal grid lines */}
          {yScale.ticks(6).map((value, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              x2="100%"
              y1={`${yScale(value)}%`}
              y2={`${yScale(value)}%`}
              stroke="currentColor"
              strokeDasharray="3,3"
              strokeWidth="0.5"
              className="text-gray-300/60 dark:text-gray-600/60"
            />
          ))}

          {/* Vertical grid lines */}
          {data.map((d, i) => (
            <line
              key={`v-${i}`}
              x1={`${xScale(d.date)! + xScale.bandwidth() / 2}%`}
              x2={`${xScale(d.date)! + xScale.bandwidth() / 2}%`}
              y1="0"
              y2="100%"
              stroke="currentColor"
              strokeDasharray="3,3"
              strokeWidth="0.5"
              className="text-gray-300/40 dark:text-gray-600/40"
            />
          ))}
        </svg>

        {/* Candlesticks */}
        <div className="absolute inset-0">
          {data.map((d, index) => {
            const xPos = xScale(d.date)!;
            const candleWidth = xScale.bandwidth() * 0.6;
            const isGreen = d.close > d.open;

            const openY = yScale(d.open);
            const closeY = yScale(d.close);
            const highY = yScale(d.high);
            const lowY = yScale(d.low);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const wickX = xPos + xScale.bandwidth() / 2;

            return (
              <div key={index} className="absolute inset-0">
                {/* High-Low Wick */}
                <div
                  className={`absolute ${isGreen ? "bg-black" : "bg-black"}`}
                  style={{
                    left: `${wickX}%`,
                    top: `${highY}%`,
                    width: "1px",
                    height: `${lowY - highY}%`,
                    transform: "translateX(-50%)",
                  }}
                />

                {/* Body */}
                <div
                  className={`absolute border ${
                    isGreen ? "bg-white border-black" : "bg-black border-black"
                  }`}
                  style={{
                    left: `${xPos + (xScale.bandwidth() - candleWidth) / 2}%`,
                    top: `${bodyTop}%`,
                    width: `${candleWidth}%`,
                    height: `${Math.max(bodyHeight, 0.5)}%`, // Minimum height for doji
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Y Axis Labels (Left) */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-5">
        {yScale.ticks(6).map((value, i) => (
          <div
            key={i}
            className="text-xs text-gray-500 tabular-nums pr-2 flex items-center h-0"
          >
            {value.toFixed(1)}
          </div>
        ))}
      </div>

      {/* Y Axis Labels (Right) */}
      {/*  <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-5">
        {yScale.ticks(6).map((value, i) => (
          <div
            key={i}
            className="text-xs text-gray-500 tabular-nums pl-2 flex items-center h-0"
          >
            {value.toFixed(1)}
          </div>
        ))}
      </div> */}

      {/* X Axis Labels (Bottom) */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-between px-12"
        style={{
          marginLeft: "var(--marginLeft)",
          marginRight: "var(--marginRight)",
        }}
      >
        {data.map((entry, i) => (
          <span
            key={i}
            className="text-xs text-gray-500 transform rotate-45 origin-bottom-left mt-2 w-full"
          >
            {entry.date}
          </span>
        ))}
      </div>

      {/* Current Price Indicator */}
      <div
        className="absolute right-0 bg-stone-500 text-white px-2 py-1 text-xs font-medium"
        style={{
          top: `calc(${yScale(
            data[data.length - 1].close
          )}% + var(--marginTop))`,
          transform: "translateY(-50%)",
        }}
      >
        {data[data.length - 1].close.toFixed(1)}
      </div>
    </div>
  );
}
