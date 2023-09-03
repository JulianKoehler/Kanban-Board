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
import { ChangeEvent, FormEvent, useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { Toaster, toast } from "react-hot-toast";

const resetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const emailInputError = email.trim().length < 1;
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailTouched(true);
  };

  async function forgotPasswordHandler(e: FormEvent) {
    e.preventDefault();
    setEmailTouched(true);

    if (email === "") return;

    try {
      sendPasswordResetEmail(email);
      toast.success("Mail sent, please check your inbox!");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }

    if (!error) router.push("/login");
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
          We will send you a message to your email address containig a link
          where you can reset your password.
        </p>
        <form
          method="post"
          onSubmit={forgotPasswordHandler}
          className="mt-12 flex w-full max-w-[36rem] flex-col gap-4"
        >
          <FormGroup additionalClasses="gap-1 relative">
            <label
              htmlFor="email"
              className="text-lg font-bold text-grey-medium"
            >
              Your Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChangeHandler}
            />
            {emailInputError && emailTouched && (
              <sub className="absolute right-4 bottom-8 text-red">
                Please provide your email
              </sub>
            )}
          </FormGroup>
          <Button className="flex justify-center">
            {sending ? LoadingSpinner_TailSpin : "Submit"}
          </Button>
        </form>
      </AuthCard>
    </>
  );
};

export default resetPassword;
