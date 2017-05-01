export default function consumeRoutes({ childRoutes, component, components, ...props }) {
  return function finalConsumeRoutesWithStore(store) {
    const finalRoutes = [].concat(childRoutes)
      .map((routeBundle) => {
        if (typeof routeBundle === 'function') {
          return routeBundle({
            getState: store.getState,
            dispatch: store.dispatch,
            injectReducer: store.injectReducer,
          });
        }
        return routeBundle;
      })
      .reduce((prev, curr) => prev.concat(curr), []);

    return {
      component,
      components,
      childRoutes: finalRoutes,
      ...props,
    };
  };
}