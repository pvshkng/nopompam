import "chart.js/auto";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Colors,
  CategoryScale,
  ChartData,
} from "chart.js";
import { Bar, Pie, Line, Chart } from "react-chartjs-2";
import { Suspense } from "react";
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
    } catch (error) {}
  }, [data]);

  if (!c || !c.chart_type || !c.data || !c.data.labels || !c.data.datasets) {
    return <ChartSkeleton />;
  }

  if (c.chart_type === "bar") {
    setTimeout(() => {
      console.log("c = ", c);
    }, 100);

    return <Bar data={formatData(c)} width={440} height={300} />;
  }
  if (c.chart_type === "line") {
    return <Line data={formatData(c)} width={440} height={300} />;
  }
  if (c.chart_type === "pie") {
    ChartJS.defaults.plugins.legend.display = true;
    return <Pie data={formatData(c)} width={440} height={300} />;
  }
}

const bar_data = {
  type: "bar",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "dataset_label_1",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  },
};

const line_data = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "dataset_label_1",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  },
};

const pie_data = {
  type: "pie",
  data: {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
      },
    ],
  },
};

{
  /* <Bar
          data={formatData(bar_data.data)}
          width={440}
          height={300}
          options={options}
        />
        <Line
          data={formatData(line_data.data)}
          width={440}
          height={300}
          options={options}
        />
        <Pie
          data={formatData(pie_data.data)}
          width={440}
          height={300}
          options={options}
        /> */
}
