import axios from "axios";
import { useState } from "react";

type HttpMethod = "POST" | "PATCH";
type RequestData = object;

const useHttpRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function sendData(
    method: HttpMethod,
    url: string,
    data: RequestData
  ): Promise<Response> {
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
        throw new Error("Could not send data: " + response.statusText);
      }

      setHasError(false);
      return response;
    } catch (err: any) {
      console.log(err.message);
      setHasError(true);
      return err;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteData(url: string, data: RequestData) {
    try {
      setIsLoading(true);
      const response = await axios.delete(url, {
        data: data,
      });

      setHasError(false);
      return response;
    } catch (err) {
      setHasError(true);
      console.log(err);
      if (err instanceof Error) {
        throw new Error("Could not delete data: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    hasError,
    sendData,
    deleteData,
  };
};

export default useHttpRequest;
