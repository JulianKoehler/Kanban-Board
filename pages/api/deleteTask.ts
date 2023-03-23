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
    // Will not delete the subcollections
    await deleteDoc(doc(db, "tasks", req.body.id));

    res
      .status(200)
      .send(
        `The task with ID ${req.body.id} and all its subtasks have been deleted`
      );
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
}