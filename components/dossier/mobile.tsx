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

const PureMobileDossier = (props: any) => {
  const {
    dossierOpen,
    setDossierOpen,
    artifacts,
    setArtifacts,
    activeTab,
    setActiveTab,
    className,
  } = props;
  return (
    <Drawer
      open={dossierOpen}
      onOpenChange={() => {
        setDossierOpen(!dossierOpen);
      }}
      /* fixed={true} */
      /* modal={false} */
      //dismissible={true}
      //nested={true}
    >
      {/* <DrawerTrigger hidden>Open</DrawerTrigger> */}
      <DrawerContent
        className={cn(
          "data-[vaul-drawer-direction=bottom]:!max-h-[95vh]",
          "data-[vaul-drawer-direction=bottom]:!h-full",
          "bg-stone-200",
          className
        )}
      >
        <DrawerHeader hidden className="size-0 m-0 p-0">
          <DrawerTitle hidden></DrawerTitle>
          <DrawerDescription hidden></DrawerDescription>
        </DrawerHeader>
        <Dossier
          dossierOpen={dossierOpen}
          setDossierOpen={setDossierOpen}
          artifacts={artifacts}
          setArtifacts={setArtifacts}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <DrawerFooter>
          <DrawerClose
            onClick={() => {
              setDossierOpen(false);
            }}
          >
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const MobileDossier = memo(PureMobileDossier);
