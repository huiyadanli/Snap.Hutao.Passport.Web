import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/user/setting/index.vue'),
      meta: {
        locale: 'menu.user.setting',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'redeem',
      name: 'Redeem',
      component: () => import('@/views/user/redeem/index.vue'),
      meta: {
        locale: 'menu.user.redeem',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'gachaData',
      name: 'GachaData',
      component: () => import('@/views/user/gachaData/index.vue'),
      meta: {
        locale: 'menu.user.gachaData',
        requiresAuth: true,
        roles: ['*'],
      },
    },

  ],
};

export default USER;
