type ErrorFeedbackProps = {
    onClose: () => void;
    header: string | undefined;
    description: string | undefined;
};

const ErrorFeedback = ({ header, description, onClose }: ErrorFeedbackProps) => {
    return (
        <div
            className="relative left-[50%] top-[50%] h-fit w-6/12 translate-x-[-50%] translate-y-[-50%] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert">
            <strong className="font-bold">{header}</strong>
            <span className="sm:inline block">{description}</span>
            <span onClick={onClose} className="absolute bottom-0 right-0 top-0 px-4 py-3">
                <svg
                    className="text-red-500 h-6 w-6 fill-current"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
            </span>
        </div>
    );
};

export default ErrorFeedback;
