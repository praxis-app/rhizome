import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Modal from '../shared/modal';
import PrimaryButton from '../shared/primary-button';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
}

const CreateChannelModal = ({ isOpen, setIsOpen }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('chat.actions.createChannel')}
      onClose={() => setIsOpen(false)}
      open={isOpen}
    >
      <form>
        <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
              {t('chat.form.name')}
            </FormLabel>
            <OutlinedInput autoComplete="off" />
          </FormControl>
        </FormGroup>

        <Box display="flex" justifyContent="right" gap="16px">
          <Button variant="text" sx={{ textTransform: 'none' }}>
            {t('actions.cancel')}
          </Button>
          <PrimaryButton type="submit" sx={{ borderRadius: '4px' }}>
            {t('actions.create')}
          </PrimaryButton>
        </Box>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
