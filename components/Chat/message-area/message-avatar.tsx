import React from "react";
import * as ui from "@/components/ui/_index";

export const Avatar = (props) => {
  const { m } = props;
  return (
    <React.Fragment>
      <div className="group flex flex-row items-center gap-2">
        <div
          // check if need bg
          className={`flex items-center justify-center ${
            m.role === "user" ? "bg-black " : "bg-gray-200 "
          } rounded-full min-w-8 min-h-8`}
        >
          <ui.Avatar>
            <ui.AvatarImage
              width={40}
              height={40}
              src={m.role === "user" ? image : "/icon/bot.svg"}
            />
            <ui.AvatarFallback className="font-black text-neutral-400">
              {m.role === "user" ? name?.charAt(0) : "AI"}
            </ui.AvatarFallback>
          </ui.Avatar>
        </div>
        <div className="font-semibold mr-2">
          {m.role === "user" ? name : assistantName}
        </div>
      </div>
    </React.Fragment>
  );
};
