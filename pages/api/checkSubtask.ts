import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

type Response = string;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "PATCH") {
    throw new Error("Only PATCZH Requests allowed!");
  }

  try {
    // Will not delete the subcollections
    await setDoc(
      doc(db, "tasks", req.body.taskId, "subtasks", req.body.subtaskId),
      {
        isCompleted: req.body.isCompleted,
      },
      { merge: true }
    );

    res
      .status(200)
      .send(`The subtask with ID ${req.body.id} has been updated!`);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
}
