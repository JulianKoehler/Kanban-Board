export async function getData(url: string) {
  const resp = await fetch(url);
  return await resp.json();
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

export async function patchData(url: string) {}

export async function deleteData(url: string) {}
