/* eslint-disable @typescript-eslint/ban-ts-comment */

import "chart.js/auto";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ChartData,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import ChartSkeleton from "./ChartSkeleton";

ChartJS.register(
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale
);

ChartJS.defaults.plugins.legend.display = false;

function formatData(c: { chart_type: string; data: ChartData }) {
  let colorIndex = 0;
  const palette = [
    "#95D2B3",
    "#55AD9B",
    "#538392",
    "#6295A2",
    "#80B9AD",
    "#B3E2A7",
  ];

  if (c.chart_type === "pie") {
    c.data.datasets.forEach((dataset) => {
      dataset.backgroundColor = dataset.data.map(() => {
        const color = palette[colorIndex];
        colorIndex = (colorIndex + 1) % palette.length;
        return color;
      });
    });
  } else {
    c.data.datasets.forEach((dataset) => {
      dataset.backgroundColor = palette[colorIndex];
      colorIndex = (colorIndex + 1) % palette.length;
    });
  }

  return c.data;
}

type GeneratedChartData = {
  chart_type: string;
  data: ChartData;
};

export function ToolChart({ data }: { data: string }) {
  const [c, setC] = useState<GeneratedChartData | null>(null);
  useEffect(() => {
    try {
      const parsedData = JSON.parse(data);
      setC(parsedData);
    } catch (error) {
      console.error(error);
    }
  }, [data]);

  if (!c || !c.chart_type || !c.data || !c.data.labels || !c.data.datasets) {
    return <ChartSkeleton />;
  }

  if (c.chart_type === "bar") {
    setTimeout(() => {
      console.log("c = ", c);
    }, 100);

    // @ts-ignore
    return <Bar data={formatData(c)} width={440} height={300} />;
  }
  if (c.chart_type === "line") {
    // @ts-ignore
    return <Line data={formatData(c)} width={440} height={300} />;
  }
  if (c.chart_type === "pie") {
    ChartJS.defaults.plugins.legend.display = true;
    // @ts-ignore
    return <Pie data={formatData(c)} width={440} height={300} />;
  }
}
