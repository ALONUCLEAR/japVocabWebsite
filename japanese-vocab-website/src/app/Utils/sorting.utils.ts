export const defaultNumSort = (prev: number, curr: number): number => prev - curr;

export const defaultDateSort = (prev: string, curr: string): number => {
  const prevTime = new Date(prev).getTime();
  const currTime = new Date(curr).getTime();

  return defaultNumSort(prevTime, currTime);
}