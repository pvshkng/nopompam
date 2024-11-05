export const getStreamingResponse = async (
  context: any,
  question: string,
  usecase: string,
) => {
  const body = { context, question, usecase };
  try {
    const response = await fetch("/api/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.body) {
      throw new Error("Readable stream not supported");
    }

    return response;
  } catch (error) {
    console.error("Error while trying to get streaming response:", error);
    return "ขออภัยเกิดข้อผิดพลาดจากระบบ กรุณาลองอีกครั้ง";
  }
};

/**
 * Generates an array of objects representing the memory of the messages.
 *
 * @param {Array<{role: string, message: string}>} messages - An array of objects containing the role and message of each message.
 * @return {Array<{role: string, message: string}>} An array of objects representing the memory of the messages.
 */
export const getMemory = (messages: { role: any; content: any }[]) => {
  const memory: any[] = [];
  messages.forEach((msg: { role: any; content: any }) => {
    memory.push({ role: msg.role, content: msg.content });
  });

  return memory;
};

export function scrollToBottom() {
  const msgArea = document.getElementById("scrollArea");
  if (msgArea) {
    setTimeout(() => {
      msgArea.scrollTop = msgArea.scrollHeight;
    }, 100);
  }
}
