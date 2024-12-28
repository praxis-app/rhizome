import { RouteObject } from 'react-router-dom';
import { SignUp } from '../pages/auth/sign-up';

export const authRouter: RouteObject = {
  path: '/auth',
  children: [
    {
      path: 'signup',
      element: <SignUp />,
    },
  ],
};
