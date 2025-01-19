import { Box, Switch, Typography } from '@mui/material';
import { t } from 'i18next';
import { PermissionName } from '../../types/role.types';
import { getPermissionText } from '../../utils/role.utils';

interface Props {
  permissionName: PermissionName;
  isEnabled: boolean;
}

const PermissionToggle = ({ permissionName, isEnabled }: Props) => {
  const { displayName, description } = getPermissionText(permissionName);

  return (
    <Box display="flex" justifyContent="space-between" marginBottom={2.8}>
      <Box>
        <Typography>{displayName}</Typography>

        <Typography fontSize={12} color="textSecondary">
          {description}
        </Typography>
      </Box>

      <Switch
        inputProps={{ 'aria-label': displayName || t('labels.switch') }}
        checked={isEnabled}
      />
    </Box>
  );
};

export default PermissionToggle;
