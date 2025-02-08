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
import { Channel, MutateChannelReq } from '../../types/channel.types';
import Modal from '../shared/modal';
import PrimaryButton from '../shared/primary-button';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  onSubmit?(): void;
}

const CreateChannelModal = ({ isOpen, setIsOpen, onSubmit }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: async (values: MutateChannelReq) => {
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
      onSubmit?.();

      navigate(`/channels/${channel.id}`);
    },
  });

  const { register, formState, handleSubmit } = useForm<MutateChannelReq>({
    mode: 'onChange',
  });

  const { t } = useTranslation();

  return (
    <Modal
      title={t('channels.actions.createChannel')}
      onClose={() => setIsOpen(false)}
      open={isOpen}
    >
      <form onSubmit={handleSubmit((fv) => createChannel(fv))}>
        <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
              {t('channels.form.name')}
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
