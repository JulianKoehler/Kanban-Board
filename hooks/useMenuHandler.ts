import { useEffect, useState } from "react";

const useMenuHandler = (ref: React.RefObject<HTMLDivElement>) => {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowElement(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return {
    showElement,
    setShowElement,
  };
};

export default useMenuHandler;
