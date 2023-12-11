import { Subtask } from "@/types/data/subtask";
import { api } from "../api";

export const subtasksApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    toggleSubtaskComplete: builder.mutation<Subtask, string>({
      query: (id) => ({
        url: `subtasks/${id}`,
        method: "PUT",
      }),
    }),
  }),
});
