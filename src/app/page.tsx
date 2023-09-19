import { LogIn } from "lucide-react";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { FileUpload } from "@/components/fileUpload";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  const isAuth = !!userId;
  return (
    <div className="w-screen h-screen">
      <main className="flex flex-col gap-5 w-full max-w-lg mx-auto h-full items-center justify-center">
        <h1 className="text-slate-50 text-3xl mb-5">Welcome to ChatPDF</h1>

        {isAuth && <Button variant="secondary">Go to chats</Button>}

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
