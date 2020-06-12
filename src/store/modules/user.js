import { login, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import md5 from 'js-md5';

const getDefaultState = () => {
  return {
    token: getToken(),
    user_id: '',
    name: '',
    avatar: '',
    rules: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_RULES: (state, rules) => {
    state.rules = rules;
  },
  SET_USER_ID: (state, id) => {
    state.user_id = id;
  }
};

const actions = {

  // 登录
  login ({ commit }, userInfo) {
    let { username, password } = userInfo;
    password = md5(password);
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { content } = response;
        commit('SET_TOKEN', content);
        setToken(content);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // 用户信息
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { username, rules, userId } = response;
        console.log('userinfo', response);
        commit('SET_NAME', username);
        commit('SET_RULES', rules);
        commit('SET_USER_ID', userId);
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  // 前端登出
  logout ({ commit }) {
    return new Promise((resolve) => {
        removeToken();
        resetRouter();
        commit('RESET_STATE');
        resolve();
    });
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

