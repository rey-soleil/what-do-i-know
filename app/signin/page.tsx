"use client";
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  // TODO: modify the Welcome Dialog to prompt users to sign in. On submitting
  // the Dialog, users are (optionally) signed in and redirected to the chat
  // page.
  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => signIn("google", { callbackUrl })}>
        Sign in With Google
      </Button>
    </div>
  );
}
