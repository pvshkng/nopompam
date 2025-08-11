import { useDossierStore } from "@/lib/stores/dossier-store";
import { memo } from "react";
import { X, House, NotebookPen, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "123", title: "blaaaah", icon: House },
  {
    name: "documents",
    title: "การวิเคราะห์ประวัติและสถานการณ์ปัจจุบันของ",
    icon: NotebookPen,
    edited: true,
  },
  {
    name: "documents1",
    title: "สกุลเงินดิจิทัลแรกของโลก",
    icon: NotebookPen,
    edited: true,
  },
  {
    name: "documents2",
    title: "ประวัติการเดินทางของ Bitcoin",
    icon: NotebookPen,
    edited: true,
  },
];

const PureDossierNavigation = (props: any) => {
  const { closeDossier, setActiveTab, activeTab } = useDossierStore();
  const isActive = (tabName: string) => {
    return activeTab === tabName;
  };
  return (
    <div
      className={cn(
        "p-0 min-w-0",
        "flex flex-row items-center justify-between",
        "border-b border-stone-200",
        "bg-neutral-50"
      )}
    >
      {/* TABS */}
      <div
        className={cn(
          //"overflow-auto",
          "flex flex-row p-1 pb-0 h-full gap-1 flex-1 min-w-0"
        )}
      >
        <button
          className={cn(
            "border m-0 p-1 border-b-0 min-w-0",
            "overflow-hidden",
            isActive("home") &&
              "border-stone-300 max-w-full bg-white shadow-[0px_1px_0px_1px_#FFFFFF]"
          )}
          onClick={() => {
            setActiveTab("home");
          }}
        >
          <House
            className={cn(
              "w-4 h-4 flex-shrink-0",
              isActive("home") ? "stroke-stone-500" : "stroke-stone-200"
            )}
          />
        </button>

        {/* Dynamic Tabs */}
        {tabs.map((t, i) => (
          <button
            key={i}
            className={cn(
              "gap-1",
              "flex flex-row flex-shrink items-center justify-center",
              "overflow-hidden",
              "min-w-0",
              "border m-0 p-1 border-b-0",
              isActive(t.name) &&
                "border-stone-300 bg-white shadow-[0px_1px_0px_0px_#FFFFFF]"
            )}
            onClick={() => {
              setActiveTab(t.name);
            }}
          >
            <t.icon
              className={cn(
                "w-4 h-4 flex-shrink-0",
                isActive(t.name) ? "stroke-stone-500" : "stroke-stone-200"
              )}
            />
            <span
              className={cn(
                "text-xs truncate text-stone-200",
                isActive(t.name) && "!text-stone-500"
              )}
            >
              {t.title}
            </span>
          </button>
        ))}

        {/* <button className={cn("border m-0 p-1 border-b-0")} onClick={() => {}}>
          <NotebookPen size={16} className="stroke-stone-200" />
        </button> */}
      </div>

      {/* Close, Minimize */}
      <div className={cn("p-1 flex flex-row items-center justify-end gap-1")}>
        {/* <button>
          <Maximize2 size={16} className="stroke-stone-700" />
        </button> */}
        <button
          className={cn(
            "border m-0 p-1 bg-stone-400"
            // bg-stone-700
          )}
          onClick={() => {}}
        >
          <Save size={16} className="stroke-stone-100" />
        </button>
        <button
          className={cn("border m-0 p-1 bg-stone-700")}
          onClick={() => {
            closeDossier();
          }}
        >
          <X size={16} className="stroke-stone-100" />
        </button>
      </div>
    </div>
  );
};

export const DossierNavigation = memo(PureDossierNavigation);
