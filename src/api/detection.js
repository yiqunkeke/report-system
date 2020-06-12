import request from '@/utils/request';
import baseApi from '@/api/base';

// 获取检测项目
export function detectionList () {
  return request({
    url: `${baseApi.API_URL}/v1/detection/getDetection`,
    method: 'get'
  });
}
