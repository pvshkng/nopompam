"use client";
import "./deletionSpinner.css";
import { deleteTopic } from "@/lib/actions/mongodb/_index";
import * as ui from "@/components/ui/_index";
import { useState } from "react";
import { useChatContext } from "@/components/Chat/ChatContext/ChatContext";
import { toast } from "sonner";

export default function TopicDeletionDialog({
  _id,
  children,
  stateTopics,
  setStateTopics,
  currentId,
}: {
  _id: string;
  children: React.ReactNode;
  stateTopics: any;
  setStateTopics: any;
  currentId: string | null;
}) {
  const { email } = useChatContext();
  const [isDeleting, setDeleting] = useState(false);
  async function confirmDeletion(topicId: string) {
    setDeleting(true);
    if(topicId === currentId){
      setDeleting(false);
      toast.error("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถลบหัวข้อสนทนาได้เนื่องจากท่านอยู่ในเซสชั่นการสนทนานี้"
      })
    } else {
      const result = await deleteTopic(topicId, email);
      if (result) {
        const updatedTopics = stateTopics.filter((t: any) => t._id !== _id);
        setStateTopics(updatedTopics);
        setDeleting(false);
        toast.success("สำเร็จ", {
          description: "ท่านได้ทำการลบหัวข้อการสนทนาเรียบร้อยแล้ว"
        })
      }
    }
  }

  return (
    <ui.AlertDialog>
      <ui.AlertDialogTrigger>{children}</ui.AlertDialogTrigger>
      <ui.AlertDialogContent>
        <ui.AlertDialogHeader>
          <ui.AlertDialogTitle>
            ต้องการลบหัวข้อสนทนาใช่หรือไม่?
          </ui.AlertDialogTitle>
          <ui.AlertDialogDescription>
            เมื่อลบหัวข้อสนทนาแล้วจะไม่สามารถกู้คืนข้อมูลได้
          </ui.AlertDialogDescription>
        </ui.AlertDialogHeader>
        <ui.AlertDialogAction
          className="flex items-center justify-center bg-destructive text-destructive-foreground hover:bg-destructive/90"
          disabled={isDeleting}
          onClick={() => confirmDeletion(_id)}
        >
          {isDeleting ? <div className="deletion-spinner" /> : "ยืนยัน"}
        </ui.AlertDialogAction>
        <ui.AlertDialogCancel asChild>
          <ui.Button disabled={isDeleting} variant="secondary">
            ยกเลิก
          </ui.Button>
        </ui.AlertDialogCancel>
      </ui.AlertDialogContent>
    </ui.AlertDialog>
  );
}
