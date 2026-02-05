// utils/date.ts
export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB");
