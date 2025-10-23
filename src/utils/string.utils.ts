import { AnyRoute } from '@tanstack/react-router';

export const removeExtraSlashes = (str: string) => {
  return str.replace(/([^:]\/)\/+/g, '$1');
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fromKebabCase = (str: string) => {
  const words = str.split('-').map((word) => capitalize(word));
  return words.join(' ');
};

// Custom display names for specific routes
const ROUTE_DISPLAY_NAMES: Record<string, string> = {
  'compare-data': 'DEPOT Items',
};

export const getNameFromPath = (path: string) => {
  const pathParts = path.split('/').filter((d: string) => d);
  const routeName = pathParts[pathParts.length - 1];

  // Check if there's a custom display name for this route
  if (ROUTE_DISPLAY_NAMES[routeName]) {
    return ROUTE_DISPLAY_NAMES[routeName];
  }

  return fromKebabCase(routeName);
};

export const getSubRoutes = (flatRoutes: AnyRoute[], subRouteName: string) => {
  return flatRoutes.filter((route: AnyRoute) => {
    const pathParts = route.fullPath.split('/').filter((d: string) => d);
    const lastCharacter = route.fullPath[route.fullPath.length - 1];
    if (
      pathParts.length === 2 &&
      pathParts[0] === subRouteName &&
      lastCharacter === '/'
    ) {
      return route;
    }
  });
};

export const getTaskFlowRoutes = (flatRoutes: AnyRoute[]) => {
  return flatRoutes.filter((route: AnyRoute) => {
    const pathParts = route.fullPath.split('/').filter((d: string) => d);
    const lastCharacter = route.fullPath[route.fullPath.length - 1];
    if (
      pathParts.length === 1 &&
      pathParts[0] !== 'playground' &&
      pathParts[0] !== undefined &&
      lastCharacter === '/'
    ) {
      return route;
    }
  });
};

export const getTopLevelRoutes = (flatRoutes: AnyRoute[]) => {
  return flatRoutes.filter((route: AnyRoute) => {
    const pathParts = route.fullPath.split('/').filter((d: string) => d);
    const lastCharacter = route.fullPath[route.fullPath.length - 1];
    if (
      pathParts.length === 1 &&
      (pathParts[0] === 'playground' || pathParts[0] === undefined) &&
      lastCharacter === '/'
    ) {
      return route;
    }
  });
};
