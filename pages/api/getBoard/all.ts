import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { IBoard, IColumn, ITask, ISubtask } from "@/types/data/board.model";
import {
  FieldPath,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type Data =
  | {
      boards: IBoard[];
    }
  | {
      message: string;
    };

export type CollectionTypes = IBoard | IColumn | ITask | ISubtask;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    throw new Error("Only GET Requests allowed!");
  }

  try {
    const boards = await getCollection("boards", req.headers.authorization) as IBoard[];
    const sortedByIndex = boards.sort(
      (a: IBoard, b: IBoard) => a.index - b.index
    );

    res.status(200).json({ boards: sortedByIndex });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      res.status(502).send({
        message: err.message,
      });
    }
  }
}

async function getCollection(collectionName: string, userId: string | undefined) {
  const results: Array<CollectionTypes> = [];

  const collectionRef = collection(db, collectionName);
  const q = query(
    collectionRef,
    where(new FieldPath("users", "creator" || "contributor"), "==", userId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  snapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as CollectionTypes);
  });

  return results;
}
