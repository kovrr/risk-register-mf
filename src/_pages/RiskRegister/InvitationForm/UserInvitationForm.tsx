import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  type InvitationFormValues,
  invitationFormSchema,
} from './components/form-config';

type Props = {
  initialEmailValue?: string;
  onSubmit: (data: InvitationFormValues) => void;
};
export const UserInvitationForm: FC<Props> = ({
  initialEmailValue,
  onSubmit,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'invitationForm' });
  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: initialEmailValue || '',
      phone: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.firstname.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('fields.firstname.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.lastname.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('fields.lastname.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.email.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('fields.email.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.phone.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('fields.phone.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('submit')}</Button>
      </form>
    </Form>
  );
};
