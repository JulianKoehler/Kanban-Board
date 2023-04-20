import { useEffect, useState } from "react";

const useViewport = () => {
  const lowestTabletViewport = 768;
  const lowestDesktopViewport = 1060;
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < lowestTabletViewport
  );
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= lowestTabletViewport &&
      window.innerWidth < lowestDesktopViewport
  );

  const updateMedia = () => {
    setIsMobile(window.innerWidth < lowestTabletViewport);
    setIsTablet(
      window.innerWidth >= lowestTabletViewport &&
        window.innerWidth < lowestDesktopViewport
    );
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const viewports: [boolean, boolean] = [isMobile, isTablet];

  return viewports;
};

export default useViewport;
