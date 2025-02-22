import { Assignment } from '@mui/icons-material';
import {
  Box,
  MenuItem,
  TableCell as MuiTableCell,
  styled,
  SxProps,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';
import { Invite } from '../../types/invite.types';
import { CurrentUser } from '../../types/user.types';
import { copyInviteLink } from '../../utils/invite.utils';
import { truncate } from '../../utils/text.utils';
import { timeFromNow } from '../../utils/time.utils';
import ItemMenu from '../shared/item-menu';
import { Link } from '../shared/link';
import UserAvatar from '../users/user-avatar';

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
}));

interface Props {
  me: CurrentUser;
  invite: Invite;
}

const ServerInviteRow = ({
  invite: { user, token, uses, maxUses, expiresAt },
  me,
}: Props) => {
  const { setToast } = useAppStore((state) => state);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const { t } = useTranslation();

  const deleteInvitePrompt = t('prompts.deleteItem', {
    itemType: 'invite link',
  });

  const tableRowStyles: SxProps = {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  };

  const handleCopyLink = async () => {
    await copyInviteLink(token);
    setToast({
      title: t('invites.prompts.copiedToClipboard'),
      status: 'success',
    });
    setMenuAnchorEl(null);
  };

  if (!me) {
    return null;
  }

  const truncatedUsername = truncate(user.name, 18);

  return (
    <TableRow sx={tableRowStyles}>
      <TableCell>
        <Link to={NavigationPaths.Home} sx={{ display: 'flex' }}>
          <UserAvatar
            userId={user.id}
            userName={user.name}
            size={24}
            sx={{ marginRight: 1.5 }}
          />
          <Box marginTop={0.25}>{truncatedUsername}</Box>
        </Link>
      </TableCell>

      <TableCell onClick={handleCopyLink} sx={{ cursor: 'pointer' }}>
        {token}
      </TableCell>

      <TableCell>{uses + (maxUses ? `/${maxUses}` : '')}</TableCell>

      <TableCell>
        {expiresAt ? timeFromNow(expiresAt) : t('time.infinity')}
      </TableCell>

      <TableCell>
        <ItemMenu
          anchorEl={menuAnchorEl}
          deletePrompt={deleteInvitePrompt}
          setAnchorEl={setMenuAnchorEl}
          prependChildren
        >
          <MenuItem onClick={handleCopyLink}>
            <Assignment fontSize="small" sx={{ marginRight: 1 }} />
            {t('actions.copy')}
          </MenuItem>
        </ItemMenu>
      </TableCell>
    </TableRow>
  );
};

export default ServerInviteRow;
