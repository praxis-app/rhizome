import { Box, Typography } from '@mui/material';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { timeAgo } from '../../utils/time.utils';
import AttachedImageList from '../images/attached-image-list';
import FormattedText from '../shared/formatted-text';

interface Props {
  message: any;
}

const Message = ({ message: { body, images = [], createdAt } }: Props) => {
  const formattedDate = timeAgo(createdAt);

  const isLarge = useAboveBreakpoint('md');

  return (
    <Box display="flex" gap={2} paddingBottom={2}>
      <Box>
        <Box display="flex" gap={1}>
          <Typography
            color="text.secondary"
            sx={{ cursor: 'default' }}
            title={formattedDate}
          >
            {formattedDate}
          </Typography>
        </Box>

        <FormattedText text={body} lineHeight={1.2} paddingBottom={0.4} />

        {!!images.length && (
          <AttachedImageList
            images={images}
            imageSx={{ borderRadius: 2 }}
            width={isLarge ? 350 : '100%'}
            paddingTop={0.7}
          />
        )}
      </Box>
    </Box>
  );
};

export default Message;
