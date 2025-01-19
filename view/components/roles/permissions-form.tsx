import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PERMISSION_NAMES } from '../../constants/role.constants';
import PrimaryButton from '../shared/primary-button';
import PermissionToggle from './permission-toggle';

const PermissionsForm = () => {
  const { t } = useTranslation();

  return (
    <Box component="form">
      {PERMISSION_NAMES.map((permissionName) => (
        <PermissionToggle
          key={permissionName}
          permissionName={permissionName}
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
