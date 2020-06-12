import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});


// 请求拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 流数据
    if (response.headers['content-type']==='application/octet-stream;charset=UTF-8' || response.headers['content-type']==='application/octet-stream') {
      let str = response.headers['content-disposition'];
      res.fileName = decodeURI(str.split(';')[2].split('=')[1].split("''")[1]);
    }
    return res;
  },
  error => {
    let errorResp = error.response;
    console.log(error.response);
    switch (errorResp.status) {
      case 400:
        Message({
          message: errorResp.data.message,
          type: 'error',
          duration: 3 * 1000
        });
        break;
      case 401:
        store.dispatch('FedLogOut').then(() => {
          router.replace({
            path: '/login'
          });
          location.reload();
        });
        break;
      case 403:
        Message({
          message: '对不起，您没有权限',
          type: 'error',
          duration: 3 * 1000
        });
        break;
      case 404:
        router.replace({
          path: '/404'
        });
        break;
      case 500:
        Message({
          message: errorResp.data.message,
          type: 'error',
          duration: 5 * 1000
        });
        break;
      default:
        Message({
          message: errorResp.data.message,
          type: 'error',
          duration: 5 * 1000
        });
    }
    return Promise.reject(errorResp);
  }
);

export default service;
