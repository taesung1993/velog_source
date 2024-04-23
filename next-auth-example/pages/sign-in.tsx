import SignInForm from "@/components/AuthForms/SignInForm";
import { useTokenContext } from "@/lib/providers/TokenProvider";
import { useEffect } from "react";

export default function SignIn() {
  const { refetch } = useTokenContext();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <article className="w-screen h-screen flex items-center justify-center">
      <SignInForm />
    </article>
  );
}
