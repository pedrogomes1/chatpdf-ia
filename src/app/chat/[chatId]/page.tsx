import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import ChatSideBar from "@/components/sidebar";
import PdfViewer from "@/components/pdfViewer";
import ChatComponent from "@/components/chat";

interface ChatProps {
  params: {
    chatId: string;
  };
}

export default async function Chat({ params }: ChatProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const allChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  const currentChat = allChats.find(
    (chat) => chat.id === parseInt(params.chatId)
  );

  const hasNotFoundChatParam = !currentChat;

  if (!allChats || hasNotFoundChatParam) return redirect("/");

  return (
    <div className="flex max-h-screen overflow-scroll bg-slate-300 mt-4">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={allChats} chatId={parseInt(params.chatId)} />
        </div>
        <div className="flex-[5] max-h-screen p-4 overflow-scroll ">
          <PdfViewer pdfUrl={currentChat?.pdfUrl} />
        </div>
        <div className="flex-[3] border-1-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(params?.chatId)} />
        </div>
      </div>
    </div>
  );
}
