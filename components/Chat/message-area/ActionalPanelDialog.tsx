/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

// prettier-ignore
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Button, Textarea } from "@/components/ui/_index";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useChatContext } from "../ChatContext/ChatContext";
import {
  checkFeedbackExist,
  insertFeedback,
  updateFeedback,
} from "@/lib/actions/sql/_index";
import "./insertingSpinner.css";
import { toast } from "sonner";

const text = {
  like: "กรุณาระบุเหตุผลที่ท่านเห็นชอบเกี่ยวกับคำตอบนี้",
  dislike: "กรุณาระบุเหตุผลที่ควรปรับปรุง",
  details: "เพื่อให้ทางเรานำความเห็นไปใช้ปรับปรุงคำตอบในครั้งถัดไป",
  already_exist: "ท่านเคยเสนอความคิดเห็นแล้ว",
  already_exist_desc:
    "หากต้องการเสนอความคิดเห็นกับการตอบกลับนี้อีกรอบกดปุ่ม 'ยืนยัน' หากไม่ต้องการกดปุ่ม 'ยกเลิก' หรือ 'กากบาท' ",
  success: "ตอบรับความคิดเห็นสำเร็จ",
  success_desc:
    "ขอบคุณที่แสดงความคิดเห็นสำหรับการตอบกลับนี้ เพื่อให้เราใช้ในการพัฒนาผลิตภัณฑ์ต่อไป",
  error: "เกิดข้อผิดพลาด",
  error_desc: "เกิดข้อผิดพลาดในการเสนอความคิดเห็น กรุณาลองใหม่อีกครั้ง",
};

export default function ActionalPanelDialog({
  type,
  messageId,
  message,
  children,
}: {
  type: string;
  messageId: string;
  message: string;
  children: React.ReactNode;
}) {
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  //const { email } = useChatContext();
  const email = ""
  const feedbackHandle = async () => {
    setIsInserting(true);
    const feedbackId = uuidv4();
    const timeStamp = new Date().toISOString();
    let feedbackObj = {
      feedbackId: feedbackId,
      user: email,
      messageId: messageId,
      message: message,
      feedbackType: type,
      comment: feedback,
      timeStamp: timeStamp,
    };

    const feedbackExist = await checkFeedbackExist(messageId);
    if (Object.keys(feedbackExist.result).length !== 0) {
      toast.warning(text.already_exist, {
        description: text.already_exist_desc,
        action: {
          label: "ยืนยัน",
          onClick: async () => {
            feedbackObj = {
              ...feedbackObj,
              feedbackId: feedbackExist.result.data_array[0][0],
            };
            try {
              await updateFeedback(feedbackObj);
              toast.success(text.success, {
                description: text.success_desc,
              });
            } catch (err) {
              toast.error(text.error, {
                description: text.error_desc,
              });
              console.error(err);
            } finally {
              setOpen(false);
              setIsInserting(false);
            }
          },
        },
        cancel: {
          label: "ยกเลิก",
          onClick: () => console.log("Close"),
        },
        actionButtonStyle: {
          backgroundColor: "rgba(251,191,36)",
          color: "rgba(55,65,81)",
        },
        cancelButtonStyle: {
          backgroundColor: "rgba(243,244,246)",
          color: "rgba(55,65,81)",
        },
      });
      setOpen(false);
      setIsInserting(false);
    } else {
      try {
        await insertFeedback(feedbackObj);
        toast.success(text.success, {
          description: text.success_desc,
        });
      } catch (err) {
        toast.error(text.error, {
          description: text.error_desc,
        });
        console.error(err);
      } finally {
        setOpen(false);
        setIsInserting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {/* @ts-ignore */}
          <DialogTitle>{text[type]}</DialogTitle>
          <DialogDescription>{text.details}</DialogDescription>
        </DialogHeader>
        <Textarea
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isInserting}
        />
        <Button
          className="flex items-center justify-center"
          disabled={isInserting}
          onClick={() => {
            feedbackHandle();
          }}
        >
          {isInserting ? <div className="inserting-spinner" /> : "ยืนยัน"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
