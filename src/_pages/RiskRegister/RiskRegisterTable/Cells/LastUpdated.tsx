import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour12: false,
} as const;

type Props = {
  value: string;
};
export const LastUpdated: FC<Props> = ({ value }) => {
  const { i18n } = useTranslation('riskRegister');
  const parsedDate = new Date(value);
  const dateString = parsedDate.toLocaleDateString(i18n.language, dateOptions);
  const dateTimeString = `${dateString}`;
  return <div>{dateTimeString}</div>;
};
