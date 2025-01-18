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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { ROLE_COLOR_OPTIONS } from '../../constants/role.constants';
import { CreateRoleReq, Role } from '../../types/role.types';
import ColorPicker from '../shared/color-picker';
import PrimaryButton from '../shared/primary-button';

const CardContent = styled(MuiCardContent)(() => ({
  '&:last-child': {
    paddingBottom: 18,
  },
}));

const RoleForm = () => {
  const [colorPickerKey, setColorPickerKey] = useState(0);

  const { handleSubmit, register, setValue, watch, reset } =
    useForm<CreateRoleReq>({
      defaultValues: {
        color: ROLE_COLOR_OPTIONS[12],
      },
      mode: 'onChange',
    });

  const queryClient = useQueryClient();
  const { mutate: createRole, isPending } = useMutation({
    mutationFn: async (data: CreateRoleReq) => {
      const { role } = await api.createRole(data);

      queryClient.setQueryData<{ roles: Role[] }>(['roles'], (oldData) => {
        if (!oldData) {
          return { roles: [] };
        }
        return { roles: [role, ...oldData.roles] };
      });
    },
    onSuccess: () => {
      setColorPickerKey(Date.now());
      reset();
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
              color={watch('color')}
              key={colorPickerKey}
              label={t('roles.form.colorPickerLabel')}
              onChange={(color) => setValue('color', color)}
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