
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChartIcon as PieIconLucide, ListChecks, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  PieChart, 
  Pie,
  Cell,
  BarChart as RechartsBarChartContainer, 
  LineChart as RechartsLineChartContainer 
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

const mockBarData = [
  { month: "Jan", entries: 120, target: 150 },
  { month: "Feb", entries: 180, target: 160 },
  { month: "Mar", entries: 150, target: 170 },
  { month: "Apr", entries: 210, target: 180 },
  { month: "May", entries: 190, target: 190 },
  { month: "Jun", entries: 230, target: 200 },
];

const mockLineData = [
  { date: "2024-01-01", waterLevel: 5.2 },
  { date: "2024-02-01", waterLevel: 5.1 },
  { date: "2024-03-01", waterLevel: 5.5 },
  { date: "2024-04-01", waterLevel: 5.3 },
  { date: "2024-05-01", waterLevel: 5.6 },
  { date: "2024-06-01", waterLevel: 5.4 },
];

const mockPieData = [
    { name: 'Completed', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: 150, fill: 'hsl(var(--chart-2))' },
    { name: 'Overdue', value: 50, fill: 'hsl(var(--destructive))' },
];

const chartConfig = {
  entries: { label: "Entries", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-2))" },
  waterLevel: { label: "Water Level (m)", color: "hsl(var(--accent))" },
};


export default function DashboardPage() {
  const { user } = useAuth(); // user is now FirebaseUser | null
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Simulate progress loading
    const timer = setTimeout(() => setProgressValue(75), 500);
    return () => clearTimeout(timer);
  }, []);

  const displayName = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {displayName}!</h1>
        <p className="text-muted-foreground">Here's an overview of your work progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Entries</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">3 requiring immediate attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Integrity Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">7</div>
            <p className="text-xs text-muted-foreground">Resolve potential errors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              Monthly Data Entries
            </CardTitle>
            <CardDescription>Comparison of data entries against targets.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPrimitive.BarChart data={mockBarData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="entries" fill="var(--color-entries)" radius={4} />
                  <Bar dataKey="target" fill="var(--color-target)" radius={4} />
                </RechartsPrimitive.BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-accent" />
              Average Water Level Trend
            </CardTitle>
            <CardDescription>Track changes in average water levels over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPrimitive.LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="waterLevel" stroke="var(--color-waterLevel)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-waterLevel)" }} activeDot={{ r: 6 }} />
                </RechartsPrimitive.LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PieIconLucide className="h-5 w-5 text-primary" />
                Task Status Distribution
            </CardTitle>
            <CardDescription>Overview of task completion status.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             <ChartContainer config={chartConfig} className="h-[250px] w-full max-w-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPrimitive.PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={mockPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {mockPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                         <ChartLegend content={<ChartLegendContent />} />
                    </RechartsPrimitive.PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Project Milestones
                </CardTitle>
                <CardDescription>Current progress towards project goals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Phase 1: Initial Survey</span>
                        <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <Progress value={100} className="h-3" />
                </div>
                <div>
                    <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Phase 2: Data Collection</span>
                        <span className="text-sm text-muted-foreground">{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} className="h-3" />
                </div>
                 <div>
                    <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">Phase 3: Analysis & Reporting</span>
                        <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-3" />
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

const RechartsPrimitive = {
  BarChart: RechartsBarChartContainer,
  LineChart: RechartsLineChartContainer,
  PieChart: PieChart, 
  Bar: Bar,
  Line: Line,
  Pie: Pie,
  Cell: Cell,
  CartesianGrid: CartesianGrid,
  XAxis: XAxis,
  YAxis: YAxis,
  Tooltip: Tooltip,
  Legend: Legend,
  ResponsiveContainer: ResponsiveContainer,
};
