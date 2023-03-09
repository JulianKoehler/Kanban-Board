import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { IBoard, IColumn, ITask, Subtask } from "@/types/data";
import { collection, getDocs } from "firebase/firestore";
import { getCollection } from "@/util/https";

type Data = {
  boards: IBoard[];
};

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    return;
  }

  const boards = (await getCollection("boards")) as IBoard[];

  res.status(200).json({ boards });
}
