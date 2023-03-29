/**
 * This route is for getting a specific board including all its columns, the columns tasks
 * and the tasks subtasks. The board ID determine wich data to load. Thereafter the columns,
 * will be queried that are connected to this board. This methodology is continuing until we reach
 * the subtasks, which are within a subcollection of each task document.
 */

import { db } from "@/firebase/config";
import { IColumn, ITask, ISubtask } from "@/types/data";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { IBoard } from "@/types/data";

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<IBoard | string>
) {
  try {
    if (req.method !== "GET") {
      throw new Error("Only GET Requests allowed!");
    }

    const { boardId } = req.query;

    if (typeof boardId !== "string") {
      throw new Error("Please enter a single valid board ID");
    }

    const board = await getBoardData(boardId);
    const columns = await getAssociatedColumns(boardId);

    for (const column of columns) {
      const tasks = await getAssociatedTasks(column.id);
      column.tasks = tasks;
    }

    res.status(200).json({
      id: boardId,
      name: board?.name ?? "Board not found",
      index: board?.index,
      columns: columns,
    });
  } catch (err) {
    console.error(err);
    res.status(502).send("ERR_BOARDDATA");
  }
}

async function getBoardData(id: string) {
  const boardRef = doc(db, "boards", id);
  const boardSnap = await getDoc(boardRef);
  if (boardSnap.exists()) {
    return boardSnap.data();
  }
}

async function getAssociatedColumns(id: string) {
  const columns: Array<IColumn> = [];
  const columnsRef = collection(db, "columns");
  const q = query(columnsRef, where("board", "==", id));
  const querySnaphot = await getDocs(q);

  querySnaphot.forEach((doc) => {
    columns.push({
      id: doc.id,
      ...doc.data(),
    } as IColumn);
  });

  return columns.sort((a: IColumn, b: IColumn) => a.index - b.index);
}

async function getAssociatedTasks(id: string) {
  const tasks: Array<ITask> = [];
  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("column", "==", id));
  const querySnapshot = await getDocs(q);

  for (const doc of querySnapshot.docs) {
    const subtasks = await getAssociatedSubtasks(doc);

    tasks.push({
      id: doc.id,
      ...doc.data(),
      subtasks,
    } as ITask);
  }

  return tasks.sort((a: ITask, b: ITask) => a.timestamp - b.timestamp);
}

async function getAssociatedSubtasks(
  taskDoc: DocumentSnapshot
): Promise<Array<ISubtask>> {
  const subtasksRef = collection(taskDoc.ref, "subtasks");
  const subtasksQuerySnapshot = await getDocs(subtasksRef);
  const subtasks = subtasksQuerySnapshot.docs.map(
    (subtaskDoc) =>
      ({
        id: subtaskDoc.id,
        ...subtaskDoc.data(),
      } as ISubtask)
  );

  /* The following 3 lines of code are only a workaround until there is an index for each existing subtask implemented */
  if (subtasks[0].index && subtasks[0].index >= 0) {
    return subtasks.sort((a: ISubtask, b: ISubtask) => a.index! - b.index!);
  }

  return subtasks;
}
