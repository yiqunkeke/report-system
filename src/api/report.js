import request from '@/utils/request';
import baseApi from '@/api/base';

// 查询报告模板
export function templateList (
  pageNum,
  pageSize,
  majorId,
  detectionId,
  templateName
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/report/getReportTemplateByPage`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      majorId,
      detectionId,
      templateName
    }
  });
}

// 新增报告模板
export function templateAdd (
  majorId,
  detectionId,
  templateName
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/report/addReportTemplate`,
    method: 'post',
    data: {
      majorId,
      detectionId,
      templateName
    }
  });
}

// 修改报告模板
export function templateEdit (
  id,
  majorId,
  detectionId,
  templateName
  ) {
  return request({
    url: `${baseApi.API_URL}/v1/report/editReportTemplate`,
    method: 'put',
    data: {
      id,
      majorId,
      detectionId,
      templateName
    }
  });
}

// 删除报告模板
export function templateDelete (id) {
  return request({
    url: `${baseApi.API_URL}/v1/report/removeReportTemplate`,
    method: 'delete',
    data: {
      id
    }
  });
}

// 导出报告
export function exportReport (workDetailId, conclusion, needSeal, sealId, reportFileName, reportTemplateId) {
  return request({
    url: `${baseApi.API_URL}/v1/export/T2P`,
    method: 'get',
    params: {
      workDetailId,
      conclusion,
      needSeal,
      sealId,
      reportFileName,
      reportTemplateId
    },
    responseType: 'blob'
  });
}

// 导出分析数据
export function exportAnalysisData (fileName, type, registerId) {
  return request({
    url: `${baseApi.API_URL}/v1/export/analysisData`,
    method: 'get',
    params: {
      fileName, type, registerId
    },
    responseType: 'blob'
  });
}
