import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DataTableDemo } from "@/components/Document/table/sample";

export default async function Document({ searchParams }) {
  return (
    <>
      <section>
        <div className="size-full p-4">
          <DataTableDemo />
        </div>
      </section>
    </>
  );
}
