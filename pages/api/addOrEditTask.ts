import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { ISubtask } from "@/types/data";

type Response = string;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "PATCH" || req.method === "POST") {
    try {
      await setDoc(doc(db, "tasks", req.body.id), {
        id: req.body.id,
        index: req.body.index,
        column: req.body.status.columnID,
        title: req.body.title,
        details: req.body.details,
        status: req.body.status,
      });

      if (req.body.subtasks.length < 1) {
        throw new Error(
          "No Subtasks provided. Please specify at least 1 subtask."
        );
      }

      for (const subtask of req.body.subtasks) {
        if (subtask.markedForDeletion) {
          await deleteDoc(
            doc(db, "tasks", req.body.id, "subtasks", subtask.id)
          );
        } else {
          await setDoc(doc(db, "tasks", req.body.id, "subtasks", subtask.id), {
            id: subtask.id,
            isCompleted: subtask.isCompleted,
            title: subtask.title,
          });
        }
      }

      res.status(200).send("Successfully set/updated the task");
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send(err.message);
      }
    }
  } else {
    throw new Error("Only POST or PATCH Requests allowed!");
  }
}
