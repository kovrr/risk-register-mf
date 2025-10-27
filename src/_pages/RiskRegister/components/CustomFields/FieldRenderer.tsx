import { CustomField, customFieldTypes } from '@/types/riskRegister';
import { CurrencyField } from './fields/CurrencyField';
import { DateField } from './fields/DateField';
import { NumericField } from './fields/NumericField';
import { TagsField } from './fields/TagsField';
import { TextField } from './fields/TextField';
import { FieldWrapper } from './FieldWrapper';

interface FieldRendererProps {
  field: CustomField;
  value: any;
  onChange?: (value: any) => void;
  mode?: 'edit' | 'view';
  onEdit?: () => void;
  onDelete?: () => void;
  isGuestUser?: boolean;
}

export function CustomFieldRenderer({
  field,
  value,
  onChange,
  mode = 'edit',
  onEdit,
  onDelete,
  isGuestUser,
}: FieldRendererProps) {
  const sharedProps = { value, onChange, mode };

  const renderField = () => {
    switch (field.field_type) {
      case customFieldTypes.CURRENCY:
        return <CurrencyField {...sharedProps} field={field} isGuestUser={isGuestUser} />;
      case customFieldTypes.NUMBER:
        return <NumericField {...sharedProps} isGuestUser={isGuestUser} />;
      case customFieldTypes.DATE:
        return <DateField {...sharedProps} isGuestUser={isGuestUser} />;
      case customFieldTypes.TAGS:
        return <TagsField {...sharedProps} isGuestUser={isGuestUser} />;
      default:
        return <TextField {...sharedProps} isGuestUser={isGuestUser} />;
    }
  };

  return (
    <FieldWrapper
      label={field.field_name}
      mode={mode}
      onEdit={onEdit}
      onDelete={onDelete}
      fieldId={field.id}
    >
      {renderField()}
    </FieldWrapper>
  );
}
