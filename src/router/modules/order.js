import Layout from '@/layout';

const orderRouter = {
  path: '/order',
  component: Layout,
  meta: {
    title: '订单管理',
    icon: 'order',
    roles: ['管理员','检测员']
  },
  children: [
    {
      name: 'order',
      path: '',
      component: function (resolve) {
        require(['@/views/order/index'], resolve);
      },
      meta: {
        title: '订单管理',
        icon: 'order',
        breadcrumb: false
      }
    },
    {
      name: 'orderDetail',
      path: 'detail',
      component: function (resolve) {
        require(['@/views/order/detail'], resolve);
      },
      hidden: true,
      meta: {
        title: '订单详情',
        icon: 'order',
      }
    }
  ]
};

export default orderRouter;
