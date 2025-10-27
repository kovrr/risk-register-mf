import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { useCurrencySignAdderPredefinedCurrency } from '@/helpers/string';
import type { ExampleEvents } from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';

type SimulationExamplesProps = {
  exampleEvents: ExampleEvents;
  currency: string;
};

export default function SimulationExamples({
  exampleEvents,
  currency,
}: SimulationExamplesProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.simulationExamples',
  });
  const currencySignFormatter = useCurrencySignAdderPredefinedCurrency({
    currency: currency,
    shorten: true,
  });

  const headers = [
    { label: '', width: '1/3' },
    { label: 'headers.medianLoss', width: '1/3' },
    { label: 'headers.maximalLoss', width: '1/3' },
  ];

  const rows = [
    {
      label: 'rows.eventCost.label',
      values: [
        exampleEvents.median
          ? currencySignFormatter(exampleEvents.median.event_loss)
          : '',
        exampleEvents.maximum
          ? currencySignFormatter(exampleEvents.maximum.event_loss)
          : '',
      ],
    },
    {
      label: 'rows.eventType.label',
      values: [
        exampleEvents.median?.event_type || '',
        exampleEvents.maximum?.event_type || '',
      ],
    },
    {
      label: 'rows.attackSurface.label',
      values: [
        exampleEvents.median ? exampleEvents.median.hazard_category : '',
        exampleEvents.maximum ? exampleEvents.maximum.hazard_category : '',
      ],
    },
    {
      label: 'rows.duration.label',
      values: [
        exampleEvents.median?.event_duration
          ? `${exampleEvents.median.event_duration} hours`
          : 'N/A',
        exampleEvents.maximum?.event_duration
          ? `${exampleEvents.maximum.event_duration} hours`
          : 'N/A',
      ],
    },

    {
      label: 'rows.recordsCompromised.label',
      values: [
        exampleEvents.median?.num_of_data_records_compromised?.toLocaleString() ||
        'N/A',
        exampleEvents.maximum?.num_of_data_records_compromised?.toLocaleString() ||
        'N/A',
      ],
    },
  ];
  return (
    <Card className='space-y-[20px] p-[20px]'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-[17px] font-[700] text-text-base-primary'>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className='text-[14px]'>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className={`p-0 w-${header.width} h-[18px] bg-transparent pb-[10px] text-center font-[700] text-text-functional-m1`}
                >
                  {index !== 0 ? t(header.label) : ''}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className='border-b-0 border-t-0'>
                <TableCell className='p-0 pt-[10px] font-[600] text-text-functional-0'>
                  {t(row.label)}
                </TableCell>
                {row.values.map((value, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className='p-0 pt-[10px] text-center font-[400] text-text-functional-m1'
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
