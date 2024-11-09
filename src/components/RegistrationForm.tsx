"use client";

import { useState, useEffect, useId, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Minus, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import pricingData from "@/data/pricing.json";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits." }),
  region: z.string().min(1, { message: "Please select a region." }),
  village: z.string().min(1, { message: "Village is required." }),
  fromDate: z.date({ required_error: "From date is required." }),
  tillDate: z.date({ required_error: "Till date is required." }),
  lunchCount: z.number().min(0),
  dinnerCount: z.number().min(0),
  paymentStatus: z.enum(["pending", "received"]).default("pending"),
});

export function TiffinRegistrationForm() {
  const [totalBill, setTotalBill] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      region: "",
      village: "",
      lunchCount: 0,
      dinnerCount: 0,
      fromDate: startOfDay(new Date()), // Initialize with start of today
      tillDate: startOfDay(new Date()), // Initialize with start of today
      paymentStatus: "pending",
    },
  });

  const calculateBill = useCallback(() => {
    const { region, fromDate, tillDate, lunchCount, dinnerCount } =
      form.getValues();
    if (!region || !fromDate || !tillDate) return;

    const selectedRegion = pricingData.regions.find((r) => r.name === region);
    if (!selectedRegion) return;

    // Add 1 to include both start and end dates
    const days = differenceInDays(tillDate, fromDate) + 1;
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    let total;

    if (lunchCount > 0 && dinnerCount > 0) {
      const combos = Math.min(lunchCount, dinnerCount);
      total =
        selectedRegion.monthly.both * months * combos +
        selectedRegion.monthly.lunch_only *
          months *
          Math.max(0, lunchCount - combos) +
        selectedRegion.monthly.dinner_only *
          months *
          Math.max(0, dinnerCount - combos) +
        selectedRegion.daily.lunch_or_dinner * remainingDays * lunchCount +
        selectedRegion.daily.lunch_or_dinner * remainingDays * dinnerCount;
    } else if (lunchCount > 0) {
      total =
        selectedRegion.monthly.lunch_only * months +
        selectedRegion.daily.lunch_or_dinner * lunchCount * remainingDays;
    } else if (dinnerCount > 0) {
      total =
        selectedRegion.monthly.dinner_only * months +
        selectedRegion.daily.lunch_or_dinner * dinnerCount * remainingDays;
    } else {
      total = 0;
    }
    setTotalBill(total);
  }, [form]);

  const fromDate = form.watch("fromDate");
  const tillDate = form.watch("tillDate");
  const region = form.watch("region");
  const lunchCount = form.watch("lunchCount");
  const dinnerCount = form.watch("dinnerCount");

  useEffect(() => {
    calculateBill();
  }, [calculateBill, fromDate, tillDate, region, lunchCount, dinnerCount]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/add-tiffin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, totalBill }),
      });

      if (response.ok) {
        console.log("Tiffin registered successfully");
        alert("Tiffin registered successfully");
        form.reset();
      } else {
        alert("Failed to register tiffin");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  }

  const setTillDateToOneMonth = () => {
    const fromDate = form.getValues("fromDate");
    if (fromDate) {
      const oneMonthLater = new Date(fromDate);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      oneMonthLater.setDate(oneMonthLater.getDate() - 1); // Subtract one day to stay within the month
      form.setValue("tillDate", oneMonthLater);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Tiffin Service Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            id={formId}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`${formId}-name`}>Name</FormLabel>
                  <FormControl>
                    <Input
                      id={`${formId}-name`}
                      placeholder="John Doe"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`${formId}-mobile`}>
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={`${formId}-mobile`}
                      placeholder="1234567890"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`${formId}-region`}>Region</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={`${formId}-region`}>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pricingData.regions.map((region) => (
                        <SelectItem key={region.name} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`${formId}-village`}>Village</FormLabel>
                  <FormControl>
                    <Input
                      id={`${formId}-village`}
                      placeholder="Village name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor={`${formId}-from-date`}>
                      From Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id={`${formId}-from-date`}
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
                          onSelect={(date) => {
                            if (date) {
                              const startOfSelectedDay = startOfDay(date);
                              field.onChange(startOfSelectedDay);
                              form.setValue("tillDate", startOfSelectedDay);
                            }
                          }}
                          disabled={(date) =>
                            date < startOfDay(new Date()) || // Allow today's date
                            date < new Date("1900-01-01")
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
                name="tillDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor={`${formId}-till-date`}>
                      Till Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id={`${formId}-till-date`}
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
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(startOfDay(date));
                            }
                          }}
                          disabled={(date) => {
                            const fromDate = form.getValues("fromDate");
                            const oneMonthLater = new Date(fromDate);
                            oneMonthLater.setMonth(
                              oneMonthLater.getMonth() + 1
                            );
                            return (
                              date < fromDate || // Can't be before from date
                              date > oneMonthLater // Can't be more than a month later
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              onClick={setTillDateToOneMonth}
              className="mt-2"
            >
              Set to One Month
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="lunchCount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`${formId}-lunch-count`}>
                      Lunch Tiffin
                    </FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          field.onChange(Math.max(0, field.value - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input
                          id={`${formId}-lunch-count`}
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="w-20 text-center"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => field.onChange(field.value + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="dinnerCount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`${formId}-dinner-count`}>
                      Dinner Tiffin
                    </FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          field.onChange(Math.max(0, field.value - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input
                          id={`${formId}-dinner-count`}
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="w-20 text-center"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => field.onChange(field.value + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-lg font-semibold" suppressHydrationWarning>
                Total Bill: ₹{totalBill}
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Tiffin"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
