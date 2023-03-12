import axios from "axios";

export async function getData(id: string) {
  const { data } = await axios.get(`http://localhost:3000/api/getBoard/${id}`);
  return data;
}

export async function patchData(url: string) {
  await fetch(url);
}

export async function deleteData(url: string) {}
