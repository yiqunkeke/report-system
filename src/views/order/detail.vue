<template>
  <div>
    <!-- 表格形式 -->
    <template v-if="tableCondition">
      <el-table
        class="table"
        :data="tableData"
        style="width: 100%"
        :cell-class-name="cellClass"
      >
        <el-table-column label="基本信息">
          <el-table-column
            prop="orderNumber"
            label="订单编号"
            width="160"
          />
          <el-table-column
            prop="orderType"
            label="订单类型"
            width="100"
          />
          <el-table-column
            prop="orderDate"
            label="订单日期"
            width="100"
          />
          <el-table-column
            prop="saleName"
            label="业务员"
            width="90"
          />
          <el-table-column
            prop="barcode"
            label="条码号"
            width="130"
          />
          <el-table-column
            property="billingType"
            label="支付类型"
            width="100"
          />
          <el-table-column
            prop="sampleUnitName"
            label="收样单位"
            width="100"
          />
          <el-table-column
            label="订单状态"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <svg-icon :icon-class="statusClass(scope.row.orderStatus)" />
              {{ scope.row.orderStatus }}
            </template>
          </el-table-column>
          <el-table-column
            prop="hospitalName"
            label="医院名称"
            width="250"
          />
          <el-table-column
            prop="deptName"
            label="科室名称"
            width="120"
          />
          <el-table-column
            prop="receiptConfirmation"
            label="财务确认"
            width="80"
          />
          <el-table-column
            prop="courierNumber"
            label="快递号码"
            width="150"
          />
          <el-table-column
            prop="expressComp"
            label="快递公司"
            width="80"
          />
          <el-table-column
            prop="remarks"
            label="备注"
            :show-overflow-tooltip="true"
          />
        </el-table-column>
      </el-table>

      <el-table
        class="table"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="病人信息">
          <el-table-column
            prop="personName"
            label="病人姓名"
            width="160"
          />
          <el-table-column
            prop="personSex"
            label="病人性别"
            width="100"
          />
          <el-table-column
            prop="personAge"
            label="病人年龄"
            width="100"
          />
          <el-table-column
            prop="contactNumber"
            label="联系电话"
            width="120"
          />
          <el-table-column
            prop="clinicalDiagnosis"
            label="临床诊断"
            width="100"
          />
          <el-table-column
            prop="pathologicalNumber"
            label="病理号"
            width="100"
          />
          <el-table-column
            prop="inpatientArea"
            label="病区"
            width="130"
          />
          <el-table-column
            property="inpatientNumber"
            label="住院号"
            width="100"
          />
          <el-table-column
            prop="bedNumber"
            label="床号"
          />
        </el-table-column>
      </el-table>

      <el-table
        class="table"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="样本信息">
          <el-table-column
            prop="sendDate"
            label="寄样日期"
            width="100"
          />
          <el-table-column
            prop="acceptDate"
            label="收样日期"
            width="100"
          />
          <el-table-column
            prop="sampleNumber"
            label="样本号"
            width="160"
          />
          <el-table-column
            prop="sampleType"
            label="样本类型"
            width="160"
          />
          <el-table-column
            prop="sampleStorageMethod"
            label="样本存放"
            width="100"
          />
          <el-table-column
            prop="sampleReturn"
            label="是否返回"
            width="100"
          />
          <el-table-column
            prop="sampleReturnExpressNumber"
            label="快递单号"
            width="100"
          />
          <el-table-column
            prop="contactInformation"
            label="联系方式"
            width="120"
          />
          <el-table-column
            prop="sampleAddressee"
            label="收件地址"
          />
        </el-table-column>
      </el-table>

      <el-table
        class="table"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="检测项目与报告">
          <el-table-column
            label="检测项目"
          >
            <template slot-scope="scope">
              <span
                v-for="item in scope.row.detectionList"
                :key="item.minorItemId"
                class="detectionItem"
              >
                <el-tag size="small">
                  大项：{{ item.majorItem }}
                </el-tag>
                -
                <el-tag
                  size="small"
                  type="warning"
                >
                  小项：{{ item.minorItem }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sequence"
            label="测序类型"
            width="90"
          />
          <el-table-column
            prop="detectionDate"
            label="分析日期"
            width="100"
          />
          <el-table-column
            prop="qualityStatus"
            label="分析状态"
            width="100"
          />
          <el-table-column
            prop="detectionStatus"
            label="检测状态"
            width="100"
          />
          <el-table-column
            prop="reportDate"
            label="报告日期"
            width="100"
          />
          <el-table-column
            prop="reportType"
            label="报告类型"
          />
        </el-table-column>
      </el-table>
    </template>
    <!-- 浮层形式 -->
    <template v-if="popCondition">
      <div class="pop">
        <h4>基本信息</h4>
        <el-row :gutter="10">
          <el-col :span="24">
            <svg-icon icon-class="dot" />医院 / 科室：{{ curOrder.hospitalName }} / {{ curOrder.deptName }}
          </el-col>
          <el-col :span="12">
            <svg-icon icon-class="dot" />订单编号：{{ curOrder.orderNumber }}
          </el-col>
          <el-col :span="12">
            <svg-icon icon-class="dot" />条码号：{{ curOrder.barcode }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />订单类型：{{ curOrder.orderType }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />订单日期：{{ curOrder.orderDate }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />订单状态：<svg-icon :icon-class="statusClass(curOrder.orderStatus)" />{{ curOrder.orderStatus }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />支付类型：{{ curOrder.billingType }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />收样单位：{{ curOrder.sampleUnitName }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />业务员：{{ curOrder.saleName }}
          </el-col>
        </el-row>
        <h4>患者信息</h4>
        <el-row :gutter="10">
          <el-col :span="12">
            <svg-icon icon-class="dot" />患者：{{ curOrder.personName }} / {{ curOrder.personSex }} / {{ curOrder.personAge }} 岁
          </el-col>
          <el-col :span="12">
            <svg-icon icon-class="dot" />联系电话：{{ curOrder.contactNumber }}
          </el-col>
          <el-col
            :span="12"
            class="hilight"
          >
            <svg-icon icon-class="dot" />临床诊断：{{ curOrder.clinicalDiagnosis }}
          </el-col>
        </el-row>
        <h4>住院信息</h4>
        <el-row :gutter="10">
          <el-col :span="6">
            <svg-icon icon-class="dot" />病理号：{{ curOrder.pathologicalNumber }}
          </el-col>
          <el-col :span="6">
            <svg-icon icon-class="dot" />病区：{{ curOrder.inpatientArea }}
          </el-col>
          <el-col :span="6">
            <svg-icon icon-class="dot" />住院号：{{ curOrder.inpatientNumber }}
          </el-col>
          <el-col :span="6">
            <svg-icon icon-class="dot" />床号：{{ curOrder.bedNumber }}
          </el-col>
        </el-row>
        <h4>样本信息</h4>
        <el-row :gutter="10">
          <el-col :span="7">
            <svg-icon icon-class="dot" />样本号：{{ curOrder.sampleNumber }}
          </el-col>
          <el-col :span="9">
            <svg-icon icon-class="dot" />样本类型：{{ curOrder.sampleType }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />存放：{{ curOrder.sampleStorageMethod }}
          </el-col>
          <el-col :span="7">
            <svg-icon icon-class="dot" />返回：{{ curOrder.sampleReturn }}
          </el-col>
          <template v-if="curOrder.sampleReturn=='需要'">
            <el-col :span="8">
              <svg-icon icon-class="dot" />快递单号：{{ curOrder.sampleReturnExpressNumber }}
            </el-col>
            <el-col :span="8">
              <svg-icon icon-class="dot" />联系方式：{{ curOrder.contactInformation }}
            </el-col>
            <el-col :span="24">
              <svg-icon icon-class="dot" />收件地址：{{ curOrder.sampleAddressee }}
            </el-col>
          </template>
          <el-col :span="8">
            <svg-icon icon-class="dot" />寄样日期：{{ curOrder.sendDate }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />收样日期：{{ curOrder.acceptDate }}
          </el-col>
        </el-row>
        <h4>快递信息</h4>
        <el-row :gutter="10">
          <el-col :span="8">
            <svg-icon icon-class="dot" />快递公司：{{ curOrder.expressComp }}
          </el-col>
          <el-col :span="12">
            <svg-icon icon-class="dot" />快递单号：{{ curOrder.courierNumber }}
          </el-col>
        </el-row>
        <h4>检测项目</h4>
        <template v-if="curOrder.detectionList && curOrder.detectionList.length != 0">
          <el-row
            v-for="(it, idx) in curOrder.detectionList"
            :key="idx"
            :gutter="10"
          >
            <el-col :span="12">
              <svg-icon icon-class="dot" />大项：{{ it.majorItem }}
            </el-col>
            <el-col :span="12">
              <svg-icon icon-class="dot" />小项：{{ it.minorItem }}
            </el-col>
          </el-row>
        </template>
        <el-row v-else>
          <el-col :span="24">
            无
          </el-col>
        </el-row>
        <h4>报告信息</h4>
        <el-row :gutter="10">
          <el-col :span="8">
            <svg-icon icon-class="dot" />分析日期：{{ curOrder.detectionDate }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />质检状态：{{ curOrder.qualityStatus }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />检测状态：{{ curOrder.detectionStatus }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />报告日期：{{ curOrder.reportDate }}
          </el-col>
          <el-col
            :span="8"
            class="hilight"
          >
            <svg-icon icon-class="dot" />报告类型：{{ curOrder.reportType }}
          </el-col>
          <el-col :span="8">
            <svg-icon icon-class="dot" />财务确认：{{ curOrder.receiptConfirmation }}
          </el-col>
        </el-row>
        <h4>备注</h4>
        <template v-if="curOrder.remarks">
          <el-row>
            <el-col
              :span="24"
              class="hilight"
            >
              {{ curOrder.remarks }}
            </el-col>
          </el-row>
        </template>
        <el-row v-else>
          <el-col
            :span="24"
            class="hilight"
          >
            无
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
import { orderDetail } from '@/api/order.js';
import { orderMixin } from '@/assets/mixins/orderMixin.js';
export default {
    mixins: [ orderMixin ],
    props: {
      id: {
        type: Number,
        default: null
      },
    },
    data() {
        return {
            orderId: this.$route.query.id,
            tableData: [],
            curOrder: {}
        };
    },
    computed: {
      tableCondition() {
        return this.orderId && this.id == null;
      },
      popCondition() {
        return this.id && (this.orderId == null || this.orderId == undefined);
      }
    },
    watch: {
        id(val) {
            this.getOrderDetail(val);
        }
    },
    mounted() {
        if(this.orderId) {
          this.getOrderDetail(this.orderId);
        }
        if(this.id) {
          this.getOrderDetail(this.id);
        }
    },
    methods: {
        // 获取订单详情
        async getOrderDetail(id) {
            let res = await orderDetail(id);
            console.log(res);
            this.tableData = [res];
            this.curOrder = res;
        }
    }
};
</script>

<style lang="scss">
@import '~@/assets/styles/modules/order.scss';
</style>

