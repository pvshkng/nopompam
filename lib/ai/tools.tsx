"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export const QueryBenefits = () => {
  return <div>Here's your benefit</div>;
};

export const SendDocument = (result) => {
  const { documentName } = result;
  return (
    <div className="w-full p-1 gap-2 flex items-center bg-orange-50 bg-opacity-80 rounded-lg underline font-bold">
      <img src="/icon/PDF_file_icon.svg" height={20} width={20} alt="pdf" />
      {documentName}.pdf
    </div>
  );
};

const formSchema = z.object({
  lastDay: z.date(),
  reason: z.string().min(1, "Reason is required"),
  name: z.string().min(1, "Name is required"),
});

export const SendResignationForm = ({ lastDay, reason }) => {
  console.log("reason = ", reason);
  // First, update the formSchema (assumed to be defined elsewhere)
  const formSchema = z.object({
    lastDay: z.date(),
    reason: z.string(),
    name: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastDay: lastDay || undefined,
      reason: reason || "",
      name: "Puvish K.",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-orange-50 bg-opacity-80 p-4 rounded-lg flex flex-col w-full"
      >
        {/* Last Day Field */}
        <FormField
          control={form.control}
          name="lastDay"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last day</FormLabel>
              <FormDescription className="text-xs">
                This is the last day you will be available.
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
                <PopoverContent
                  className="flex flex-col items-center justify-center p-0 m-0"
                  align="start"
                >
                  {/* <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  /> */}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="w-full my-3 !border-orange-800" />

        {/* Reason Field */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for leaving</FormLabel>
              <FormDescription className="text-xs">
                This will help us better understand why you're leaving.
              </FormDescription>
              <FormControl>
                <Textarea placeholder="Tell us why you're leaving" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="w-full my-3 !border-orange-800" />
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm your name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="w-full my-3 !border-orange-800" />

        <Button variant={"destructive"} type="submit" className="w-full my-1">
          Confirm
        </Button>
        <FormDescription className="text-xs">
          Process cannot be reversed once submitted.
        </FormDescription>
      </form>
    </Form>
  );
};

export const SendJobOpeningForm = ({
  roleName,
  description,
  qualification,
  salaryRange,
  jobBoardPost,
}) => {
  const formSchema = z.object({
    roleName: z.string(),
    description: z.string(),
    qualification: z.string(),
    salaryRange: z.object({
      from: z.number(),
      to: z.number(),
    }),
    jobBoardPost: z.object({
      officialWebsite: z.boolean(),
      linkedIn: z.boolean(),
      glassdoor: z.boolean(),
      facebook: z.boolean(),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: roleName || "",
      description: description || "",
      qualification: qualification || "",
      salaryRange: {
        from: salaryRange?.from! || 0,
        to: salaryRange?.to! || 0,
      },
      jobBoardPost: {
        officialWebsite: jobBoardPost.officialWebsite || false,
        linkedIn: jobBoardPost.linkedIn || false,
        glassdoor: jobBoardPost.glassdoor || false,
        facebook: jobBoardPost.facebook || false,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-blue-50 bg-opacity-80 p-4 rounded-lg flex flex-col w-full"
      >
        {/* Role Name Field */}
        <FormField
          control={form.control}
          name="roleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormDescription className="text-xs">
                Enter the title of the position
              </FormDescription>
              <FormControl>
                <Input placeholder="e.g. Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="w-full my-3 !border-blue-800" />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormDescription className="text-xs">
                Provide a detailed description of the role
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Enter job description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="w-full my-3 !border-blue-800" />

        {/* Qualification Field */}
        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualifications Required</FormLabel>
              <FormDescription className="text-xs">
                List all required qualifications and experience
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Enter required qualifications"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="w-full my-3 !border-blue-800" />

        {/* Salary Range Fields */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="salaryRange.from"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Salary Range (From)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Minimum salary"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryRange.to"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Salary Range (To)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Maximum salary"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <hr className="w-full my-3 !border-blue-800" />

        {/* Job Board Posts */}
        <div className="space-y-4">
          <FormLabel>Post Job Opening On</FormLabel>
          <FormDescription className="text-xs">
            Select the platforms where you want to post this job opening
          </FormDescription>

          {["officialWebsite", "linkedIn", "glassdoor", "facebook"].map(
            (platform) => (
              <FormField
                key={platform}
                control={form.control}
                name={`jobBoardPost.${platform}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 gap-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </FormLabel>
                  </FormItem>
                )}
              />
            )
          )}
        </div>

        <hr className="w-full my-3 !border-blue-800" />

        <Button type="submit" variant={"ChatX"} className="w-full my-1 mt-3">
          Create Job Opening
        </Button>
        <FormDescription className="text-xs">
          Review all information before submitting.
        </FormDescription>
      </form>
    </Form>
  );
};
