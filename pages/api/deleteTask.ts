import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

type Response = {
  message: string;
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "DELETE") {
    throw new Error("Only DELETE Requests allowed!");
  }
  console.log(req.body);
  

  try {
    // Will not delete the subcollections
    await deleteDoc(doc(db, "tasks", req.body));

    res.status(200).send({
      message: `The task with ID ${req.body.id} and all its subtasks have been deleted`,
    });
  } catch (err) {
    console.log(err);
    
    if (err instanceof Error) {
      res.status(500).send({
        message: err.message,
      });
    }
  }
}
