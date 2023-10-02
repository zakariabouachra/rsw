import { lazy } from 'react';
import { Navigate } from 'react-router-dom'; // Ajout de Navigate


// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Cookies from 'js-cookie';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

const isAuthenticated = () => {
  const token = Cookies.get('jwt');
  return !!token; // Retourne vrai si le jeton JWT est présent, sinon faux
};


// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  element: isAuthenticated() ? <MainLayout /> : <Navigate to="/login" replace />, // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
  children: [
    {
      path: '/',
      element: isAuthenticated() ? <DashboardDefault /> : <Navigate to="/login" replace />, // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: isAuthenticated() ? <DashboardDefault /> : <Navigate to="/login" replace />, // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
        },
      ],
    },
  ],
};

export default MainRoutes;


