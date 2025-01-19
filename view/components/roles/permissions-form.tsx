import { Box } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PERMISSION_NAMES } from '../../constants/role.constants';
import PrimaryButton from '../shared/primary-button';
import PermissionToggle from './permission-toggle';

const PermissionsForm = () => {
  const { control, register } = useForm({
    defaultValues: {
      permissions: PERMISSION_NAMES.map(() => ({ value: false })),
    },
  });
  const { fields } = useFieldArray({
    name: 'permissions',
    control,
  });

  const { t } = useTranslation();

  return (
    <Box component="form">
      {fields.map((field, index) => (
        <PermissionToggle
          key={field.id}
          switchProps={register(`permissions.${index}.value`)}
          permissionName={PERMISSION_NAMES[index]}
          isEnabled={false}
        />
      ))}

      <Box display="flex" justifyContent="end" sx={{ marginTop: 6 }}>
        <PrimaryButton type="submit">{t('actions.save')}</PrimaryButton>
      </Box>
    </Box>
  );
};

export default PermissionsForm;
