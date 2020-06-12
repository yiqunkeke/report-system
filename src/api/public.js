import request from '@/utils/request';
import baseApi from '@/api/base';

// 测序类型
export function sequenceType() {
    return request({
      url: `${baseApi.API_URL}/v1/dictionary/getSequenceType`,
      method: 'get'
    });
}

// 获取财务确认状态
export function confirmStatus() {
  return request({
    url: `${baseApi.API_URL}/v1/dictionary/getReceiptConfirmationStatus`,
    method: 'get'
  });
}

// 获取医院列表
export function hospitalList() {
  return request({
    url: `${baseApi.API_URL}/v1/hospital/getHospital`,
    method: 'get'
  });
}

// 获取收样单位
export function sampleUnit() {
  return request({
    url: `${baseApi.API_URL}/v1/dictionary/getRegion`,
    method: 'get'
  });
}

// 获取设备类型
export function equipment() {
  return request({
    url: `${baseApi.API_URL}/v1/register/getEquipment`,
    method: 'get'
  });
}

// 获取疾病类型
export function disease() {
  return request({
    url: `${baseApi.API_URL}/v1/disease/getDisease`,
    method: 'get'
  });
}

// 获取cosmic版本号
export function cosmicVersion() {
  return request({
    url: `${baseApi.API_URL}/v1/register/getCosmicVersion`,
    method: 'get'
  });
}

// 获取文件分析状态
export function analyStatus() {
  return request({
    url: `${baseApi.API_URL}/v1/register/getRegisterDetailAnalysisStatus`,
    method: 'get'
  });
}

// 获取工作小组
export function group(sequenceType) {
  return request({
    url: `${baseApi.API_URL}/v1/dictionary/getGroupName`,
    method: 'get',
    params: {
      sequenceType
    }
  });
}

// 获取所有分析员
export function analyst() {
  return request({
    url: `${baseApi.API_URL}/v1/dictionary/getUserByWork`,
    method: 'get'
  });
}
