"use client";
import Link from "next/link";
import { use } from "react";
import { GridBackground } from "@/components/background-grid";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

export default function Playground(params: any) {
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
      completed: false,
    },
  ]);

  const [researchPlan, setResearchPlan] = useState({
    title: "Chatbot Research Plan",
    description: "",
    steps: [""],
  });
  const router = useRouter();

  const searchParams = useSearchParams();
  const secret = searchParams.get("secret");

  if (secret === "booboolovesmoojiw") {
    return (
      <div className="flex flex-col items-center justify-center size-full">
        <GridBackground />

        {/* TEST AREA */}

        <section
          className={cn(
            "z-10 p-2 flex flex-col items-start justify-center",
            "border border-stone-300",
            "bg-white rounded-md"
          )}
        >
          <h1 className="text-sm font-semibold">{researchPlan.title}</h1>

          <div className="space-y-8 text-center p-2">
            <Stepper defaultValue={2} value={2} orientation="vertical">
              {steps.map(({ step, title, completed }, i) => (
                <StepperItem
                  //completed={completed}
                  key={step}
                  step={step}
                  loading={true}
                  className="relative items-start not-last:flex-1"
                >
                  <StepperTrigger
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="items-start rounded pb-5 last:pb-0 cursor-default"
                  >
                    <StepperIndicator className="data-[state=completed]:!bg-stone-700" />
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
        {/* END OF TEST AREA */}
      </div>
    );
  } else {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    window.location.href = "/";
  }
}
