<template>
  <div>
    <!-- 查询条件 -->
    <el-form :inline="true">
      <el-form-item
        label="检测大项"
      >
        <el-select
          v-model="major"
          placeholder="请选择检测大项"
          size="small"
          clearable
          filterable
          value-key="majorName"
          @change="majorChange($event)"
        >
          <el-option
            v-for="item in majorList"
            :key="item.majorItemId"
            :label="item.majorName"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="检测小项"
      >
        <el-select
          v-model="minorItemId"
          placeholder="请选择检测小项"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in minorList"
            :key="item.minorItemId"
            :label="item.minorItemName"
            :value="item.minorItemId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称">
        <el-input
          v-model="templateName"
          size="small"
          placeholder="请输入模板名称"
          clearable
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
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          新增
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
    >
      <el-table-column
        prop="majorItem"
        label="检测大项"
        width="260"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isEdit==false">
            {{ scope.row.majorItem }}
          </span>
          <div v-else>
            <el-select
              v-model="scope.row.major"
              placeholder="请选择检测大项"
              size="small"
              clearable
              filterable
              value-key="majorName"
              @change="majorChange($event, scope.row)"
            >
              <el-option
                v-for="item in majorList"
                :key="item.majorItemId"
                :label="item.majorName"
                :value="item"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="minorItem"
        label="检测小项"
        width="300"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isEdit==false">
            {{ scope.row.minorItem }}
          </span>
          <div v-else>
            <el-select
              v-model="scope.row.detectionId"
              placeholder="请选择检测小项"
              size="small"
              clearable
              filterable
            >
              <el-option
                v-for="item in minorList"
                :key="item.minorItemId"
                :label="item.minorItemName"
                :value="item.minorItemId"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="templateName"
        label="模板名称"
        width="300"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isEdit==false">
            {{ scope.row.templateName }}
          </span>
          <div v-else>
            <el-input
              v-model="scope.row.templateName"
              size="small"
              placeholder="请输入模板名称"
              clearable
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isEdit==false"
            size="mini"
            type="success"
            plain
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-else
            size="mini"
            plain
            @click="handleSave(scope.row)"
          >
            保存
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button
              slot="reference"
              type="danger"
              size="mini"
              plain
              icon="el-icon-delete"
            >
              删除
            </el-button>
          </el-popconfirm>
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
</template>

<script>
import { detectionList } from '@/api/detection';
import { templateList, templateAdd, templateEdit, templateDelete } from '@/api/report';
export default {
    data() {
        return {
            pageNum: 1,
            pageSize: 20,
            total: null,
            loading: false,
            tableData: [],

            major: {
                majorItemId: null
            },
            templateName: '',
            minorItemId: null,
            minorList: [],
            majorList: []
        };
    },
    mounted() {
        this.getDetectionList();
        this.getReportTemplate();
    },
    methods: {
        // 获取检测项目
        async getDetectionList() {
            let res = await detectionList();
            console.log(res);
            this.majorList = res;
        },
        // 检测大项选中
        majorChange(val, row) {
            this.minorItemId = null;
            this.minorList = [];
            if(row) {
                row.detectionId = null;
            }
            if(val) {
                this.minorList = val.itemList;
            }
        },
        // 获取报告模板
        async getReportTemplate() {
            this.loading = true;
            let  { content, pageTotal} = await templateList(
                this.pageNum,
                this.pageSize,
                this.major.majorItemId,
                this.minorItemId,
                this.templateName
                );
            this.loading = false;
            content.forEach(item => {
                this.$set(item, 'isEdit', false);
                this.$set(item, 'major', {
                    majorItemId: item.majorId,
                    majorName: item.majorItem
                });
            });
            this.tableData = content;
            this.total = pageTotal;
        },
        // 查询
        handleSearch(){
            this.pageNum = 1;
            this.getReportTemplate();
        },
        // 分页
        handleCurrentChange(val){
            this.pageNum = val;
            this.getReportTemplate();
        },
        // 新增
        async handleAdd() {
            if(this.major.majorItemId == null) {
                this.$message({
                    message: '请选择检测大项',
                    type: 'warning'
                });
                return false;
            }
            if(this.minorItemId == null) {
                this.$message({
                    message: '请选择检测小项',
                    type: 'warning'
                });
                return false;
            }
            if(this.templateName == '') {
                this.$message({
                    message: '请填写模板名称',
                    type: 'warning'
                });
                return false;
            }
            let {code, message} = await templateAdd(this.major.majorItemId, this.minorItemId, this.templateName);
            if(code===200) {
                this.$message({
                    message: message,
                    type: 'success'
                });
                this.major = {
                    majorItemId: null
                };
                this.minorItemId = null;
                this.templateName = '';
                this.getReportTemplate();
            } else {
                this.$message.error(message);
            }
        },
        // 编辑
        handleEdit(row) {
            console.log(1, row);
            this.$set(row, 'isEdit', true);
            this.minorList = this.majorList.filter(item => item.majorItemId === row.majorId)[0].itemList;
        },
        // 保存
        async handleSave(row) {
            if(row.major.majorItemId == null) {
                this.$message({
                    message: '请选择检测大项',
                    type: 'warning'
                });
                return false;
            }
            if(row.detectionId == null || row.detectionId =='') {
                this.$message({
                    message: '请选择检测小项',
                    type: 'warning'
                });
                return false;
            }
            if(row.templateName == '') {
                this.$message({
                    message: '请填写模板名称',
                    type: 'warning'
                });
                return false;
            }
            let {code, message} = await templateEdit(row.id, row.major.majorItemId, row.detectionId, row.templateName);
            if(code===200) {
                this.$message({
                    message: message,
                    type: 'success'
                });
                // this.$set(row, 'isEdit', false);
                this.getReportTemplate();
            } else {
                this.$message.error(message);
            }
        },
        // 删除
        async handleDelete(row) {
            console.log(row);
            let {code, message} = await templateDelete(row.id);
            if(code===200) {
                this.$message({
                    message: message,
                    type: 'success'
                });
                this.getReportTemplate();
            } else {
                this.$message.error(message);
            }
        }
    }
};
</script>

<style>

</style>
