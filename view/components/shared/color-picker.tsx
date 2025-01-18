import { ArrowForwardIos } from '@mui/icons-material';
import { Box, SxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const COLOR_OPTIONS = [
  '#59b99d',
  '#64c878',
  '#5297d5',
  '#915cb0',
  '#d93866',
  '#3a7e6b',
  '#448954',
  '#346591',
  '#693986',
  '#9e2757',
  '#eac545',
  '#d8833b',
  '#d85846',
  '#99a6a3',
  '#657c8a',
  '#bc7f2f',
  '#9d4b1b',
  '#8c3528',
];

interface Props {
  color: string;
  label: string;
  onChange(color: string): void;
  sx?: SxProps;
}

const ColorPicker = ({ label, color, onChange, sx }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const colorBoxSx: SxProps = {
    backgroundColor: color,
    borderRadius: 1,
    height: 24,
    marginRight: 1.5,
    width: 24,
  };

  return (
    <Box sx={sx}>
      <Box
        display="flex"
        justifyContent="space-between"
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', marginBottom: 0.25 }}
      >
        <Typography color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        <Box display="flex">
          <Box sx={colorBoxSx}></Box>
          <Typography maxWidth="65px" marginRight={1.25}>
            {color}
          </Typography>
          <ArrowForwardIos
            fontSize="small"
            sx={{ transform: 'translateY(2px)' }}
          />
        </Box>
      </Box>

      {open && (
        <Box marginTop={2.5} marginBottom={1.5}>
          <Typography
            fontWeight={500}
            marginBottom={1.25}
            color="text.secondary"
          >
            {t('roles.form.pickColor')}
          </Typography>

          <Box display="flex" gap="16px" flexWrap="wrap" width="250px">
            {COLOR_OPTIONS.map((color) => (
              <Box
                key={color}
                bgcolor={color}
                width="28px"
                height="28px"
                borderRadius="60px"
                sx={{ cursor: 'pointer' }}
                onClick={() => onChange(color)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ColorPicker;
