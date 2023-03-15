import { IBoard, IColumn, ITask, Subtask } from "@/types/data";
import axios from "axios";
import { useState } from "react";

type HttpMethod = "POST" | "PATCH";
type RequestData = IBoard | IColumn | ITask | Subtask;

const useHttpRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function sendData(method: HttpMethod, url: string, data: RequestData) {
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
        console.log(response);
        throw new Error("Could not send data.");
      }

      setHasError(false);
    } catch (err: any) {
      console.log(err.message);
      setHasError(true);
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

      console.log(response);
      setHasError(false);
    } catch (err) {
      setHasError(true);
      console.log(err);
      throw new Error("Could not delete data.");
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
