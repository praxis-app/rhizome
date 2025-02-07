import { Close } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import ConfirmDeleteChannelModal from '../../components/chat/confirm-delete-channel-modal';
import TopNav from '../../components/nav/top-nav';
import DeleteButton from '../../components/shared/delete-button';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { MutateChannelReq } from '../../types/chat.types';

const EditChannelPage = () => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { channelId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, formState, reset, handleSubmit } =
    useForm<MutateChannelReq>({
      mode: 'onChange',
    });

  const { data, isLoading } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: async () => {
      const result = await api.getChannel(channelId!);
      reset({ name: result.channel.name });
      return result;
    },
    enabled: !!channelId,
  });

  const { mutate: updateChannel, isPending } = useMutation({
    mutationFn: async (values: MutateChannelReq) => {
      if (!data) {
        return;
      }
      await api.updateChannel(data.channel.id, values);

      // TODO: Uncomment if needed to update the cache
      // const channel = { ...data.channel, ...values };
      // queryClient.setQueryData<{ channel: Channel }>(
      //   ['channels', data.channel.id],
      //   { channel },
      // );
      // queryClient.setQueryData<{ channels: Channel[] }>(
      //   ['channels'],
      //   (oldData) => {
      //     if (!oldData) {
      //       return { channels: [] };
      //     }
      //     return {
      //       channels: oldData.channels.map((c) => {
      //         return c.id === channel.id ? channel : c;
      //       }),
      //     };
      //   },
      // );

      navigate(`${NavigationPaths.Channels}/${channelId}`);
    },
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <TopNav
        header={t('chat.headers.channelSettings')}
        onBackClick={() => navigate(`${NavigationPaths.Channels}/${channelId}`)}
        backBtnIcon={<Close />}
      />

      <Card sx={{ marginBottom: '12px' }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit((fv) => updateChannel(fv))}
          >
            <FormGroup sx={{ gap: 1.5, paddingBottom: 3.5 }}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                  {t('chat.form.name')}
                </FormLabel>
                <OutlinedInput autoComplete="off" {...register('name')} />
              </FormControl>
            </FormGroup>

            <Box display="flex" justifyContent="right" gap="16px">
              <PrimaryButton
                type="submit"
                sx={{ borderRadius: '4px' }}
                disabled={isPending || !formState.dirtyFields.name}
              >
                {t('actions.save')}
              </PrimaryButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <DeleteButton onClick={() => setIsConfirmDeleteOpen(true)}>
        {t('chat.actions.deleteChannel')}
      </DeleteButton>

      {!!channelId && (
        <ConfirmDeleteChannelModal
          channelId={channelId}
          isOpen={isConfirmDeleteOpen}
          setIsOpen={setIsConfirmDeleteOpen}
        />
      )}
    </>
  );
};

export default EditChannelPage;
