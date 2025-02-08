import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  PaperProps,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { BLURPLE, GRAY } from '../../styles/theme';
import { Channel, UpdateChannelReq } from '../../types/channel.types';
import DeleteButton from '../shared/delete-button';
import ChannelFormFields from './channel-form-fields';
import ConfirmDeleteChannelModal from './confirm-delete-channel-modal';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  editChannel: Channel;
}

const EditChannelDrawer = ({ isOpen, setIsOpen, editChannel }: Props) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateChannel, isPending } = useMutation({
    mutationFn: async (values: UpdateChannelReq) => {
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

  const { register, formState, handleSubmit, reset } =
    useForm<UpdateChannelReq>({
      defaultValues: { name: editChannel.name },
      mode: 'onChange',
    });

  const { t } = useTranslation();

  useEffect(() => {
    reset({ name: editChannel.name });
  }, [editChannel, reset]);

  const paperProps: PaperProps = {
    sx: {
      height: 'calc(100% - 54px)',
      bgcolor: GRAY['900'],
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      paddingTop: '12px',
    },
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      anchor="bottom"
      PaperProps={paperProps}
    >
      <form onSubmit={handleSubmit((fv) => updateChannel(fv))}>
        <Box
          display="flex"
          justifyContent="space-between"
          padding="0 16px 12px"
        >
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ marginRight: '24px' }}
            edge="start"
          >
            <Close />
          </IconButton>

          <Typography alignSelf="center" fontWeight="600">
            {t('channels.headers.channelSettings')}
          </Typography>

          <Button
            type="submit"
            sx={{ textTransform: 'none', color: BLURPLE['300'] }}
            disabled={isPending || !formState.dirtyFields.name}
          >
            {t('actions.save')}
          </Button>
        </Box>

        <Divider sx={{ marginBottom: '16px' }} />

        <ChannelFormFields register={register} sx={{ paddingX: '16px' }} />
      </form>

      <DeleteButton
        onClick={() => setIsConfirmDeleteOpen(true)}
        sx={{ marginX: '16px' }}
        fullWidth={false}
      >
        {t('channels.actions.deleteChannel')}
      </DeleteButton>

      <ConfirmDeleteChannelModal
        isOpen={isConfirmDeleteOpen}
        setIsOpen={setIsConfirmDeleteOpen}
        channelId={editChannel.id}
      />
    </Drawer>
  );
};

export default EditChannelDrawer;
