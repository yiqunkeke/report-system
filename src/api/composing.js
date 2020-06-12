import request from '@/utils/request';
import baseApi from '@/api/base';

// 获取登记列表
export function composingList (
    pageNum,
    pageSize,
    name,
    registerDateBegin,
    registerDateEnd,
    equipment,
    mBarcode,
    createUser,
    rotation,
    edit,
    operate,
    finish) {
  return request({
    url: `${baseApi.API_URL}/v1/register/getRegister`,
    method: 'get',
    params: {
        pageNum,
        pageSize,
        name,
        registerDateBegin,
        registerDateEnd,
        equipment,
        mBarcode,
        createUser,
        rotation,
        edit,
        operate,
        finish
    }
  });
}

// 新增登记
export function composingAdd (
  boardingDate,
  createDate,
  equipment,
  rotation,
  mBarcode,
  createUser,
  AMP,
  cosmicVersion,
  regionalId,
  details
) {
  return request({
    url: `${baseApi.API_URL}/v1/register/addRegister`,
    method: 'post',
    data: {
      boardingDate,
      createDate,
      equipment,
      rotation,
      mBarcode,
      createUser,
      AMP,
      cosmicVersion,
      regionalId,
      details
    }
  });
}

// 删除
export function composingDelete (userId, mainRegister) {
  return request({
    url: `${baseApi.API_URL}/v1/register/batchRemove`,
    method: 'delete',
    data: {
      userId,
      mainRegister
    }
  });
}

// 批量上机
export function composingOperation (userId, mainRegister) {
  return request({
    url: `${baseApi.API_URL}/v1/register/batchOnLineOperation`,
    method: 'put',
    data: {
      userId,
      mainRegister
    }
  });
}

// 获取登记详情（所有）
export function composingDetail (rmid) {
  return request({
    url: `${baseApi.API_URL}/v1/register/getRegisterInfo`,
    method: 'get',
    params: {
      rmid
    }
  });
}

// 编辑登记
export function composingEdit (
  rmid,
  boardingDate,
  createDate,
  equipment,
  rotation,
  mBarcode,
  createUser,
  AMP,
  cosmicVersion,
  regionalId,
  details
) {
  return request({
    url: `${baseApi.API_URL}/v1/register/editRegister`,
    method: 'put',
    data: {
      rmid,
      boardingDate,
      createDate,
      equipment,
      rotation,
      mBarcode,
      createUser,
      AMP,
      cosmicVersion,
      regionalId,
      details
    }
  });
}

// 批量修改cosmic版本号
export function editCosmicVersion (userId, cosmicVersion, details) {
  return request({
    url: `${baseApi.API_URL}/v1/register/batchEditCosmicVersion`,
    method: 'put',
    data: {
      userId,
      cosmicVersion,
      details
    }
  });
}

// 批量修改疾病
export function editDisease (userId, diseaseId, details) {
  return request({
    url: `${baseApi.API_URL}/v1/register/batchEditDisease`,
    method: 'put',
    data: {
      userId,
      diseaseId,
      details
    }
  });
}

// 批量重新分析
export function reAnalysis (userId, details) {
  return request({
    url: `${baseApi.API_URL}/v1/register/batchReload`,
    method: 'put',
    data: {
      userId,
      details
    }
  });
}
