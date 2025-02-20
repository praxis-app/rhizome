import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../components/shared/primary-button';
import { Time } from '../../constants/shared.constants';

const MAX_USES_OPTIONS = [1, 5, 10, 25, 50, 100];

const InvitesPage = () => {
  const { t } = useTranslation();

  const expiresAtOptions = [
    {
      message: t('invites.form.expiresAtOptions.oneDay'),
      value: Time.Day,
    },
    {
      message: t('invites.form.expiresAtOptions.sevenDays'),
      value: Time.Week,
    },
    {
      message: t('invites.form.expiresAtOptions.oneMonth'),
      value: Time.Month,
    },
    {
      message: t('invites.form.expiresAtOptions.never'),
      value: '',
    },
  ];

  return (
    <>
      <Card>
        <CardContent>
          <FormGroup sx={{ marginBottom: 1.5 }}>
            <FormControl variant="standard" sx={{ marginBottom: 1 }}>
              <InputLabel>{t('invites.form.labels.expiresAt')}</InputLabel>
              <Select>
                {expiresAtOptions.map((option) => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.message}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="standard">
              <InputLabel>{t('invites.form.labels.maxUses')}</InputLabel>
              <Select>
                {MAX_USES_OPTIONS.map((option) => (
                  <MenuItem value={option} key={option}>
                    {t('invites.form.maxUsesOptions.xUses', {
                      count: option,
                    })}
                  </MenuItem>
                ))}
                <MenuItem value={''}>
                  {t('invites.form.maxUsesOptions.noLimit')}
                </MenuItem>
              </Select>
            </FormControl>
          </FormGroup>

          <Box display="flex" justifyContent="end">
            <PrimaryButton sx={{ marginTop: 1.5 }} type="submit">
              {t('invites.actions.generateLink')}
            </PrimaryButton>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default InvitesPage;
