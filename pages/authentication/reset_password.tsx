import Button from "@/components/UI/Button";
import AuthCard from "@/components/UI/Cards/AuthCard";
import FormGroup from "@/components/UI/Formelements/FormGroup";
import Input from "@/components/UI/InputFields/TextInput";
import { LoadingSpinner_TailSpin } from "@/components/UI/LoadingSpinner";
import { auth } from "@/firebase/config";
import logo from "@/public/assets/logo-dark.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { Toaster, toast } from "react-hot-toast";

type Props = {};

const resetPassword = (props: Props) => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  async function forgotPasswordHandler(e: FormEvent) {
    e.preventDefault();

    const response = sendPasswordResetEmail(emailRef.current!.value);

    toast.promise(response, {
      loading: "Sending...",
      success: "Email sent! Check your inbox.",
      error: "Could not send email, please try again later.",
    });

    await response;

    router.push("/authentication/login");
  }

  return (
    <>
      <div>
        <Toaster
          toastOptions={{
            style: {
              borderRadius: "4rem",
              background: "#F4F7FD",
              color: "black",
            },
          }}
        />
      </div>
      <AuthCard className="flex-col items-center gap-4">
        <Link href="/">
          <Image
            src={logo.src}
            alt="kanban"
            width={logo.width + 100}
            height={logo.height}
          />
        </Link>

        <h1 className="my-10 text-3xl font-bold tracking-[-0.1rem]">
          Reset your password
        </h1>
        <p className="w-[40rem] text-center">
          We will send you an email to your email address containig a link where
          you can reset your password.
        </p>
        <form
          method="post"
          onSubmit={forgotPasswordHandler}
          className="mt-12 flex w-full max-w-[36rem] flex-col gap-4"
        >
          <FormGroup additionalClasses="gap-1">
            <label
              htmlFor="email"
              className="text-lg font-bold text-grey-medium"
            >
              Your Email
            </label>
            <Input type="email" id="email" name="email" ref={emailRef} />
          </FormGroup>
          <Button>Submit</Button>
        </form>
      </AuthCard>
    </>
  );
};

export default resetPassword;
