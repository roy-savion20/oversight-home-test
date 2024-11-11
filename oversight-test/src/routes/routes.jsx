import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Admin from '../components/Admin'
import ManagerProfile from '../components/ManagerProfile'
import { ManagerContextProvider } from '../context/Managercontext';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <ManagerContextProvider><Login /></ManagerContextProvider> ,
  },
  {
    path: '/admin',
    element: <Admin/>
  },
  {
    path: '/ManagerProfile',
    element: <ManagerContextProvider><ManagerProfile/></ManagerContextProvider>
  }
]);

export default routes;