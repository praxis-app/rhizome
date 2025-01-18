import { ArrowForwardIos } from '@mui/icons-material';
import { Box, SxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';

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
  '#f44336',
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
  const isAboveSm = useAboveBreakpoint('sm');

  const colorBoxSx: SxProps = {
    backgroundColor: color,
    borderRadius: 1,
    height: 24,
    marginRight: 1.5,
    width: 24,
  };

  const colorOptionSx = (colorOption: string): SxProps => ({
    backgroundColor: colorOption,
    width: 28,
    height: 28,
    borderRadius: 60,
    cursor: 'pointer',
    transition: 'transform 200ms cubic-bezier(.4,0,.2,1)',
    boxShadow:
      colorOption === color
        ? `${colorOption} 0px 0px 0px 15px inset, ${colorOption} 0px 0px 5px`
        : 'none',

    '&:hover': {
      transform: isAboveSm ? 'scale(1.2)' : 'none',
    },
  });

  return (
    <Box sx={sx}>
      <Box
        display="flex"
        justifyContent="space-between"
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', marginBottom: 0.25, userSelect: 'none' }}
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
            {COLOR_OPTIONS.map((colorOption) => (
              <Box
                key={colorOption}
                sx={colorOptionSx(colorOption)}
                onClick={() => onChange(colorOption)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ColorPicker;
