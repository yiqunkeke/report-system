<template>
  <div>
    <el-table
      v-loading="loading"
      class="table"
      :data="tableData"
      border
      stripe
    >
      <el-table-column
        prop="personName"
        label="病人姓名"
        width="100"
      />
      <el-table-column
        prop="personSex"
        label="性别"
        width="60"
      >
        <template slot-scope="scope">
          {{ scope.row.personSex == 1 ? '男': scope.row.personSex == 2 ? '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="personAge"
        label="年龄"
        width="60"
      />
      <el-table-column
        prop="clinicalDiagnosis"
        label="临床诊断"
        width="100"
      />
      <el-table-column
        prop="hospitalName"
        label="送检医院"
        width="180"
      />
      <el-table-column
        prop="deptName"
        label="科室"
        width="100"
      />
      <el-table-column
        prop="detectionNames"
        label="检测项目"
        width="200"
      />
      <el-table-column
        prop="reportConclusion"
        label="报告结论"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.reportConclusion }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.reportConclusion }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="reportDate"
        label="报告日期"
        width="120"
      />
      <el-table-column
        prop="sendDate"
        label="寄样日期"
        width="120"
      />
      <el-table-column
        prop="acceptDate"
        label="收样日期"
        width="120"
      />
      <el-table-column
        prop="barcode"
        label="条码号"
        width="100"
      />
      <el-table-column
        prop="reportName"
        label="报告名称"
      />
    </el-table>
  </div>
</template>

<script>
import { similarOrder } from '@/api/order.js';
export default {
    props: {
        id: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            tableData: [], // 相似订单
            loading: false
        };
    },
    watch: {
        id(val) {
            this.getSimilarOrder(val);
        }
    },
    methods: {
        // 获取相似订单
        async getSimilarOrder(orderId) {
          this.loading = true;
          let res = await similarOrder(orderId);
          this.loading = false;
          this.tableData = res;
          console.log('similar-order', res);
        }
    }
};
</script>

<style>

</style>
