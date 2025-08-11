import { useDossierStore } from "@/lib/stores/dossier-store";
import { memo } from "react";
import { X, House, Maximize2, Minimize2, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "123", icon: House },
  { name: "documents", icon: NotebookPen, edited: true },
];

const PureDossierNavigation = (props: any) => {
  const { closeDossier, setActiveTab, activeTab } = useDossierStore();
  const isActive = (tabName: string) => {
    return activeTab === tabName;
  };
  return (
    <div
      className={cn(
        "p-0",
        "flex flex-row items-center justify-between bg-white",
        "border-b border-stone-200"
      )}
    >
      {/* TABS */}
      <div
        className={cn(
          "overflow-x-auto",
          "p-1 pb-0 size-full flex flex-row items-end justify-start gap-1"
        )}
      >
        <button
          className={cn(
            "border m-0 p-1 border-b-0",
            isActive("home") &&
              "border-stone-300 shadow-[0px_1px_0px_0px_#FFFFFF]"
          )}
          onClick={() => {
            setActiveTab("home");
          }}
        >
          <House
            size={16}
            className={
              isActive("home") ? "stroke-stone-500" : "stroke-stone-200"
            }
          />
        </button>

        {/* .map() stuff here */}
        {tabs.map((t) => (
          <button
            className={cn(
              "relative border m-0 p-1 border-b-0",
              isActive(t.name) &&
                "border-stone-300 shadow-[0px_1px_0px_0px_#FFFFFF]"
            )}
            onClick={() => {
              setActiveTab(t.name);
            }}
          >
            {t.edited && (
              <div
                className={cn(
                  "absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-yellow-500"
                )}
              />
            )}
            <t.icon
              size={16}
              className={
                isActive(t.name) ? "stroke-stone-500" : "stroke-stone-200"
              }
            />
          </button>
        ))}

        {/* <button className={cn("border m-0 p-1 border-b-0")} onClick={() => {}}>
          <NotebookPen size={16} className="stroke-stone-200" />
        </button> */}
      </div>

      {/* Close, Minimize */}
      <div className={cn("p-1 flex flex-row items-center gap-2")}>
        {/* <button>
          <Maximize2 size={16} className="stroke-stone-700" />
        </button> */}
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
