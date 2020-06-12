<template>
  <div>
    <!-- 查询条件 / 操作按钮 -->
    <el-form :inline="true">
      <el-form-item style="margin-right:40px">
        <el-radio-group
          v-model="conclusions"
          @change="getAnalysList"
        >
          <el-radio label="SNP">
            SNP
          </el-radio>
          <el-radio label="突变型">
            突变型
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group
          v-model="state"
          @change="handleStateChange"
        >
          <el-checkbox label="舍弃" />
          <el-checkbox label="选中" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="float:right">
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
          style="margin-right:10px;"
        >
          <el-radio-group
            v-model="type"
            @change="handleExportData"
          >
            <el-radio label="0">
              所有
            </el-radio>
            <el-radio label="1">
              突变型
            </el-radio>
          </el-radio-group>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            icon="el-icon-download"
          >
            导出分析数据
          </el-button>
        </el-popover>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-close"
          plain
          @click="handleBtn(0)"
        >
          舍弃
        </el-button>
        <el-button
          type="success"
          size="mini"
          icon="el-icon-check"
          plain
          @click="handleBtn(1)"
        >
          选中
        </el-button>
        <el-button
          type="warning"
          size="mini"
          plain
          icon="el-icon-paperclip"
          @click="handleExtra"
        >
          获取额外数据
        </el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          icon="el-icon-plus"
          @click="handleInsert"
        >
          插入FLT3
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      class="table"
      max-height="680px"
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
        prop="cosmicSiteName"
        label="意义位置标注"
        sortable
        width="140"
      />
      <el-table-column
        prop="statusName"
        label="状态"
        sortable
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="statusClass(scope.row.statusName)" />
          {{ scope.row.statusName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="container"
        label="匹配公式"
        width="110"
      />
      <el-table-column
        prop="conclusions"
        label="结论"
        width="100"
      />
      <el-table-column
        prop="chr"
        label="Chr"
        width="60"
      />
      <el-table-column
        prop="start"
        label="Start"
        width="100"
      />
      <el-table-column
        prop="end"
        label="End"
        width="100"
      />
      <el-table-column
        prop="ref"
        label="Ref"
        width="60"
      />
      <el-table-column
        prop="alt"
        label="Alt"
        width="70"
      />
      <el-table-column
        prop="funcRefGene"
        label="funcRefGene"
        width="120"
      />
      <el-table-column
        prop="geneRefGene"
        label="GeneRefGene"
        width="120"
      />
      <el-table-column
        prop="exonicFuncRefGene"
        label="ExonicFunc.RefGene"
        width="180"
      />
      <el-table-column
        prop="aaChangeRefGene"
        label="aaChangeRefGene"
        width="95"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="450"
          >
            <div class="pop">
              <el-row :gutter="10">
                <el-col :span="24">
                  <svg-icon icon-class="dot" />GeneRefGene：{{ scope.row.geneRefGene }}
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <svg-icon icon-class="dot" />Chr：{{ scope.row.chr }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />Start：{{ scope.row.start }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />End：{{ scope.row.end }}
                </el-col>
                <el-col :span="6">
                  <svg-icon icon-class="dot" />Ref：{{ scope.row.ref }}
                </el-col>
                <el-col :span="6">
                  <svg-icon icon-class="dot" />Alt：{{ scope.row.alt }}
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <svg-icon icon-class="dot" />aaChangeRefGene：{{ scope.row.aaChangeRefGene }}
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <svg-icon icon-class="dot" />ExonicFunc.RefGene：{{ scope.row.exonicFuncRefGene }}
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <svg-icon icon-class="dot" />snp138：{{ scope.row.snp138 }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />Depth：{{ scope.row.depth }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />Mutation.ratio：{{ scope.row.mutationRatioA }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />1000g2015aug_all：{{ scope.row.thousandG2015augAll }}
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <svg-icon icon-class="dot" />cosmic83：{{ scope.row.cosmic77 }}
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col
                  :span="12"
                  class="hilight"
                >
                  <svg-icon icon-class="dot" />ExAC_ALL：{{ scope.row.exACALL }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />ExAC_AFR：{{ scope.row.exACAFR }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />ExAC_AMR：{{ scope.row.exACAMR }}
                </el-col>
                <el-col
                  :span="12"
                  class="hilight"
                >
                  <svg-icon icon-class="dot" />ExAC_EAS：{{ scope.row.exACEAS }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />ExAC_FIN：{{ scope.row.exACFIN }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />ExAC_NFE：{{ scope.row.exACNFE }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />ExAC_OTH：{{ scope.row.exACOTH }}
                </el-col>
                <el-col :span="12">
                  <svg-icon icon-class="dot" />ExAC_SAS：{{ scope.row.exACSAS }}
                </el-col>
              </el-row>
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.aaChangeRefGene }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="snp138"
        label="snp138"
        width="110"
      />
      <el-table-column
        prop="depth"
        label="Depth"
        width="100"
      />
      <el-table-column
        prop="mutationRatioA"
        label="Mutation.ratio"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.mutationRatioA }}
        </template>
      </el-table-column>
      <el-table-column
        prop="thousandG2015augAll"
        label="1000g2015aug_all"
        width="160"
      />
      <el-table-column
        prop="cosmic77"
        label="cosmic83"
        width="100"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.cosmic77 }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.cosmic77 }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="clndsdbid"
        label="CLNDSDBID"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.clndsdbid }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.clndsdbid }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="clndbn"
        label="CLNDBN"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.clndbn }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.clndbn }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="clnacc"
        label="CLNACC"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.clnacc }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.clnacc }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="clndsdb"
        label="CLNDSDB"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.clndsdb }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.clndsdb }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="clinsig"
        label="CLINSIG"
        width="120"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            width="400"
          >
            <div class="pop">
              {{ scope.row.clinsig }}
            </div>
            <el-link
              slot="reference"
              type="primary"
              :underline="false"
              title="完整信息"
            >
              {{ scope.row.clinsig }}
            </el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="siftScore"
        label="SIFT_score"
        width="100"
      />
      <el-table-column
        prop="siftPred"
        label="SIFT_pred"
        width="100"
      />
      <el-table-column
        prop="polyphen2HDIVScore"
        label="Polyphen2_HDIV_score"
        width="100"
      />
      <el-table-column
        prop="polyphen2HDIVPred"
        label="Polyphen2_HDIV_pred"
        width="100"
      />
      <el-table-column
        prop="polyphen2HVARScore"
        label="Polyphen2_HVAR_score"
        width="110"
      />
      <el-table-column
        prop="polyphen2HVARPred"
        label="Polyphen2_HVAR_pred"
        width="100"
      />
      <el-table-column
        prop="lrtScore"
        label="LRT_score"
        width="100"
      />
      <el-table-column
        prop="lrtPred"
        label="LRT_pred"
        width="100"
      />
      <el-table-column
        prop="mutationTasterScore"
        label="MutationTaster_score"
        width="100"
      />
      <el-table-column
        prop="mutationTasterPred"
        label="MutationTaster_pred"
        width="100"
      />
      <el-table-column
        prop="mutationAssessorScore"
        label="MutationAssessor_score"
        width="110"
      />
      <el-table-column
        prop="mutationAssessorPred"
        label="MutationAssessor_pred"
        width="110"
      />
      <el-table-column
        prop="fathmmScore"
        label="FATHMM_score"
        width="100"
      />
      <el-table-column
        prop="fathmmPred"
        label="FATHMM_pred"
        width="100"
      />
      <el-table-column
        prop="exACALL"
        label="ExAC_ALL"
        width="100"
      />
      <el-table-column
        prop="exACAFR"
        label="ExAC_AFR"
        width="100"
      />
      <el-table-column
        prop="exACAMR"
        label="ExAC_AMR"
        width="100"
      />
      <el-table-column
        prop="exACEAS"
        label="ExAC_EAS"
        width="100"
      />
      <el-table-column
        prop="exACFIN"
        label="ExAC_FIN"
        width="100"
      />
      <el-table-column
        prop="exACNFE"
        label="ExAC_NFE"
        width="100"
      />
      <el-table-column
        prop="exACOTH"
        label="ExAC_OTH"
        width="100"
      />
      <el-table-column
        prop="exACSAS"
        label="ExAC_SAS"
        width="100"
      />
    </el-table>
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
    <!-- 舍弃/选中弹层 -->
    <el-dialog
      top="12%"
      title="请确认勾选的数据"
      :visible.sync="visible"
      width="34%"
      center
    >
      <!-- 勾选的数据-->
      <el-table
        class="table"
        :data="selection"
        border
        stripe
        max-height="300"
      >
        <el-table-column
          prop="chr"
          label="Chr"
          width="60"
        />
        <el-table-column
          prop="start"
          label="Start"
          width="100"
        />
        <el-table-column
          prop="end"
          label="End"
          width="100"
        />
        <el-table-column
          prop="ref"
          label="Ref"
          width="60"
        />
        <el-table-column
          prop="alt"
          label="Alt"
          width="60"
        />
        <el-table-column
          prop="mutationRatioA"
          label="Mutation.ratio"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.mutationRatioA }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="aaChangeRefGene"
          label="aaChangeRefGene"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
              width="400"
            >
              <div class="pop">
                {{ scope.row.aaChangeRefGene }}
              </div>
              <el-link
                slot="reference"
                type="primary"
                :underline="false"
                title="完整信息"
              >
                {{ scope.row.aaChangeRefGene }}
              </el-link>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 获取额外数据drawer -->
    <extra
      :drawer="drawer"
      @close="handleClose"
      @extraSelct="extraSelect"
    />
    <!-- 插入FLT3弹层 -->
    <el-dialog
      top="12%"
      title="插入FLT3数据"
      :visible.sync="visibleFLT3"
      width="34%"
      center
    >
      <el-form>
        <el-form-item label="NM_004119:ins约等于：">
          <el-input
            v-model="bp"
            size="small"
            clearable
            style="width:60%"
          >
            <template slot="append">
              BP
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="mutation：">
          <el-radio-group
            v-model="mutation"
          >
            <el-radio label="≈10%">
              约等于10%
            </el-radio>
            <el-radio label="<50%">
              小于50%
            </el-radio>
            <el-radio label="≈50%">
              约等于50%
            </el-radio>
            <el-radio label=">50%">
              大于50%
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="visibleFLT3 = false"
        >
          取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleFLT3Confirm"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { analysisList, abandon, retain, extraData, flt3 } from '@/api/analysis.js';
import { exportAnalysisData } from '@/api/report.js';
import downloadFileByBlob from '@/utils/download';
import extra from './extra';
export default {
    components: {
      extra
    },
    props: {
        registerId: {
            type: Number,
            default: null
        },
        excelName: {
          type: String,
          default: ''
        }
    },
    data() {
        return {
            conclusions: '突变型',
            state: ['选中'],
            tableData: [], // 分析数据
            // 分页
            pageNum: 1,
            pageSize: 20,
            total: null,
            loading: false,
            state1: 0,
            state2: 1,
            regisId: null,
            selection: [],
            btnFlag: null,
            visible: false,
            details: [],
            drawer: false,
            visibleFLT3: false,
            mutation: '约等于10%',
            bp: null,
            type: '',
            fileName: ''
        };
    },
    computed: {
      ...mapGetters({
        'userId': 'user_id'
      }),
      // 状态-svg图标
      statusClass() {
        return function(status) {
          switch (status) {
            case '选中':
              return 'checked';
            case '额外插入':
              return 'insert';
            case '舍弃':
              return 'buhege';
            default :
              return '';
          }
        };
      }
    },
    watch: {
        registerId(val) {
            this.regisId = val;
            this.getAnalysList();
        },
        excelName(val) {
          this.fileName = val;
        }
    },
    methods: {
        // 状态class
        cellClass(data) {
          // console.log(data);
          if(data.columnIndex == 2 && data.row.statusName == '舍弃') {
            return 'abandon';
          }
          if(data.columnIndex == 2 && data.row.statusName == '选中') {
            return 'checked';
          }
          if(data.columnIndex == 2 && data.row.statusName == '额外插入') {
            return 'insert';
          }
          // 意义位置
          if(data.columnIndex == 1 && data.row.cosmicSiteName == '致病性标注') {
            return 'abandon';
          }
          if(data.columnIndex == 1 && data.row.cosmicSiteName == '非该类疾病COSMIC号') {
            return 'checked';
          }
          if(data.columnIndex == 1 && data.row.cosmicSiteName == '特殊意义') {
            return 'insert';
          }
        },
        // 获取分析数据
        async getAnalysList() {
          if(this.regisId==null) {
            this.$message({
              message: '请先选择样本',
              type: 'warning'
            });
            return false;
          }
          this.loading = true;
          let { content, pageTotal } = await analysisList(
              this.pageNum,
              this.pageSize,
              this.regisId,
              this.conclusions,
              this.state1,
              this.state2
            );
          this.loading = false;
          this.tableData = content;
          this.total = pageTotal;
        },
        // 分页
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getAnalysList();
        },
        // 状态选中
        handleStateChange(val) {
            this.state1 = val.includes('舍弃') ? 1 : 0;
            this.state2 = val.includes('选中') ? 1 : 0;
            this.getAnalysList();
        },
        // 选中样本
        handleSelect(selection) {
            this.selection = selection;
        },
        // 舍弃 / 选中
        handleBtn(val) {
          this.btnFlag = val;
          if(this.selection.length == 0) {
            this.$message({
              message: '请勾选数据',
              type: 'warning'
            });
            return false;
          }
          this.visible = true;
          console.log(this.selection);
        },
        handleConfirm() {
          this.details = this.selection.map(item => {
              return {
                middleId: item.middleId,
                detailId: item.detailId,
                geneName: item.geneRefGene,
              };
          });
          this.btnFlag === 0 ? this.handleAbandon() : this.handleRetain();
        },
        // 舍弃
        async handleAbandon() {
            console.log(this.userId);
            console.log(this.regisId);
            console.log(this.details);
            let { code, message } = await abandon(
                this.userId,
                this.regisId,
                this.details
            );
            if(code===200) {
              this.$message({
                message: message,
                type: 'success'
              });
              this.getAnalysList();
              this.visible = false;
              this.selection = [];
            } else {
              this.$message.error(message);
            }
        },
        // 选中
        async handleRetain() {
            console.log(this.userId);
            console.log(this.regisId);
            console.log(this.details);
            let { code, message } = await retain(
                this.userId,
                this.regisId,
                this.details
            );
            if(code===200) {
              this.$message({
                message: message,
                type: 'success'
              });
              this.getAnalysList();
              this.visible = false;
              this.selection = [];
            } else {
              this.$message.error(message);
            }
        },
        // 获取额外数据
        handleExtra() {
          if(this.regisId == null) {
            this.$message({
              message: '请先选择样本',
              type: 'warning'
            });
            return false;
          }
          this.drawer = true;
        },
        handleClose(val) {
          this.drawer = val;
        },
        async extraSelect(detailId) {
          console.log(detailId);
          console.log(this.regisId);
          if(this.regisId == null) {
            this.$message({
              message: '请先选择样本',
              type: 'warning'
            });
            return false;
          }
          let {code, message} = await extraData(this.regisId, detailId);
          if(code===200) {
            this.$message({
              message: message,
              type: 'success'
            });
            this.getAnalysList();
          } else {
              this.$message.error(message);
          }
        },
        // 插入
        handleInsert() {
          if(this.regisId == null) {
            this.$message({
              message: '请先选择样本',
              type: 'warning'
            });
            return false;
          }
          this.visibleFLT3 = true;
        },
        async handleFLT3Confirm() {
          let {code, message} = await flt3(this.regisId, this.bp, this.mutation);
          if(code===200) {
            this.$message({
              message: message,
              type: 'success'
            });
            this.getAnalysList();
            this.visibleFLT3 = false;
          } else {
              this.$message.error(message);
          }
        },
        // 导出分析数据
        async handleExportData() {
          if(this.regisId == null) {
            this.$message({
              message: '请先选择样本',
              type: 'warning'
            });
            return false;
          }
          console.log(this.fileName);
          console.log(this.type);
          console.log(this.regisId);
          let res = await exportAnalysisData(this.fileName, this.type, this.regisId);
          const blobUrl = URL.createObjectURL(res);
          downloadFileByBlob(blobUrl, res.fileName);
          this.type='';
        }
    }
};
</script>

<style>

</style>

