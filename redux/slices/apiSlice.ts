import API_ENDPOINTS from "@/services/api-endpoints";
import {
  BoardListItem,
  IBoard,
  IColumn,
  ITask,
  ITaskChanged,
  TaskDataServerResponse,
} from "@/types/data/board.model";
import { DeletionPayload } from "@/types/rtk-query/task-deletion";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "/api/";

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
    updateBoard: builder.mutation<void, IBoard>({
      query: (board) => ({
        url: API_ENDPOINTS.addOrEditBoard,
        method: "PATCH",
        body: board,
      }),
      invalidatesTags: ["BoardList"],
      async onQueryStarted(board, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            boardApi.util.updateQueryData(
              "getBoardData",
              board?.id ?? "",
              (draft) => {
                for (let i = 0; i < draft.columns!.length; i++) {
                  if (board.columns![i].markedForDeletion) {
                    draft.columns?.filter(
                      (column) => column.id !== board.columns![i].id
                    );
                    break;
                  }
                  draft.columns![i].name = board.columns![i].name;
                  draft.columns![i].color = board.columns![i].color;
                }
              }
            )
          );
        } catch (err) {
          console.log(err);
          dispatch(boardApi.util.invalidateTags(["BoardData"]));
        }
      },
    }),
    deleteBoard: builder.mutation<void, IBoard>({
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
    createTask: builder.mutation<string, ITaskChanged>({
      query: (task) => ({
        url: API_ENDPOINTS.addOrEditTask,
        method: "POST",
        body: task,
      }),
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            boardApi.util.updateQueryData(
              "getBoardData",
              task.boardId ?? "",
              (draft) => {
                const columnIndex = draft.columns?.findIndex(
                  (column) => column?.id === task?.column
                );
                draft.columns![columnIndex!].tasks!.push(task);
              }
            )
          );
        } catch (err) {
          console.log(err);
          dispatch(boardApi.util.invalidateTags(["BoardData"]));
        }
      },
    }),
    updateTask: builder.mutation<TaskDataServerResponse, ITaskChanged>({
      query: (task) => ({
        url: API_ENDPOINTS.addOrEditTask,
        method: "PATCH",
        body: task,
      }),
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const { id } = task;

        try {
          await queryFulfilled;
          dispatch(
            boardApi.util.updateQueryData(
              "getBoardData",
              task.boardId ?? "",
              (draft) => {
                const hasColumnChanged = task?.column !== task?.oldColumn;
                const oldColumnIndex = draft.columns?.findIndex(
                  (column) => column?.id === task?.oldColumn
                );
                const newColumnIndex = draft.columns?.findIndex(
                  (column) => column?.id === task?.column
                );

                if (
                  !draft.columns ||
                  !task ||
                  oldColumnIndex! < 0 ||
                  newColumnIndex! < 0
                ) {
                  throw new Error(`Check your data, something is undefined.`);
                }

                if (hasColumnChanged) {
                  draft.columns[oldColumnIndex!].tasks = draft.columns[
                    oldColumnIndex!
                  ].tasks?.filter((task) => task.id !== id);
                  draft.columns[newColumnIndex!].tasks?.push(task);
                } else {
                  const indexOfUpdatedTask = draft.columns[
                    newColumnIndex!
                  ].tasks?.findIndex((task) => task.id === id);
                  draft.columns[newColumnIndex!].tasks![indexOfUpdatedTask!] =
                    task;
                }
              }
            )
          );
        } catch (err) {
          console.log(err);
          dispatch(boardApi.util.invalidateTags(["BoardData"]));
        }
      },
    }),
    deleteTask: builder.mutation<void, DeletionPayload>({
      query: (payload) => ({
        url: API_ENDPOINTS.deleteTask,
        method: "DELETE",
        body: payload.id,
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const { id, column, boardId } = payload;
        try {
          await queryFulfilled;

          dispatch(
            boardApi.util.updateQueryData(
              "getBoardData",
              boardId ?? "",
              (draft) => {
                const columnIndex = draft?.columns?.findIndex(
                  (col) => col.id === column
                );
                if (columnIndex === undefined)
                  throw new Error("No column found for this task.");

                draft.columns![columnIndex].tasks = draft?.columns![
                  columnIndex
                ]?.tasks?.filter((task) => task.id !== id);
              }
            )
          );
        } catch (err) {
          console.log(err);
          dispatch(boardApi.util.invalidateTags(["BoardData"]));
        }
      },
    }),
    markSubtask: builder.mutation<
      void,
      {
        taskId: string;
        subtaskId: string;
        isCompleted: boolean;
        boardId: string;
      }
    >({
      query: (subtask) => ({
        url: API_ENDPOINTS.checkSubtask,
        method: "PATCH",
        body: subtask,
      }),
      async onQueryStarted(subtask, { dispatch, queryFulfilled }) {
        const { taskId, subtaskId, isCompleted, boardId } = subtask;
        dispatch(
          boardApi.util.updateQueryData(
            "getBoardData",
            boardId ?? "",
            (draft) => {
              const column = draft.columns?.findIndex((column) =>
                column.tasks?.some((task) => task.id === taskId)
              );
              const task = draft.columns![column!].tasks?.findIndex(
                (task) => task.id === taskId
              );
              const subtask = draft.columns![column!].tasks![
                task!
              ].subtasks.findIndex((subtask) => subtask.id === subtaskId);

              draft.columns![column!].tasks![task!].subtasks![
                subtask!
              ].isCompleted = isCompleted;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          dispatch(boardApi.util.invalidateTags(["BoardData"]));
        }
      },
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
