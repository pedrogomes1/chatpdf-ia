import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
