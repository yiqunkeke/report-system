import request from '@/utils/request';
import baseApi from '@/api/base';

// 附件列表查询
export function fileList (orderId) {
    return request({
      url: `${baseApi.API_URL}/v1/file/getAttachment`,
      method: 'get',
      params: {
        orderId
      }
    });
}

// 附件上传
export function fileUpload (orderId, userId, file) {
  return request({
    url: `${baseApi.API_URL}/v1/file/upload`,
    method: 'post',
    params: {
      orderId,
      userId,
      file
    }
  });
}

// 删除附件
export function fileDelete (attachmentId) {
  return request({
    url: `${baseApi.API_URL}/v1/file/remove/${attachmentId}`,
    method: 'delete'
  });
}

// 下载附件
export function fileDownload (attachmentId) {
  return request({
    url: `${baseApi.API_URL}/v1/file/download`,
    method: 'get',
    params: {
      attachmentId
    },
    responseType: 'blob'
  });
}
