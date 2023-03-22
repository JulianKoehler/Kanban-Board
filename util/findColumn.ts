import { BoardsState } from "@/redux/slices/boardSlice";
import { IColumn, ITask } from "@/types/data";
import { WritableDraft } from "immer/dist/internal";

export default function findColumn(
  state: WritableDraft<BoardsState>,
  payload: ITask
) {
  const statusId = payload.column;
  return state.activeBoardData!.columns?.find(
    (column: IColumn) => column.id === statusId
  );
}
