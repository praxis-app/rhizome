import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/nav/top-nav';
import PrimaryButton from '../../components/shared/primary-button';
import { NavigationPaths } from '../../constants/shared.constants';
import { UpdateServerConfigReq } from '../../types/server-config.types';

const Integrations = () => {
  const { mutate: updateConfig, isPending } = useMutation({
    mutationFn: api.updateServerConfig,
  });

  const { register, handleSubmit } = useForm<UpdateServerConfigReq>({
    mode: 'onChange',
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <TopNav
        header={t('settings.labels.integrations')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit((fv) => updateConfig(fv))}>
            <FormGroup sx={{ marginBottom: 1.5 }}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 500, paddingBottom: 1 }}>
                  {t('settings.labels.discordClientId')}
                </FormLabel>
                <OutlinedInput
                  autoComplete="off"
                  {...register('botClientId')}
                />
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
        </CardContent>
      </Card>
    </>
  );
};

export default Integrations;
