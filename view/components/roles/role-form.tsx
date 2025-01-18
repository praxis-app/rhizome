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
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { ROLE_COLOR_OPTIONS } from '../../constants/role.constants';
import { CreateRoleReq } from '../../types/role.types';
import ColorPicker from '../shared/color-picker';
import PrimaryButton from '../shared/primary-button';

const CardContent = styled(MuiCardContent)(() => ({
  '&:last-child': {
    paddingBottom: 18,
  },
}));

// TODO: Move color into the form state

const RoleForm = () => {
  const [color, setColor] = useState(ROLE_COLOR_OPTIONS[12]);
  const [colorPickerKey] = useState('');

  const { handleSubmit, register } = useForm<CreateRoleReq>({
    mode: 'onChange',
  });

  const { mutate: createRole, isPending } = useMutation({
    mutationFn: async (data: CreateRoleReq) => {
      api.createRole(data);
    },
  });

  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit((fv) => createRole(fv))}>
          <FormGroup>
            <FormControl sx={{ paddingBottom: 1.8 }}>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('roles.form.name')}
              </FormLabel>
              <OutlinedInput autoComplete="off" {...register('name')} />
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
            <PrimaryButton
              sx={{ marginTop: 1.5 }}
              type="submit"
              disabled={isPending}
            >
              {t('actions.create')}
            </PrimaryButton>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
