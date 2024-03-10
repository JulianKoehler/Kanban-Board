'use client';

import Button from '@/components/UI/Button/Button';
import AuthCard from '@/components/UI/Cards/AuthCard';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import Input from '@/components/UI/InputFields/TextInput';
import { LoadingSpinner_TailSpin } from '@/components/UI/LoadingSpinner';
import LogoLightMode from '@/public/assets/logo-dark.svg';
import LogoDarkMode from '@/public/assets/logo-light.svg';
import { restApi } from '@/services/redux/api';
import { HTTPExceptionResponse } from '@/services/redux/api/auth/types';
import { login } from '@/services/redux/slices/authSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Login = () => {
    const { push } = useRouter();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [sendLoginRequest, { data, isLoading }] = restApi.auth.useLoginMutation();

    async function signInHandler(e: FormEvent) {
        e.preventDefault();

        try {
            await sendLoginRequest({
                email: emailRef.current!.value,
                password: passwordRef.current!.value,
            });

            dispatch(login(data!));
            push('/');
        } catch (err) {
            console.error(err);
            let errorMessage = 'The service is currently unavailable. Please try again later.';
            if ((err as FetchBaseQueryError)?.data) {
                errorMessage = ((err as FetchBaseQueryError).data as HTTPExceptionResponse)?.detail
            }
            toast.error(errorMessage);
        }
    }

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
                    <Image
                        src={theme === 'light' ? LogoLightMode.src : LogoDarkMode.src}
                        alt="kanban"
                        width={LogoLightMode.width + 100}
                        height={LogoLightMode.height}
                    />
                </Link>
                <h1 className="my-10 text-3xl font-bold tracking-[-0.1rem]">Sign in with email</h1>
                <form onSubmit={signInHandler} className="flex w-full max-w-[36rem] flex-col gap-4">
                    <FormGroup className="gap-1">
                        <label htmlFor="email" className="text-lg font-bold text-grey-medium">
                            Your Email
                        </label>
                        <Input type="email" id="email" name="email" ref={emailRef} />
                    </FormGroup>
                    <FormGroup className="gap-1">
                        <label htmlFor="password" className="text-lg font-bold text-grey-medium">
                            Password
                        </label>

                        <Input type="password" id="password" name="password" ref={passwordRef} />
                    </FormGroup>
                    <Button disabled={isLoading} className="mt-4 flex justify-center rounded-[0.8rem] py-4 text-lg">
                        {isLoading ? LoadingSpinner_TailSpin : 'Sign in'}
                    </Button>
                </form>
                <div className="relative mt-6 flex w-full flex-col gap-7">
                    <Link href="/reset_password" className="w-full pl-[4.8em] text-left font-bold text-purple-main">
                        Forgot password?
                    </Link>
                    <div className="absolute -bottom-48 left-1/2 -translate-x-1/2">
                        New to kanban?{' '}
                        <Link href="/signup" className="font-bold text-purple-main">
                            Create Account
                        </Link>
                    </div>
                </div>
            </AuthCard>
        </>
    );
};

export default Login;
