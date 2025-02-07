import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  OutlinedInput,
  PaperProps,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { BLURPLE, GRAY } from '../../styles/theme';
import { Channel, MutateChannelReq } from '../../types/chat.types';
import DeleteButton from '../shared/delete-button';
import Modal from '../shared/modal';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  editChannel: Channel;
}

const EditChannelDrawer = ({ isOpen, setIsOpen, editChannel }: Props) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateChannel, isPending } = useMutation({
    mutationFn: async (values: MutateChannelReq) => {
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

  const { mutate: deleteChannel, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      await api.deleteChannel(editChannel.id);

      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return {
            channels: oldData.channels.filter(
              (role) => role.id !== editChannel.id,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const { register, formState, handleSubmit } = useForm<MutateChannelReq>({
    defaultValues: {
      name: editChannel.name,
    },
    mode: 'onChange',
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  const paperProps: PaperProps = {
    sx: {
      height: 'calc(100% - 54px)',
      bgcolor: GRAY['900'],
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      paddingTop: '12px',
    },
  };

  const handleDeleteBtnClick = async () => {
    await navigate(NavigationPaths.Home);
    deleteChannel();
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
            {t('chat.headers.channelSettings')}
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

        <FormGroup sx={{ gap: 1.5, paddingBottom: 3.5, paddingX: '16px' }}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
              {t('chat.form.name')}
            </FormLabel>
            <OutlinedInput autoComplete="off" {...register('name')} />
          </FormControl>
        </FormGroup>
      </form>

      <DeleteButton
        onClick={() => setIsConfirmDeleteOpen(true)}
        sx={{ marginX: '16px' }}
        fullWidth={false}
      >
        {t('chat.actions.deleteChannel')}
      </DeleteButton>

      <Modal
        open={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
      >
        <Typography marginBottom={3}>
          {t('prompts.deleteItem', { itemType: 'channel' })}
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            onClick={() => setIsConfirmDeleteOpen(false)}
          >
            {t('actions.cancel')}
          </Button>
          <Button
            variant="contained"
            sx={{ color: '#f44336' }}
            onClick={handleDeleteBtnClick}
            disabled={isDeletePending}
          >
            {t('actions.delete')}
          </Button>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default EditChannelDrawer;
