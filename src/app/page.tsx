import { Button } from "@/components/ui/button";
import { SignIn, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  const isAuth = !!userId;
  return (
    <div className="w-screen h-screen">
      <main className="flex flex-col h-full items-center justify-center">
        <h1 className="text-slate-50 text-3xl mb-5">Welcome to ChatPDF</h1>

        {isAuth && <Button>Go to chats</Button>}

        {isAuth ? (
          <h1>file</h1>
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
