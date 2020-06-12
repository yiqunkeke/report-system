import Layout from '@/layout';

const workRouter = {
  name: 'work',
  path: '/work',
  component: Layout,
  meta: {
    title: '工作管理',
    icon: 'work',
    roles: ['管理员','检测员']
  },
  children: [
    {
      name: 'my',
      path: 'my',
      component: function (resolve) {
        require(['@/views/work/my'], resolve);
      },
      meta: {
        title: '我的工作',
        icon: 'mywork'
      }
    },
    {
      name: 'assign',
      path: 'assign',
      component: function (resolve) {
        require(['@/views/work/assign'], resolve);
      },
      meta: {
        title: '分配工作',
        icon: 'assign'
      }
    },
    {
      name: 'unqualified',
      path: 'unqualified',
      component: function (resolve) {
        require(['@/views/work/unqualified'], resolve);
      },
      meta: {
        title: '不合格样本',
        icon: 'buhege'
      }
    }
  ]
};

export default workRouter;
