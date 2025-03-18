import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/nav/top-nav';
import PrimaryButton from '../../components/shared/primary-button';
import { NavigationPaths } from '../../constants/shared.constants';

const Integrations = () => {
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
          <FormGroup sx={{ marginBottom: 1.5 }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 1 }}>
                {t('settings.labels.discordClientId')}
              </FormLabel>
              <OutlinedInput autoComplete="off" />
            </FormControl>
          </FormGroup>

          <Box display="flex" justifyContent="end">
            <PrimaryButton sx={{ marginTop: 1.5 }} type="submit">
              {t('settings.actions.connectDiscord')}
            </PrimaryButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Integrations;
