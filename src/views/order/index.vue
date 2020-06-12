<template>
  <div>
    <!-- 查询条件 -->
    <el-form :inline="true">
      <el-form-item label="病人姓名">
        <el-input
          v-model="name"
          placeholder="请输入病人姓名"
          size="small"
          clearable
        />
      </el-form-item>
      <el-form-item label="条码号">
        <el-input
          v-model="barcode"
          placeholder="请输入条码号"
          size="small"
          clearable
        />
      </el-form-item>
      <el-form-item label="医院名称">
        <el-select
          v-model="hospitalNumber"
          placeholder="请选择医院"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in hospitals"
            :key="item.id"
            :label="item.hospitalName"
            :value="item.hospitalNumber"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务员">
        <el-select
          v-model="salesmanId"
          placeholder="请选择业务员"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="样本号">
        <el-input
          v-model="sampleNumber"
          size="small"
          clearable
          placeholder="请输入样本号"
        />
      </el-form-item>
      <el-form-item label="临床诊断">
        <el-input
          v-model="clinicalDiagnosis"
          size="small"
          clearable
          placeholder="请输入临床诊断"
        />
      </el-form-item>
      <el-form-item label="收样单位">
        <el-select
          v-model="sampleCollectionUnit"
          placeholder="请选择收样单位"
          size="small"
          clearable
          filterable
          :disabled="disabled"
        >
          <el-option
            v-for="item in sampleUnitList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="财务确认">
        <el-select
          v-model="receiptConfirmation"
          placeholder="请选择"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in cfmStatusList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="测序类型">
        <el-select
          v-model="sequence"
          placeholder="请选择"
          size="small"
          clearable
          filterable
          :disabled="disabled"
        >
          <el-option
            v-for="item in sequenceList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单日期">
        <el-date-picker
          v-model="orderDate"
          type="daterange"
          align="right"
          size="small"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="接收日期">
        <el-date-picker
          v-model="receiveDate"
          type="daterange"
          align="right"
          size="small"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="warning"
          size="small"
          :loading="loading"
          icon="el-icon-search"
          @click="handleSearch"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-tabs
      v-model="status"
      @tab-click="handleSearch"
    >
      <el-tab-pane
        v-for="item in labelList"
        :key="item.key"
        :label="item.value"
        :name="`${item.key}`"
      >
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          :max-height="maxHeight"
          border
          stripe
          tooltip-effect="light"
          :cell-class-name="cellClass"
          :header-cell-class-name="cancelAll"
          @select="handleSelectRow"
        >
          <el-table-column
            v-if="!iSelect"
            label="序号"
            type="index"
            :index="1"
            width="50"
            align="center"
          />

          <el-table-column
            v-if="iSelect"
            fixed="left"
            type="selection"
            width="55"
            align="center"
          />

          <el-table-column
            prop="orderDate"
            label="订单日期"
            width="100"
          />
          <el-table-column
            prop="sendDate"
            label="寄样日期"
            width="100"
          />
          <el-table-column
            prop="acceptDate"
            label="接收日期"
            width="100"
          />
          <el-table-column
            label="订单编号"
            width="160"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="600"
              >
                <div class="pop">
                  <h4>快递信息</h4>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <svg-icon icon-class="dot" />快递公司：{{ scope.row.expressComp }}
                    </el-col>
                    <el-col :span="12">
                      <svg-icon icon-class="dot" />快递单号：{{ scope.row.courierNumber }}
                    </el-col>
                  </el-row>
                  <h4>检测项目</h4>
                  <template v-if="scope.row.detectionList && scope.row.detectionList.length != 0">
                    <el-row
                      v-for="(it, idx) in scope.row.detectionList"
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
                      <svg-icon icon-class="dot" />分析日期：{{ scope.row.detectionDate }}
                    </el-col>
                    <el-col :span="8">
                      <svg-icon icon-class="dot" />质检状态：{{ scope.row.qualityStatus }}
                    </el-col>
                    <el-col :span="8">
                      <svg-icon icon-class="dot" />检测状态：{{ scope.row.detectionStatus }}
                    </el-col>
                    <el-col :span="8">
                      <svg-icon icon-class="dot" />报告日期：{{ scope.row.reportDate }}
                    </el-col>
                    <el-col :span="8">
                      <svg-icon icon-class="dot" />报告类型：{{ scope.row.reportType }}
                    </el-col>
                  </el-row>
                </div>
                <el-link
                  slot="reference"
                  type="primary"
                  title="查看更多"
                  @click="handleDetail(scope.row)"
                >
                  {{ scope.row.orderNumber }}<i class="el-icon-view el-icon--right" />
                </el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="barcode"
            label="条码号"
            width="130"
          />
          <el-table-column
            label="病人姓名"
            width="90"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                trigger="hover"
                width="600"
              >
                <div class="pop">
                  <h4>患者信息</h4>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <svg-icon icon-class="dot" />患者：{{ scope.row.personName }} / {{ scope.row.personSex }} / {{ scope.row.personAge }} 岁
                    </el-col>
                    <el-col :span="12">
                      <svg-icon icon-class="dot" />联系电话：{{ scope.row.contactNumber }}
                    </el-col>
                    <el-col :span="12">
                      <svg-icon icon-class="dot" />临床诊断：{{ scope.row.clinicalDiagnosis }}
                    </el-col>
                  </el-row>
                  <h4>住院信息</h4>
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <svg-icon icon-class="dot" />病理号：{{ scope.row.pathologicalNumber }}
                    </el-col>
                    <el-col :span="6">
                      <svg-icon icon-class="dot" />病区：{{ scope.row.inpatientArea }}
                    </el-col>
                    <el-col :span="6">
                      <svg-icon icon-class="dot" />住院号：{{ scope.row.inpatientNumber }}
                    </el-col>
                    <el-col :span="6">
                      <svg-icon icon-class="dot" />床号：{{ scope.row.bedNumber }}
                    </el-col>
                  </el-row>
                  <h4>样本信息</h4>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <svg-icon icon-class="dot" />样本号：{{ scope.row.sampleNumber }}
                    </el-col>
                    <el-col :span="9">
                      <svg-icon icon-class="dot" />样本类型：{{ scope.row.sampleType }}
                    </el-col>
                    <el-col :span="8">
                      <svg-icon icon-class="dot" />存放：{{ scope.row.sampleStorageMethod }}
                    </el-col>
                    <el-col :span="7">
                      <svg-icon icon-class="dot" />返回：{{ scope.row.sampleReturn }}
                    </el-col>
                    <template v-if="scope.row.sampleReturn=='需要'">
                      <el-col :span="8">
                        <svg-icon icon-class="dot" />快递单号：{{ scope.row.sampleReturnExpressNumber }}
                      </el-col>
                      <el-col :span="8">
                        <svg-icon icon-class="dot" />联系方式：{{ scope.row.contactInformation }}
                      </el-col>
                      <el-col :span="24">
                        <svg-icon icon-class="dot" />收件地址：{{ scope.row.sampleAddressee }}
                      </el-col>
                    </template>
                  </el-row>
                </div>
                <el-link
                  slot="reference"
                  type="primary"
                  :underline="false"
                >
                  {{ scope.row.personName }}
                </el-link>
              </el-popover>
            </template>
          </el-table-column>
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
            property="billingType"
            label="支付类型"
            width="100"
          />
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
            prop="saleName"
            label="业务员"
            width="80"
          />
          <el-table-column
            prop="sampleUnitName"
            label="收样单位"
            width="100"
          />
          <el-table-column
            prop="orderType"
            label="订单类型"
            width="80"
          />
          <el-table-column
            prop="sequence"
            label="测序类型"
            width="90"
          />
          <el-table-column
            prop="receiptConfirmation"
            label="财务确认"
            width="80"
          />
          <el-table-column
            prop="remarks"
            label="备注"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { sequenceType, confirmStatus, hospitalList, sampleUnit } from '@/api/public.js';
import { activeUser } from '@/api/user.js';
import { orderStatus, orderList } from '@/api/order.js';
import { orderMixin } from '@/assets/mixins/orderMixin.js';
  export default {
    mixins: [ orderMixin ],
    props: {
      maxHeight: {
        type: Number,
        default: 650
      },
      iSelect: {
        type: Boolean,
        default: false
      },
      seq: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        // 查询字段
        name: '',
        barcode: '',
        hospitalNumber: '',
        salesmanId: '',
        sampleNumber: '',
        clinicalDiagnosis: '',
        sampleCollectionUnit: '',
        receiptConfirmation: '',
        sequence: '',
        status: '-1',
        orderDate: [],
        receiveDate: [],

        labelList: [],
        userList:[],
        sequenceList: [],
        cfmStatusList: [],
        hospitals: [],
        sampleUnitList: [],

        // 表格
        tableData: [],

        // 分页
        pageNum: 1,
        pageSize: 20,
        total: null,

        loading: false,
        radio: null,
        disabled: false
      };
    },
    computed: {
      ...mapGetters('composing', {
        'sampleUnit': 'sampleUnit'
      }),
      orderDateBegin() {
        if(this.orderDate && this.orderDate.length!=0) {
          return this.orderDate[0];
        } else {
          return '';
        }
      },
      orderDateEnd() {
        if(this.orderDate && this.orderDate.length!=0) {
          return this.orderDate[1];
        } else {
          return '';
        }
      },
      receiveDateBegin() {
        if(this.receiveDate && this.receiveDate.length!=0) {
          return this.receiveDate[0];
        } else {
          return '';
        }
      },
      receiveDateEnd() {
        if(this.receiveDate && this.receiveDate.length!=0) {
          return this.receiveDate[1];
        } else {
          return '';
        }
      }
    },
    watch: {
      sampleUnit: {
        handler(val) {
          if(val != null) {
            this.sampleCollectionUnit = val;
            this.handleSearch();
            this.disabled = true;
          }
        },
        immediate: true
      }
    },
    mounted() {
      this.getOrderStatus();
      this.getActiveUser();
      this.getSequenceType();
      this.getConfirmStatus();
      this.getHospitalList();
      this.getSampleUnit();
      // 二代测序登记-添加订单
      if(this.seq == 2) {
        this.sequence = 2;
        this.disabled = true;
      }
      this.getOrderPage();
    },
    methods: {
      ...mapActions('composing', ['orderAction', 'visibleAction']),
      // 获取订单状态
      async getOrderStatus() {
        let res = await orderStatus();
        res.unshift({
          key: '-1',
          value: '全部'
        });
        this.labelList = res;
      },
      // 获取活跃用户
      async getActiveUser() {
        let res = await activeUser();
        this.userList = res;
      },
      // 获取测序类型
      async getSequenceType() {
        let res = await sequenceType();
        this.sequenceList = res;
      },
      // 获取财务确认状态
      async getConfirmStatus() {
        let res = await confirmStatus();
        this.cfmStatusList = res;
      },
      // 获取医院列表
      async getHospitalList() {
        let res = await hospitalList();
        this.hospitals = res;
      },
      // 获取收样单位
      async getSampleUnit() {
        let res = await sampleUnit();
        this.sampleUnitList = res;
      },
      // 获取订单分页
      async getOrderPage() {
        this.loading = true;
        let status = this.status =='-1' ? null: this.status;
        let { content, pageTotal } = await orderList(
          this.pageNum,
          this.pageSize,
          this.name,
          this.barcode,
          this.hospitalNumber,
          this.salesmanId,
          this.sampleNumber,
          this.clinicalDiagnosis,
          this.sampleCollectionUnit,
          this.receiptConfirmation,
          this.sequence,
          status,
          this.orderDateBegin,
          this.orderDateEnd,
          this.receiveDateBegin,
          this.receiveDateEnd
          );
        this.loading = false;
        this.tableData = content;
        this.total = pageTotal;
      },
      // 分页
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getOrderPage();
      },
      // 查询
      handleSearch() {
        this.pageNum = 1;
        this.getOrderPage();
      },
      // 取消全选功能
      cancelAll({ columnIndex }) {
        if (columnIndex === 0 && this.iSelect == true) {
          return 'disabledSelection';
        }
      },
      // 选中行
      handleSelectRow(selection, row) {
        for(let tab of this.$refs.table) {
          tab.clearSelection();
        }
        this.orderAction(row);
        this.visibleAction(false);
      },
      // 订单详情
      handleDetail(row) {
        // console.log(row.id);
        this.$router.push({
          path: '/order/detail',
          query: {
            id: row.id
          }
        });
      }
    }
  };

</script>

<style lang="scss">
@import '~@/assets/styles/modules/order.scss';
</style>
