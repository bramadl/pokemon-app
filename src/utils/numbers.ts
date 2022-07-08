export const padNumber = (num: number, length: number): string => {
  return String(num).padStart(length, "0");
};
