import Layout from '@/layout';

const composingRouter = {
  path: '/composing',
  component: Layout,
  meta: {
    title: '排版登记',
    icon: 'composing',
    roles: ['管理员','检测员']
  },
  children: [
    {
      name: '',
      path: '',
      component: function (resolve) {
        require(['@/views/composing/index'], resolve);
      },
      meta: {
        title: '排版登记',
        icon: 'composing',
        breadcrumb: false
      }
    },
    {
      name: 'seqAdd',
      path: 'add',
      component: function (resolve) {
        require(['@/views/composing/add'], resolve);
      },
      hidden: true,
      meta: {
        title: '新增',
        icon: 'composing',
      }
    },
    {
      name: 'seqEdit',
      path: 'edit',
      component: function (resolve) {
        require(['@/views/composing/edit'], resolve);
      },
      hidden: true,
      meta: {
        title: '编辑',
        icon: 'composing',
      }
    }
  ]
};

export default composingRouter;
