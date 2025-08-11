import { cn } from "@/lib/utils";
import { memo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Dossier } from ".";
import { useDossierStore } from "@/lib/stores/dossier-store";

const PureMobileDossier = (props: any) => {
  const { className } = props;

  const {
    dossierOpen,
    setDossierOpen,
    activeTab,
    setActiveTab,
    openDossier,
    closeDossier,
    openDossierWithDocuments,
  } = useDossierStore();

  return (
    <Drawer
      open={dossierOpen}
      onOpenChange={() => {
        setDossierOpen(!dossierOpen);
      }}
    >
      {/* <DrawerTrigger hidden>Open</DrawerTrigger> */}
      <DrawerContent
        className={cn(
          "data-[vaul-drawer-direction=bottom]:!max-h-[95vh]",
          "data-[vaul-drawer-direction=bottom]:!h-full",
          className
        )}
      >
        <DrawerHeader hidden className="size-0 m-0 p-0">
          <DrawerTitle hidden></DrawerTitle>
          <DrawerDescription hidden></DrawerDescription>
        </DrawerHeader>
        <Dossier />
        {/* <DrawerFooter>
          <DrawerClose
            onClick={() => {
              setDossierOpen(false);
            }}
          >
            Close
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export const MobileDossier = memo(PureMobileDossier);
