const publicRoutes = [
  {
    path: '/',
    element: <div>Home page</div>,
  },
  {
    path: '/login',
    element: <div>Login page</div>,
  },
  {
    path: '/register',
    element: <div>Register page</div>,
  },
  {
    path: '/unauthorized',
    element: <div>You don't have permission to access this page</div>,
  },
];

export default publicRoutes;