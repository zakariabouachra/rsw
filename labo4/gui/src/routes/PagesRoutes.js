import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Cookies from 'js-cookie';

// render - dashboard
const Warehouses = Loadable(lazy(() => import('pages/warehouse')));
const Database = Loadable(lazy(() => import('pages/database')));
const WarehouseDetail = Loadable(lazy(() => import('pages/warehouse/warehouseDetails')));
const DatabaseDetail = Loadable(lazy(() => import('pages/database/dbDetails')));
const Schemas = Loadable(lazy(() => import('pages/schema')));
const Tables = Loadable(lazy(() => import('pages/table')));

const isAuthenticated = () => {
  const token = Cookies.get('jwt');
  return !!token;
};

const MainRoutes = {
  path: '/',
  element: isAuthenticated() ? <MainLayout /> : <Navigate to="/login" replace />,
  children: [
    {
      path: 'warehouse',
      element: isAuthenticated() ? <Warehouses /> : <Navigate to="/login" replace />,
    },
    {
      path: 'warehouse/:warehouseName',
      element: isAuthenticated() ? <WarehouseDetail /> : <Navigate to="/login" replace />,
    },
    {
      path: 'database',
      element: isAuthenticated() ? <Database /> : <Navigate to="/login" replace />,
    },
    {
      path: 'database/:databaseName',
      element: isAuthenticated() ? <DatabaseDetail /> : <Navigate to="/login" replace />,
    },
    {
      path: 'database/:databaseName/:schemaName',
      element: isAuthenticated() ? <Schemas /> : <Navigate to="/login" replace />,
    },
    {
      path: 'database/:databaseName/:schemaName/:tableName',
      element: isAuthenticated() ? <Tables /> : <Navigate to="/login" replace />,
    }
  ],
};

export default MainRoutes;
