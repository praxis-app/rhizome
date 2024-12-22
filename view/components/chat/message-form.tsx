// TODO: Add remaining layout and functionality - below is a WIP

import { Send } from '@mui/icons-material';
import { Box, FormGroup, IconButton, Input, SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { t } from 'i18next';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../client/api-client';
import { KeyCodes } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { Message } from '../../types/chat.types';
import AttachedImagePreview from '../images/attached-image-preview';
import ImageInput from '../images/image-input';
import { Image } from '../../types/image.types';

interface FormValues {
  body: string;
}

interface Props {
  channelId: string;
}

const MessageForm = ({ channelId }: Props) => {
  const [images, setImages] = useState<File[]>([]);
  const [imagesInputKey, setImagesInputKey] = useState<number>();

  const { handleSubmit, register, setValue, formState, reset } =
    useForm<FormValues>();
  const registerBodyProps = register('body');

  const isDarkMode = useIsDarkMode();
  const queryClient = useQueryClient();

  const { mutate: sendMessage } = useMutation(async ({ body }: FormValues) => {
    const { message } = await api.sendMessage(channelId, body, images.length);
    const messageImages: Image[] = [];

    if (images.length && message.images) {
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.set('file', images[i]);

        const placeholder = message.images[i];
        const { image } = await api.uploadMessageImage(
          channelId,
          message.id,
          placeholder.id,
          formData,
        );
        messageImages.push(image);
      }
      setImagesInputKey(Date.now());
      setImages([]);
    }

    const messageWithImages = {
      ...message,
      images: messageImages,
    };

    queryClient.setQueryData<{ messages: Message[] }>(
      ['messages', channelId],
      (oldData) => {
        if (!oldData) {
          return { messages: [messageWithImages] };
        }
        return {
          messages: [messageWithImages, ...oldData.messages],
        };
      },
    );
    setValue('body', '');
    reset();
  });

  const formStyles: SxProps = {
    borderTop: `1px solid ${isDarkMode ? grey[900] : grey[100]}`,
    transition: 'background-color 0.2s cubic-bezier(.4,0,.2,1)',
    bgcolor: 'background.paper',
    paddingTop: 1,
    paddingBottom: 2,
    paddingX: 0.9,
    width: '100%',
  };
  const inputStyles: SxProps = {
    borderRadius: 8,
    paddingY: 0.8,
    width: '100%',
  };
  const sendBtnStyles: SxProps = {
    width: 40,
    height: 40,
    transform: 'translateY(5px)',
  };

  const handleSendBtnClick = () => {
    handleSubmit((values) => sendMessage(values))();
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.code !== KeyCodes.Enter) {
      return;
    }
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    handleSubmit((values) => sendMessage(values))();
  };

  const handleRemoveSelectedImage = (imageName: string) => {
    setImages(images.filter((image) => image.name !== imageName));
    setImagesInputKey(Date.now());
  };

  return (
    <Box sx={formStyles}>
      <FormGroup row>
        <Box
          bgcolor={isDarkMode ? grey[900] : grey[100]}
          sx={{ transition: 'background-color 0.2s cubic-bezier(.4,0,.2,1)' }}
          borderRadius={4}
          paddingX={1.5}
          paddingY={0.2}
          flex={1}
        >
          <Input
            {...registerBodyProps}
            autoComplete="off"
            placeholder={t('chat.prompts.sendAMessage')}
            onKeyDown={handleInputKeyDown}
            sx={inputStyles}
            disableUnderline
            multiline
          />

          <Box display="flex" justifyContent="space-between">
            <ImageInput
              key={imagesInputKey}
              setImages={setImages}
              iconStyles={{ fontSize: 25, color: 'text.secondary' }}
              multiple
            />

            <IconButton
              sx={sendBtnStyles}
              edge="end"
              onClick={handleSendBtnClick}
              disabled={!images.length && !formState.dirtyFields.body}
              disableRipple
            >
              <Send sx={{ fontSize: 20, color: 'text.secondary' }} />
            </IconButton>
          </Box>
        </Box>
      </FormGroup>

      {!!images.length && (
        <AttachedImagePreview
          handleRemove={handleRemoveSelectedImage}
          selectedImages={images}
          sx={{ marginLeft: 1.5 }}
        />
      )}
    </Box>
  );
};

export default MessageForm;
