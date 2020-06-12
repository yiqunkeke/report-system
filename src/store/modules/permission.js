import {constantRoutes, asyncRouter} from '@/router';

function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0);
  } else {
    return true;
  }
}

function filterAsyncRouter (asyncRouterMap, roles) {
  return asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
}

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRoutes.concat(routers);
    }
  },
  actions: {
    GenerateRoutes ({commit}, data) {
      return new Promise(resolve => {
        const roles = data.rules;
        let accessedRouters;
        accessedRouters = filterAsyncRouter(asyncRouter, roles);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    }
  }
};

export default permission;