import {
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
import { Textarea } from '@/components/atoms/textarea';
import InfoPopover from '@/components/molecules/info-popover';
import { useGroupsWithCreatePermission } from '@/services/hooks';
import { useEffect, useState } from 'react';
import type { Control, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { BaseScenarioFormValues } from './form-config';
import { IMPACT_OPTIONS, LIKELIHOOD_OPTIONS } from './form-config';

interface BasicScenarioInfoProps<T extends BaseScenarioFormValues> {
  control: Control<T>;
  isEditMode: boolean;
}

export default function BasicScenarioInfo<T extends BaseScenarioFormValues>({
  control,
  isEditMode,
}: BasicScenarioInfoProps<T>) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>();

  // Read active_group_id from localStorage
  useEffect(() => {
    try {
      const savedGroupId = localStorage.getItem('active_group_id');
      setActiveGroupId(savedGroupId || undefined);
    } catch (error) {
      console.warn('Failed to read active_group_id from localStorage:', error);
    }
  }, []);

  const { data: groupsData } = useGroupsWithCreatePermission({
    page: 1,
    pageSize: 100,
    sort: 'name:ASC',
    active_group_id: activeGroupId,
  });
  const groups = groupsData?.results ?? [];

  // Find the group name for display in edit mode
  const getGroupName = (groupId: string | undefined): string => {
    if (!groupId) return '';
    const group = groups.find((g) => g.documentId === groupId);
    return group?.name || groupId;
  };

  return (
    <div className='space-y-xs'>
      <div className='grid grid-cols-4 gap-4'>
        <FormField<T>
          control={control}
          name={'customer_scenario_id' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel required className='text-text-base-primary'>
                {t('labels.scenarioId')}
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isEditMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<T>
          control={control}
          name={'name' as FieldPath<T>}
          render={({ field }) => (
            <FormItem className='col-span-3'>
              <FormLabel required className='text-text-base-primary'>
                {t('labels.scenarioName')}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField<T>
        control={control}
        name={'description' as FieldPath<T>}
        render={({ field }) => (
          <FormItem className='col-span-4'>
            <FormLabel required className='text-text-base-primary'>
              {t('labels.description')}
            </FormLabel>
            <FormControl>
              <Textarea {...field} className='min-h-[120px]' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField<T>
        control={control}
        name={'group_id' as FieldPath<T>}
        render={({ field }) => (
          <FormItem className='col-span-4'>
            <FormLabel required className='text-text-base-primary'>
              {t('labels.group', { defaultValue: 'Group' })}
            </FormLabel>
            <FormControl>
              {isEditMode ? (
                <Input
                  value={getGroupName(field.value)}
                  disabled={true}
                  data-testid='group-display'
                />
              ) : (
                <Select
                  value={field.value || undefined}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger data-testid='group-select'>
                    <SelectValue placeholder='Select a group' />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem
                        key={group.documentId ?? `group-${group.id}`}
                        value={group.documentId}
                      >
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid gap-6 md:grid-cols-2'>
        <FormField
          control={control}
          name={'likelihood' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                required
                info={<InfoPopover content={t('labels.likelihoodInformation')} />}
                className='text-text-base-primary'
              >
                {t('labels.likelihood')}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid='likelihood-select'>
                    <SelectValue placeholder={t('select.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-testid='likelihood-select-content'>
                  {LIKELIHOOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={'impact' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                required
                info={<InfoPopover content={t('labels.impactInformation')} />}
                className='text-text-base-primary'
              >
                {t('labels.impact')}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid='impact-select'>
                    <SelectValue placeholder={t('select.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-testid='impact-select-content'>
                  {IMPACT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
