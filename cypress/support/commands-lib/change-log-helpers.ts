export const extractRelevantModelVersion = (modelVersion = ''): string => {
  return modelVersion.split('.', 3).slice(0, 2).join('.');
};

export const areModelVersionsEqual = (
  modelVersion1: string,
  modelVersion2: string
) => {
  return (
    extractRelevantModelVersion(modelVersion1) ===
    extractRelevantModelVersion(modelVersion2)
  );
};

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour12: false,
} as const;
const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
} as const;

const locale = 'en-US';

export const getDateTimeString = (date: Date) => {
  const parsedDate = new Date(date);
  const dateString = parsedDate.toLocaleDateString(locale, dateOptions);
  const timeString = parsedDate.toLocaleTimeString(locale, timeOptions);
  return `${dateString} ${timeString}`;
};

export const getChangePercentage = (valueA: number, valueB: number) => {
  const percentage = (valueA / valueB - 1) * 100;
  return `${new Intl.NumberFormat().format(
    parseFloat(Math.abs(percentage).toFixed(2))
  )}%`;
};
