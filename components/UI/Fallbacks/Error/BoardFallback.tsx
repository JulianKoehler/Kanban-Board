'use client';

import Button from '@/components/UI/Button/Button';
import ErrorImage from '@/public/assets/404.png';
import Image from 'next/image';
import { FallbackProps } from 'react-error-boundary';
import { errorMessageMap, errorTypeGuardMap } from './helpers';

const BoardFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    let errorMessage = 'Unable to load your board. We apologize for the inconvenience.';

    const hasStatusProp = errorTypeGuardMap.withStatus(error);
    const isListedError = Object.keys(errorMessageMap).includes(String(error?.status));

    if (hasStatusProp && isListedError) {
        errorMessage = errorMessageMap[error.status];
    }

    return (
        <div className="h-full w-full bg-grey-light dark:bg-grey-very-dark">
            <div className="justify-cente m-auto flex max-w-[50%] flex-col items-center gap-8 rounded-3xl p-8 pt-[10%] text-center text-red">
                <h1 className="mb-4 text-3xl font-bold">Oops! Something went wrong.</h1>
                <p className="mb-4 font-bold text-grey-dark dark:text-white">{errorMessage}</p>
                <Image src={ErrorImage} alt="error" width={400} />
                <Button variant="secondary" onClick={resetErrorBoundary}>
                    Try again
                </Button>
            </div>
        </div>
    );
};

export default BoardFallback;
