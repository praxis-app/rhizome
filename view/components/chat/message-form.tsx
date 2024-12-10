import { Send } from '@mui/icons-material';
import { Box, FormGroup, IconButton, Input, SxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { api } from '../../client/api-client';
import { KeyCodes } from '../../constants/shared.constants';
import AttachedImagePreview from '../images/attached-image-preview';
import ImageInput from '../images/image-input';

interface FormValues {
  body: string;
}

interface Props {
  channelId: number;
}

const MessageForm = ({ channelId }: Props) => {
  const { handleSubmit, register, setValue } = useForm<FormValues>();
  const { ref: bodyRef, onChange, ...registerBodyProps } = register('body');

  const { mutate: sendMessage } = useMutation(async ({ body }: FormValues) => {
    const result = await api.sendMessage(channelId, body);
    console.log(result);
    setValue('body', '');
  });

  const formStyles: SxProps = {
    bgcolor: 'background.paper',
    position: 'fixed',
    bottom: '0px',
    left: 0,
    paddingY: 1,
    paddingX: 0.9,
    width: '100%',
  };
  const inputStyles: SxProps = {
    borderRadius: 8,
    paddingY: 0.8,
    width: '100%',
  };
  const sendButtonStyles: SxProps = {
    width: 40,
    height: 40,
    transform: 'translateY(5px)',
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.code !== KeyCodes.Enter) {
      return;
    }
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();
    handleSubmit((values) => sendMessage(values))();
  };

  return (
    <Box sx={formStyles}>
      <FormGroup row>
        <Box
          bgcolor={grey[900]}
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
            onChange={onChange}
            ref={(e) => {
              bodyRef(e);
            }}
            disableUnderline
            multiline
          />

          <Box display="flex" justifyContent="space-between">
            <ImageInput
              iconStyles={{ color: 'text.secondary', fontSize: 25 }}
              multiple
            />

            <IconButton
              sx={sendButtonStyles}
              edge="end"
              onClick={handleSubmit((values) => sendMessage(values))}
              disableRipple
            >
              <Send sx={{ fontSize: 20, color: 'text.secondary' }} />
            </IconButton>
          </Box>
        </Box>
      </FormGroup>

      <AttachedImagePreview selectedImages={[]} sx={{ marginLeft: 1.5 }} />
    </Box>
  );
};

export default MessageForm;
