// TODO: Determine whether to split RoleMember between server and group

import { RemoveCircle } from '@mui/icons-material';
import { Box, IconButton, Typography, styled } from '@mui/material';
import { User } from '../../types/user.types';
import { Link } from '../shared/link';
import UserAvatar from '../users/user-avatar';

const OuterFlex = styled(Box)(() => ({
  display: 'flex',
  marginBottom: 12,
  '&:last-child': {
    marginBottom: 0,
  },
}));

interface Props {
  roleMember: User;
}

const RoleMember = ({ roleMember }: Props) => {
  return (
    <OuterFlex justifyContent="space-between">
      <Link to="/">
        <Box display="flex">
          <UserAvatar
            userId={roleMember.id}
            userName={roleMember.name}
            sx={{ marginRight: 1.5 }}
          />
          <Typography color="primary" sx={{ marginTop: 1 }}>
            {roleMember.displayName || roleMember.name}
          </Typography>
        </Box>
      </Link>

      <IconButton>
        <RemoveCircle />
      </IconButton>
    </OuterFlex>
  );
};

export default RoleMember;
