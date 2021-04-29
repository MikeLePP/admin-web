export const getId = (pathname?: string): string | undefined => {
  const search = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  return pathname ? search.exec(pathname)?.[0] : undefined;
};
