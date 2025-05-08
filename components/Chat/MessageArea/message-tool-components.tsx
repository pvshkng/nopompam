import React from "react";
import {
  QueryBenefits,
  SendDocument,
  SendResignationForm,
  SendJobOpeningForm,
} from "@/lib/ai/tools";

export const ToolComponents = (props) => {
  const { m } = props;
  return (
    <React.Fragment>
      {/* TOOL CALLING COMPONENT */}
      <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg">
        {/* @ts-ignore */}
        {m.toolInvocations?.map((toolInvocation) => {
          const { toolName, toolCallId, state } = toolInvocation;

          if (state === "result") {
            if (toolName === "queryBenefits") {
              const { result } = toolInvocation;
              return (
                <div key={toolCallId}>
                  <QueryBenefits {...result} />
                </div>
              );
            } else if (toolName === "sendDocument") {
              const { result } = toolInvocation;
              return (
                <div key={toolCallId}>
                  <SendDocument {...result} />
                </div>
              );
            } else if (toolName === "sendResignationForm") {
              const { result } = toolInvocation;
              return (
                <div key={toolCallId} className="flex w-full">
                  <SendResignationForm {...result} />
                </div>
              );
            } else if (toolName === "sendJobOpeningForm") {
              const { result } = toolInvocation;
              return (
                <div key={toolCallId} className="flex w-full">
                  <SendJobOpeningForm {...result} />
                </div>
              );
            }
          } else {
            return (
              <div key={toolCallId}>
                <div>{toolName}</div>
              </div>
            );
          }
        })}
      </div>
    </React.Fragment>
  );
};
