import { ReactNode } from "react";

export default function Auth({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen">{children}</div>
  );
}
