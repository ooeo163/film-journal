import path from "node:path";

export const LOCAL_ALBUMS_ROOT =
  process.env.LOCAL_ALBUMS_ROOT ?? "D:\\workspace\\film-journal-img";

export function getLocalMediaUrl(relativePath: string) {
  return `/api/local-media?path=${encodeURIComponent(relativePath)}`;
}

export function resolveLocalMediaPath(relativePath: string) {
  const normalized = relativePath.replace(/\//g, path.sep);
  const resolved = path.resolve(LOCAL_ALBUMS_ROOT, normalized);
  const root = path.resolve(LOCAL_ALBUMS_ROOT);

  if (!resolved.startsWith(root)) {
    throw new Error("Invalid local media path.");
  }

  return resolved;
}
