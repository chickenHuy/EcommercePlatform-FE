"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
};

export default function ChartSeller({ chartData }) {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsPhone(true);
      } else {
        setIsPhone(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="w-full h-full p-3">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              bottom: 60,
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickMargin={10}
              interval={0}
              tick={{
                angle: -90,
                textAnchor: "end",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name, props) => {
                    const { payload } = props;
                    const date = payload?.date;
                    return (
                      <div className="flex items-center justify-between space-x-2 p-1">
                        <div className="h-full w-[3px] bg-red-primary"></div>
                        <div className="flex flex-col space-y-1">
                          <span>{date}</span>
                          <div>
                            <span className="text-muted-foreground mr-2">
                              {chartConfig[name]?.label || name}:
                            </span>
                            <span className="font-bold">
                              {value.toLocaleString()} ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="#ef233b"
              strokeWidth={2}
              dot={{
                fill: "#ef233b",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
