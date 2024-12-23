import { Typography } from '@mui/material';
import { Layout } from '../components/app/layout';

export const ErrorPage = () => {
  return (
    <Layout>
      <Typography fontSize={22} marginTop={3} marginLeft={2.5}>
        Something went wrong.
      </Typography>
    </Layout>
  );
};
