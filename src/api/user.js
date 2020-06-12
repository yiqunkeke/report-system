import request from '@/utils/request';
import baseApi from '@/api/base';

export function login (data) {
  return request({
    url: `${baseApi.API_URL}/v1/user/login`,
    method: 'post',
    data
  });
}

export function getInfo (token) {
  return request({
    url: `${baseApi.API_URL}/v1/user/info`,
    method: 'get',
    params: { token }
  });
}

export function logout () {
  return request({
    url: `${baseApi.API_URL}/v1/user/logout`,
    method: 'post'
  });
}

// 获取活跃用户列表
export function activeUser () {
  return request({
    url: `${baseApi.API_URL}/v1/user/getActiveUser`,
    method: 'get'
  });
}
