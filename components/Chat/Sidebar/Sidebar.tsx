"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/_index";
import { toolTipContents } from "@/app/chat/_data";
import type { CategoryItem } from "@/app/chat/_types";

type SidebarProps = {
  categoryItems: CategoryItem[];
  subCategoryItems: CategoryItem[];
  categoryIdValue: string;
  subCategoryIdValue?: string;
  categoryHandle: (arg: string, arg2?: boolean) => void;
  subCategoryHandle: (arg: string) => void;
  username: string;
};

export default function Sidebar(props: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div
      className={
        isSidebarOpen
          ? `side-bar w-72 bg-gray-100 h-screen border-gray-200 border relative shadow-[rgba(50,50,93,0.5)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]`
          : `side-bar w-5 bg-gray-100 h-screen border-gray-200 border relative shadow-[rgba(50,50,93,0.5)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]`
      }
    >
      {isSidebarOpen ? (
        <div
          className="mt-24 w-fit flex items-center justify-center bg-gray-200 rounded-full p-2 drop-shadow font-bold min-w-10 min-h-10 ml-[268px] cursor-pointer shadow-[rgba(50,50,93,0.5)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]"
          onClick={() => {
            setIsSidebarOpen(false);
          }}
        >
          <Image
            src={"/icon/close-sidebar.svg"}
            alt="sidebar-button"
            width={24}
            height={24}
          />
        </div>
      ) : (
        <div
          className="mt-24 w-fit flex items-center justify-center bg-gray-200 rounded-full p-2 drop-shadow font-bold min-w-10 min-h-10 ml-[8px] cursor-pointer shadow-[rgba(50,50,93,0.5)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]"
          onClick={() => {
            setIsSidebarOpen(true);
          }}
        >
          <Image
            src={"/icon/open-sidebar.svg"}
            alt="sidebar-button"
            width={24}
            height={24}
          />
        </div>
      )}

      {isSidebarOpen && (
        <div className="side-bar-bottom mt-auto px-4 absolute bottom-0 pb-4 w-full">
          <div className="text-sm pb-4 text-gray-500">
            Select your area of interest
          </div>
          <div className="text-base pb-2 text-gray-500">Category</div>
          {props.categoryIdValue === "enterprise" ||
          props.categoryIdValue === "business" ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="category-options">
                      <select
                        className="w-full h-10 rounded border-gray-300 border"
                        onChange={(e) =>
                          props.categoryHandle(e.target.value, true)
                        }
                        value={props.categoryIdValue}
                      >
                        {props.categoryItems.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="mb-10">
                    <div className="w-64 whitespace-pre-line">
                      {toolTipContents.map(
                        (item) =>
                          item.categoryId === props.categoryIdValue &&
                          item.content
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-base pb-2 pt-2 text-gray-500">
                Sub Category
              </div>
              <div className="category-options">
                <select
                  className="w-full h-10 rounded border-gray-300 border"
                  onChange={(e) => props.subCategoryHandle(e.target.value)}
                  value={props.subCategoryIdValue}
                >
                  {props.subCategoryItems.map((item, index) => {
                    return (
                      item.category === props.categoryIdValue && (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
            </>
          ) : (
            <div className="category-options">
              <select
                className="w-full h-10 rounded border-gray-300 border"
                onChange={(e) => props.categoryHandle(e.target.value, true)}
                value={props.categoryIdValue}
              >
                {props.categoryItems.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div className="username-box pt-8 pb-[16px]">
            <div className="username flex items-center justify-center bg-green-600 rounded-3xl w-max p-px mx-auto shadow-inner max-w-[90%]">
              <div className="username-full p-2 font-bold text-white truncate ">
                {props.username}
              </div>
              <div className="username-ini flex items-center justify-center bg-green-200 rounded-full p-2 drop-shadow font-bold min-w-10 min-h-10">
                {props.username?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
