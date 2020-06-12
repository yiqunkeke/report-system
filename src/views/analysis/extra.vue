<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      :direction="direction"
      size="50%"
      @closed="handleClose"
    >
      <div class="pad">
        <el-form
          :inline="true"
          label-width="80px"
        >
          <el-form-item
            label="基因名称"
          >
            <el-input
              v-model="geneName"
              size="small"
              clearable
              placeholder="请输入基因名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="warning"
              size="small"
              icon="el-icon-search"
              :loading="loading"
              @click="getExtra"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          border
          stripe
          class="table"
          max-height="760px"
          :header-cell-class-name="cancelAll"
          @select="handleSelect"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            align="center"
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
            width="60"
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
          />
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
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { extraDataList } from '@/api/analysis.js';
export default {
    props: {
        drawer: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: false,
            direction: 'rtl',
            loading: false,
            geneName: null,
            pageNum: 1,
            pageSize: 20,
            total: null,
            tableData: []
        };
    },
    watch: {
        drawer(val) {
            this.visible = val;
        }
    },
    mounted() {
        this.getExtra();
    },
    methods: {
        // 获取额外数据
        async getExtra() {
            this.loading = true;
            let { content, pageTotal } = await extraDataList(
                  this.pageNum,
                  this.pageSize,
                  this.geneName,
              );
              // console.log('extra', content, pageTotal);
              this.loading = false;
              this.tableData = content;
              this.total = pageTotal;
        },
        // 选中行
        handleSelect(selection, row) {
            this.visible = false;
            this.$refs.table.clearSelection();
            this.$emit('close', this.visible);
            // console.log('选中的额外数据-', row);
            this.$emit('extraSelct', row.detailId);
        },
        // 分页
        handleCurrentChange(val) {
            this.pageNum = val;
        },
        // 关闭 drawer
        handleClose() {
            this.$emit('close', this.visible);
        },
        // 取消全选功能
        cancelAll({ columnIndex }) {
            if (columnIndex === 0) {
                return 'disabledSelection';
            }
        },
    }
};
</script>

<style>

</style>
