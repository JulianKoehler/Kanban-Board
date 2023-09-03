import API_ENDPOINTS from "@/services/api-endpoints";
import {
  BoardListItem,
  IBoard,
  IColumn,
  ISubtask,
  ITask,
} from "@/types/data/board.model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "/api/"
// const BASE_URL = "http://localhost:3000/api/";

export const boardApi = createApi({
  reducerPath: "board",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["BoardList", "BoardData"],
  endpoints: (builder) => ({
    getBoardList: builder.query<BoardListItem[], string>({
      query: (userId: string) => ({
        url: API_ENDPOINTS.getAllBoards,
        headers: {
          "Content-Type": "text/plain",
          authorization: userId,
        },
      }),
      transformResponse: (response: { boards: BoardListItem[] }) =>
        response.boards,
      providesTags: ["BoardList"],
    }),
    getBoardData: builder.query<IBoard, string>({
      query: (boardId) => `${API_ENDPOINTS.getSpecificBoard}/${boardId}`,
      providesTags: ["BoardData"],
    }),
    createBoard: builder.mutation<null, IBoard>({
      query: (board) => ({
        url: API_ENDPOINTS.addOrEditBoard,
        method: "POST",
        body: board,
      }),
      invalidatesTags: ["BoardList"],
    }),
    updateBoard: builder.mutation<null, IBoard>({
      query: (board) => ({
        url: API_ENDPOINTS.addOrEditBoard,
        method: "PATCH",
        body: board,
      }),
      invalidatesTags: ["BoardList", "BoardData"],
    }),
    deleteBoard: builder.mutation<null, IBoard>({
      query: (board) => ({
        url: API_ENDPOINTS.deleteBoard,
        method: "DELETE",
        body: board,
      }),
      invalidatesTags: ["BoardList", "BoardData"],
    }),
    createColumn: builder.mutation<IColumn, IColumn>({
      query: (column) => ({
        url: API_ENDPOINTS.addColumn,
        method: "POST",
        body: column,
      }),
      invalidatesTags: ["BoardData"],
    }),
    createTask: builder.mutation<string, ITask>({
      query: (task) => ({
        url: API_ENDPOINTS.addOrEditTask,
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["BoardData"],
    }),
    updateTask: builder.mutation<string, ITask>({
      query: (task) => ({
        url: API_ENDPOINTS.addOrEditTask,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: ["BoardData"],
    }),
    deleteTask: builder.mutation<null, Pick<ITask, "id">>({
      query: (id) => ({
        url: API_ENDPOINTS.deleteTask,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["BoardData"],
    }),
    markSubtask: builder.mutation<
      null,
      {
        taskId: string;
        subtaskId: string;
        isCompleted: boolean;
      }
    >({
      query: (subtask) => ({
        url: API_ENDPOINTS.checkSubtask,
        method: "PATCH",
        body: subtask,
      }),
      invalidatesTags: ["BoardData"],
    }),
  }),
});

export const {
  useCreateBoardMutation,
  useCreateColumnMutation,
  useCreateTaskMutation,
  useDeleteBoardMutation,
  useDeleteTaskMutation,
  useGetBoardDataQuery,
  useGetBoardListQuery,
  useUpdateBoardMutation,
  useMarkSubtaskMutation,
  useUpdateTaskMutation,
} = boardApi;
