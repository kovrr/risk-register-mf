export const formatDatetimeOnlyDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};
