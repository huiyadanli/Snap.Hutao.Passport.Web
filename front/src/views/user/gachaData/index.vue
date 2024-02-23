<template>
  <div class="container">
    <Breadcrumb :items="['menu.user.gachaData', 'menu.user.gachaData']" />
    <a-card class="general-card" :title="$t('menu.user.gachaData')"  >
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 18 }" label-align="left"
            :rules="rules">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item field="uid" :label="$t('gachaData.form.uid')" validate-trigger="blur">
                  <a-input v-model="formModel.uid" :placeholder="$t('gachaData.input.uid')" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="GachaType" :label="$t('gachaData.form.GachaType')" validate-trigger="blur">
                  <a-select v-model="formModel.GachaType" :options="GachaTypeOptions" />
                </a-form-item>
              </a-col>
              <a-col :flex="'86px'" style="text-align: right">
                <a-space direction="horizontal" :size="18">
                  <a-button type="primary" @click="search">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="reset">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('searchTable.form.reset') }}
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-col>

      </a-row>


      <a-tabs default-active-key="1">
        <a-tab-pane key="1" :title="$t('gachaData.tab.gachaDataList')">
          <a-row style="margin-bottom: 16px">
            <a-col :span="12">
              <a-space>
                <a-upload action="/">
                  <template #upload-button>
                    <a-button>
                      {{ $t('gachaData.gachaDataList.export') }}
                    </a-button>
                  </template>
                </a-upload>
              </a-space>
            </a-col>
            <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
              </a-tooltip>
              <a-tooltip :content="$t('searchTable.actions.columnSetting')">
                <a-popover trigger="click" position="bl" @popup-visible-change="popupVisibleChange">
                  <div class="action-icon"><icon-settings size="18" /></div>
                  <template #content>
                    <div id="tableSetting">
                      <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">
                        <div style="margin-right: 4px; cursor: move">
                          <icon-drag-arrow />
                        </div>
                        <div>
                          <a-checkbox v-model="item.checked" @change="
                            handleChange($event, item as TableColumnData, index)
                            ">
                          </a-checkbox>
                        </div>
                        <div class="title">
                          {{ item.title === '#' ? '序列号' : item.title }}
                        </div>
                      </div>
                    </div>
                  </template>
                </a-popover>
              </a-tooltip>
            </a-col>
          </a-row>

          <a-table :columns="(cloneColumns as TableColumnData[])" :data="renderData" :virtual-list-props="{ height: 500 }"
            :pagination="false" :scroll="{ x: 1000 }" />

          <a-row style="padding-top: 15px;">
            <a-col :span="12">
              <a-button type="primary">
                <icon-left />
                Prev
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button type="primary" style="float: right;">
                Next
                <icon-right />
              </a-button>
            </a-col>
          </a-row>




        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('gachaData.tab.gachaDataStatistics')">

        </a-tab-pane>
        <a-tab-pane key="3" :title="$t('gachaData.common.reserved')">
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { queryPolicyList, PolicyRecord, PolicyParams } from '@/api/list';
import { Pagination } from '@/types/global';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import { pullGachaData } from "@/api/hutao";
import { Alert, Message } from '@arco-design/web-vue';

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const generateFormModel = () => {
  return {
    // number: '',
    // name: '',
    // contentType: '',
    // filterType: '',
    // createdTime: [],
    // status: '',

    uid: '',
    GachaType: '',
    QueryType: '',
    ItemId: '',
    Time: '',
    Id: '',
    count: "200"
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref<PolicyRecord[]>([]);
const formModel = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>('medium');


const rules = {
  uid: [
    {
      required: true,
      message: t("gachaData.common.msg.need")
    }
  ],
  GachaType: [{
    required: true,
    message: t("gachaData.common.msg.need")
  }]
}


const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
  count: String,
});
// const densityList = computed(() => [
//   {
//     name: t('searchTable.size.mini'),
//     value: 'mini',
//   },
//   {
//     name: t('searchTable.size.small'),
//     value: 'small',
//   },
//   {
//     name: t('searchTable.size.medium'),
//     value: 'medium',
//   },
//   {
//     name: t('searchTable.size.large'),
//     value: 'large',
//   },
// ]);
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('gachaData.columns.GachaType'),
    dataIndex: 'GachaType',
    slotName: 'GachaType',
  },
  // {
  //   title: t('gachaData.columns.QueryType'),
  //   dataIndex: 'QueryType',
  // },
  {
    title: t('gachaData.columns.ItemId'),
    dataIndex: 'ItemId',
  },
  {
    title: t('gachaData.columns.Time'),
    dataIndex: 'Time',
    slotName: 'Time',
  },
  {
    title: t('gachaData.columns.Id'),
    dataIndex: 'Id',
  },


]);
const GachaTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('gachaData.form.GachaType.resident'),
    value: '200',
  },
  {
    label: t('gachaData.form.GachaType.charactarUP'),
    value: '301',
  },
  {
    label: t('gachaData.form.GachaType.weaponUP'),
    value: '302',
  },
  {
    label: t('gachaData.form.GachaType.beginner'),
    value: '100',
  },
]);
// const filterTypeOptions = computed<SelectOptionData[]>(() => [
//   {
//     label: t('searchTable.form.filterType.artificial'),
//     value: 'artificial',
//   },
//   {
//     label: t('searchTable.form.filterType.rules'),
//     value: 'rules',
//   },
// ]);
// const statusOptions = computed<SelectOptionData[]>(() => [
//   {
//     label: t('searchTable.form.status.online'),
//     value: 'online',
//   },
//   {
//     label: t('searchTable.form.status.offline'),
//     value: 'offline',
//   },
// ]);
const fetchData = async (

) => {
  setLoading(true);
  if (formModel.value.uid === "" || formModel.value.GachaType === "") {
    Message.error({
      content: t("gachaData.form.loseParam"),
      duration: 5 * 1000,
    });
    return;
  }
  try {
    const { data } = await pullGachaData<string>(formModel.value.uid, formModel.value.GachaType, formModel.value.count)
    console.log(data)
    renderData.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData();
};
const onPageChange = (current: number) => {
  fetchData();
};

fetchData();
const reset = () => {
  formModel.value = generateFormModel();
};

const handleSelectDensity = (
  val: string | number | Record<string, any> | undefined,
  e: Event
) => {
  size.value = val as SizeProps;
};

const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter(
      (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};

const exchangeArray = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(
      beforeIdx,
      1,
      newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
};

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        },
      });
    });
  }
};

watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  { deep: true, immediate: true }
);
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 1px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
