import { ClerkProvider, auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/header";
import { Providers } from "./store/providers";
import { Toaster } from "react-hot-toast";

import "./global.css";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "ChatPDF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  const isAuth = !!userId;

  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-gray-900 text-slate-50 px-5 py-5`}
      >
        <ClerkProvider>
          {isAuth && <Header />}

          <Providers>{children}</Providers>
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
