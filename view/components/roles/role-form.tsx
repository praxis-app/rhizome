import {
  Box,
  Card,
  FormControl,
  FormGroup,
  FormLabel,
  CardContent as MuiCardContent,
  OutlinedInput,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ColorPicker from '../shared/color-picker';
import PrimaryButton from '../shared/primary-button';

export const DEFAULT_ROLE_COLOR = '#f44336';

const CardContent = styled(MuiCardContent)(() => ({
  '&:last-child': {
    paddingBottom: 18,
  },
}));

const RoleForm = () => {
  const [color, setColor] = useState(DEFAULT_ROLE_COLOR);
  const [colorPickerKey] = useState('');
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <FormGroup>
          <FormControl sx={{ paddingBottom: 1.8 }}>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
              {t('roles.form.name')}
            </FormLabel>
            <OutlinedInput autoComplete="off" />
          </FormControl>

          <ColorPicker
            color={color}
            key={colorPickerKey}
            label={t('roles.form.colorPickerLabel')}
            onChange={(color: string) => setColor(color)}
            sx={{ marginBottom: 1.25 }}
          />
        </FormGroup>

        <Box display="flex" justifyContent="end">
          <PrimaryButton sx={{ marginTop: 1.5 }} type="submit">
            {t('actions.create')}
          </PrimaryButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
