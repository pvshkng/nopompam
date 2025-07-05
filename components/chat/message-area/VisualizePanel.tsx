"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useChatContext } from "@/components/chat/ChatContext/ChatContext";

export default function VisualizePanel() {
  const { handleSend } = useChatContext();
  return (
    <div
      className={cn(
        "chart-button-area",
        "flex flex-row item-center justify-center py-1 px-2 gap-2",
        "bg-[#e0e0e0] rounded-full border-[1px] border-gray-200",
        "hover:-translate-y-1",
        "transition-all",
        "hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]",
        "[&>*]:transition-all",
        "[&>*:hover]:drop-shadow-[0_3px_3px_rgba(134, 239, 172, 1)]"
      )}
    >
      <button
        className={cn(
          "bg-gray-100 sm:px-4 sm:py-1 max-sm:p-2 border rounded-full flex space-x-2 items-center",
          "text-gray-600 text-xs",
          "hover:bg-green-100 hover:border-green-300 hover:text-green-600",
          "visualize-button"
        )}
        onClick={() => handleSend("แสดงข้อมูลในรูปแบบกราฟแท่ง (Bar Chart)", "chart")}
      >
        <Image
          src="/icon/chart-column.svg"
          width={12}
          height={12}
          alt="chart bar"
          className="m-0 green-icon"
        />
        <div className="sm:block max-sm:hidden">Bar Chart</div>
      </button>
      <button
        className={cn(
          "bg-gray-100 sm:px-4 sm:py-1 max-sm:p-2 border rounded-full flex space-x-2 items-center",
          "text-gray-600 text-xs",
          "hover:bg-green-100 hover:border-green-300 hover:text-green-600",
          "visualize-button"
        )}
        onClick={() => handleSend("แสดงข้อมูลในรูปแบบกราฟเส้น (Line Chart)", "chart")}
      >
        <Image
          src="/icon/chart-line.svg"
          width={12}
          height={12}
          alt="chart line"
          className="m-0 green-icon"
        />
        <div className="sm:block max-sm:hidden">Line Chart</div>
      </button>
      <button
        className={cn(
          "bg-gray-100 sm:px-4 sm:py-1 max-sm:p-2 border rounded-full flex space-x-2 items-center",
          "text-gray-600 text-xs",
          "hover:bg-green-100 hover:border-green-300 hover:text-green-600",
          "visualize-button"
        )}
        onClick={() => handleSend("แสดงข้อมูลในรูปแบบแผนภูมิรูปวงกลม (Pie Chart)", "chart")}
      >
        <Image
          src="/icon/chart-pie.svg"
          width={12}
          height={12}
          alt="chart pie"
          className="m-0 green-icon"
        />
        <div className="sm:block max-sm:hidden">Pie Chart</div>
      </button>
    </div>
  );
}
