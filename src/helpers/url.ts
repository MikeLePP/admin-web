export const getId = (pathname: string): any => {
  const search = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  return search.exec(pathname)?.[0];
};
