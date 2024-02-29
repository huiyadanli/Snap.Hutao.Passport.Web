<template>
  <!-- get verify code -->
  <a-modal :visible="props.visible" :mask-closable="false" @ok="handleOk" @cancel="handleCancel">
    <template #title>
      {{ $t('userSetting.SecuritySettings.button.cancelAccount') }}
    </template>
    <div class="body">
      <div class="title">
        {{ $t('userSetting.SecuritySettings.button.verifyCode') }}
      </div>
      <div class="content">
        <a-input ref="input" v-model:value="code" :error="error" placeholder="code" />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@arco-design/web-vue';

// verify code
const code = ref('');
const error = ref(false);
const input = ref<InstanceType<typeof Input>>();

// modal
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['update:visible']);
const handleOk = () => {
  if (!code.value) {
    error.value = true;
    input.value?.focus();
    return;
  }
  emit('update:visible', false);
};
const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<style scoped lang="less">
.body {
  display: flex;
  align-items: center;
}

.title {
  font-size: 16px;
  margin-right: 6px;
}
</style>

