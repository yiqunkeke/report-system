<template>
  <div>
    <div class="transferWrap">
      <!-- 左侧 -->
      <div class="left">
        <!-- 查询条件 -->
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item
            label="工作小组"
            prop="group"
          >
            <el-select
              v-model="ruleForm.group"
              placeholder="请选择工作小组"
              size="small"
              clearable
              filterable
              value-key="groupName"
              @change="groupChange"
            >
              <el-option
                v-for="item in groupList"
                :key="item.groupId"
                :label="item.groupName"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="寄样日期"
            prop="sendDate"
          >
            <el-date-picker
              v-model="ruleForm.sendDate"
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
          <el-form-item
            label="病人姓名"
            prop="name"
          >
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入病人姓名"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="条码号"
            prop="barcode"
          >
            <el-input
              v-model="ruleForm.barcode"
              placeholder="请输入条码号"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="大Barcode"
            prop="mBarcode"
          >
            <el-input
              v-model="ruleForm.mBarcode"
              placeholder="请输入大Barcode"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="轮次"
            prop="rotation"
          >
            <el-input
              v-model="ruleForm.rotation"
              placeholder="请输入轮次"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
          >
            <el-checkbox-group v-model="ruleForm.status">
              <el-checkbox
                v-for="item in analyStatusList"
                :key="item.key"
                :label="item.value"
              />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="warning"
              size="small"
              :loading="loading"
              icon="el-icon-search"
              @click="handleSearch('ruleForm')"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="tableData"
          max-height="600"
          border
          stripe
          :cell-class-name="cellClass"
          @select="handleSelect"
          @select-all="handleSelect"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            align="center"
          />

          <el-table-column
            prop="acceptDate"
            label="收样日期"
            width="100"
          />

          <el-table-column
            prop="name"
            label="病人姓名"
            width="100"
          />

          <el-table-column
            prop="rotation"
            label="轮次"
            width="90"
          />

          <el-table-column
            property="detectionName"
            label="检测项目"
            width="260"
            :sortable="true"
          />

          <el-table-column
            prop="mBarcode"
            label="大Barcode"
            width="110"
          />

          <el-table-column
            prop="dBarcode"
            label="Barcode"
            width="110"
          />

          <el-table-column
            prop="barcode"
            label="条码号"
            width="110"
          />

          <el-table-column
            label="状态"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <svg-icon :icon-class="statusClass(scope.row.analysisStatus)" />
              {{ scope.row.analysisStatus }}
            </template>
          </el-table-column>
        </el-table>
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
      <!-- 按钮 -->
      <div class="center">
        <el-button
          type="primary"
          size="small"
          plain
          @click="handleAddWork"
        >
          添加到工作中
          <i class="el-icon-arrow-right el-icon--right" />
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-arrow-left"
          plain
          @click="handleBackWork"
        >
          返回至工作池
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="handleUnqualify"
        >
          设置为样本不合格
        </el-button>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item
            label="分析员"
            prop="analyst"
          >
            <el-select
              v-model="form.analyst"
              placeholder="请选择分析员"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in analystList"
                :key="item.userId"
                :label="item.name"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="添加日期"
            prop="workDate"
          >
            <el-date-picker
              v-model="form.workDate"
              value-format="yyyy-MM-dd"
              type="date"
              size="small"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="warning"
              size="small"
              :loading="loading2"
              icon="el-icon-search"
              @click="handleSearch2"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading2"
          :data="tableData2"
          max-height="750"
          border
          stripe
          :cell-class-name="cellClass"
          @select="handleSelect2"
          @select-all="handleSelect2"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            align="center"
          />

          <el-table-column
            prop="workDate"
            label="添加日期"
            width="100"
          />

          <el-table-column
            prop="analystName"
            label="分析员"
            width="100"
          />

          <el-table-column
            prop="orderName"
            label="病人姓名"
            width="100"
          />

          <el-table-column
            prop="rotation"
            label="轮次"
            width="90"
          />

          <el-table-column
            property="detectionName"
            label="检测项目"
            :sortable="true"
          />
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :page-size="pageSize"
            :current-page="pageNum2"
            :total="total2"
            @current-change="handleCurrentChange2"
          />
        </div>
      </div>
      <!-- 样本不合格弹层 -->
      <el-dialog
        top="12%"
        title="请确认不合格的样本"
        :visible.sync="unqualifyVisible"
        width="30%"
        center
      >
        <el-table
          :data="totalUnqualify"
          border
          stripe
          max-height="300"
        >
          <el-table-column
            prop="name"
            label="病人姓名"
            width="100"
          />

          <el-table-column
            prop="rotation"
            label="轮次"
            width="90"
          />

          <el-table-column
            property="detectionName"
            label="检测项目"
            :sortable="true"
          />
        </el-table>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="unqualifyVisible = false"
          >
            取 消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="unqualifyConfirm"
          >
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { unworkList, addWork, workList, backWork, unQualify } from '@/api/work.js';
import { group, analyStatus } from '@/api/public.js';
export default {
  data() {
    return {
      // 查询字段
      ruleForm: {
          name: '',
          barcode: '',
          group: '',
          mBarcode: '',
          rotation: '',
          status: ['报告文件已导入'],
          sendDate: [],
      },
      form: {
        analyst: '',
        workDate: ''
      },
      rules: {
        group: [
          { required: true, message: '请选择工作小组', trigger: 'change' }
        ],
        sendDate: [
          { required: true, message: '请选择寄样日期', trigger: 'change' }
        ],
        analyst: [
          { required: true, message: '请选择分析员', trigger: 'blur' }
        ],
        workDate: [
          { required: true, message: '请选择添加日期', trigger: 'change' }
        ]
      },

      // 下拉列表
      groupList: [],
      analyStatusList: [],
      analystList: [],

      // 工作池
      pageNum: 1,
      pageSize: 20,
      total: null,
      loading: false,
      tableData: [],
      workspaceDetail: [],
      unqualifies: [],

      // 已添加工作
      pageNum2: 1,
      total2: null,
      loading2: false,
      tableData2: [],
      details: [],
      unqualifies2: [],
      unqualifyVisible: false,
      totalUnqualify: []
    };
  },
  computed: {
    ...mapGetters({
      'operationUserId': 'user_id'
    }),
    sendDateBegin() {
        if(this.ruleForm.sendDate && this.ruleForm.sendDate.length!=0) {
          return this.ruleForm.sendDate[0];
        } else {
          return '';
        }
    },
    sendDateEnd() {
        if(this.ruleForm.sendDate && this.ruleForm.sendDate.length!=0) {
          return this.ruleForm.sendDate[1];
        } else {
          return '';
        }
    },
    isOperate() {
      return this.ruleForm.status.includes('未初始化') ? 1: 0;
    },
    isImported() {
      return this.ruleForm.status.includes('报告文件已导入') ? 1: 0;
    },
    isFinish() {
      return this.ruleForm.status.includes('分析完成') ? 1: 0;
    },
    // 状态-svg图标
    statusClass() {
      return function(status) {
        switch (status) {
          case '未初始化':
            return 'edit';
          case '报告文件已导入':
            return 'daitijiao';
          case '分析完成':
            return 'daoda';
          default :
            return '';
        }
      };
    },
    workDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return `${year}-${month}-${day}`;
    }
  },
  mounted() {
    this.getGroup(2);
    this.getAnalyStatus();
    this.$set(this.form, 'workDate', this.workDate);
  },
  methods: {
    // 订单状态class
    cellClass(data) {
      // console.log(data);
      if(data.columnIndex == 8 && data.row.analysisStatus == '未初始化') {
        return 'edit';
      }
      if(data.columnIndex == 8 && data.row.analysisStatus == '报告文件已导入') {
        return 'operate';
      }
      if(data.columnIndex == 8 && data.row.analysisStatus == '分析完成') {
        return 'finish';
      }
    },
    // 获取工作池内容
    getUnworkList() {
      let formName= 'ruleForm';
      this.$refs[formName].validate(async (valid) => {
            if (valid) {
              this.loading = true;
              console.log(this.sendDateBegin,
                this.sendDateEnd);
              let { content, pageTotal } = await unworkList(
                this.pageNum,
                this.pageSize,
                this.ruleForm.name,
                this.sendDateBegin,
                this.sendDateEnd,
                this.ruleForm.mBarcode,
                this.ruleForm.rotation,
                this.isOperate,
                this.isImported,
                this.isFinish,
                this.ruleForm.group.groupId,
                this.ruleForm.barcode
              );
              console.log('unworkList',content, pageTotal);
              this.loading = false;
              this.tableData = content;
              this.total = pageTotal;
            } else {
              console.log('error submit!!');
              return false;
            }
      });
    },
    // 获取已添加工作
    async getWorkList() {
      let formName= 'form';
      this.$refs[formName].validate(async (valid) => {
            if (valid) {
              this.loading2 = true;
              let {content, pageTotal} = await workList(
                this.pageNum2,
                this.pageSize,
                this.form.analyst,
                this.form.workDate
              );
              console.log('workList',content, pageTotal);
              this.loading2 = false;
              this.tableData2 = content;
              this.total2 = pageTotal;
            } else {
              console.log('error submit!!');
              return false;
            }
      });
    },
    // 获取工作小组
    async getGroup(sequenceType) {
      let res = await group(sequenceType);
      this.groupList = res;
    },
    // 获取文件分析状态
    async getAnalyStatus() {
      let res = await analyStatus();
      let arr = [];
      for (let item of res) {
        if(item.key==0 || item.key==501 || item.key==6) {
          arr.push(item);
        }
      }
      this.analyStatusList = arr;
    },
    // 分页
    handleCurrentChange(val){
      this.pageNum = val;
      this.getUnworkList();
    },
    handleCurrentChange2(val) {
      this.pageNum2 = val;
      this.getWorkList();
    },
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getUnworkList();
    },
    handleSearch2() {
      this.pageNum2 = 1;
      this.getWorkList();
    },
    // 选中工作小组
    groupChange(val) {
      this.analystList = [];
      this.$set(this.form, 'analyst', null);
      if(val) {
        this.analystList = val.userList;
      }
    },
    // 选中样本
    handleSelect(selection) {
      this.workspaceDetail = selection.map(item => {
          return {
            registerId: item.registerId,
            orderId: item.orderId,
            diseaseId: item.diseaseId,
            detectionId: item.detectionId,
            name: item.name,
            rotation: item.rotation
          };
      });
      this.unqualifies = selection;  // 左侧不合格样本
    },
    handleSelect2(selection) {
      let arr = selection.map(item => {
          return {
            workDetailId: item.workDetailId,
            registerId: item.registerId
          };
      });
      this.details = arr;
      this.unqualifies2 = selection; // 右侧不合格样本
    },
    // 添加到工作中
    handleAddWork() {
      if(this.workspaceDetail.length==0) {
        this.$message({
          message: '请勾选左侧样本',
          type: 'warning'
        });
        return false;
      }
      let formName= 'form';
      this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let { code, message } = await addWork(
                this.form.analyst,
                this.workspaceDetail
              );
              if(code===200) {
                this.$message({
                  message: message,
                  type: 'success'
                });
                this.getUnworkList();
                this.getWorkList();
                this.workspaceDetail = [];
                this.unqualifies = [];
              } else {
                this.$message.error(message);
              }
            } else {
              console.log('error submit!!');
              return false;
            }
      });
    },
    // 返回至工作池
    async handleBackWork() {
      if(this.details.length==0) {
        this.$message({
          message: '请勾选右侧样本',
          type: 'warning'
        });
        return false;
      }
      let { code, message } = await backWork(
         this.operationUserId,
         this.details
      );
      if(code===200) {
        this.$message({
          message: message,
          type: 'success'
        });
        this.getUnworkList();
        this.getWorkList();
        this.details = [];
        this.unqualifies2 =[];
      } else {
        this.$message.error(message);
      }
    },
    // 样本不合格
    handleUnqualify() {
      let arr = this.unqualifies.map(item => {
        return {
          name: item.name,
          rotation: item.rotation,
          detectionName: item.detectionName,
          workDetailId: item.workDetailId,
          registerId: item.registerId
        };
      });
      let arr2 = this.unqualifies2.map(item => {
        return {
          name: item.orderName,
          rotation: item.rotation,
          detectionName: item.detectionName,
          workDetailId: item.workDetailId,
          registerId: item.registerId
        };
      });
      this.totalUnqualify = arr.concat(arr2);
      console.log(this.totalUnqualify);
      if(this.totalUnqualify.length == 0) {
        this.$message({
          message: '请勾选不合格的样本',
          type: 'warning'
        });
        return false;
      }
      this.unqualifyVisible = true;
    },
    // 确认样本不合格
    async unqualifyConfirm() {
      let arr  = this.totalUnqualify.map(item => {
          return {
             workDetailId: item.workDetailId,
             registerId: item.registerId
          };
      });
      let { code, message } = await unQualify(
         this.operationUserId,
         arr
      );
      if(code===200) {
        this.$message({
          message: message,
          type: 'success'
        });
        this.getUnworkList();
        this.getWorkList();
      } else {
        this.$message.error(message);
      }
      this.unqualifyVisible = false;
      this.totalUnqualify = [];
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/modules/composing.scss';
@import '~@/assets/styles/modules/work.scss';
</style>
