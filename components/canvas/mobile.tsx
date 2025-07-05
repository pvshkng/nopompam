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

const PureMobileCanvas = (props: any) => {
  const { isDrawerOpen, setIsDrawerOpen, className } = props;
  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={() => {
        setIsDrawerOpen(!isDrawerOpen);
      }}
      /* fixed={true} */
      /* modal={false} */
      dismissible={true}
      nested={true}
    >
      {/* <DrawerTrigger hidden>Open</DrawerTrigger> */}
      <DrawerContent className={className}>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer description</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose
            onClick={() => {
              setIsDrawerOpen(false);
            }}
          >
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const MobileCanvas = memo(PureMobileCanvas);
