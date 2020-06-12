<template>
  <div>
    <!-- 查询条件 -->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="ruleForm"
    >
      <el-form-item
        label="添加日期"
      >
        <el-date-picker
          v-model="ruleForm.workDate"
          type="daterange"
          align="right"
          size="small"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="病人姓名">
        <el-input
          v-model="ruleForm.name"
          size="small"
          placeholder="请输入病人姓名"
          clearable
        />
      </el-form-item>

      <el-form-item label="轮次">
        <el-input
          v-model="ruleForm.rotation"
          size="small"
          clearable
          placeholder="请输入轮次"
        />
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
      <el-form-item style="float:right">
        <el-button
          type="primary"
          size="small"
          @click="handleBtn(0)"
        >
          <svg-icon
            icon-class="analysis"
            style="margin-right:5px"
          />
          重新分析
        </el-button>
        <el-button
          type="success"
          size="small"
          plain
          icon="el-icon-edit"
          @click="handleBtn(1)"
        >
          修改疾病类型
        </el-button>
        <el-button
          type="warning"
          size="small"
          plain
          icon="el-icon-edit"
          @click="handleBtn(2)"
        >
          修改Cosmic版本
        </el-button>
        <el-button
          size="small"
          plain
          icon="el-icon-connection"
          @click="handleBtn(3)"
        >
          转移工作
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      max-height="750"
      class="table"
      :cell-class-name="cellClass"
      @select="handleSelect"
      @select-all="handleSelect"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        prop="orderName"
        label="病人姓名"
        width="80"
      />
      <el-table-column
        prop="analystName"
        label="分析员"
        width="80"
      />
      <el-table-column
        prop="workDate"
        label="添加日期"
        width="100"
      />
      <el-table-column
        prop="detectionName"
        label="检测项目"
        width="300"
      />
      <el-table-column
        label="文件分析状态"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="statusClass(scope.row.analyStatus)" />
          {{ scope.row.analyStatus }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rotation"
        label="轮次"
        width="130"
      />
      <el-table-column
        prop="equipment"
        label="设备类型"
        width="100"
      />
      <el-table-column
        prop="barcode"
        label="大Barcode"
        width="120"
      />
      <el-table-column
        prop="newPreprocessling"
        label="分析状态"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="type(scope.row.newPreprocessling)"
            size="small"
          >
            {{ scope.row.newPreprocessling == 1 ? "已分析" : "未分析" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="clinicalDiagnosis"
        label="临床诊断"
        width="200"
      />
      <el-table-column
        prop="diseaseName"
        label="疾病"
        width="120"
      />
      <el-table-column
        prop="cosmicVersion"
        label="cosmic版本号"
      />
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <div class="btnWrap" />
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 样本弹层 -->
    <el-dialog
      top="12%"
      title="请确认勾选的样本"
      :visible.sync="visible"
      width="30%"
      center
    >
      <!-- 勾选的样本 -->
      <el-table
        :data="selection"
        border
        stripe
        max-height="300"
      >
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
      <!-- 修改疾病 -->
      <div v-if="btnFlag===1">
        <el-form
          ref="form"
          class="mgt15"
          :model="form"
          :rules="rules"
        >
          <el-form-item
            label="疾病大类"
            prop="disease"
          >
            <el-select
              v-model="form.disease"
              placeholder="请选择疾病大类"
              size="small"
              clearable
              filterable
              value-key="value"
              @change="diseaseChange"
            >
              <el-option
                v-for="item in diseaseList"
                :key="item.key"
                :label="item.value"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="疾病小类"
            prop="disease"
          >
            <el-select
              v-model="form.diseaseId"
              placeholder="请选择疾病小类"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in diseaseMinorList"
                :key="item.diseaseId"
                :label="item.diseaseName"
                :value="item.diseaseId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 修改cosmic版本号 -->
      <div v-if="btnFlag===2">
        <el-form
          ref="form2"
          class="mgt15"
          :model="form2"
          :rules="rules"
        >
          <el-form-item
            label="cosmic版本号"
            prop="cosmicVersion"
          >
            <el-select
              v-model="form2.cosmicVersion"
              placeholder="请选择cosmic版本号"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in cosmicVersionList"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 转移工作 -->
      <div v-if="btnFlag===3">
        <el-form
          ref="form3"
          class="mgt15"
          :model="form3"
          :rules="rules"
        >
          <el-form-item
            label="转移至"
            prop="receiver"
          >
            <el-select
              v-model="form3.receiver"
              placeholder="请选择转移至用户"
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
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="visible = false"
        >
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleConfirm"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { myWork, workTransfer } from '@/api/work';
import { reAnalysis, editCosmicVersion, editDisease } from '@/api/composing';
import { disease, cosmicVersion } from '@/api/public';
import { activeUser } from '@/api/user';
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        rotation: '',
        workDate: '',
      },
      form: {
        disease: '',
        diseaseId: ''
      },
      form2: {
        cosmicVersion: '',
      },
      form3: {
        receiver: '',
      },
      rules: {
        disease: [
          { required: true, message: '请选择疾病大类', trigger: 'blur' }
        ],
        diseaseId: [
          { required: true, message: '请选择疾病小类', trigger: 'blur' }
        ],
        cosmicVersion: [
          { required: true, message: '请选择cosmic版本号', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '请选择接收人', trigger: 'blur' }
        ]
      },
      pageNum: 1,
      pageSize: 20,
      total: null,
      loading: false,
      tableData: [],
      selection: [],
      details: [],
      visible: false,
      btnFlag: 0,
      diseaseList: [],
      diseaseMinorList: [],
      cosmicVersionList: [],
      userList: []
    };
  },
  computed: {
    ...mapGetters({
      'analyst': 'user_id'
    }),
    workDateBegin() {
        if(this.ruleForm.workDate && this.ruleForm.workDate.length!=0) {
          return this.ruleForm.workDate[0];
        } else {
          return '';
        }
    },
    workDateEnd() {
        if(this.ruleForm.workDate && this.ruleForm.workDate.length!=0) {
          return this.ruleForm.workDate[1];
        } else {
          return '';
        }
    },
    // 文件分析状态-svg图标
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
    // 分析状态
    type(){
      return function(newPreprocessling) {
        return newPreprocessling == 1 ? 'success' : 'info';
      };
    }
  },
  mounted() {
    this.getMyWork();
  },
  methods: {
    // 订单状态class
    cellClass(data) {
      // console.log(data);
      if(data.columnIndex == 5 && data.row.analyStatus == '未初始化') {
        return 'edit';
      }
      if(data.columnIndex == 5 && data.row.analyStatus == '报告文件已导入') {
        return 'operate';
      }
      if(data.columnIndex == 5 && data.row.analyStatus == '分析完成') {
        return 'finish';
      }
    },
    // 获取我的工作
    async getMyWork() {
      let formName= 'ruleForm';
      this.$refs[formName].validate(async (valid) => {
            if (valid) {
              this.loading = true;
              console.log('pageNum,pageSize', this.pageNum,
                  this.pageSize);
              console.log('analyst', this.analyst);
              console.log('workDateBegin', this.workDateBegin);
              console.log('workDateEnd', this.workDateEnd);
              let { content, pageTotal } = await myWork(
                  this.pageNum,
                  this.pageSize,
                  this.ruleForm.name,
                  this.ruleForm.rotation,
                  this.analyst,
                  // 181,
                  this.workDateBegin,
                  this.workDateEnd
              );
              console.log('mywork',content, pageTotal);
              this.loading = false;
              this.tableData = content;
              this.total = pageTotal;
            } else {
              console.log('error submit!!');
              return false;
            }
      });
    },
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getMyWork();
    },
    // 分页
    handleCurrentChange (val){
      this.pageNum = val;
      this.getMyWork();
    },
    // 选中样本
    handleSelect(selection) {
      this.selection = selection;
    },
    // 获取疾病类型
    async getDisease() {
      let res = await disease();
      this.diseaseList = res;
    },
    // 选中疾病大类
    diseaseChange(val) {
      this.$set(this.form, 'diseaseId', null);
      this.diseaseMinorList = val.content;
    },
    // 获取cosmic版本号
    async getCosmicVersion() {
      let res = await cosmicVersion();
      this.cosmicVersionList = res;
    },
    // 获取活跃用户
    async getActiveUser() {
      let res = await activeUser();
      this.userList = res;
      console.log('user', res);
    },
    // 重新分析 / 修改疾病类型 / 修改cosmic版本号 / 转移工作
    handleBtn(val) {
      this.btnFlag = val;
      if(this.selection.length == 0) {
        this.$message({
          message: '请勾选样本',
          type: 'warning'
        });
        return false;
      }
      if(val == 1) {
        this.getDisease();
      }
      if(val == 2) {
        this.getCosmicVersion();
      }
      if(val == 3) {
        this.getActiveUser();
      }
      this.visible = true;
      // console.log(this.selection);
    },
    // 弹窗确认提交
    async handleConfirm() {
      // console.log('details',this.details);
      this.details = this.selection.map(item => {
          return {
            registerId: item.registerId,
            workDetailId: item.workDetailId
          };
      });
      // 重新分析
      if(this.btnFlag === 0) {
        let { code, message } = await reAnalysis(
            this.analyst,
            // 181,
            this.details
        );
        if(code===200) {
          this.$message({
            message: message,
            type: 'success'
          });
          this.getMyWork();
          this.visible = false;
          this.selection = [];
        } else {
          this.$message.error(message);
        }
      }
      // 修改疾病类型
      if(this.btnFlag === 1) {
        let formName= 'form';
        this.$refs[formName].validate(async (valid) => {
              if (valid) {
                let { code, message } = await editDisease(
                    this.analyst,
                    // 181,
                    this.form.diseaseId,
                    this.details
                );
                if(code===200) {
                  this.$message({
                    message: message,
                    type: 'success'
                  });
                  this.getMyWork();
                  this.visible = false;
                  this.selection = [];
                  this.$set(this.form, 'disease', '');
                  this.$set(this.form, 'diseaseId', '');
                } else {
                  this.$message.error(message);
                }
              } else {
                console.log('error submit!!');
                return false;
              }
        });
      }
      // 修改cosmic版本号
      if(this.btnFlag === 2) {
        let formName= 'form2';
        this.$refs[formName].validate(async (valid) => {
              if (valid) {
                let { code, message } = await editCosmicVersion(
                    this.analyst,
                    // 181,
                    this.form2.cosmicVersion,
                    this.details
                );
                if(code===200) {
                  this.$message({
                    message: message,
                    type: 'success'
                  });
                  this.getMyWork();
                  this.visible = false;
                  this.selection = [];
                  this.$set(this.form2, 'cosmicVersion', '');
                } else {
                  this.$message.error(message);
                }
              } else {
                console.log('error submit!!');
                return false;
              }
        });
      }
      // 转移工作
      if(this.btnFlag === 3) {
        let formName= 'form3';
        this.$refs[formName].validate(async (valid) => {
              if (valid) {
                let { code, message } = await workTransfer(
                    this.analyst,
                    // 181,
                    this.form3.receiver	,
                    this.details
                );
                if(code===200) {
                  this.$message({
                    message: message,
                    type: 'success'
                  });
                  this.getMyWork();
                  this.visible = false;
                  this.selection = [];
                  this.$set(this.form3, 'receiver', '');
                } else {
                  this.$message.error(message);
                }
              } else {
                console.log('error submit!!');
                return false;
              }
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/modules/composing.scss';
</style>
