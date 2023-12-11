import { SubtaskResponse } from "@/types/data/subtask";
import { api } from "../api";

export const subtasksApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    toggleSubtaskComplete: builder.mutation<SubtaskResponse, string>({
      query: (id) => ({
        url: `subtasks/${id}`,
        method: "PUT",
      }),
    }),
  }),
});
