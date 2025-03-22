import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import PrimaryButton from '../../components/shared/primary-button';
import { useAppStore } from '../../store/app.store';
import {
  ServerConfig,
  UpdateServerConfigReq,
} from '../../types/server-config.types';

interface Props {
  serverConfig: ServerConfig;
}

const ConnectDiscordForm = ({ serverConfig }: Props) => {
  const { setToast } = useAppStore((state) => state);

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<UpdateServerConfigReq>({
    mode: 'onChange',
    defaultValues: {
      botClientId: serverConfig.botClientId,
    },
  });

  const { mutate: updateConfig, isPending } = useMutation({
    mutationFn: async (values: UpdateServerConfigReq) => {
      await api.updateServerConfig(values);

      queryClient.setQueryData<{ serverConfig: ServerConfig }>(
        ['serverConfig'],
        (oldData) => {
          return {
            serverConfig: {
              ...oldData?.serverConfig,
              botClientId: values.botClientId || null,
            },
          };
        },
      );
    },
    onError(error: AxiosError) {
      const errorMessage =
        (error.response?.data as string) || t('errors.somethingWentWrong');

      setToast({
        title: errorMessage,
        status: 'error',
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((fv) => updateConfig(fv))}>
      <FormGroup sx={{ marginBottom: 1.5 }}>
        <FormControl>
          <FormLabel sx={{ fontWeight: 500, paddingBottom: 1 }}>
            {t('settings.labels.discordClientId')}
          </FormLabel>
          <OutlinedInput autoComplete="off" {...register('botClientId')} />
        </FormControl>
      </FormGroup>

      <Box display="flex" justifyContent="end">
        <PrimaryButton
          disabled={isPending}
          sx={{ marginTop: 1.5 }}
          type="submit"
        >
          {t('settings.actions.connectDiscord')}
        </PrimaryButton>
      </Box>
    </form>
  );
};

export default ConnectDiscordForm;
