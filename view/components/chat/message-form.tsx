import { Send } from '@mui/icons-material';
import { Box, FormGroup, IconButton, Input, SxProps } from '@mui/material';
import { t } from 'i18next';
import AttachedImagePreview from '../images/attached-image-preview';
import ImageInput from '../images/image-input';
import { grey } from '@mui/material/colors';

const MessageForm = () => {
  const formStyles: SxProps = {
    position: 'fixed',
    bottom: '0px',
    left: 0,
    bgcolor: 'background.paper',
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
            autoComplete="off"
            placeholder={t('chat.prompts.sendAMessage')}
            sx={inputStyles}
            value={''}
            disableUnderline
            multiline
          />

          <Box display="flex" justifyContent="space-between">
            <ImageInput
              iconStyles={{ color: 'text.secondary', fontSize: 25 }}
              multiple
            />

            <IconButton sx={sendButtonStyles} edge="end" disableRipple>
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
