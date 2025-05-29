"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, SearchIcon, FilterX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

interface SearchFilters {
  dateRange?: DateRange;
  location?: string;
  project?: string;
}

interface SearchResult {
  id: string;
  date: string;
  location: string;
  project: string;
  waterLevel: number;
  ph: number;
  conductivity: number;
}

const mockSearchResults: SearchResult[] = [
  { id: "1", date: "2024-05-15", location: "Well GWK-001", project: "PMKSY-2024-KOL-03", waterLevel: 5.2, ph: 7.1, conductivity: 320 },
  { id: "2", date: "2024-05-18", location: "Borewell XYZ-7", project: "JJM-2024-KOL-01", waterLevel: 12.5, ph: 6.8, conductivity: 450 },
  { id: "3", date: "2024-04-20", location: "River Bank A", project: "NGRBA-2023-KOL-05", waterLevel: 2.1, ph: 7.5, conductivity: 280 },
  { id: "4", date: "2024-06-01", location: "Well GWK-002", project: "PMKSY-2024-KOL-03", waterLevel: 4.9, ph: 7.0, conductivity: 310 },
  { id: "5", date: "2023-11-10", location: "Test Site PQR", project: "R&D-2023-MISC-02", waterLevel: 8.3, ph: 6.5, conductivity: 550 },
];

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: { from: subDays(new Date(), 30), to: new Date() }
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    console.log("Searching with filters:", filters);
    // Simulate API call & filtering
    setTimeout(() => {
      let filteredResults = mockSearchResults;
      if (filters.location) {
        filteredResults = filteredResults.filter(r => r.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.project) {
        filteredResults = filteredResults.filter(r => r.project.toLowerCase().includes(filters.project!.toLowerCase()));
      }
      if (filters.dateRange?.from && filters.dateRange?.to) {
        filteredResults = filteredResults.filter(r => {
          const recordDate = new Date(r.date);
          return recordDate >= filters.dateRange!.from! && recordDate <= filters.dateRange!.to!;
        });
      }
      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleResetFilters = () => {
    setFilters({ dateRange: { from: subDays(new Date(), 30), to: new Date() } });
    setResults([]);
  };
  
  // Initial search on load
  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
        <p className="text-muted-foreground">Find specific groundwater records based on various parameters.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Specify criteria to narrow down your search results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium mb-1">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRange"
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
            <Input
              placeholder="Location (e.g., Well ID, Block)"
              value={filters.location || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              aria-label="Location filter"
            />
            <Input
              placeholder="Project ID / Name"
              value={filters.project || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
              aria-label="Project filter"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetFilters} disabled={isSearching}>
              <FilterX className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="mr-2 h-4 w-4" />
              )}
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearching && results.length === 0 && (
         <div className="flex justify-center items-center py-10">
            <RotateCcw className="mr-2 h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading results...</p>
         </div>
      )}
      
      {!isSearching && results.length === 0 && (
         <Card className="shadow-md">
            <CardContent className="py-10 text-center">
              <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-muted-foreground">No results found for your criteria. Try adjusting your filters.</p>
            </CardContent>
         </Card>
      )}

      {results.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {results.length} record(s) matching your criteria.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Water Level (m)</TableHead>
                  <TableHead className="text-right">pH</TableHead>
                  <TableHead className="text-right">Conductivity (µS/cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{format(new Date(result.date), "dd MMM yyyy")}</TableCell>
                    <TableCell>{result.location}</TableCell>
                    <TableCell>{result.project}</TableCell>
                    <TableCell className="text-right">{result.waterLevel.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{result.ph.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{result.conductivity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
