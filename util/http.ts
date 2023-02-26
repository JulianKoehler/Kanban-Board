export async function getData(url: string) {
  const resp = await fetch(url);
  return await resp.json();
}

export async function sendData(url: string) {}

export async function patchData(url: string) {}

export async function deleteData(url: string) {}
