import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'RouteSelectionPage',
    component: () => import('../views/RouteSelection.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('../views/detail/ProjectDetail.vue'),
    meta: { transition: 'fade' },
    props: true
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('../views/Skills.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/canvas',
    name: 'Canvas',
    component: () => import('../views/Drawing.vue'),
    meta: { transition: 'fade' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue'),
    meta: { transition: '' }
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('../views/detail/BlogDetail.vue'),
    meta: { transition: 'fade' },
    props: true
  },
  {
    // microCMSプレビュー用のルート（/blog/preview/xxx&draftKey=xxx 形式）
    path: '/blog/preview',
    name: 'BlogPreview',
    component: () => import('../views/detail/BlogDetail.vue'),
    meta: { transition: 'fade' },
    props: route => ({
      id: route.query.id,
      draftKey: route.query.draftKey,
      isPreview: true
    })
  },
  {
    // エラーページのルート
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error.vue')
  },
  {
    // 404エラー用のキャッチオール
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Error' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // ページ遷移時にページの先頭にスクロール
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      // 即座にスクロール
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0 });
        }, 100); // 100ms待ってからスクロール
      });
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Error') {
    const storedCode = sessionStorage.getItem('errorCode');
    if (!storedCode) {
      // エラーコードがない場合は404を設定
      sessionStorage.setItem('errorCode', '404');
    }
  }
  next();
});

export default router
