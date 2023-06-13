import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

type Response = string;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "PATCH" || req.method === "POST") {
    try {
      await setDoc(doc(db, "boards", req.body.id), {
        name: req.body.name,
        index: req.body.index,
        users: req.body.users,
      });

      for (const column of req.body.columns) {
        if (column.markedForDeletion) {
          await deleteDoc(doc(db, "columns", column.id));
        } else {
          await setDoc(doc(db, "columns", column.id), {
            board: req.body.id,
            index: column.index,
            name: column.name,
            color: column.color,
          });
        }
      }

      res.status(200).send("Successfully set/updated the board");
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send(err.message);
      }
    }
  } else {
    throw new Error("Only POST or PATCH Requests allowed!");
  }
}
