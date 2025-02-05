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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import { BLURPLE, GRAY } from '../../styles/theme';
import { Channel, CreateChannelReq } from '../../types/chat.types';

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
    defaultValues: {
      name: editChannel.name,
    },
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

        <FormGroup sx={{ gap: 1.5, paddingBottom: 3, paddingX: '16px' }}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
              {t('chat.form.name')}
            </FormLabel>
            <OutlinedInput autoComplete="off" {...register('name')} />
          </FormControl>
        </FormGroup>
      </form>
    </Drawer>
  );
};

export default EditChannelDrawer;
