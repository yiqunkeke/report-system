import Layout from '@/layout';

const analysisRouter = {
  path: '/analysis',
  component: Layout,
  meta: {
    title: '数据分析',
    icon: 'order',
    roles: ['管理员','检测员']
  },
  children: [
    {
      name: 'analysis',
      path: '',
      component: function (resolve) {
        require(['@/views/analysis/index'], resolve);
      },
      meta: {
        title: '数据分析',
        icon: 'analysis',
        breadcrumb: false
      }
    }
  ]
};

export default analysisRouter;
