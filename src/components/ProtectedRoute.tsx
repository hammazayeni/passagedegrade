import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthorized, type AuthPage } from '@/lib/auth';

type Props = {
  page: AuthPage;
  children: ReactNode;
};

export default function ProtectedRoute({ page, children }: Props) {
  const location = useLocation();
  if (!isAuthorized(page)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
