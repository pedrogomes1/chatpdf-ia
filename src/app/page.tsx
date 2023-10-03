import { LogIn } from "lucide-react";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { FileUpload } from "@/components/fileUpload";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";

export default async function Home() {
  const { userId } = await auth();

  const _chats = await db.select().from(chats);

  const lastChat = _chats.length ? _chats[_chats.length - 1] : null;

  const isAuth = !!userId;
  return (
    <div className="w-screen h-screen">
      <main className="flex flex-col gap-5 w-full max-w-lg mx-auto h-full items-center justify-center">
        <h1 className="text-slate-50 text-3xl mb-5">Welcome to ChatPDF</h1>

        {isAuth && (
          <Link href={`/chat/${lastChat?.id}`}>
            <Button disabled={!lastChat} variant="secondary">
              Go to chats
            </Button>
          </Link>
        )}

        {isAuth ? (
          <FileUpload />
        ) : (
          <Link href="/auth/sign-in">
            <Button>
              Login to get started <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </main>
    </div>
  );
}
