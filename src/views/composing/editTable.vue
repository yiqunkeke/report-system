<template>
  <div>
    <!-- 表格 -->
    <el-table
      class="table"
      :data="tableData"
      max-height="700"
      border
      stripe
    >
      <el-table-column
        fixed="left"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleAddOrder(scope.$index)"
          >
            选择订单
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleDelOrder(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="orderNum"
        label="订单编号"
        width="150"
      />

      <el-table-column
        prop="name"
        label="病人姓名"
        width="100"
      />

      <el-table-column
        label="检测项目"
        width="360"
      >
        <template slot-scope="scope">
          <div
            v-for="item in scope.row.detectionList"
            :key="item.minorItemId"
          >
            <el-tag size="small">
              大项：{{ item.majorItem }}
            </el-tag>
            <el-tag
              size="small"
              type="warning"
            >
              小项：{{ item.minorItem }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="labNum"
        label="实验编号"
        width="100"
        align="center"
      />

      <el-table-column
        prop="dBarcode"
        label="Barcode"
        width="90"
      />

      <el-table-column
        prop="analysisDetectionName"
        label="分析项目"
        width="240"
      />

      <el-table-column
        label="疾病类型 - 使系统自动匹配意义和结论"
      >
        <template slot-scope="scope">
          疾病大类：
          <el-select
            v-model="scope.row.disease"
            placeholder="请选择疾病大类"
            size="small"
            clearable
            filterable
            value-key="value"
            @change="diseaseChange($event, scope.row)"
          >
            <el-option
              v-for="item in scope.row.diseaseList"
              :key="item.key"
              :label="item.value"
              :value="item"
            />
          </el-select>
          &nbsp;&nbsp;
          疾病小类：
          <el-select
            v-model="scope.row.diseaseId"
            placeholder="请选择疾病小类"
            size="small"
            clearable
            filterable
          >
            <el-option
              v-for="item in scope.row.diseaseMinorList"
              :key="item.diseaseId"
              :label="item.diseaseName"
              :value="item.diseaseId"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'EditTable',
  props: {
    amp: {
      type: Number,
      default: null
    },
    diseaseList: {
      type: Array,
      default:() => {
        return [];
      }
    }
  },
  data() {
    return {
      tableData: [],
      curRowIndex: null,
      diseaseMinorList: [],
      editTable: []
    };
  },
  computed: {
    ...mapGetters('composing', {
      'order': 'order',
      'editDetails': 'editDetails'
    })
  },
  watch: {
    amp(val) {
      if(val == 1) {
        if(this.editDetails.length == 1) {
          // 详情中有
          console.log(111, this.editDetails);
          if(this.diseaseList.length !== 0) {
          for(let item of this.editDetails) {
            let disease = this.diseaseList.filter(d => d.key ==item.diseaseClass)[0];
            this.$set(item, 'diseaseList', this.diseaseList);
            this.$set(item, 'disease', disease); // 大类-绑定对象
            this.$set(item, 'diseaseId', item.diseaseId); // 小类-绑定对象
            if(disease !== undefined) {
              this.$set(item, 'diseaseMinorList', disease.content);
              }
            }
          }
          this.tableData = this.editDetails;
        } else {
          // 切换过amp，editDetails 10行
          this.initTable(1, 'AMP');
        }

      } else {
        this.initTable(10);
      }
    },
    order(val) {
      console.log('miseqOrder', val);
      let isEmpty = (obj) => (Object.keys(obj).length === 0) ? true : false; // 判断对象是否为空
      if(isEmpty(val) == false) {
        // 设置表格行数据
        let curObj = this.tableData[this.curRowIndex];
        this.$set(curObj, 'orderNum', val.orderNumber);
        this.$set(curObj, 'name', val.personName);
        this.$set(curObj, 'detectionList', val.detectionList);
        this.$set(curObj, 'orderId', val.id);
      }
    },
    diseaseList(val) {
      if(val && val.length != 0) {
        for(let item of this.tableData) {
          this.$set(item,'diseaseList', val);
        }
      }
    },
    tableData: {
      handler(val) {
        this.editDetailsAction(val);
      },
      deep: true
    },
    editDetails(val) {
      this.editTable = val;
      if(this.diseaseList.length !== 0) {
        for(let item of this.editTable) {
          let disease = this.diseaseList.filter(d => d.key ==item.diseaseClass)[0];
          this.$set(item, 'diseaseList', this.diseaseList);
          this.$set(item, 'disease', disease); // 大类-绑定对象
          this.$set(item, 'diseaseId', item.diseaseId); // 小类-绑定对象
          if(disease !== undefined) {
            this.$set(item, 'diseaseMinorList', disease.content);
          }
        }
      }
      console.log('final', this.editTable);
      this.tableData = this.editTable;
    }
  },
  mounted() {
    this.initTable(10);
  },
  methods: {
    ...mapActions('composing', ['visibleAction', 'orderAction', 'editDetailsAction']),
    // 初始化表格
    initTable(len, amp) {
      this.tableData = [];
      for(let i = 0; i < len; i++) {
        let obj = {
          orderNum: '',
          name: '',
          detectionList: [],
          labNum: '',
          dBarcode: '',
          diseaseList: this.diseaseList,
          diseaseMinorList: []
        };
        obj.labNum = amp ? amp : `L${i + 1}`;
        if(i < 7) {
          obj.dBarcode = amp ? '' : `Barcode${i + 11}`;
        } else {
          obj.dBarcode = amp ? '' : `Barcode${i + 13}`;
        }
        this.tableData.push(obj);
      }
    },
    // 添加订单
    handleAddOrder(index) {
      this.curRowIndex = index;
      this.visibleAction(true);
      this.orderAction({});
    },
    // 删除表格行数据
    handleDelOrder(index) {
      let curObj = this.tableData[index];
      this.$set(curObj, 'orderNum', '');
      this.$set(curObj, 'name', '');
      this.$set(curObj, 'detectionList', []);
      this.$set(curObj, 'orderId', null);
    },
    // 疾病大类选中
    diseaseChange(val, row) {
      // console.log(val, row);
      this.$set(row, 'diseaseId', null);
      this.$set(row, 'diseaseMinorList', val.content);
    }
  }
};
</script>

<style>

</style>
