import { Tag } from '@mui/icons-material';
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { Channel } from '../../types/chat.types';

interface Props {
  channel: Channel;
  isActive: boolean;
}

const ChannelListItem = ({ channel, isActive }: Props) => {
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();

  const listItemBtnSx: SxProps = {
    color: 'text.secondary',
    borderRadius: '4px',
    marginRight: '6px',
    marginLeft: '8px',
    paddingRight: '10px',
    paddingLeft: '8px',
    height: '30px',
  };

  const getChannelNameTextProps = () => {
    const selectedColor = isDarkMode ? 'white' : 'black';
    return {
      sx: {
        color: isActive ? selectedColor : 'text.secondary',
        fontWeight: isActive ? 600 : 500,
        fontSize: '15px',
      },
    };
  };

  return (
    <ListItemButton
      key={channel.id}
      onClick={() => navigate(`/channels/${channel.id}`)}
      sx={listItemBtnSx}
    >
      <ListItemIcon sx={{ minWidth: '33px' }}>
        <Tag sx={{ color: 'text.secondary' }} />
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={getChannelNameTextProps()}
        primary={
          <Box display="flex">
            <Box>{channel.name}</Box>
          </Box>
        }
      />
    </ListItemButton>
  );
};

export default ChannelListItem;
