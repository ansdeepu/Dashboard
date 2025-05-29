"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Download, FileText, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { generateReportSummary, type GenerateReportSummaryOutput } from "@/ai/flows/generate-report-summary";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReportFilters {
  reportType: string;
  dateRange?: DateRange;
}

interface ReportDataRow {
  id: string;
  date: string;
  location: string;
  parameter: string;
  value: string | number;
  unit: string;
}

const mockReportData: ReportDataRow[] = [
  { id: "r1", date: "2024-05-10", location: "Well A", parameter: "Water Level", value: 5.2, unit: "m" },
  { id: "r2", date: "2024-05-10", location: "Well A", parameter: "pH", value: 7.1, unit: "" },
  { id: "r3", date: "2024-05-11", location: "Well B", parameter: "Conductivity", value: 350, unit: "µS/cm" },
  { id: "r4", date: "2024-05-11", location: "Well B", parameter: "Water Level", value: 6.0, unit: "m" },
  { id: "r5", date: "2024-05-12", location: "Well A", parameter: "Water Level", value: 5.1, unit: "m" },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ReportFilters>({
    reportType: "summary",
    dateRange: { from: subDays(new Date(), 7), to: new Date() },
  });
  const [reportData, setReportData] = useState<ReportDataRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [reportSummary, setReportSummary] = useState<GenerateReportSummaryOutput | null>(null);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportSummary(null); // Clear previous summary
    console.log("Generating report with filters:", filters);
    // Simulate API call
    setTimeout(() => {
      // Mock filtering based on date range if needed
      setReportData(mockReportData);
      setIsGenerating(false);
      toast({ title: "Report Generated", description: "Summary report is ready." });
    }, 1000);
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      toast({ title: "No Data", description: "Generate a report first to export.", variant: "destructive" });
      return;
    }
    const headers = Object.keys(reportData[0]).join(",");
    const rows = reportData.map(row => Object.values(row).join(",")).join("\n");
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `report_${filters.reportType}_${format(new Date(), "yyyyMMdd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Export Successful", description: "Report downloaded as CSV." });
    }
  };
  
  const handleGenerateSummary = async () => {
    if (reportData.length === 0) {
      toast({ title: "No Data", description: "Generate a report first to get an AI summary.", variant: "destructive" });
      return;
    }
    setIsSummarizing(true);
    setReportSummary(null);
    
    const reportTextForAI = reportData.map(row => 
      `Date: ${row.date}, Location: ${row.location}, Parameter: ${row.parameter}, Value: ${row.value} ${row.unit}`
    ).join('\n');

    try {
      const summaryResult = await generateReportSummary({ reportText: reportTextForAI });
      setReportSummary(summaryResult);
      toast({ title: "AI Summary Generated", description: "Report summary is available below." });
    } catch (error) {
      console.error("Error generating report summary:", error);
      toast({ title: "AI Summary Failed", description: "Could not generate AI summary.", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report Generation</h1>
        <p className="text-muted-foreground">Generate and export summary reports from your data.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Report Options</CardTitle>
          <CardDescription>Select criteria for your report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              value={filters.reportType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, reportType: value }))}
            >
              <SelectTrigger aria-label="Report Type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Overall Summary</SelectItem>
                <SelectItem value="water_level">Water Level Trends</SelectItem>
                <SelectItem value="water_quality">Water Quality Parameters</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y")} - {" "}
                          {format(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Report</CardTitle>
              <CardDescription>Report for {filters.reportType.replace('_', ' ')} from {filters.dateRange?.from ? format(filters.dateRange.from, "PPP") : ''} to {filters.dateRange?.to ? format(filters.dateRange.to, "PPP") : ''}.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateSummary} disabled={isSummarizing}>
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                AI Summary
              </Button>
              <Button onClick={handleExportCSV} variant="default">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {reportSummary && (
              <Alert className="mb-4 border-accent text-accent-foreground bg-accent/10">
                <Sparkles className="h-4 w-4 !text-accent" />
                <AlertTitle className="text-accent-foreground font-semibold">AI Generated Summary</AlertTitle>
                <AlertDescription className="text-accent-foreground/90">
                  {reportSummary.summary}
                </AlertDescription>
              </Alert>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{format(new Date(row.date), "dd MMM yyyy")}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.parameter}</TableCell>
                    <TableCell className="text-right">{row.value}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
       {!isGenerating && reportData.length === 0 && (
         <Card className="shadow-md">
            <CardContent className="py-10 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-muted-foreground">No report generated yet. Select your options and click "Generate Report".</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
