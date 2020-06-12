<template>
  <div>
    <div>
      <el-upload
        ref="upload"
        class="upload-demo"
        name="file"
        :action="action"
        :headers="headers"
        :file-list="fileList"
        :auto-upload="false"
        :multiple="true"
        :data="params"
        :on-success="handleSuccess"
      >
        <el-button
          slot="trigger"
          size="mini"
          type="primary"
          icon="el-icon-folder"
          @click="handleUpload"
        >
          选取文件
        </el-button>
        <el-button
          style="margin-left: 10px;"
          size="mini"
          type="success"
          icon="el-icon-upload"
          @click="submitUpload"
        >
          上传到服务器
        </el-button>
      </el-upload>
    </div>
    <el-table
      v-loading="loading"
      class="mgt15"
      :data="tableData"
      border
      stripe
    >
      <el-table-column
        prop="attachmentName"
        label="附件名"
        width="400"
      />
      <el-table-column
        prop="reportName"
        label="下载报告"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-download"
            plain
            @click="handleDownload(scope.row)"
          >
            下载
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              plain
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import baseApi from '@/api/base';
import { fileList, fileDelete, fileDownload } from '@/api/file.js';
import { getToken } from '@/utils/auth';
import downloadFileByBlob from '@/utils/download';
export default {
  props: {
        id: {
            type: Number,
            default: null
        }
  },
  data() {
    return {
      tableData: [], // 附件列表
      loading: false,
      orderId: this.id,
      action: `${baseApi.API_URL}/v1/file/upload`,
      headers: { Authorization: 'Bearer ' + getToken() },
      fileList: [],
      params: {
        userId: this.userId,
        orderId: this.orderId
      }
    };
  },
  computed: {
    ...mapGetters({
      'userId': 'user_id'
    })
  },
  watch: {
        id(val) {
          this.orderId = val;
          this.getFileList(val);
        }
  },
  methods: {
    // 获取附件列表
    async getFileList(orderId) {
      this.loading = true;
      let res = await fileList(orderId);
      this.loading = false;
      this.tableData = res;
      console.log('fileList', res);
    },
    // 选择文件
    handleUpload() {
      this.params = {
        userId: this.userId,
        orderId: this.orderId
      };
    },
    // 上传到服务器
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 上传成功
    handleSuccess() {
      this.fileList = [];
      this.getFileList(this.orderId);
    },
    // 删除附件
    async handleDelete(row) {
      console.log(row);
      let {code, message}  = await fileDelete(row.attachmentId);
      if(code===200) {
        this.$message({
          message: message,
          type: 'success'
        });
        this.getFileList(this.orderId);
      } else {
        this.$message.error(message);
      }
    },
    // 下载附件
    async handleDownload(row) {
      let res = await fileDownload(
        row.attachmentId
      );
      const blobUrl = URL.createObjectURL(res);
      downloadFileByBlob(blobUrl, res.fileName);
    }
  }
};
</script>

<style>

</style>
