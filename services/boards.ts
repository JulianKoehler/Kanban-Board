import { IBoard } from "@/types/data";
import apiClient from ".";

const getAllBoards = async () => {
  const { data } = await apiClient.get("/getBoard/all");
  return data;
};

const getBoard = async (id: string) => {
  const { data } = await apiClient.get(`/getBoard/${id}`);
  return data;
};

const createBoard = async (payload: IBoard) => {
  const { data } = await apiClient.post("/addOrEditBoard", payload);
  return data;
};

const updateBoard = async (payload: IBoard) => {
  const { data } = await apiClient.post("/addOrEditBoard", payload);
  return data;
};

const BoardServices = {
  getAllBoards,
  getBoard,
  createBoard,
  updateBoard,
};

export default BoardServices;
