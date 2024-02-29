<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.redeem']"/>
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <a-card :bordered="false">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 16 }"
          >
            <a-form-item
              field="code"
              :rules="[
                {
                  length: 18,
                  required: true,
                  message: $t('userRedeem.form.error.code.required'),
                },
              ]"
              :label="$t('userRedeem.form.code')"
            >
              <a-input
                v-model="formData.code"
                :placeholder="$t('userRedeem.form.placeholder.code')"
              />
            </a-form-item>

            <a-form-item>
              <a-space>
                <a-button type="primary" @click="validate">
                  {{ $t('userRedeem.form.submit') }}
                </a-button>
                <a-button type="secondary" @click="reset">
                  {{ $t('userRedeem.form.reset') }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import {redeem } from "@/api/hutao";
import {Message} from "@arco-design/web-vue";

const formRef = ref<FormInstance>();

interface RedeemModel {
  code: string;
}

const formData = ref<RedeemModel>({
  code: '',
});
const validate = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    const {data: result} = await redeem({code: formData.value.code})
    Message.success(`兑换成功，到期时间已增加 ${result.value} 天`)
    // TODO: Refresh expire time
  }
};
const reset = async () => {
  formRef.value?.resetFields();
};
</script>

<script lang="ts">
export default {
  name: 'Redeem',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px;
}

.wrapper {
  min-height: 580px;
  padding: 20px 0 0 20px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}

.form {
  width: 540px;
  margin: 0 auto;
}
</style>
