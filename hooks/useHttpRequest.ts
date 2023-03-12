import { useState } from "react";

type httpMethod = "POST" | "PATCH";

const useHttpRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function sendData(method: httpMethod, url: string, data: object) {
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Could not post data.");
      }

      setHasError(false);
    } catch (err) {
      console.log(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    hasError,
    sendData,
  };
};

export default useHttpRequest;
