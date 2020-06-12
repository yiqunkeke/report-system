import request from '@/utils/request';
import baseApi from '@/api/base';

// 获取分析数据
export function analysisList (
    pageNum,
    pageSize,
    registerId,
    conclusions,
    state1,
    state2
    ) {
  return request({
    url: `${baseApi.API_URL}/v1/detail/getDetails`,
    method: 'get',
    params: {
        pageNum,
        pageSize,
        registerId,
        conclusions,
        state1,
        state2
    }
  });
}

// 批量舍弃
export function abandon (
  userId,
  registerId,
  details
  ) {
return request({
    url: `${baseApi.API_URL}/v1/detail/batchAbandon`,
    method: 'put',
    data: {
      userId,
      registerId,
      details
    }
  });
}

// 批量保留
export function retain (
  userId,
  registerId,
  details
  ) {
return request({
    url: `${baseApi.API_URL}/v1/detail/batchSave`,
    method: 'put',
    data: {
      userId,
      registerId,
      details
    }
  });
}

// 获取额外分析数据
export function extraDataList (
  pageNum,
  pageSize,
  geneName
  ) {
return request({
    url: `${baseApi.API_URL}/v1/detail/getAdditionalDetails`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      geneName
    }
  });
}

// 获取分析意义
export function conclusionList (
  pageNum,
  pageSize,
  registerId,
  site
  ) {
return request({
    url: `${baseApi.API_URL}/v1/detail/getDetailsConclusion`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      registerId,
      site
    }
  });
}

// 获取额外数据
export function extraData (registerId, detailId) {
  return request({
    url: `${baseApi.API_URL}/v1/detail/extraDetail`,
    method: 'post',
    data: {
      registerId,
      detailId
    }
  });
}

// 插入FLT3
export function flt3 (registerId, bp, mutation) {
  return request({
    url: `${baseApi.API_URL}/v1/detail/insertFLT3`,
    method: 'post',
    data: {
      registerId,
      bp,
      mutation
    }
  });
}
