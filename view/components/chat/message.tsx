// TODO: Add remaining layout and functionality - below is a WIP

import { Box, Typography } from '@mui/material';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { timeAgo } from '../../utils/time.utils';
import AttachedImageList from '../images/attached-image-list';
import FormattedText from '../shared/formatted-text';
import UserAvatar from '../users/user-avatar';

interface Props {
  message: any;
}

const Message = ({
  message: { body, images = [], user, createdAt },
}: Props) => {
  const isLarge = useAboveBreakpoint('md');
  const formattedDate = timeAgo(createdAt);

  return (
    <Box display="flex" gap={2} paddingBottom={2}>
      <UserAvatar sx={{ marginTop: 0.5 }} withLink />

      <Box>
        <Box display="flex" gap={1}>
          <Typography fontFamily="Inter" fontWeight={600}>
            {user.name}
          </Typography>
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
