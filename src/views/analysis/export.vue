<template>
  <div>
    <el-form
      ref="ruleForm"
      label-width="120px"
      :rules="rules"
      :model="ruleForm"
      class="form"
    >
      <el-form-item
        label="结论意义："
        prop="conclusion"
      >
        <el-input
          v-model="ruleForm.conclusion"
          type="textarea"
          :rows="14"
          placeholder="请输入结论意义"
        />
      </el-form-item>
      <el-form-item
        label="是否需要印章："
        prop="needSeal"
      >
        <el-radio-group v-model="ruleForm.needSeal">
          <el-radio :label="1">
            是
          </el-radio>
          <el-radio :label="0">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="文件名称："
        prop="reportFileName"
      >
        <el-input
          v-model="ruleForm.reportFileName"
          placeholder="请输入文件名称"
        />
      </el-form-item>
      <el-form-item
        label="模板名称："
        prop="reportTemplateId"
      >
        <el-select
          v-model="ruleForm.reportTemplateId"
          placeholder="请选择模板"
        >
          <el-option
            v-for="item in reportTemplateList"
            :key="item.reportTemplateId"
            :label="item.reportTemplateName"
            :value="item.reportTemplateId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleExportReport('ruleForm')"
        >
          导出报告
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { exportReport } from '@/api/report';
import downloadFileByBlob from '@/utils/download';
export default {
  props: {
    sumary: {
      type: String,
      default: ''
    },
    workDetailId: {
      type: Number,
      default: null
    },
    workName: {
      type: String,
      default: ''
    },
    reportTemplateList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      ruleForm: {
        conclusion: '',
        needSeal: 0,
        reportFileName: null,
        reportTemplateId: null,
      },
      sealId: null,
      rules: {
          conclusion: [
            { required: true, message: '请输入结论意义', trigger: 'blur' }
          ],
          needSeal: [
            { required: true, message: '请选择活动资源', trigger: 'blur' }
          ],
          reportFileName: [
            { required: true, message: '请输入文件名称', trigger: 'blur' }
          ],
          reportTemplateId: [
            { required: true, message: '请选择模板', trigger: 'blur' }
          ]
      }
    };
  },
  watch: {
    sumary(val) {
      this.$set(this.ruleForm, 'conclusion', val);
    },
    workName(val) {
      this.$set(this.ruleForm, 'reportFileName', val);
    }
  },
  methods: {
    // 导出报告
    handleExportReport(formName) {
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res = await exportReport(
              this.workDetailId,
              this.ruleForm.conclusion,
              this.ruleForm.needSeal,
              this.sealId,
              this.ruleForm.reportFileName,
              this.ruleForm.reportTemplateId
              );
              console.log(res);
              const blobUrl = URL.createObjectURL(res);
              downloadFileByBlob(blobUrl, res.fileName);
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
