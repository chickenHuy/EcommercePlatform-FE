"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
};

export default function ChartSeller({ chartData }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg">Biểu đồ doanh số trong ngày</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 100,
              bottom: 100,
              left: 50,
              right: 50,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={60}
              tickFormatter={(value) => value.slice(0, 10)}
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
                      <div className="flex items-center justify-between space-x-2 p-2">
                        <div className="h-full w-[3px] bg-error"></div>
                        <div className="flex flex-col space-y-1">
                          <Label>{date}</Label>
                          <div>
                            <Label className="text-muted-foreground mr-2">
                              {chartConfig[name]?.label || name}:
                            </Label>
                            <Label className="font-bold">
                              {value.toLocaleString()} ₫
                            </Label>
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
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
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
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this date <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 dates
        </div>
      </CardFooter> */}
    </Card>
  );
}
