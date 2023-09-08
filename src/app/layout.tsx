import { ClerkProvider, auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./global.css";
import Header from "@/components/header";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${poppins.className} bg-gray-900 text-slate-50 px-5 py-5`}
        >
          {isAuth && <Header />}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
