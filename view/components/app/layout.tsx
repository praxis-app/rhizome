import { Container, SxProps } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export const Layout = ({ children, sx }: Props) => {
  return <Container sx={sx}>{children}</Container>;
};
