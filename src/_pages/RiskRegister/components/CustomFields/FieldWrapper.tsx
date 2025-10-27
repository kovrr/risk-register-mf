import { DemoExperienceContext } from '@/DemoExperienceContext';
import Image from 'next/image';
import { useIsGuestUser } from 'permissions/use-permissions';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import HamburgerIcon from '../icons/HamburgerIcon.svg';
import PencilIcon from '../icons/PencilIcon.svg';
import TrashIcon from '../icons/TrashIcon.svg';
export const INPUT =
  'w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 disabled:bg-gray-100';

interface FieldWrapperProps {
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  mode?: 'edit' | 'view';
  fieldId?: string;
}

export function FieldWrapper({
  label,
  children,
  mode,
  onEdit,
  onDelete,
  fieldId,
}: FieldWrapperProps) {
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div
      className='flex w-full max-w-[600px] items-center'
      data-testid={fieldId ? `field-${fieldId}` : undefined}
    >
      <div className='flex-1'>
        <div className='flex items-center gap-[5px]' style={{ width: '170px' }}>
          <label
            title={label}
            className='truncate'
            style={{
              color: 'var(--Text-Base-Primary, #303045)',
              fontFamily: 'var(--Font-Family-Primary, "Source Sans Pro")',
              fontSize: 'var(--Font-Size-Regular, 14px)',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'normal',
            }}
          >
            {label}
          </label>
          {mode === 'edit' && (
            <button
              type='button'
              onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editScenario') }) : handleEditClick}
              className='flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[5px] p-1 hover:bg-gray-100'
              tabIndex={-1}
              data-testid='field-edit-button'
            >
              <Image src={PencilIcon} alt='' />
            </button>
          )}
        </div>
      </div>

      <div className='flex-shrink-0' style={{ width: '146px' }}
        onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editField') }) : undefined}>
        {children}
      </div>

      {
        mode === 'edit' && (
          <div className='flex flex-shrink-0 items-center gap-4 pl-4'>
            <div className={isGuestUser ? 'cursor-not-allowed' : 'cursor-grab'} data-testid='field-drag-handle'
              onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editScenario') }) : onDelete}>
              <Image src={HamburgerIcon} alt='drag handle' />
            </div>
            {onDelete && (
              <button
                type='button'
                onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editScenario') }) : onDelete}
                className='flex items-center justify-center'
                tabIndex={-1}
                data-testid='field-delete-button'
              >
                <Image src={TrashIcon} alt='delete' />
              </button>
            )}
          </div>
        )
      }
    </div >
  );
}
