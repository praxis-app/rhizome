import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { Channel, CreateChannelReq } from '../../types/chat.types';
import Modal from '../shared/modal';
import PrimaryButton from '../shared/primary-button';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
}

const CreateChannelModal = ({ isOpen, setIsOpen }: Props) => {
  const queryClient = useQueryClient();

  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: async (values: CreateChannelReq) => {
      const { channel } = await api.createChannel(values);

      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return { channels: [...oldData.channels, channel] };
        },
      );
      setIsOpen(false);
    },
  });

  const { register, formState, handleSubmit } = useForm<CreateChannelReq>({
    mode: 'onChange',
  });

  const { t } = useTranslation();

  return (
    <Modal
      title={t('chat.actions.createChannel')}
      onClose={() => setIsOpen(false)}
      open={isOpen}
    >
      <form onSubmit={handleSubmit((fv) => createChannel(fv))}>
        <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
              {t('chat.form.name')}
            </FormLabel>
            <OutlinedInput autoComplete="off" {...register('name')} />
          </FormControl>
        </FormGroup>

        <Box display="flex" justifyContent="right" gap="16px">
          <Button
            variant="text"
            sx={{ textTransform: 'none' }}
            onClick={() => setIsOpen(false)}
          >
            {t('actions.cancel')}
          </Button>
          <PrimaryButton
            type="submit"
            sx={{ borderRadius: '4px' }}
            disabled={isPending || !formState.dirtyFields.name}
          >
            {t('actions.create')}
          </PrimaryButton>
        </Box>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
