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
      <el-form-item label="登记日期">
        <el-date-picker
          v-model="registerDate"
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
      <el-form-item label="设备类型">
        <el-select
          v-model="equipment"
          placeholder="请选择设备类型"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in equipmentList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="大Barcode">
        <el-input
          v-model="mBarcode"
          placeholder="请输入大Barcode"
          size="small"
          clearable
        />
      </el-form-item>
      <el-form-item label="登记人">
        <el-select
          v-model="createUser"
          placeholder="请选择登记人"
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
      <el-form-item label="轮次">
        <el-input
          v-model="rotation"
          placeholder="请输入轮次"
          size="small"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-checkbox-group v-model="status">
          <el-checkbox
            v-for="(item, index) in statusList"
            :key="index"
            :label="item"
          />
        </el-checkbox-group>
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
      <el-form-item style="float:right">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          新增
        </el-button>
        <el-popconfirm
          title="确定删除吗？"
          @onConfirm="handleBatchDelete"
        >
          <el-button
            slot="reference"
            type="danger"
            size="small"
            icon="el-icon-delete"
            plain
          >
            批量删除
          </el-button>
        </el-popconfirm>
        <el-popconfirm
          title="确定批量上机吗？"
          @onConfirm="handleOperate"
        >
          <el-button
            slot="reference"
            type="success"
            size="small"
            icon="el-icon-thumb"
            plain
          >
            批量上机
          </el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      max-height="700"
      border
      stripe
      :cell-class-name="cellClass"
      @select="handleSelect"
      @select-all="handleSelect"
    >
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="disabled(scope.row.status)"
            size="mini"
            plain
            type="success"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button
              slot="reference"
              :disabled="disabled(scope.row.status)"
              size="mini"
              type="danger"
              plain
              icon="el-icon-delete"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

      <el-table-column
        type="selection"
        width="55"
        align="center"
      />

      <el-table-column
        prop="createDate"
        label="登记日期"
        width="100"
      />

      <el-table-column
        prop="boardingDate"
        label="上机日期"
        width="100"
      />

      <el-table-column
        prop="cosmicVersion"
        label="cosmic版本号"
        width="120"
      />

      <el-table-column
        prop="equipment"
        label="设备类型"
        width="100"
      />

      <el-table-column
        prop="rotation"
        label="轮次"
        width="90"
      />

      <el-table-column
        prop="mbarcode"
        label="大Barcode"
        width="110"
      />

      <el-table-column
        label="状态"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="statusClass(scope.row.status)" />
          {{ scope.row.status }}
        </template>
      </el-table-column>

      <el-table-column
        property="createUserName"
        label="登记人"
        width="80"
      />

      <el-table-column
        label="是否为amp"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.amp == 0 ? '否':'是' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="regionalAbb"
        label="收样单位"
        width="100"
      />

      <el-table-column
        label="Barcode11"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName11"
            size="small"
            :type="fileAnalysisStatus(scope.row.barcodeState11)"
            :title="scope.row.barcodeState11"
          >
            {{ scope.row.barcodeName11 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode12"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName12"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState12)"
            :title="scope.row.barcodeState12"
          >
            {{ scope.row.barcodeName12 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode13"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName13"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState13)"
            :title="scope.row.barcodeState13"
          >
            {{ scope.row.barcodeName13 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode14"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName14"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState14)"
            :title="scope.row.barcodeState14"
          >
            {{ scope.row.barcodeName14 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode15"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName15"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState15)"
            :title="scope.row.barcodeState15"
          >
            {{ scope.row.barcodeName15 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode16"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName16"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState16)"
            :title="scope.row.barcodeState16"
          >
            {{ scope.row.barcodeName16 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode17"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName17"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState17)"
            :title="scope.row.barcodeState17"
          >
            {{ scope.row.barcodeName17 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode20"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName20"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState20)"
            :title="scope.row.barcodeState20"
          >
            {{ scope.row.barcodeName20 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode21"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName21"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState21)"
            :title="scope.row.barcodeState21"
          >
            {{ scope.row.barcodeName21 }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Barcode22"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.barcodeName22"
            size="mini"
            :type="fileAnalysisStatus(scope.row.barcodeState22)"
            :title="scope.row.barcodeState22"
          >
            {{ scope.row.barcodeName22 }}
          </el-tag>
        </template>
      </el-table-column>
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
import { mapGetters } from 'vuex';
import { composingList, composingDelete, composingOperation } from '@/api/composing.js';
import { activeUser } from '@/api/user.js';
import { equipment } from '@/api/public.js';
export default {
  data() {
    return {
      // 查询字段
      name: '',
      equipment: '',
      mBarcode: '',
      createUser: '',
      rotation: '',
      status: [],
      registerDate: [],

      // 下拉列表
      statusList: ['编辑中', '已上机', '分析完成'],
      equipmentList: [],
      userList: [],

      // 表格
      tableData: [],

      // 分页
      pageNum: 1,
      pageSize: 20,
      total: null,
      loading: false,
      mainRegister: []
    };
  },
  computed: {
    ...mapGetters({
      'userId': 'user_id'
    }),
    registerDateBegin() {
        if(this.registerDate && this.registerDate.length!=0) {
          return this.registerDate[0];
        } else {
          return '';
        }
    },
    registerDateEnd() {
        if(this.registerDate && this.registerDate.length!=0) {
          return this.registerDate[1];
        } else {
          return '';
        }
    },
    edit() {
      return this.status.includes('编辑中') ? 1: 0;
    },
    operate() {
      return this.status.includes('已上机') ? 1: 0;
    },
    finish() {
      return this.status.includes('分析完成') ? 1: 0;
    },
    // 状态-svg图标
    statusClass() {
      return function(status) {
        switch (status) {
          case '编辑中':
            return 'edit';
          case '已上机':
            return 'daitijiao';
          case '分析完成':
            return 'daoda';
          default :
            return '';
        }
      };
    },
    // 文件分析状态
    fileAnalysisStatus() {
      return function(status) {
        switch (status) {
          case '样本不合格':
            return 'danger';
          case '报告文件已导入':
            return 'warning';
          case '分析完成':
            return 'success';
          default :
            return 'info';
        }
      };
    },
    // 编辑/删除条件
    disabled() {
      return function(status) {
        if(status !== '编辑中'){
          return true;
        } else {
          return false;
        }
      };
    }
  },
  mounted() {
    this.getActiveUser();
    this.getEquipment();
    this.getComposingList();
  },
  methods: {
    // 订单状态class
    cellClass(data) {
      // console.log(data);
      if(data.columnIndex == 7 && data.row.status == '编辑中') {
        return 'edit';
      }
      if(data.columnIndex == 7 && data.row.status == '已上机') {
        return 'operate';
      }
      if(data.columnIndex == 7 && data.row.status == '分析完成') {
        return 'finish';
      }
    },
    // 获取二代测序列表
    async getComposingList() {
      this.loading = true;
      let { content, pageTotal } = await composingList(
        this.pageNum,
        this.pageSize,
        this.name,
        this.registerDateBegin,
        this.registerDateEnd,
        this.equipment,
        this.mBarcode,
        this.createUser,
        this.rotation,
        this.edit,
        this.operate,
        this.finish
      );
      // console.log(content, pageTotal);
      this.loading = false;
      this.tableData = content;
      this.total = pageTotal;
    },
    // 获取活跃用户
    async getActiveUser() {
      let res = await activeUser();
      this.userList = res;
    },
    // 获取设备类型
    async getEquipment() {
      let res = await equipment();
      this.equipmentList = res;
    },
    // 分页
    handleCurrentChange(val){
      this.pageNum = val;
      this.getComposingList();
    },
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getComposingList();
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: '/composing/add'
      });
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: '/composing/edit',
        query: {
          rmid: row.rmId
        }
      });
    },
    // 删除接口
    async delete() {
      let {code, message} = await composingDelete(this.userId, this.mainRegister);
      if(code === 200) {
        await this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.getComposingList();
      } else {
        this.$message.error(message);
      }
    },
    // 删除
    handleDelete(row) {
      this.mainRegister = [
        {
          rmid: row.rmId
        }
      ];
      this.delete();
    },
    // 选中行
    handleSelect(selection) {
      this.mainRegister = selection.map(item => {
          return {
            rmid: item.rmId
          };
      });
    },
    // 批量删除
    handleBatchDelete() {
      if(this.mainRegister.length == 0) {
        this.$message({
          message: '请选择要删除的登记',
          type: 'warning'
        });
      } else {
        this.delete();
      }
    },
    // 批量上机
    async handleOperate() {
      if(this.mainRegister.length == 0) {
        this.$message({
          message: '请选择要上机的登记',
          type: 'warning'
        });
      } else {
        let {code, message} = await composingOperation(this.userId, this.mainRegister);
        if(code === 200) {
          this.$message({
            message: '批量上机成功',
            type: 'success'
          });
          this.getComposingList();
        } else {
          this.$message.error(message);
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/modules/composing.scss';
</style>
