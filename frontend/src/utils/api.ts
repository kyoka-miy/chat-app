export async function useGet(url: string) {
  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export async function usePost(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to post data");
  return res.json();
}

export async function useDelete(url: string) {
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete data");
  return res.json();
}
