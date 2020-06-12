<template>
  <div>
    <div class="top">
      <el-button
        type="warning"
        size="small"
        icon="el-icon-notebook-2"
        @click="drawer = true"
      >
        选择样本
      </el-button>
      <div
        v-if="work"
        class="base"
      >
        <p>
          <span>Excel名称：</span>
          <el-tag
            type="info"
            effect="plain"
          >
            {{ work.excelName }}
          </el-tag>
        </p>
        <p>
          <span>疾病：</span>
          <el-tag
            type="info"
            effect="plain"
          >
            {{ work.diseaseName }}
          </el-tag>
        </p>
        <el-popover
          placement="top-start"
          trigger="hover"
          width="600"
        >
          <orderDetail :id="work.orderId" />
          <el-button
            slot="reference"
            type="success"
            size="small"
            plain
          >
            当前订单
          </el-button>
        </el-popover>
      </div>
    </div>

    <!-- tab -->
    <el-tabs v-model="status">
      <el-tab-pane
        key="similarOrder"
        label="历史订单"
        name="similarOrder"
      >
        <similar :id="work.orderId" />
      </el-tab-pane>
      <el-tab-pane
        key="analysis"
        label="分析数据"
        name="analysis"
      >
        <analysis
          :register-id="work.registerId"
          :excel-name="work.excelName"
        />
      </el-tab-pane>
      <el-tab-pane
        key="conclusion"
        label="结论意义"
        name="conclusion"
      >
        <conclusion :register-id="work.registerId" />
      </el-tab-pane>
      <el-tab-pane
        key="export"
        label="导出报告"
        name="export"
      >
        <exportReport
          :sumary="work.reportConclusion"
          :work-detail-id="work.workDetailId"
          :work-name="work.workName"
          :report-template-list="work.reportTemplateList"
        />
      </el-tab-pane>
      <el-tab-pane
        key="send"
        label="发送报告"
        name="send"
      >
        <send :id="work.orderId" />
      </el-tab-pane>
    </el-tabs>
    <!-- drawer  -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
    >
      <div class="pad">
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item
            label="分析员"
            prop="analyst"
          >
            <el-select
              v-model="ruleForm.analyst"
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
          <el-form-item>
            <el-button
              type="warning"
              size="small"
              :loading="loading"
              icon="el-icon-search"
              @click="getWorkTree"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <el-tree
          class="mgt15"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyst } from '@/api/public.js';
import { workTree, workDetail } from '@/api/work.js';
import orderDetail from '@/views/order/detail';
import similar from './similarOrder';
import analysis from './analysis';
import conclusion from './conclusion';
import exportReport from './export';
import send from './send';
export default {
    components: {
      orderDetail,
      similar,
      analysis,
      conclusion,
      exportReport,
      send
    },
    data() {
        return {
            ruleForm: {
                analyst: '',
                workDate: ''
            },
            rules: {
                analyst: [
                    { required: true, message: '请选择分析员', trigger: 'blur' }
                ],
                workDate: [
                    { required: true, message: '请选择添加日期', trigger: 'change' }
                ]
            },
            loading: false,
            drawer: false,
            direction: 'ltr',
            treeData: [],
            defaultProps: {
                children: 'details',
                label: 'content'
            },
            status: 'similarOrder',
            analystList: [], // 分析员
            work: '' // 工作详情
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
        }
    },
    mounted() {
        this.getAnalyst();
        this.$set(this.ruleForm, 'analyst', this.analyst);
    },
    methods: {
        // 获取所有分析员
        async getAnalyst() {
            let res = await analyst();
            this.analystList = res;
        },
        // 获取工作树列表
        async getWorkTree() {
            let formName= 'ruleForm';
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    let res = await workTree(this.ruleForm.analyst, this.workDateBegin, this.workDateEnd);
                    console.log('workTree', res);
                    this.loading = false;
                    this.treeData = res;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 树节点
        handleNodeClick(obj) {
            if(obj.workDetailId) {
              this.drawer = false;
              this.getWorkDetail(obj.workDetailId);
            }
        },
        // 获取工作详情
        async getWorkDetail(id) {
          let res = await workDetail(id);
          this.work = res;
          console.log('work-detail', this.work);
        }
    }
};
</script>

<style lang="scss">
@import '~@/assets/styles/modules/analysis.scss';
</style>

