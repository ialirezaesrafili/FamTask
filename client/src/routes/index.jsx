// packages imports
import { createBrowserRouter } from 'react-router-dom';



// module imports
import App from "../App";
import NotFound from '../pages/NotFound';
import publicRoutes from './public.route';


const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        ...publicRoutes,
        {
          path: '*',
          element: <NotFound /> 
        },
      ],
    },
  ]);
  
  export default router;