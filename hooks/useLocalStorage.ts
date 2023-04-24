type LocalStorageMethods = "GET" | "SET";

const useLocalStorage = (
  itemname: string,
  method: LocalStorageMethods = "GET",
  data: object | undefined = undefined
) => {
  if (method === "GET") {
    return localStorage.getItem(itemname);
  }

  if (method === "SET") {
    if (data === undefined) {
      throw new Error("Please provide the data you would like to store.");
    }

    localStorage.setItem(itemname, JSON.stringify(data));

    return;
  }
};

export default useLocalStorage;
