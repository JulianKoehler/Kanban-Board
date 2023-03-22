import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/config";
import { IBoard, IColumn, ITask, ISubtask } from "@/types/data";
import { collection, getDocs } from "firebase/firestore";

type Data = {
  boards: IBoard[];
};

export type CollectionTypes = IBoard | IColumn | ITask | ISubtask;

export default async function requestHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    throw new Error("Only GET Requests allowed!");
  }

  const boards = (await getCollection("boards")) as IBoard[];
  const sortedByIndex = boards.sort(
    (a: IBoard, b: IBoard) => a.index - b.index
  );

  res.status(200).json({ boards: sortedByIndex });
}

async function getCollection(collectionName: string) {
  const results: Array<CollectionTypes> = [];

  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) {
    throw new Error("No boards available!");
  }

  snapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as CollectionTypes);
  });

  return results;
}
