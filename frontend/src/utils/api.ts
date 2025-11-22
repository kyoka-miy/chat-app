// FIXME: Add error handling

export async function useGet<T = any>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

export async function usePost<T = any, B = any>(url: string, body: B): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to post data');
  return res.json();
}

export async function useDelete<T = any>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete data');
  return res.json();
}
