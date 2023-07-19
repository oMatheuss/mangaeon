import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/layout';

import { Home } from '@/pages/home';
import { Leitor } from '@/pages/leitor';
import { Manga } from '@/pages/manga';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/ler/:name/online/:id/:chap',
        element: <Leitor />,
      },
      {
        path: '/manga/:name/:id',
        element: <Manga />,
      },
    ],
  },
]);
