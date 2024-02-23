import { defineStore } from 'pinia';
import {
  login as userLogin,
  // logout as userLogout,
  getUserInfo,
} from '@/api/hutao';
import { PassportRequest, UserInfo } from '@/types/hutao';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { rsaEncrypt } from '@/utils/crypt';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    UserName: '',
    NormalizedUserName: '',
    IsLicensedDeveloper: false,
    IsMaintainer: false,
    GachaLogExpireAt: '',
  }),

  getters: {
    userInfo(state: UserInfo): UserInfo {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserInfo>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();

      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: PassportRequest) {
      try {
        loginForm.UserName = rsaEncrypt(loginForm.UserName);
        loginForm.Password = rsaEncrypt(loginForm.Password);
        const res = await userLogin(loginForm);
        setToken(res.data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },

    // Logout
    async logout() {
      try {
        // await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
