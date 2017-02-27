export function pluckComponentsFromRoute(currentRoute) {
  let componentsToReturn;

  function reduceComponentsToArray(components) {
    return Object.keys(components)
      .map(componentKey => components[componentKey]);
  }

  if (currentRoute.component) {
    componentsToReturn = [currentRoute.component];
  }

  if (currentRoute.getComponent) {
    currentRoute.getComponent(null, (err, component) => {
      componentsToReturn = [component];
    });
  }

  if (currentRoute.components) {
    componentsToReturn = reduceComponentsToArray(currentRoute.components);
  }

  if (currentRoute.getComponents) {
    currentRoute.getComponents(null, (err, components) => {
      componentsToReturn = reduceComponentsToArray(components);
    });
  }

  return componentsToReturn;
}

export function selectPropFromComponent(prop) {
  return function getPropFromComponent(component) {
    return component[prop];
  };
}

export function getPropFromRoute(routes, prop) {
  return routes.reduce((memo, currRoute) => {
    const componentsToExtractPropsFrom = pluckComponentsFromRoute(currRoute);
    const routeProps = componentsToExtractPropsFrom
      .map(selectPropFromComponent(prop))
      .filter(maybeValue => maybeValue);

    return memo.concat(routeProps);
  }, []);
}

export default function getPropsFromRoute(renderProps, propsToGet) {
  const finalPropsToGet = [].concat(propsToGet);
  const { routes } = renderProps;

  return finalPropsToGet
    .reduce((memo, currentProp) => ({
      ...memo,
      [currentProp]: getPropFromRoute(routes, currentProp),
    }), {});
}
