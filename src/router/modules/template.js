import Layout from '@/layout';

const templateRouter = {
  path: '/template',
  component: Layout,
  meta: {
    title: '报告模板',
    icon: 'template',
    roles: ['管理员','检测员']
  },
  children: [
    {
      name: 'template',
      path: '',
      component: function (resolve) {
        require(['@/views/template/index'], resolve);
      },
      meta: {
        title: '报告模板',
        icon: 'template',
        breadcrumb: false
      }
    }
  ]
};

export default templateRouter;
