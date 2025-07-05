import React from "react";
import {
  QueryBenefits,
  SendDocument,
  SendResignationForm,
  SendJobOpeningForm,
} from "@/lib/ai/tools";

import { DocumentsReference } from "@/components/tools/documents-reference";

export const ToolComponents = (props: any) => {
  const { m } = props;
  return (
    <React.Fragment>
      {/* TOOL CALLING COMPONENT */}
      <div /* className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg" */
      >
        {/* @ts-ignore */}
        {m.toolInvocations?.map((toolInvocation) => {
          const { toolName, toolCallId, state } = toolInvocation;
          const { result } = toolInvocation;
          if (state === "result") {
            if (toolName === "queryBenefits") {
              return (
                <div key={toolCallId}>
                  <QueryBenefits {...result} />
                </div>
              );
            } else if (toolName === "sendDocument") {
              return (
                <div key={toolCallId}>
                  <SendDocument {...result} />
                </div>
              );
            } else if (toolName === "sendResignationForm") {
              return (
                <div key={toolCallId} className="flex w-full">
                  <SendResignationForm {...result} />
                </div>
              );
            } else if (toolName === "sendJobOpeningForm") {
              return (
                <div key={toolCallId} className="flex w-full">
                  <SendJobOpeningForm {...result} />
                </div>
              );
            } else if (toolName === "documentSearch") {
              const { result } = toolInvocation;
              return (
                <div key={toolCallId} className="flex w-full">
                  <DocumentsReference result={toolInvocation.result} />
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
