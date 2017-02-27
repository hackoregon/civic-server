export default function createRoutes(...routes) {
  return function createRoutesWithStore(store) {
    const finalRoutes = [].concat(...routes)
      .map((route) => {
        if (typeof route === 'function') {
          return route(store);
        }
        return route;
      });

    return finalRoutes;
  };
}