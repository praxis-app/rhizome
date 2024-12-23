import { Container, SxProps } from '@mui/material';
import { ReactNode } from 'react';
import Toast from '../shared/toast';

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export const Layout = ({ children, sx }: Props) => {
  return (
    <Container sx={sx}>
      {children}
      <Toast />
    </Container>
  );
};
