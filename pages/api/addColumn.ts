import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";

type Response = string;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST") {
    throw new Error("Only POST or PATCH Requests allowed!");
  }

  try {
    await setDoc(doc(db, "columns", req.body.id), {
      board: req.body.boardId,
      color: req.body.color,
      index: req.body.index,
      name: req.body.name,
    });

    res.status(200).send("Successfully added the column");
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  }
}
