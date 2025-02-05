import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
  PaperProps,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { GRAY } from '../../styles/theme';
import { Channel, CreateChannelReq } from '../../types/chat.types';
import PrimaryButton from '../shared/primary-button';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  editChannel: Channel;
}

const EditChannelDrawer = ({ isOpen, setIsOpen, editChannel }: Props) => {
  const queryClient = useQueryClient();

  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: async (values: CreateChannelReq) => {
      await api.updateChannel(editChannel.id, values);

      const channel = { ...editChannel, ...values };
      queryClient.setQueryData<{ channel: Channel }>(
        ['channels', editChannel.id],
        { channel },
      );
      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return {
            channels: oldData.channels.map((c) => {
              return c.id === channel.id ? channel : c;
            }),
          };
        },
      );

      setIsOpen(false);
    },
  });

  const { register, formState, handleSubmit } = useForm<CreateChannelReq>({
    mode: 'onChange',
  });

  const { t } = useTranslation();

  const paperProps: PaperProps = {
    sx: {
      height: 'calc(100% - 54px)',
      bgcolor: GRAY['900'],
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      paddingTop: '12px',
      paddingX: '16px',
    },
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      anchor="bottom"
      PaperProps={paperProps}
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
            {t('actions.save')}
          </PrimaryButton>
        </Box>
      </form>
    </Drawer>
  );
};

export default EditChannelDrawer;
