import { ThreeDots, TailSpin } from 'react-loader-spinner';

export const LoadingSpinner_ThreeDots = (
    <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#635FC7"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        visible={true}
    />
);

export const LoadingSpinner_TailSpin = (
    <TailSpin
        height="20"
        width="20"
        color="#A8A4FF"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
    />
);
