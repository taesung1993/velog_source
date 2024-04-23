import { PropsWithChildren } from "react";
import NavBar from "./NavBar";

export default function Default({ children }: PropsWithChildren) {
  return (
    <article className="w-screen min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto p-4">
        {children}
      </main>
    </article>
  );
}
