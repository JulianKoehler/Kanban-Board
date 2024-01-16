'use client';

import Button from '@/components/UI/Button/Button';
import AuthCard from '@/components/UI/Cards/AuthCard';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import Input from '@/components/UI/InputFields/TextInput';
import { LoadingSpinner_TailSpin } from '@/components/UI/LoadingSpinner';
import logo from '@/public/assets/logo-dark.svg';
import { restApi } from '@/services/redux/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function NewPasswordPage({ searchParams }: { searchParams: Record<string, string> }) {
    const router = useRouter();
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmedPasswordRef = useRef<HTMLInputElement>(null);
    const [setNewPassword, result] = restApi.auth.useSetNewPasswordMutation();

    const { token } = searchParams;

    async function submitNewPasswordHandler(e: FormEvent) {
        e.preventDefault();

        if (passwordRef.current!.value !== confirmedPasswordRef.current!.value) {
            toast.error('Your passwords are not matching :(');
            return;
        }

        try {
            const hasError = await setNewPassword({
                accessToken: token as string,
                tokenType: 'Bearer',
                password: passwordRef.current!.value,
            }).unwrap();

            if (hasError) throw new Error(hasError?.detail);
            else toast.success('You password was successfully updated!');
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
    }

    useEffect(() => {
        if (result.isSuccess) router.push('/');
    }, [result, router]);

    return (
        <>
            <div>
                <Toaster
                    toastOptions={{
                        style: {
                            borderRadius: '4rem',
                            background: '#F4F7FD',
                            color: 'black',
                        },
                    }}
                />
            </div>
            <AuthCard className="flex-col items-center gap-4">
                <Link href="/">
                    <Image src={logo.src} alt="kanban" width={logo.width + 100} height={logo.height} />
                </Link>

                <h1 className="my-10 text-3xl font-bold tracking-[-0.1rem]">Reset your password</h1>
                <p className="w-[40rem] text-center">To proceed please choose a new password.</p>
                <form
                    method="post"
                    onSubmit={submitNewPasswordHandler}
                    className="mt-12 flex w-full max-w-[36rem] flex-col gap-4">
                    <FormGroup className="gap-1">
                        <label htmlFor="password" className="text-lg font-bold text-grey-medium">
                            New Password
                        </label>

                        <Input type="password" id="password" name="password" ref={passwordRef} />
                    </FormGroup>
                    <FormGroup className="gap-1">
                        <label htmlFor="password_confirmed" className="text-lg font-bold text-grey-medium">
                            Confirm your new password
                        </label>

                        <Input
                            type="password"
                            id="password_confirmed"
                            name="password_confirmed"
                            ref={confirmedPasswordRef}
                        />
                    </FormGroup>
                    <Button
                        disabled={result.isLoading}
                        className="mt-4 flex justify-center rounded-[0.8rem] py-4 text-lg capitalize">
                        {result.isLoading ? LoadingSpinner_TailSpin : 'Submit new password'}
                    </Button>
                </form>
            </AuthCard>
        </>
    );
}
