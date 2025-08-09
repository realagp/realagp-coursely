"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--color-yellow-600)",
  },
} satisfies ChartConfig


interface enrollmentProps {
  data: {date: string; enrollments: number }[],
}

export function AdminChartArea({data}:enrollmentProps) {

  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = data.filter((item) => {

    const date = new Date(item.date);
    
    if (isNaN(date.getTime())) return false;

    date.setHours(0, 0, 0, 0);
    const referenceDate = new Date();
    referenceDate.setHours(0, 0, 0, 0);

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  const totalEnrollments = React.useMemo(() => 
    data.reduce((acc, curr) => acc + curr.enrollments, 0), [data]
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
                {timeRange === "90d" && `Total for the last 3 months: ${totalEnrollments}`}
                {timeRange === "30d" && `Total for the last 30 days: ${totalEnrollments}`}
                {timeRange === "7d" && `Total for the last 7 days: ${totalEnrollments}`}
          </span>
          <span className="@[540px]/card:hidden">
                {timeRange === "90d" && `Last 3 months: ${totalEnrollments}`}
                {timeRange === "30d" && `Last 30 days: ${totalEnrollments}`}
                {timeRange === "7d" && `Last 7 days: ${totalEnrollments}`}          
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart margin={{left: 12, right: 12}} data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tickMargin={5}
                interval={"preserveStartEnd"}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US",{
                    month: "short",
                    day: "numeric"
                  })
                }} 
              />
              <ChartTooltip content={
                <ChartTooltipContent className="w-[150px]" labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US",{
                      month: "short",
                      day: "numeric"
                    })
                  }}/>
              }/>
              <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
            </BarChart>
          </ChartContainer>
      </CardContent>
    </Card>
  )
}
