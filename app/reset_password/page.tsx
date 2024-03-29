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
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ResetPasswordPage = () => {
    const { push } = useRouter();
    const [sendPasswordResetRequest, result] = restApi.auth.useRequestPasswordResetMutation();
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const emailInputError = email.trim().length < 1;

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailTouched(true);
    };

    async function forgotPasswordHandler(e: FormEvent) {
        e.preventDefault();
        setEmailTouched(true);

        if (email === '') return;

        try {
            const hasError = await sendPasswordResetRequest({ email }).unwrap();

            if (hasError) throw new Error(hasError?.detail);
            else toast.success('Mail sent, please check your inbox!');
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!result.isUninitialized && result.isSuccess) {
            push('/login');
        }
    }, [result, push]);

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
                <p className="w-[40rem] text-center">
                    We will send you a message to your email address containig a link where you can reset your password.
                </p>
                <form
                    method="post"
                    onSubmit={forgotPasswordHandler}
                    className="mt-12 flex w-full max-w-[36rem] flex-col gap-4">
                    <FormGroup className="relative gap-1">
                        <label htmlFor="email" className="text-lg font-bold text-grey-medium">
                            Your Email
                        </label>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeHandler} />
                        {emailInputError && emailTouched && (
                            <sub className="absolute bottom-8 right-4 text-red">Please provide your email</sub>
                        )}
                    </FormGroup>
                    <Button className="flex justify-center">
                        {result.isLoading ? LoadingSpinner_TailSpin : 'Submit'}
                    </Button>
                </form>
            </AuthCard>
        </>
    );
};

export default ResetPasswordPage;
