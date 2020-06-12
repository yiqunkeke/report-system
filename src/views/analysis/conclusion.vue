<template>
  <div>
    <el-form :inline="true">
      <el-form-item style="margin-right:40px">
        <el-radio-group
          v-model="site"
          @change="getConclusionList"
        >
          <el-radio
            v-for="item in siteList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
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
    >
      <el-table-column
        prop="site"
        label="显示位置"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{ siteName(scope.row.site) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="geneName"
        label="基因名称"
        width="110"
      />
      <el-table-column
        prop="analysisData"
        label="检测数据"
        width="200"
      />
      <el-table-column
        prop="mutation"
        label="突变比例"
        sortable
        width="120"
      />
      <el-table-column
        prop="conclusion"
        label="检测结果"
        sortable
        width="160"
      />
      <el-table-column
        prop="type"
        label="数据来源"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.type == 1 ? '套餐中获取' : '分析得出' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="临床意义"
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
  </div>
</template>

<script>
import { conclusionList } from '@/api/analysis.js';
export default {
    props: {
        registerId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            regisId: null,
            site: 1,
            tableData: [],
            // 分页
            pageNum: 1,
            pageSize: 20,
            total: null,
            loading: false,
            siteList: [
                {
                    label: '鉴别诊断',
                    value: 1
                },
                {
                    label: '预后评估',
                    value: 2
                },
                {
                    label: '靶向治疗',
                    value: 3
                },
                {
                    label: '二类',
                    value: 4
                },
                {
                    label: '三类',
                    value: 5
                },
                {
                    label: '其他',
                    value: 6
                }
            ]
        };
    },
    computed: {
        siteName() {
            return function(val) {
                return this.siteList.filter(item => item.value === val)[0].label;
            };
        }
    },
    watch: {
        registerId(val) {
            this.regisId = val;
            this.getConclusionList();
        }
    },
    methods: {
        // 获取结论意义
        async getConclusionList() {
            if(this.regisId==null) {
                this.$message({
                    message: '请先选择样本',
                    type: 'warning'
                });
                return false;
            }
            this.loading = true;
            let { content, pageTotal } = await conclusionList(
                this.pageNum,
                this.pageSize,
                this.regisId,
                this.site
            );
            this.loading = false;
            this.tableData = content;
            this.total = pageTotal;
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getConclusionList();
        }
    }
};
</script>

<style>

</style>
