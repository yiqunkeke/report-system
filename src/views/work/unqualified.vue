<template>
  <div>
    <!-- 查询条件 -->
    <el-form
      :inline="true"
      label-width="80px"
    >
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
        label="设备类型"
        prop="equipment"
      >
        <el-select
          v-model="ruleForm.equipment"
          placeholder="请选择设备类型"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in equipmentList"
            :key="item.key"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
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
          icon="el-icon-s-check"
          @click="handleQualify"
        >
          返回合格
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      max-height="760"
      border
      stripe
      @select="handleSelect"
      @select-all="handleSelect"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />

      <el-table-column
        prop="orderNum"
        label="订单编号"
        width="160"
      />

      <el-table-column
        prop="name"
        label="病人姓名"
        width="150"
      />

      <el-table-column
        prop="equipment"
        label="设备类型"
        width="100"
      />

      <el-table-column
        prop="rotation"
        label="轮次"
        width="140"
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
        label="是否为amp"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.amp == 0 ? '否':'是' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="diseaseName"
        label="疾病"
        width="100"
      />
      <el-table-column
        label="检测项目"
      >
        <template slot-scope="scope">
          <span
            v-for="(item,index) in scope.row.detectionList"
            :key="index"
          >
            <el-tag
              v-if="item && item.majorItem"
              size="small"
            >
              大项：{{ item.majorItem }}
            </el-tag>
            -
            <el-tag
              v-if="item && item.minorItem"
              size="small"
              type="warning"
            >
              小项：{{ item.minorItem }}
            </el-tag>
          </span>
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

    <!-- 样本不合格弹层 -->
    <el-dialog
      top="12%"
      title="请确认返回合格的样本"
      :visible.sync="unqualifyVisible"
      width="30%"
      center
    >
      <el-table
        :data="qualifyList"
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
          label="检测项目"
        >
          <template slot-scope="scope">
            <span
              v-for="(item,index) in scope.row.detectionList"
              :key="index"
            >
              <el-tag
                v-if="item && item.majorItem"
                size="small"
              >
                大项：{{ item.majorItem }}
              </el-tag>
              -
              <el-tag
                v-if="item && item.minorItem"
                size="small"
                type="warning"
              >
                小项：{{ item.minorItem }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
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
</template>

<script>
import { equipment } from '@/api/public.js';
import { unqualifyList, qualify } from '@/api/work.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // 查询字段
      ruleForm: {
          name: '',
          rotation: '',
          equipment: '',
          mBarcode: ''
      },
      equipmentList: [],
      pageNum: 1,
      pageSize: 20,
      total: null,
      loading: false,
      tableData: [],
      details: [],
      qualifyList: [],
      unqualifyVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      'userId': 'user_id'
    })
  },
  mounted() {
    this.getEquipment();
    this.getUnqualifyList();
  },
  methods: {
    // 获取设备类型
    async getEquipment() {
      let res = await equipment();
      this.equipmentList = res;
    },
    // 获取不合格样本
    async getUnqualifyList() {
      this.loading = true;
      let { content, pageTotal } = await unqualifyList(
          this.pageNum,
          this.pageSize,
          this.ruleForm.name,
          this.ruleForm.rotation,
          this.ruleForm.equipment,
          this.ruleForm.mBarcode
      );
      console.log('unqualifyList',content, pageTotal);
      this.loading = false;
      this.tableData = content;
      this.total = pageTotal;
    },
    // 查询
    handleSearch() {
      this.pageNum = 1;
      this.getUnqualifyList();
    },
    // 分页
    handleCurrentChange(val){
      this.pageNum = val;
      this.getUnqualifyList();
    },
    // 选中样本
    handleSelect(selection) {
      this.details = selection.map(item => {
          return {
            registerId: item.registerId
          };
      });
      this.qualifyList = selection;
      console.log(this.qualifyList);
    },
    // 返回合格
    async handleQualify() {
      if(this.details.length == 0) {
        this.$message({
          message: '请勾选样本',
          type: 'warning'
        });
        return false;
      }
      this.unqualifyVisible = true;
    },
    // 确认返回合格
    async unqualifyConfirm() {
      let { code, message } = await qualify(
         this.userId,
         this.details
      );
      if(code===200) {
        this.$message({
          message: message,
          type: 'success'
        });
        this.getUnqualifyList();
      } else {
        this.$message.error(message);
      }
      this.unqualifyVisible = false;
      this.details = [];
    }
  }
};
</script>

<style>

</style>
