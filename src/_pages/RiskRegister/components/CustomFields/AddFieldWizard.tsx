import { Dialog, DialogContent } from '@/components/atoms/dialog';
import { type CustomField, customFieldTypes } from '@/types/riskRegister';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FieldConfiguration } from './FieldConfiguration';
import { type FieldTypeOption, FieldTypeSelection } from './FieldTypeSelection';

interface AddFieldWizardProps {
  open: boolean;
  onClose: () => void;
  onCreate: (field: Omit<CustomField, 'id'>) => void;
  initialField?: CustomField | null;
}

export function AddFieldWizard({
  open,
  onClose,
  onCreate,
  initialField,
}: AddFieldWizardProps) {
  const { t } = useTranslation('common');
  const [step, setStep] = React.useState<'choose' | 'config'>('choose');
  const [selectedType, setSelectType] = React.useState<FieldTypeOption | null>(
    null,
  );

  const FIELD_TYPES: FieldTypeOption[] = React.useMemo(
    () => [
      {
        type: customFieldTypes.CURRENCY,
        label: t('riskRegister.customFields.wizard.fieldTypes.currency.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.currency.subtitle',
        ),
      },
      {
        type: customFieldTypes.NUMBER,
        label: t('riskRegister.customFields.wizard.fieldTypes.number.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.number.subtitle',
        ),
      },
      {
        type: customFieldTypes.TAGS,
        label: t('riskRegister.customFields.wizard.fieldTypes.tags.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.tags.subtitle',
        ),
      },
      {
        type: customFieldTypes.DATE,
        label: t('riskRegister.customFields.wizard.fieldTypes.date.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.date.subtitle',
        ),
      },
      {
        type: customFieldTypes.TEXT,
        label: t('riskRegister.customFields.wizard.fieldTypes.text.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.text.subtitle',
        ),
      },
    ],
    [t],
  );

  React.useEffect(() => {
    if (open && initialField) {
      const fieldType =
        FIELD_TYPES.find((t) => t.type === initialField.field_type) || null;
      setSelectType(fieldType);
      setStep('config');
    } else {
      setStep('choose');
      setSelectType(null);
    }
  }, [initialField, open, FIELD_TYPES]);

  const reset = () => {
    setStep('choose');
    setSelectType(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectFieldType = (fieldType: FieldTypeOption) => {
    setSelectType(fieldType);
    setStep('config');
  };

  const handleBack = () => {
    // When going back from an edit, we close the modal entirely
    if (initialField) {
      handleClose();
    } else {
      setStep('choose');
    }
  };

  const handleSave = (config: { name: string; currency?: string }) => {
    if (!config.name || !selectedType) return;
    onCreate({
      field_name: config.name,
      field_type: selectedType.type,
      attributes:
        selectedType.type === 'currency' ? { currency: config.currency } : {},
      value: initialField?.value,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className='max-h-[90vh] w-full max-w-2xl overflow-y-auto'>
        {step === 'choose' ? (
          <FieldTypeSelection
            fieldTypes={FIELD_TYPES}
            onSelect={handleSelectFieldType}
          />
        ) : selectedType ? (
          <FieldConfiguration
            selectedFieldType={selectedType}
            onBack={handleBack}
            onSave={handleSave}
            initialField={initialField}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
