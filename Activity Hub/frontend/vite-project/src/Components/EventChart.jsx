import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function EventChart() {
  return (
    <BarChart
      xAxis={[
        { scaleType: "band", data: ["FISK", "MEHARRY", "TSU", "VANDERBILT"] },
      ]}
      series={[
        { data: [4, 3, 5, 2] },
        { data: [1, 6, 3, 3] },
        { data: [2, 5, 6, 4] },
      ]}
      width={500}
      height={300}
    />
  );
}
