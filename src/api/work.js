import request from '@/utils/request';
import baseApi from '@/api/base';

// 获取工作池内容
export function unworkList (
    pageNum,
    pageSize,
    name,
    sendDateBegin,
    sendDateEnd,
    mBarcode,
    rotation,
    isOperate,
    isImported,
    isFinish,
    groupId,
    barcode) {
  return request({
    url: `${baseApi.API_URL}/v1/work/getWorkPool`,
    method: 'get',
    params: {
        pageNum,
        pageSize,
        name,
        sendDateBegin,
        sendDateEnd,
        mBarcode,
        rotation,
        isOperate,
        isImported,
        isFinish,
        groupId,
        barcode
    }
  });
}

// 人员获取工作
export function addWork (analyst, workspaceDetail) {
return request({
  url: `${baseApi.API_URL}/v1/work/addForUserWorkspace`,
  method: 'post',
  data: {
      analyst,
      workspaceDetail
    }
  });
}

// 获取已添加工作内容
export function workList (pageNum, pageSize, analyst, workDate) {
  return request({
    url: `${baseApi.API_URL}/v1/work/getAssignedWork`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      analyst,
      workDate
    }
  });
}

// 返回工作池
export function backWork (operationUserId, details) {
  return request({
    url: `${baseApi.API_URL}/v1/work/removeWork`,
    method: 'delete',
    data: {
      operationUserId,
      details
    }
  });
}

// 样本不合格（批量）
export function unQualify (operationUserId, details) {
  return request({
    url: `${baseApi.API_URL}/v1/work/reExamination`,
    method: 'put',
    data: {
      operationUserId,
      details
    }
  });
}

// 获取样本不合格
export function unqualifyList (
  pageNum,
  pageSize,
  name,
  rotation,
  equipment,
  mBarcode
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/register/getUnqualified`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      name,
      rotation,
      equipment,
      mBarcode
    }
  });
}

// 返回样本合格（批量）
export function qualify (userId, details) {
  return request({
    url: `${baseApi.API_URL}/v1/register/batchReturnQualified`,
    method: 'put',
    data: {
      userId,
      details
    }
  });
}

// 获取我的工作
export function myWork (
  pageNum,
  pageSize,
  name,
  rotation,
  analyst,
  workDateBegin,
  workDateEnd
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/work/getWorkDetails`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      name,
      rotation,
      analyst,
      workDateBegin,
      workDateEnd
    }
  });
}

// 获取工作列表树
export function workTree (
  analyst,
  date1,
  date2
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/work/getWorkList`,
    method: 'get',
    params: {
      analyst,
      date1,
      date2
    }
  });
}

// 获取工作内容详情
export function workDetail (workDetailId) {
  return request({
    url: `${baseApi.API_URL}/v1/work/getWorkInfo`,
    method: 'get',
    params: {
      workDetailId
    }
  });
}

// 转移工作人
export function workTransfer (operationUserId, receiver, details) {
  return request({
    url: `${baseApi.API_URL}/v1/work/transfer`,
    method: 'put',
    data: {
      operationUserId, receiver, details
    }
  });
}
