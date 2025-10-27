import { DemoExperienceContext } from '@/DemoExperienceContext';
import { X } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TagsFieldProps {
  value: string[];
  onChange?: (value: string[]) => void;
  mode?: 'edit' | 'view';
  isGuestUser?: boolean;
}

export const TagsField: React.FC<TagsFieldProps> = ({
  value = [],
  onChange,
  mode = 'edit',
  isGuestUser: propIsGuestUser,
}) => {
  const { t } = useTranslation('common');
  const [inputValue, setInputValue] = useState('');
  const tags = value || [];
  const inputRef = useRef<HTMLInputElement>(null);
  const isGuestUser = useIsGuestUser() || propIsGuestUser;
  const { showDemoModal } = useContext(DemoExperienceContext);

  const addTags = (newTags: string[]) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTags') });
      return;
    }
    const validTags = newTags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && !tags.includes(tag));
    if (validTags.length > 0) {
      onChange?.([...tags, ...validTags]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addTags([inputValue]);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTags') });
      return;
    }
    onChange?.(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const newTags = paste.split(',');
    addTags(newTags);
    setInputValue('');
  };

  const clearAll = () => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTags') });
      return;
    }
    onChange?.([]);
  };

  if (mode === 'view') {
    return (
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <div
            key={tag}
            className='rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800'
          >
            {tag}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      <div
        className='flex w-full flex-wrap items-center gap-1 rounded-lg border border-gray-300 px-2 py-1 text-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 disabled:bg-gray-100'
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <div
            key={tag}
            className='flex items-center gap-1 rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-700'
          >
            <span>{tag}</span>
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='rounded-full p-0.5 hover:bg-gray-300'
              aria-label={`Remove ${tag}`}
              data-testid={`remove-tag-${tag}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={
            tags.length === 0
              ? t('riskRegister.customFields.fields.tags.placeholder')
              : ''
          }
          className='min-w-[120px] flex-1 bg-transparent py-1 focus:outline-none'
          data-testid='new-tag-input'
          disabled={isGuestUser}
        />
      </div>
      {tags.length > 0 && (
        <button
          type='button'
          onClick={clearAll}
          className='absolute inset-y-0 right-0 flex items-center pr-3'
          aria-label='Clear all tags'
        >
          <X size={16} className='text-gray-500 hover:text-gray-700' />
        </button>
      )}
    </div>
  );
};
