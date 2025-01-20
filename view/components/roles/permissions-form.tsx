import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PERMISSION_NAMES } from '../../constants/role.constants';
import PrimaryButton from '../shared/primary-button';
import PermissionToggle from './permission-toggle';

const PermissionsForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      permissions: PERMISSION_NAMES.map(() => ({ value: false })),
    },
  });

  const { t } = useTranslation();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <Controller
        name="permissions"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {PERMISSION_NAMES.map((permissionName, index) => (
              <PermissionToggle
                key={permissionName}
                permissionName={permissionName}
                checked={value[index].value}
                onChange={(e) => {
                  const newPermissions = [...value];
                  newPermissions[index].value = e.target.checked;
                  onChange(newPermissions);
                }}
              />
            ))}
          </>
        )}
      />

      <Box display="flex" justifyContent="end" sx={{ marginTop: 6 }}>
        <PrimaryButton type="submit">{t('actions.save')}</PrimaryButton>
      </Box>
    </Box>
  );
};

export default PermissionsForm;
