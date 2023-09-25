import Link from "next/link";
import { Button } from "../ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ChatSideBarProps {
  chats: DrizzleChat[];
  chatId: number;
}

export default async function ChatSideBar({ chats, chatId }: ChatSideBarProps) {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-cyan-600 flex flex-col">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-white flex items-center", {
                "bg-zinc-400 text-white": chat.id === chatId,
                "hover:text-slate-200": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-2 text-sm text-white ">
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
        </div>
      </div>
    </div>
  );
}
