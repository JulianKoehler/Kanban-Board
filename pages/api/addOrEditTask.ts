import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

type Response = {
  message: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "PATCH" || req.method === "POST") {
    try {
      await setDoc(doc(db, "tasks", req.body.id), {
        id: req.body.id,
        timestamp: req.body.timestamp,
        column: req.body.status.columnID,
        title: req.body.title,
        details: req.body.details,
        status: req.body.status,
      });

      for (const subtask of req.body.subtasks) {
        if (subtask.markedForDeletion) {
          await deleteDoc(
            doc(db, "tasks", req.body.id, "subtasks", subtask.id)
          );
        } else {
          await setDoc(doc(db, "tasks", req.body.id, "subtasks", subtask.id), {
            id: subtask.id,
            index: subtask.index,
            isCompleted: subtask.isCompleted,
            title: subtask.title,
          });
        }
      }

      res.status(200).send({
        message: "Successfully set/updated the task",
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  } else {
    throw new Error("Only POST or PATCH Requests allowed!");
  }
}
