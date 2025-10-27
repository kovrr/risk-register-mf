import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import type React from 'react';
import type { FC } from 'react';

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const ScenarioMetricCard: FC<Props> = ({
  title,
  description,
  children,
  footer,
}) => {
  return (
    <Card className='min-h-[200px]'>
      <CardHeader>
        <CardTitle className='text-[17px]'>{title}</CardTitle>
        <CardDescription className='min-h-[60px] text-[13px] text-text-base-secondary'>
          {description}
        </CardDescription>
        <CardContent>{children}</CardContent>
        <CardFooter className='w-full'>{footer}</CardFooter>
      </CardHeader>
    </Card>
  );
};
