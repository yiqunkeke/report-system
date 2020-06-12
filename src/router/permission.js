import router from '.';
import store from '../store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  /**
   * 判断是否有Token
   * 1：如果有token
   * 2：如果又是登录，直接过
   * 3：如果不是登录，判断有没有用户内容
   * 4：没有用户内容，则进行查询
   */
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.getters.rules.length === 0) {
        try {
          store.dispatch('user/getInfo').then(res => {
            const {rules} = res;
            store.dispatch('GenerateRoutes', {rules}).then(() => {
              router.addRoutes(store.getters.addRouters);
              next({...to, replace: true});
            });
          });
          next();
        } catch (err) {
          await store.dispatch('user/resetToken');
          Message.error('没有权限，请重新登录');
          next('/login');
          NProgress.done();
        }
      } else {
        next();
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
