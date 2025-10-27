import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { CustomField } from '@/types/riskRegister';
import { Plus } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AddFieldWizard } from './AddFieldWizard';
import { CustomFieldRenderer } from './FieldRenderer';

interface CustomFieldsContainerProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange?: (fieldId: string, value: any) => void;
  onAddField: (field: Omit<CustomField, 'id'>) => void;
  onEditField: (fieldId: string, field: Partial<CustomField>) => void;
  onDeleteField: (fieldId: string) => void;
  onReorder: (fields: CustomField[]) => void;
  mode?: 'edit' | 'view';
}

export function CustomFieldsContainer({
  fields,
  values,
  onChange,
  onAddField,
  onEditField,
  onDeleteField,
  onReorder,
  mode = 'edit',
}: CustomFieldsContainerProps) {
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [editFieldId, setEditFieldId] = React.useState<string | null>(null);
  const [editFieldData, setEditFieldData] = React.useState<CustomField | null>(
    null,
  );
  const { t } = useTranslation('common');
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange?.(fieldId, value);
  };

  const handleEditField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    setEditFieldId(fieldId);
    setEditFieldData(field);
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    setEditFieldId(null);
    setEditFieldData(null);
  };

  const handleWizardCreateOrEdit = (field: Omit<CustomField, 'id'>) => {
    if (editFieldId) {
      // Edit existing field
      onEditField(editFieldId, field);
    } else {
      // Add new field
      onAddField(field);
    }
    handleWizardClose();
  };

  const handleAddFieldClick = () => {
    if (isGuestUser) {
      showDemoModal({ title: t('addCustomField') });
      return;
    }
    setIsWizardOpen(true);
    setEditFieldId(null);
    setEditFieldData(null);
  };

  return (
    <div
      className='flex max-w-[600px] flex-1 flex-col items-start gap-[20px] self-stretch rounded-br-[20px] rounded-tr-[20px] bg-white p-5'
      style={{ borderRadius: '0px 20px 20px 0px' }}
    >
      <div className='flex w-full items-center justify-between'>
        <span
          style={{
            color: 'var(--Text-Base-Primary, #303045)',
            fontFamily: 'var(--Font-Family-Primary, \"Source Sans Pro\")',
            fontSize: 'var(--Font-Size-Large, 16px)',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
          }}
        >
          {t('riskRegister.customFields.title')}
        </span>
        {mode === 'edit' && (
          <button
            onClick={handleAddFieldClick}
            style={{
              display: 'flex',
              padding: '8px 16px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: 'var(--Button, 15px)',
              border: '1px solid var(--Fill-Brand-Primary, #5551F7)',
              background: 'var(--Fill-Base-0, #FFF)',
              color: 'var(--Text-Brand-Primary, #5551F7)',
              fontFamily: 'var(--Font-Family-Primary, "Source Sans Pro")',
              fontSize: 'var(--Font-Size-Regular, 14px)',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
            }}
            type='button'
          >
            <Plus size={16} /> {t('riskRegister.customFields.add')}
          </button>
        )}
      </div>

      <div className='w-full space-y-4'>
        {fields.map((field, index) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', index.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = Number(e.dataTransfer.getData('text/plain'));
              const toIndex = index;
              if (fromIndex !== toIndex) {
                const reorderedFields = [...fields];
                const [movedItem] = reorderedFields.splice(fromIndex, 1);
                reorderedFields.splice(toIndex, 0, movedItem);
                onReorder(reorderedFields);
              }
            }}
          >
            <CustomFieldRenderer
              field={field}
              value={values[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              mode={mode}
              onEdit={() => handleEditField(field.id)}
              onDelete={() => onDeleteField(field.id)}
              isGuestUser={isGuestUser}
            />
          </div>
        ))}
      </div>

      <AddFieldWizard
        open={isWizardOpen}
        onClose={handleWizardClose}
        onCreate={handleWizardCreateOrEdit}
        initialField={editFieldData}
      />
    </div>
  );
}
