"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

export const Experiment = () => {
  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Step One",
      completed: true,
    },
    {
      step: 2,
      title: "Step Two",
      completed: true,
    },
    {
      step: 3,
      title: "Step Three",
      completed: true,
    },
    {
      step: 4,
      title: "Step Four",
      completed: true,
    },
  ]);

  const streamedData = [{ id: "", type: "research", content: "" }];

  const [researchPlan, setResearchPlan] = useState({
    title: "Chatbot Research Plan",
    description: "",
    steps: [""],
  });

  return (
    <section
      className={cn(
        "z-10 p-2 flex flex-col items-start justify-center",
        "border border-blue-300",
        "bg-white rounded-md"
      )}
    >
      <h1 className="text-sm font-semibold">{researchPlan.title}</h1>

      <div className="space-y-8 text-center p-2">
        <Stepper defaultValue={2} value={5} orientation="vertical">
          {steps.map(({ step, title, completed }, i) => (
            <StepperItem
              //completed={completed}
              key={step}
              step={step}
              loading={false}
              className="relative items-start not-last:flex-1"
            >
              <StepperTrigger
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="items-start rounded pb-5 last:pb-0 cursor-default"
              >
                <StepperIndicator className="data-[state=completed]:!bg-blue-700" />
                <div className="mt-0.5 px-1 text-left">
                  <StepperTitle>{title}</StepperTitle>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>
    </section>
  );
};
