import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import PrimaryButton from '../../components/shared/primary-button';
import { UpdateServerConfigReq } from '../../types/server-config.types';

const ConnectDiscordForm = () => {
  const { mutate: updateConfig, isPending } = useMutation({
    mutationFn: api.updateServerConfig,
  });

  const { register, handleSubmit } = useForm<UpdateServerConfigReq>({
    mode: 'onChange',
  });

  const { t } = useTranslation();

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
