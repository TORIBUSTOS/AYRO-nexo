export async function fetcher(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Error al consultar la API")
  }

  return res.json()
}
