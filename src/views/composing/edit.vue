<template>
  <div>
    <!-- 表单 -->
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="ruleForm"
      :rules="rules"
    >
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
          @change="handleEquipChange"
        >
          <el-option
            v-for="item in equipmentList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
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
      <el-form-item
        label="上机日期"
        prop="boardingDate"
      >
        <el-date-picker
          v-model="ruleForm.boardingDate"
          value-format="yyyy-MM-dd"
          type="date"
          size="small"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item
        label="登记日期"
        prop="createDate"
      >
        <el-date-picker
          v-model="ruleForm.createDate"
          value-format="yyyy-MM-dd"
          type="date"
          size="small"
          placeholder="选择日期"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="cosmic版本号"
        prop="cosmicVersion"
      >
        <el-select
          v-model="ruleForm.cosmicVersion"
          placeholder="请选择cosmic版本号"
          size="small"
          clearable
          filterable
        >
          <el-option
            v-for="item in cosmicVersionList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
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
        label="收样单位"
        prop="regionalId"
      >
        <el-select
          v-model="ruleForm.regionalId"
          placeholder="请选择收样单位"
          size="small"
          clearable
          filterable
          @change="regionalIdChange"
        >
          <el-option
            v-for="item in sampleUnitList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="ampVisible"
        label="是否为amp"
      >
        <el-radio-group
          v-model="AMP"
        >
          <el-radio :label="1">
            是
          </el-radio>
          <el-radio :label="0">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <editTable
      :amp="AMP"
      :disease-list="diseaseList"
    />
    <!-- drawer -->
    <orderDrawer />
    <!-- 按钮 -->
    <el-button
      type="primary"
      size="small"
      @click="handleSubmit('ruleForm')"
    >
      保存
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { equipment, disease, cosmicVersion, sampleUnit } from '@/api/public.js';
import { composingEdit, composingDetail } from '@/api/composing.js';
import editTable from './editTable';
import orderDrawer from './orderDrawer';
export default {
    name: 'SquenceEdit',
    components: {
        editTable,
        orderDrawer
    },
    data() {
        return {
            // 表单
            AMP: 0,
            ruleForm: {
              boardingDate:'',
              createDate: '',
              mBarcode: '',
              equipment: '',
              rotation: '',
              cosmicVersion: '',
              regionalId: '',
            },
            rules: {
              boardingDate: [
                { required: true, message: '请选择上机时间', trigger: 'change' }
              ],
              mBarcode: [
                { required: true, message: '请输入大Barcode', trigger: 'change' }
              ],
              equipment: [
                { required: true, message: '请选择设备类型', trigger: 'blur' },
              ],
              rotation: [
                { required: true, message: '请输入轮次', trigger: 'change' }
              ],
              cosmicVersion: [
                { required: true, message: '请选择cosmic版本号', trigger: 'change' }
              ],
              regionalId: [
                { required: true, message: '请选择收样单位', trigger: 'change' }
              ]
            },

            ampVisible: true,
            equipmentList: [],
            diseaseList:[],
            cosmicVersionList: [],
            sampleUnitList: [],
            row: {}
        };
    },
    computed: {
        ...mapGetters({
          'createUser': 'user_id',
          'details': 'composing/editDetails'
        })
    },
    async mounted() {
        this.getEquipment();
        this.getDisease();
        this.getCosmicVersion();
        this.getSampleUnit();
        await this.getComposingDetail();
        await this.init();
    },
    methods: {
        ...mapActions('composing', ['sampleUnitAction', 'editDetailsAction']),
        // 初始化
        init() {
          console.log('详情', this.row);
          this.AMP = this.row.amp;
          this.$set(this.ruleForm, 'boardingDate', this.row.boardingDate);
          this.$set(this.ruleForm, 'createDate', this.row.createDate);
          this.$set(this.ruleForm, 'mBarcode', this.row.mbarcode);
          this.$set(this.ruleForm, 'equipment', this.row.equipment);
          this.$set(this.ruleForm, 'cosmicVersion', this.row.cosmicVersion);
          this.$set(this.ruleForm, 'rotation', this.row.rotation);
          this.$set(this.ruleForm, 'regionalId', this.row.regionalId);
          this.editDetailsAction(this.row.registerDetail);
        },
        // 获取登记详情（所有）
        async getComposingDetail() {
          let res = await composingDetail(this.$route.query.rmid);
          this.row = res;
        },
        // 获取设备类型
        async getEquipment() {
            let res = await equipment();
            this.equipmentList = res;
        },
        // 设备类型改变
        handleEquipChange(val) {
            console.log(val);
            switch (val) {
                case 'NGS':
                    this.AMP = 0;
                    this.ampVisible = false;
                    break;
                default :
                    this.ampVisible = true;
            }
        },
        // 获取疾病类型
        async getDisease() {
          let res = await disease();
          this.diseaseList = res;
        },
        // 获取cosmicVersion
        async getCosmicVersion() {
          let res = await cosmicVersion();
          this.cosmicVersionList = res;
        },
        // 获取收样单位
        async getSampleUnit() {
          let res = await sampleUnit();
          this.sampleUnitList = res;
        },
        // 收样单位改变
        regionalIdChange(val) {
          // console.log(val);
          this.sampleUnitAction(val);
        },
        // 保存
        handleSubmit(formName) {
          let details = this.details.map(item => {
            return {
              registerId: item.registerId,
              orderId: item.orderId,
              orderNum: item.orderNum,
              name: item.name,
              labNum: item.labNum,
              dBarcode: item.dBarcode,
              diseaseId: item.diseaseId
            };
          });
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let {code, message} = await composingEdit(
                this.$route.query.rmid,
                this.ruleForm.boardingDate,
                this.ruleForm.createDate,
                this.ruleForm.equipment,
                this.ruleForm.rotation,
                this.ruleForm.mBarcode,
                this.createUser,
                this.AMP,
                this.ruleForm.cosmicVersion,
                this.ruleForm.regionalId,
                details);
              if(code === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$router.push({
                  path: '/composing'
                });
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
};
</script>

<style>

</style>
