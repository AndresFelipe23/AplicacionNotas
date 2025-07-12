import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 