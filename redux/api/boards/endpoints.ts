import { api } from "../api";
import { pessimisticUpdate } from "./pessimistic-updates";

export const boardsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getBoardList: builder.query<BoardListItem[], void>({
      query: () => "boards",
      transformResponse: (response: BoardListResponse) => response.own_boards,
      providesTags: ["BoardList"],
    }),
    getBoardDataById: builder.query<BoardDataResponse, string>({
      query: (id) => `boards/${id}`,
      providesTags: ["BoardData"],
    }),
    createBoard: builder.mutation<BoardCreateResponse, BoardCreate>({
      query: ({ title, stages }) => ({
        url: "boards",
        method: "POST",
        body: {
          title,
          stages,
        },
      }),
      invalidatesTags: ["BoardList"],
    }),
    updateBoard: builder.mutation<BoardDataResponse, { id: string; data: BoardUpdate }>({
      query: ({ id, data }) => ({
        url: `boards/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BoardList"],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        pessimisticUpdate.updateBoard(queryFulfilled, dispatch, id);
      },
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BoardList"],
    }),
  }),
});
