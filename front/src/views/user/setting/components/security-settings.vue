<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.password') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.password') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.github') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph v-if="isGithubAuthorization">
              {{ $t('userSetting.SecuritySettings.placeholder.bind.github') }}
            </a-typography-paragraph>
            <a-typography-paragraph v-if="!isGithubAuthorization" class="tip">
              {{ $t('userSetting.SecuritySettings.placeholder.github') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link v-if="isGithubAuthorization" @click="unbindGithubAccount">
              {{ $t('userSetting.SecuritySettings.button.unbind') }}
            </a-link>
            <a-link v-if="!isGithubAuthorization" @click="bindGithubAccount">
              {{ $t('userSetting.SecuritySettings.button.bind') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <div class="content">
        <a-popconfirm :content="$t('userSetting.SecuritySettings.popconfirm.cancelAccount')" @ok="cancelVisible = true">
          <a-button type="primary" status="danger">
            {{ $t('userSetting.SecuritySettings.button.cancelAccount') }}
          </a-button>
        </a-popconfirm>
      </div>
      <!-- modal -->
      <CancelAccount v-model:visible="cancelVisible" />
    </a-list-item>
    <!--    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.phone') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已绑定：150******50
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.email') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph class="tip">
              {{ $t('userSetting.SecuritySettings.placeholder.email') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>-->
  </a-list>
</template>

<script lang="ts" setup>
import { unbindGithub, getGithubAuthorizationStatus } from '@/api/hutao';
import { ref } from 'vue';
import { getToken } from '@/utils/auth';
import CancelAccount from './cancel-account.vue';

// Github 账号绑定
const isGithubAuthorization = ref(false);
const getGithubBindStatus = async () => {
  const res = await getGithubAuthorizationStatus();
  isGithubAuthorization.value = res.data.IsAuthorized;
};
getGithubBindStatus();

const unbindGithubAccount = async () => {
  await unbindGithub();
  await getGithubBindStatus();
};
const bindGithubAccount = () => {
  window.location.href = `https://homa.snapgenshin.com/OAuth/Github/RedirectLogin?token=${encodeURIComponent(
    getToken() as string
  )}`;
};

// 注销账号
const cancelVisible = ref(false);
</script>

<style scoped lang="less">
:deep(.arco-list-item) {
  border-bottom: none !important;

  .arco-typography {
    margin-bottom: 20px;
  }

  .arco-list-item-meta-avatar {
    margin-bottom: 1px;
  }

  .arco-list-item-meta {
    padding: 0;
  }
}

:deep(.arco-list-item-meta-content) {
  flex: 1;
  border-bottom: 1px solid var(--color-neutral-3);

  .arco-list-item-meta-description {
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    .tip {
      color: rgb(var(--gray-6));
    }

    .operation {
      margin-right: 6px;
    }
  }
}
</style>

