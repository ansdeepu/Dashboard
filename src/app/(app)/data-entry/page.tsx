"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircle, AlertTriangle, Loader2, Sparkles, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState } from "react";
import { dataIntegrityCheck, type DataIntegrityCheckOutput } from "@/ai/flows/data-integrity-check";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const dataEntrySchema = z.object({
  location: z.string().min(1, "Location is required"),
  projectId: z.string().min(1, "Project ID is required"),
  dateOfRecord: z.date({ required_error: "Date of record is required." }),
  waterLevel: z.coerce.number().optional(),
  ph: z.coerce.number().min(0).max(14).optional(),
  conductivity: z.coerce.number().positive().optional(),
  remarks: z.string().optional(),
});

type DataEntryFormValues = z.infer<typeof dataEntrySchema>;

// Mock past entries for AI check
const mockPastEntries = [
  "Location: Site A, Date: 2023-05-10, Water Level: 5.5m, pH: 7.2, Conductivity: 350µS/cm",
  "Location: Site B, Date: 2023-05-12, Water Level: 6.1m, pH: 7.0, Conductivity: 420µS/cm",
  "Location: Site A, Date: 2023-04-15, Water Level: 5.3m, pH: 7.3, Conductivity: 330µS/cm",
];


export default function DataEntryPage() {
  const { toast } = useToast();
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<DataIntegrityCheckOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<DataEntryFormValues>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      location: "",
      projectId: "",
      remarks: "",
    },
  });

  async function handleDataIntegrityCheck() {
    const currentValues = form.getValues();
    if (!currentValues.location && !currentValues.waterLevel && !currentValues.ph && !currentValues.conductivity) {
        toast({
            title: "No Data to Check",
            description: "Please enter some data before checking integrity.",
            variant: "destructive",
        });
        return;
    }

    setIsCheckingIntegrity(true);
    setIntegrityResult(null);

    const newDataEntryString = `Location: ${currentValues.location}, Date: ${currentValues.dateOfRecord ? format(currentValues.dateOfRecord, 'yyyy-MM-dd') : 'N/A'}, Water Level: ${currentValues.waterLevel || 'N/A'}m, pH: ${currentValues.ph || 'N/A'}, Conductivity: ${currentValues.conductivity || 'N/A'}µS/cm, Remarks: ${currentValues.remarks || 'N/A'}`;

    try {
      const result = await dataIntegrityCheck({
        newDataEntry: newDataEntryString,
        pastEntries: mockPastEntries,
      });
      setIntegrityResult(result);
      if (result.isConsistent) {
        toast({
          title: "Data Consistent",
          description: "The new entry appears consistent with past data.",
          className: "bg-green-500 text-white", // Custom styling for success
        });
      } else {
        toast({
          title: "Potential Inconsistency",
          description: result.potentialError || "AI identified a potential issue.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking data integrity:", error);
      toast({
        title: "AI Check Failed",
        description: "Could not perform data integrity check.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingIntegrity(false);
    }
  }

  async function onSubmit(values: DataEntryFormValues) {
    setIsSubmitting(true);
    console.log("Form submitted:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Data Submitted",
      description: (
        <div className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Your data for {values.location} has been successfully recorded.
        </div>
      ),
    });
    form.reset();
    setIntegrityResult(null);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Data Entry</h1>
          <p className="text-muted-foreground">Enter new groundwater data records.</p>
        </div>
        <Button onClick={handleDataIntegrityCheck} disabled={isCheckingIntegrity} variant="outline">
          {isCheckingIntegrity ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          AI Check Integrity
        </Button>
      </div>

      {integrityResult && (
        <Alert variant={integrityResult.isConsistent ? "default" : "destructive"} className={integrityResult.isConsistent ? "border-green-500" : ""}>
          {integrityResult.isConsistent ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{integrityResult.isConsistent ? "Data Consistent" : "Potential Inconsistency"}</AlertTitle>
          <AlertDescription>
            {integrityResult.isConsistent ? "AI analysis suggests the data is consistent with past entries." : integrityResult.potentialError}
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Data Record</CardTitle>
          <CardDescription>Fill in the details for the new groundwater data point.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name / ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Well GWK-001, Anchal Block" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project / Scheme ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PMKSY-2024-KOL-03" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfRecord"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Record</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="waterLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Level (meters)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 5.75" {...field} />
                      </FormControl>
                      <FormDescription>Depth from ground level to water surface.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ph"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>pH</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 7.2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conductivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electrical Conductivity (µS/cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" placeholder="e.g., 350" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks / Observations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes, e.g., color of water, nearby activities, etc."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || isCheckingIntegrity}>
                  {isSubmitting ? (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                     <FilePlus2 className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Record"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
