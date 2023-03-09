import { db } from "@/firebase/config";
import { IBoard, IColumn, ITask, Subtask } from "@/types/data";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";

type collectionTypes = IBoard | IColumn | ITask | Subtask;

export async function getData(id: string) {
  const { data } = await axios.get(`http://localhost:3000/api/getBoard/${id}`);
  return data;
}

export async function postData(url: string, data: object) {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(resp);
}

export async function patchData(url: string) {
  await fetch(url);
}

export async function deleteData(url: string) {}

export async function getCollection(collectionName: string) {
  const collectionData = collection(db, collectionName);
  const snapshot = await getDocs(collectionData);

  const results: Array<collectionTypes> = [];
  snapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as collectionTypes);
  });

  return results;
}
