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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { useGroups } from '@/services/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { type FC, useEffect } from 'react';
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
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
    page: 1,
    pageSize: 100,
    sort: 'name:ASC',
  });

  const groups = groupsData?.results ?? [];

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      email: initialEmailValue || '',
      groupId: '',
    },
  });

  // Set default group from localStorage if available
  useEffect(() => {
    try {
      const savedGroupId = localStorage.getItem('active_group_id');
      if (savedGroupId && groups.length > 0) {
        const foundGroup = groups.find((g) => g.documentId === savedGroupId);
        if (foundGroup) {
          form.setValue('groupId', foundGroup.documentId);
        }
      }
    } catch (error) {
      console.warn('Failed to load active group from localStorage:', error);
    }
  }, [groups, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
          name='groupId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingGroups}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a group' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.documentId} value={group.documentId}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoadingGroups}>
          {t('submit')}
        </Button>
      </form>
    </Form>
  );
};
