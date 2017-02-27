import React from 'react';
import isClient from '../../lib/utils/isClient';
import consumeRoutes from '../../lib/router/consumeRoutes';
import Shell from './pages/Shell';
import About from './pages/About';
import Explore from './pages/Explore';
import Collections from './pages/Collections';
import CivicApp from './routes/CivicApp';
import AppA from '../housingApp';
import AppB from '../emergencyApp';

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

const NotFoundRoute = {
  path: isClient ? '*' : '.*',
  getComponent(location, cb) {
    cb(null, require('./pages/NotFound').default);
  },
};

const items = [{ collectionId: 'emergency' }, { collectionId: 'housing' }];
const makePaths = path => ({ path: `/civic/${path}`, name: path });
const WithPaths = () => <Collections items={items.map(({ collectionId }) => makePaths(collectionId))} />;

const routes = [
  { path: '/civic',
    name: 'root',
    component: CivicApp,
    childRoutes: [
      { ...makePaths('collections'),
        component: WithPaths,
      },
      { ...makePaths('about'),
        component: About,
      },
      { ...makePaths('explore'),
        component: Explore,
      },
      { ...makePaths('emergency'),
        component: AppB,
      },
      { ...makePaths('housing'),
        component: AppA,
      },
    ],
  },
];

export default consumeRoutes({
  component: Shell,
  childRoutes: [
    routes,
    NotFoundRoute,
  ],
});
