import request from '@/utils/request';
import baseApi from '@/api/base';

// 订单状态
export function orderStatus() {
  return request({
    url: `${baseApi.API_URL}/v1/dictionary/getOrderStatus`,
    method: 'get'
  });
}

// 订单列表
export function orderList (
  pageNum,
  pageSize,
  name,
  barcode,
  hospitalNumber,
  salesmanId,
  sampleNumber,
  clinicalDiagnosis,
  sampleCollectionUnit,
  receiptConfirmation,
  sequenceType,
  status,
  orderDateBegin,
  orderDateEnd,
  receiveDateBegin,
  receiveDateEnd
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/order/getOrderList`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      name,
      barcode,
      hospitalNumber,
      salesmanId,
      sampleNumber,
      clinicalDiagnosis,
      sampleCollectionUnit,
      receiptConfirmation,
      sequenceType,
      status,
      orderDateBegin,
      orderDateEnd,
      receiveDateBegin,
      receiveDateEnd
    }
  });
}

// 订单详情
export function orderDetail (orderId) {
  return request({
    url: `${baseApi.API_URL}/v1/order/getOrderInfo`,
    method: 'get',
    params: {
      orderId
    }
  });
}

// 获取相似订单
export function similarOrder (orderId) {
  return request({
    url: `${baseApi.API_URL}/v1/order/getSimilarOrder`,
    method: 'get',
    params: {
      orderId
    }
  });
}
