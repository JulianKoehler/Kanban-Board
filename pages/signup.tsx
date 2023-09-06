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
import React, { FormEvent, useEffect, useRef } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { Toaster, toast } from "react-hot-toast";

const Signup = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmedPasswordRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);

  async function signUpHandler(e: FormEvent) {
    e.preventDefault();

    if (passwordRef.current!.value !== confirmedPasswordRef.current!.value) {
      toast.error("Your passwords are not matching :(");
      return;
    }

    await createUserWithEmailAndPassword(
      emailRef.current!.value,
      passwordRef.current!.value
    );
    if (error) toast.error("Could not create account, please try again later!");

    await sendEmailVerification();
  }

  useEffect(() => {
    (async () => {
      if (user) {
        const displayName = userNameRef!.current!.value;
        await updateProfile({ displayName });

        toast.success(
          `Welcome to kanban, ${displayName}! We have sent you a verification email.`
        );
        router.push("/");
      }
    })();
  }, [user]);

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
          Sign up with email
        </h1>
        <form
          method="post"
          onSubmit={signUpHandler}
          className="flex w-full max-w-[36rem] flex-col gap-4"
        >
          <FormGroup additionalClasses="gap-1">
            <label
              htmlFor="user_name"
              className="text-lg font-bold text-grey-medium"
            >
              Your Name
            </label>
            <Input
              type="text"
              id="user_name"
              name="user_name"
              ref={userNameRef}
            />
          </FormGroup>
          <FormGroup additionalClasses="gap-1">
            <label
              htmlFor="email"
              className="text-lg font-bold text-grey-medium"
            >
              Your Email
            </label>
            <Input type="email" id="email" name="email" ref={emailRef} />
          </FormGroup>
          <FormGroup additionalClasses="gap-1">
            <label
              htmlFor="password"
              className="text-lg font-bold text-grey-medium"
            >
              Password
            </label>

            <Input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
            />
          </FormGroup>
          <FormGroup additionalClasses="gap-1">
            <label
              htmlFor="password_confirmed"
              className="text-lg font-bold text-grey-medium"
            >
              Confirm your password
            </label>

            <Input
              type="password"
              id="password_confirmed"
              name="password_confirmed"
              ref={confirmedPasswordRef}
            />
          </FormGroup>
          <Button
            disabled={loading}
            className="mt-4 capitalize flex justify-center rounded-[0.8rem] py-4 text-lg"
          >
            {loading ? LoadingSpinner_TailSpin : "create account"}
          </Button>
        </form>
        <div className="mt-6 flex w-full flex-col gap-7">
          <div className="w-full pl-[4.8em] text-left">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-purple-main">
              Sign in
            </Link>
          </div>
        </div>
      </AuthCard>
    </>
  );
};

export default Signup;