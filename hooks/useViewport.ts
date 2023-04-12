import { useEffect, useState } from "react";

const useViewport = () => {
  const tabletViewport = 768;
  const [isMobile, setIsMobile] = useState(window.innerWidth < tabletViewport);

  const updateMedia = () => {
    setIsMobile(window.innerWidth < tabletViewport);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return isMobile;
};

export default useViewport;
