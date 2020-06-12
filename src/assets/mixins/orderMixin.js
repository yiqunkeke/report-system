export const orderMixin = {
    computed: {
      // 订单状态-svg图标
      statusClass() {
        return function(status) {
          switch (status) {
            case '待提交':
              return 'daitijiao';
            case '途中':
              return 'tuzhong';
            case '到达':
              return 'daoda';
            case '不合格':
              return 'buhege';
            case '取消检测':
              return 'cancel';
            case '待定':
              return 'todo';
            case '报告已上传':
              return 'upload';
            default :
              return '';
          }
        };
      }
    },
    methods: {
      // 订单状态class
      cellClass(data) {
        // console.log(data);
        if(data.columnIndex == 7 && data.row.orderStatus == '待提交') {
          return 'unSubmit';
        }
        if(data.columnIndex == 7 && data.row.orderStatus == '途中') {
          return 'onWay';
        }
        if(data.columnIndex == 7 && data.row.orderStatus == '到达') {
          return 'arrived';
        }
        if(data.columnIndex == 7 && data.row.orderStatus == '不合格') {
          return 'unqualified';
        }
        if(data.columnIndex == 7 && data.row.orderStatus == '取消检测') {
          return 'cancelDetection';
        }
        if(data.columnIndex == 7 && data.row.orderStatus == '待定') {
          return 'todo';
        }
        if(data.columnIndex == 7 && data.row.orderStatus == '报告已上传') {
          return 'reportUploaded';
        }
      }
    }
};

