//TODO fix usecase description

"use client";
//prettier-ignore
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/_index";
import { cn } from "@/lib/utils";
//import { toast } from "sonner";
import { useToast, Button } from "@/components/ui/_index";

//prettier-ignore
const options = [
  { value: "auto", label: "Auto-detect", description: "ระบบจะทำการเลือกให้อัตโนมัติจากคำถามของผู้ใช้งาน", },
  { value: "product", label: "Product", description: "ระบบจะตอบคำถามเกี่ยวกับผลิตภัณฑ์ธนาคาร อาทิ บัตรเครดิต สินเชื่อบ้าน สินเชื่อรถ และ กองทุนรวม" },
  { value: "brs", label: "BRS", description: "ระบบจะตอบคำถามเกี่ยวกับข้อมูลทางธุรกิจจากเอกสาร BRS โดยให้คำนิยามและยกตัวอย่างประกอบ" },
  { value: "sql", label: "SQL", description: "ระบบจะตอบคำถามจากฐานข้อมูลใน Databricks โดยการใช้ SQL" },
];

export default function UseCaseSelector(props: any) {
  const { toast } = useToast();
  const { usecase, setUsecase } = props;

  return (
    
    <>
      <div className="flex flex-row items-center">
        <div className="mx-1 text-[10px] text-gray-500 font-semibold">
          Use case:
        </div>
        <Tabs
          defaultValue="auto"
          onValueChange={(v) => {
            setUsecase(v);
          }}
        >
          <TabsList className="h-auto bg-transparent my-1 p-0">
            {options.map((o, i) => (
              <TabsTrigger
                key={i}
                className={cn(
                  "uc-hover-trigger",
                  "text-[10px] mx-[2px] p-1",
                  "data-[state=active]:bg-bean",
                  " text-gray-300 data-[state=active]:text-gray-500",
                  "leading-none"
                )}
                onClick={() => {
                  /* toast.info("Use case changed to "+o.label, {
                      description: o.description,
                      position: "top-right",
                      duration: 2000
                    }) */
                  toast({
                    title: `Usecase: ${o.label}`,
                    description: o.description,
                    variant: "default",
                  });
                }}
                value={o.value}
              >
                {o.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
