import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

type Response = string;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "DELETE") {
    throw new Error("Only DELETE Requests allowed!");
  }

  try {
    await deleteDoc(doc(db, "boards", req.body.id));

    if (req.body.columns.length < 1) {
      res.status(200).send(`The board with ID ${req.body.id} has been deleted`);
    }

    for (const column of req.body.columns) {
      await deleteDoc(doc(db, "columns", column.id));

      if (!column.tasks || column.tasks.length < 1) {
        continue;
      }

      for (const task of column.tasks) {
        await deleteDoc(doc(db, "tasks", task.id));
      }
    }

    res.status(200).send(`The board with ID ${req.body.id} has been deleted`);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
}
